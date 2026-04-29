import express, { Request } from "express";
import bcrypt from "bcryptjs";
import { generateAccessToken } from "../token";
import prisma from "../../prisma";

const router = express.Router();
router.post(
  "/token",
  async (
    req: Request<{ email: string; password: string }>,
    res,
    next,
  ): Promise<void> => {
    const { email, password } = req.body;
    if (!email || !password)
      res.status(400).json({ error: "Email or password missing" });

    const user = await prisma.user.findUnique({
      where: { email: req.body?.email },
    });
    if (
      !user ||
      !user.password ||
      !bcrypt.compareSync(password, user.password)
    ) {
      res.sendStatus(403);
      return;
    }
    const token = generateAccessToken({
      id: user.id,
      email: user.email,
      name: user?.name || "",
    });
    res.status(200).json(token);
  },
);

export default router;
