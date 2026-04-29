import request from "supertest";
import { app } from "../src/app";

export { app };

export const TYLER = { email: "tcneuen@prisma.io", password: "password123" };
export const BOB = { email: "bob@prisma.io", password: "password123" };

export async function getToken(email: string, password: string): Promise<string> {
  const res = await request(app)
    .post("/v1/auth/token")
    .send({ email, password });
  return res.body as string;
}
