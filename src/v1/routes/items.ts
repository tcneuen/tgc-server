import express from "express";
import { z } from "zod";
import prisma from "../../prisma";

// mergeParams lets us access :collectionId from the parent router
const router = express.Router({ mergeParams: true });

const CreateItemSchema = z.object({
  name: z.string(),
  description: z.string(),
  listId: z.string().uuid(),
  /** ID of the item this new item should be inserted after (null/absent = insert at head) */
  afterId: z.number().int().nullable().optional(),
});

const UpdateItemSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
});

const MoveItemSchema = z.object({
  listId: z.string().uuid(),
  /** ID of the item this item should be placed after in the target list (null = move to head) */
  afterId: z.number().int().nullable(),
});

function getUserId(req: express.Request): number | null {
  return req.user?.id ?? null;
}

async function requireCollection(
  collectionId: string,
  userId: number,
  res: express.Response,
) {
  const collection = await prisma.collection.findFirst({
    where: { id: collectionId, userId },
  });
  if (!collection) {
    res.status(404).json({ error: "Collection not found" });
  }
  return collection;
}

/**
 * Walk the linked list for a given list starting from its head (prevId IS NULL)
 * and return items in order.
 */
async function getOrderedItems(collectionId: string, listId?: string) {
  const where = { collectionId, ...(listId ? { listId } : {}) };
  const allItems = await prisma.item.findMany({ where });

  if (listId) {
    return sortLinkedList(allItems);
  }

  // Multi-list: group by listId, sort each group, then concatenate
  const byList = new Map<string, typeof allItems>();
  for (const item of allItems) {
    const group = byList.get(item.listId) ?? [];
    group.push(item);
    byList.set(item.listId, group);
  }
  const sorted: typeof allItems = [];
  for (const group of byList.values()) {
    sorted.push(...sortLinkedList(group));
  }
  return sorted;
}

type ItemNode = { id: number; prevId: number | null; nextId: number | null; [key: string]: unknown };

function sortLinkedList<T extends ItemNode>(items: T[]): T[] {
  if (items.length === 0) return [];
  const byId = new Map(items.map((i) => [i.id, i]));
  const visited = new Set<number>();
  const result: T[] = [];

  // Walk each chain starting from its head (prevId is null or points outside this set).
  // This handles orphan items (prevId=null, nextId=null) as single-element chains.
  const heads = items.filter(
    (i) => i.prevId === null || !byId.has(i.prevId),
  );
  for (const head of heads) {
    let current: T | undefined = head;
    while (current && !visited.has(current.id)) {
      result.push(current);
      visited.add(current.id);
      current = current.nextId != null ? byId.get(current.nextId) : undefined;
    }
  }

  // Append any remaining items that weren't reachable (broken chains)
  for (const item of items) {
    if (!visited.has(item.id)) result.push(item);
  }

  return result;
}

/**
 * Compute ratings for all items in a list based on linked-list position and
 * the list's startingRating. Returns map of itemId → rating.
 * Rating = startingRating * (1/2)^position where position is 0-based rank.
 * If startingRating is null the rating field is set to null.
 */
async function computeRatingsForList(listId: string): Promise<Map<number, number | null>> {
  const list = await prisma.list.findUnique({
    where: { id: listId },
    include: { collection: { include: { lists: true } } },
  });
  const items = await prisma.item.findMany({ where: { listId } });
  const ordered = sortLinkedList(items);
  const ratings = new Map<number, number | null>();
  if (list?.startingRating == null) {
    for (const item of ordered) ratings.set(item.id, null);
  } else {
    const floor = list.startingRating;
    // Find the nearest list with a higher startingRating in the same collection
    const siblingsAbove = (list.collection?.lists ?? [])
      .map((l) => l.startingRating)
      .filter((r): r is number => r != null && r > floor)
      .sort((a, b) => a - b);
    const ceiling = siblingsAbove.length > 0 ? siblingsAbove[0] : 10.0;
    const n = ordered.length;
    for (let i = 0; i < n; i++) {
      // Worst item (i = n-1) → floor; best item (i = 0) approaches ceiling
      const rating = floor + (ceiling - floor) * Math.max(0, n - 1 - i) / n;
      ratings.set(ordered[i].id, rating);
    }
  }
  return ratings;
}

/**
 * Persist recalculated ratings for every item in a list.
 */
async function recalcRatingsForList(listId: string) {
  const ratingMap = await computeRatingsForList(listId);
  if (ratingMap.size === 0) return;
  await prisma.$transaction(
    Array.from(ratingMap.entries()).map(([id, rating]) =>
      prisma.item.update({ where: { id }, data: { rating } }),
    ),
  );
}

/**
 * Splice `itemId` out of the linked list it currently belongs to, repairing
 * the gap left behind.  Does NOT persist the item's own prev/next changes —
 * caller is responsible for that.  Returns the prisma operations to run inside
 * a transaction.
 */
function spliceOutOps(item: ItemNode) {
  const ops = [];
  if (item.prevId !== null) {
    ops.push(
      prisma.item.update({
        where: { id: item.prevId },
        data: { nextId: item.nextId },
      }),
    );
  }
  if (item.nextId !== null) {
    ops.push(
      prisma.item.update({
        where: { id: item.nextId },
        data: { prevId: item.prevId },
      }),
    );
  }
  return ops;
}

// GET /collections/:collectionId/items?listId=<optional>
router.get("/", async (req, res, next) => {
  const userId = getUserId(req);
  if (userId === null) { res.sendStatus(401); return; }
  try {
    const { collectionId } = req.params;
    const collection = await requireCollection(collectionId, userId, res);
    if (!collection) return;
    const listId = req.query.listId as string | undefined;
    const items = await getOrderedItems(collectionId, listId);
    res.json(items);
  } catch (err) {
    next(err);
  }
});

// POST /collections/:collectionId/items
// Inserts item after `afterId` in the target list (or at the head if afterId is null/absent).
router.post("/", async (req, res, next) => {
  const userId = getUserId(req);
  if (userId === null) { res.sendStatus(401); return; }
  const parsed = CreateItemSchema.safeParse(req.body);
  if (!parsed.success) { next(parsed.error); return; }
  try {
    const { collectionId } = req.params;
    const collection = await requireCollection(collectionId, userId, res);
    if (!collection) return;

    const { listId, afterId, ...rest } = parsed.data;

    // Determine prev/next pointers
    let prevNode: ItemNode | null = null;
    let nextNode: ItemNode | null = null;

    if (afterId != null) {
      prevNode = await prisma.item.findFirst({
        where: { id: afterId, listId },
      });
      if (!prevNode) {
        res.status(400).json({ error: "afterId item not found in target list" });
        return;
      }
      if (prevNode.nextId != null) {
        nextNode = await prisma.item.findUnique({ where: { id: prevNode.nextId } });
      }
    } else {
      // Inserting at head — find current head (prevId IS NULL)
      nextNode = await prisma.item.findFirst({
        where: { listId, prevId: null },
      });
    }

    const item = await prisma.item.create({
      data: {
        ...rest,
        collectionId,
        listId,
        prevId: prevNode?.id ?? null,
        nextId: nextNode?.id ?? null,
      },
    });

    // Update surrounding nodes
    const updates: ReturnType<typeof prisma.item.update>[] = [];
    if (prevNode) updates.push(prisma.item.update({ where: { id: prevNode.id }, data: { nextId: item.id } }));
    if (nextNode) updates.push(prisma.item.update({ where: { id: nextNode.id }, data: { prevId: item.id } }));
    if (updates.length) await prisma.$transaction(updates);

    await recalcRatingsForList(listId);
    const updated = await prisma.item.findUniqueOrThrow({ where: { id: item.id } });
    res.status(201).json(updated);
  } catch (err) {
    next(err);
  }
});

// PATCH /collections/:collectionId/items/:itemId — update name/description only
router.patch("/:itemId", async (req, res, next) => {
  const userId = getUserId(req);
  if (userId === null) { res.sendStatus(401); return; }
  const parsed = UpdateItemSchema.safeParse(req.body);
  if (!parsed.success) { next(parsed.error); return; }
  try {
    const { collectionId, itemId } = req.params;
    const collection = await requireCollection(collectionId, userId, res);
    if (!collection) return;
    const existing = await prisma.item.findFirst({
      where: { id: Number(itemId), collectionId },
    });
    if (!existing) { res.status(404).json({ error: "Item not found" }); return; }
    const item = await prisma.item.update({
      where: { id: Number(itemId) },
      data: parsed.data,
    });
    res.json(item);
  } catch (err) {
    next(err);
  }
});

// DELETE /collections/:collectionId/items/:itemId
// Splices item out of the linked list and recalculates ratings.
router.delete("/:itemId", async (req, res, next) => {
  const userId = getUserId(req);
  if (userId === null) { res.sendStatus(401); return; }
  try {
    const { collectionId, itemId } = req.params;
    const collection = await requireCollection(collectionId, userId, res);
    if (!collection) return;
    const existing = await prisma.item.findFirst({
      where: { id: Number(itemId), collectionId },
    });
    if (!existing) { res.status(404).json({ error: "Item not found" }); return; }

    const listId = existing.listId;
    // Delete first — ON DELETE SET NULL cascade clears neighbors' pointers to this item,
    // then spliceOutOps repairs the gap (sets prevNode.nextId = nextNode and vice versa).
    await prisma.$transaction([
      prisma.item.delete({ where: { id: existing.id } }),
      ...spliceOutOps(existing),
    ]);

    await recalcRatingsForList(listId);
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
});

// PATCH /collections/:collectionId/items/:itemId/move
// Moves item to a different position (optionally a different list).
// Body: { listId, afterId: number | null }
router.patch("/:itemId/move", async (req, res, next) => {
  const userId = getUserId(req);
  if (userId === null) { res.sendStatus(401); return; }
  const parsed = MoveItemSchema.safeParse(req.body);
  if (!parsed.success) { next(parsed.error); return; }
  try {
    const { collectionId, itemId } = req.params;
    const collection = await requireCollection(collectionId, userId, res);
    if (!collection) return;
    const existing = await prisma.item.findFirst({
      where: { id: Number(itemId), collectionId },
    });
    if (!existing) { res.status(404).json({ error: "Item not found" }); return; }

    const { listId, afterId } = parsed.data;
    const oldListId = existing.listId;

    // 1. Determine new neighbours
    let prevNode: ItemNode | null = null;
    let nextNode: ItemNode | null = null;

    if (afterId != null) {
      if (afterId === existing.id) {
        res.status(400).json({ error: "afterId cannot be the item itself" });
        return;
      }
      prevNode = await prisma.item.findFirst({ where: { id: afterId, listId } });
      if (!prevNode) {
        res.status(400).json({ error: "afterId item not found in target list" });
        return;
      }
      // Skip ourselves if we're already in the same list
      const rawNext = prevNode.nextId != null ? await prisma.item.findUnique({ where: { id: prevNode.nextId } }) : null;
      nextNode = rawNext?.id === existing.id ? null : rawNext;
    } else {
      const rawHead = await prisma.item.findFirst({ where: { listId, prevId: null } });
      nextNode = rawHead?.id === existing.id ? null : rawHead;
    }

    // 2. Splice out from old position, insert at new position in one transaction.
    // Order matters for SQLite unique constraints:
    //   a) Clear item's own prev/next pointers (frees the unique slots they occupied)
    //   b) Repair old neighbors using the original pointer values
    //   c) Link new neighbors to the item
    //   d) Set item's new position
    const ops: ReturnType<typeof prisma.item.update>[] = [
      // a) Clear item's pointers so old neighbors can take ownership of each other's ids
      prisma.item.update({
        where: { id: existing.id },
        data: { prevId: null, nextId: null },
      }),
      // b) Repair old neighbors
      ...spliceOutOps(existing),
    ];

    if (prevNode) ops.push(prisma.item.update({ where: { id: prevNode.id }, data: { nextId: existing.id } }));
    if (nextNode) ops.push(prisma.item.update({ where: { id: nextNode.id }, data: { prevId: existing.id } }));

    ops.push(
      prisma.item.update({
        where: { id: existing.id },
        data: {
          listId,
          prevId: prevNode?.id ?? null,
          nextId: nextNode?.id ?? null,
        },
      }),
    );

    await prisma.$transaction(ops);

    // 3. Recalc ratings (both lists if the item moved between lists)
    const listsToRecalc = new Set([listId, oldListId]);
    await Promise.all([...listsToRecalc].map(recalcRatingsForList));

    const updated = await prisma.item.findUniqueOrThrow({ where: { id: existing.id } });
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

export default router;
