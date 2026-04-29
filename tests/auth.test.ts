import { describe, it, expect } from "vitest";
import request from "supertest";
import { app } from "./helpers";

describe("POST /v1/auth/token", () => {
  it("returns a JWT for valid credentials", async () => {
    const res = await request(app)
      .post("/v1/auth/token")
      .send({ email: "tcneuen@prisma.io", password: "password123" });

    expect(res.status).toBe(200);
    expect(typeof res.body).toBe("string");
    // JWT has three dot-separated segments
    expect((res.body as string).split(".")).toHaveLength(3);
  });

  it("returns 403 for an incorrect password", async () => {
    const res = await request(app)
      .post("/v1/auth/token")
      .send({ email: "tcneuen@prisma.io", password: "wrongpassword" });

    expect(res.status).toBe(403);
  });

  it("returns 403 for a non-existent user", async () => {
    const res = await request(app)
      .post("/v1/auth/token")
      .send({ email: "nobody@example.com", password: "password123" });

    expect(res.status).toBe(403);
  });

  it("returns 400 when email is missing", async () => {
    const res = await request(app)
      .post("/v1/auth/token")
      .send({ password: "password123" });

    expect(res.status).toBe(400);
  });
});
