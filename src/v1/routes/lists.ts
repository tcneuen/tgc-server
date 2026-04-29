import express from "express";
import { z } from "zod";
import prisma from "../../prisma";

// mergeParams lets us access :collectionId from the parent router
const router = express.Router({ mergeParams: true });

const CreateListSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  protected: z.boolean().optional(),
  backgroundColor: z.string().nullable().optional(),
  startingRating: z.number().nullable().optional(),
});

const UpdateListSchema = z.object({
  name: z.string().optional(),
  protected: z.boolean().optional(),
  backgroundColor: z.string().nullable().optional(),
  startingRating: z.number().nullable().optional(),
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

// GET /collections/:collectionId/lists
router.get("/", async (req, res, next) => {
  const userId = getUserId(req);
  if (userId === null) { res.sendStatus(401); return; }
  try {
    const { collectionId } = req.params;
    const collection = await requireCollection(collectionId, userId, res);
    if (!collection) return;
    const lists = await prisma.list.findMany({ where: { collectionId } });
    res.json(lists);
  } catch (err) {
    next(err);
  }
});

// POST /collections/:collectionId/lists
router.post("/", async (req, res, next) => {
  const userId = getUserId(req);
  if (userId === null) { res.sendStatus(401); return; }
  const parsed = CreateListSchema.safeParse(req.body);
  if (!parsed.success) {
    next(parsed.error);
    return;
  }
  try {
    const { collectionId } = req.params;
    const collection = await requireCollection(collectionId, userId, res);
    if (!collection) return;
    const list = await prisma.list.create({
      data: { ...parsed.data, collectionId },
    });
    res.status(201).json(list);
  } catch (err) {
    next(err);
  }
});

// PATCH /collections/:collectionId/lists/:listId
router.patch("/:listId", async (req, res, next) => {
  const userId = getUserId(req);
  if (userId === null) { res.sendStatus(401); return; }
  const parsed = UpdateListSchema.safeParse(req.body);
  if (!parsed.success) {
    next(parsed.error);
    return;
  }
  try {
    const { collectionId, listId } = req.params;
    const collection = await requireCollection(collectionId, userId, res);
    if (!collection) return;
    const existing = await prisma.list.findFirst({
      where: { id: listId, collectionId },
    });
    if (!existing) {
      res.status(404).json({ error: "List not found" });
      return;
    }
    const list = await prisma.list.update({
      where: { id: listId },
      data: parsed.data,
    });
    res.json(list);
  } catch (err) {
    next(err);
  }
});

// DELETE /collections/:collectionId/lists/:listId
router.delete("/:listId", async (req, res, next) => {
  const userId = getUserId(req);
  if (userId === null) { res.sendStatus(401); return; }
  try {
    const { collectionId, listId } = req.params;
    const collection = await requireCollection(collectionId, userId, res);
    if (!collection) return;
    const existing = await prisma.list.findFirst({
      where: { id: listId, collectionId },
    });
    if (!existing) {
      res.status(404).json({ error: "List not found" });
      return;
    }
    if (existing.protected) {
      res.status(403).json({ error: "Cannot delete a protected list" });
      return;
    }
    await prisma.list.delete({ where: { id: listId } });
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
});

export default router;
