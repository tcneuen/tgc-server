import express from "express";
import { z } from "zod";
import prisma from "../../prisma";

const router = express.Router();

const CreateListImportSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  protected: z.boolean().optional(),
  backgroundColor: z.string().optional(),
  startingRating: z.number().optional(),
  items: z.array(z.object({
    name: z.string(),
    description: z.string(),
  })).optional(),
});

const CreateCollectionSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  defaultListId: z.string().nullable().optional(),
  lists: z.array(CreateListImportSchema).optional(),
});

const UpdateCollectionSchema = z.object({
  name: z.string().optional(),
  defaultListId: z.string().nullable().optional(),
});

function getUserId(req: express.Request): number | null {
  return req.user?.id ?? null;
}

// GET /collections — all collections for the current user (with their lists)
router.get("/", async (req, res, next) => {
  const userId = getUserId(req);
  if (userId === null) { res.sendStatus(401); return; }
  try {
    const collections = await prisma.collection.findMany({
      where: { userId },
      include: { lists: true },
    });
    res.json(collections);
  } catch (err) {
    next(err);
  }
});

// POST /collections
router.post("/", async (req, res, next) => {
  const userId = getUserId(req);
  if (userId === null) { res.sendStatus(401); return; }
  const parsed = CreateCollectionSchema.safeParse(req.body);
  if (!parsed.success) {
    next(parsed.error);
    return;
  }
  try {
    const { lists: listsInput, ...collectionData } = parsed.data;

    if (!listsInput || listsInput.length === 0) {
      // Simple creation — no lists or items
      const collection = await prisma.collection.create({
        data: { ...collectionData, userId },
        include: { lists: true },
      });
      res.status(201).json(collection);
      return;
    }

    // Full import: create collection + lists + items + ratings in one transaction
    const collectionId = collectionData.id ?? crypto.randomUUID();
    const listRecords = listsInput.map((l) => ({
      id: l.id ?? crypto.randomUUID(),
      name: l.name,
      protected: l.protected ?? false,
      backgroundColor: l.backgroundColor ?? null,
      startingRating: l.startingRating ?? null,
    }));

    await prisma.$transaction(async (tx) => {
      // Create collection and all lists
      await tx.collection.create({
        data: {
          id: collectionId,
          name: collectionData.name,
          defaultListId: collectionData.defaultListId ?? null,
          userId,
          lists: { create: listRecords },
        },
      });

      // Create items per list in linked-list order
      const itemIdsByList = new Map<string, number[]>();
      for (let li = 0; li < listsInput.length; li++) {
        const listItems = listsInput[li].items ?? [];
        const listId = listRecords[li].id;
        const createdIds: number[] = [];
        let prevId: number | null = null;

        for (const itemData of listItems) {
          const item = await tx.item.create({
            data: { name: itemData.name, description: itemData.description, collectionId, listId, prevId, nextId: null, rating: null },
          });
          if (prevId !== null) {
            await tx.item.update({ where: { id: prevId }, data: { nextId: item.id } });
          }
          createdIds.push(item.id);
          prevId = item.id;
        }
        itemIdsByList.set(listId, createdIds);
      }

      // Compute and apply ratings
      for (const lr of listRecords) {
        const itemIds = itemIdsByList.get(lr.id) ?? [];
        if (itemIds.length === 0 || lr.startingRating == null) continue;
        const floor = lr.startingRating;
        const ceiling = listRecords
          .map((l) => l.startingRating)
          .filter((r): r is number => r != null && r > floor)
          .sort((a, b) => a - b)[0] ?? 10.0;
        const n = itemIds.length;
        for (let i = 0; i < n; i++) {
          const rating = floor + (ceiling - floor) * Math.max(0, n - 1 - i) / n;
          await tx.item.update({ where: { id: itemIds[i] }, data: { rating } });
        }
      }
    });

    const collection = await prisma.collection.findFirst({
      where: { id: collectionId },
      include: { lists: true, items: true },
    });
    res.status(201).json(collection);
  } catch (err) {
    next(err);
  }
});

// GET /collections/:id
router.get("/:id", async (req, res, next) => {
  const userId = getUserId(req);
  if (userId === null) { res.sendStatus(401); return; }
  try {
    const collection = await prisma.collection.findFirst({
      where: { id: req.params.id, userId },
      include: { lists: true, items: true },
    });
    if (!collection) {
      res.status(404).json({ error: "Collection not found" });
      return;
    }
    res.json(collection);
  } catch (err) {
    next(err);
  }
});

// PATCH /collections/:id
router.patch("/:id", async (req, res, next) => {
  const userId = getUserId(req);
  if (userId === null) { res.sendStatus(401); return; }
  const parsed = UpdateCollectionSchema.safeParse(req.body);
  if (!parsed.success) {
    next(parsed.error);
    return;
  }
  try {
    const existing = await prisma.collection.findFirst({
      where: { id: req.params.id, userId },
    });
    if (!existing) {
      res.status(404).json({ error: "Collection not found" });
      return;
    }
    const collection = await prisma.collection.update({
      where: { id: req.params.id },
      data: parsed.data,
    });
    res.json(collection);
  } catch (err) {
    next(err);
  }
});

// DELETE /collections/:id
router.delete("/:id", async (req, res, next) => {
  const userId = getUserId(req);
  if (userId === null) { res.sendStatus(401); return; }
  try {
    const existing = await prisma.collection.findFirst({
      where: { id: req.params.id, userId },
    });
    if (!existing) {
      res.status(404).json({ error: "Collection not found" });
      return;
    }
    await prisma.collection.delete({ where: { id: req.params.id } });
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
});

export default router;
