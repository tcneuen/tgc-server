import express from "express";
import { z } from "zod";
import prisma from "../../prisma";

const router = express.Router();

const CreateCollectionSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  defaultListId: z.string().nullable().optional(),
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
    const collection = await prisma.collection.create({
      data: { ...parsed.data, userId },
      include: { lists: true },
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
      include: { lists: true, items: { orderBy: { order: "asc" } } },
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
