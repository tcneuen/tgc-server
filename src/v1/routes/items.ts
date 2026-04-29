import express from "express";
import { z } from "zod";
import prisma from "../../prisma";

// mergeParams lets us access :collectionId from the parent router
const router = express.Router({ mergeParams: true });

const CreateItemSchema = z.object({
  name: z.string(),
  description: z.string(),
  listId: z.string().uuid(),
  order: z.number().int().optional(),
});

const UpdateItemSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
});

const MoveItemSchema = z.object({
  listId: z.string().uuid(),
  order: z.number().int(),
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

// GET /collections/:collectionId/items?listId=<optional>
router.get("/", async (req, res, next) => {
  const userId = getUserId(req);
  if (userId === null) { res.sendStatus(401); return; }
  try {
    const { collectionId } = req.params;
    const collection = await requireCollection(collectionId, userId, res);
    if (!collection) return;
    const listId = req.query.listId as string | undefined;
    const items = await prisma.item.findMany({
      where: { collectionId, ...(listId ? { listId } : {}) },
      orderBy: { order: "asc" },
    });
    res.json(items);
  } catch (err) {
    next(err);
  }
});

// POST /collections/:collectionId/items
router.post("/", async (req, res, next) => {
  const userId = getUserId(req);
  if (userId === null) { res.sendStatus(401); return; }
  const parsed = CreateItemSchema.safeParse(req.body);
  if (!parsed.success) {
    next(parsed.error);
    return;
  }
  try {
    const { collectionId } = req.params;
    const collection = await requireCollection(collectionId, userId, res);
    if (!collection) return;
    const { listId, order, ...rest } = parsed.data;
    const computedOrder =
      order ??
      (await prisma.item.count({ where: { collectionId, listId } })) + 1;
    const item = await prisma.item.create({
      data: { ...rest, collectionId, listId, order: computedOrder },
    });
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
});

// PATCH /collections/:collectionId/items/:itemId
router.patch("/:itemId", async (req, res, next) => {
  const userId = getUserId(req);
  if (userId === null) { res.sendStatus(401); return; }
  const parsed = UpdateItemSchema.safeParse(req.body);
  if (!parsed.success) {
    next(parsed.error);
    return;
  }
  try {
    const { collectionId, itemId } = req.params;
    const collection = await requireCollection(collectionId, userId, res);
    if (!collection) return;
    const existing = await prisma.item.findFirst({
      where: { id: Number(itemId), collectionId },
    });
    if (!existing) {
      res.status(404).json({ error: "Item not found" });
      return;
    }
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
// Re-sequences order for remaining items in the same list
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
    if (!existing) {
      res.status(404).json({ error: "Item not found" });
      return;
    }
    await prisma.$transaction([
      prisma.item.delete({ where: { id: Number(itemId) } }),
      prisma.item.updateMany({
        where: {
          collectionId,
          listId: existing.listId,
          order: { gt: existing.order },
        },
        data: { order: { decrement: 1 } },
      }),
    ]);
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
});

// PATCH /collections/:collectionId/items/:itemId/move — change list and/or position
router.patch("/:itemId/move", async (req, res, next) => {
  const userId = getUserId(req);
  if (userId === null) { res.sendStatus(401); return; }
  const parsed = MoveItemSchema.safeParse(req.body);
  if (!parsed.success) {
    next(parsed.error);
    return;
  }
  try {
    const { collectionId, itemId } = req.params;
    const collection = await requireCollection(collectionId, userId, res);
    if (!collection) return;
    const existing = await prisma.item.findFirst({
      where: { id: Number(itemId), collectionId },
    });
    if (!existing) {
      res.status(404).json({ error: "Item not found" });
      return;
    }
    const { listId, order } = parsed.data;
    const item = await prisma.item.update({
      where: { id: Number(itemId) },
      data: { listId, order },
    });
    res.json(item);
  } catch (err) {
    next(err);
  }
});

export default router;
