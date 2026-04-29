import bcrypt from "bcryptjs";
import express, { Request } from "express";

import { User } from "../../../prisma/src/client";
import { UserCreateInputSchema } from "../../../prisma/src/zod";
import { zodValidateSchema } from "../../error";
import prisma from "../../prisma";

const router = express.Router();

router.post(
  "/",
  async (
    req: Request<null, Omit<User, "password">, Partial<User>>,
    res,

    next,
  ) => {
    const data = zodValidateSchema(UserCreateInputSchema, req, next);
    if (!data) return;
    const { password, ...data2 } = data;
    try {
      const result = await prisma.user.create({
        data: {
          ...data2,
          password: bcrypt.hashSync(password),
        },
        select: {
          id: true,
          email: true,
          name: true,
          username: true,
        },
      });
      res.json(result);
    } catch (error) {
      next(error);
    }
  },
);

router.get("/", async (req, res) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      username: true,
    },
  });
  res.json(users);
});

router.get("/:id", async (req: Request<User>, res) => {
  const id = req.params.id;
  if (!id) {
    res.status(404).json({ error: "Invalid user" });
    return;
  }
  const users = await prisma.user.findUnique({
    where: { id: Number(id) },
    select: {
      id: true,
      email: true,
      name: true,
      username: true,
    },
  });
  res.json(users);
});

export default router;
