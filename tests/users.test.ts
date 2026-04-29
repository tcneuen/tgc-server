import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import { app, getToken, TYLER } from "./helpers";

let token: string;

beforeAll(async () => {
  token = await getToken(TYLER.email, TYLER.password);
});

describe("GET /v1/users", () => {
  it("returns all users (without passwords)", async () => {
    const res = await request(app)
      .get("/v1/users")
      .set("Authorization", `token ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).not.toHaveProperty("password");
  });

  it("returns 403 without a token", async () => {
    const res = await request(app).get("/v1/users");
    expect(res.status).toBe(403);
  });
});

describe("GET /v1/users/:id", () => {
  it("returns the user by id", async () => {
    const res = await request(app)
      .get("/v1/users/1")
      .set("Authorization", `token ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ email: "tcneuen@prisma.io" });
    expect(res.body).not.toHaveProperty("password");
  });
});

describe("POST /v1/users", () => {
  it("creates a new user and returns it without the password", async () => {
    const unique = Date.now();

    const res = await request(app)
      .post("/v1/users")
      .set("Authorization", `token ${token}`)
      .send({
        name: "Test User",
        username: `testuser_${unique}`,
        email: `testuser_${unique}@example.com`,
        password: "password123",
      });

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ email: `testuser_${unique}@example.com` });
    expect(res.body).not.toHaveProperty("password");
  });

  it("returns 400 for a duplicate email", async () => {
    const res = await request(app)
      .post("/v1/users")
      .set("Authorization", `token ${token}`)
      .send({
        name: "Tyler Duplicate",
        username: "tcneuen_dup",
        email: "tcneuen@prisma.io",
        password: "password123",
      });

    expect(res.status).toBe(400);
  });

  it("returns 400 when required fields are missing", async () => {
    const res = await request(app)
      .post("/v1/users")
      .set("Authorization", `token ${token}`)
      .send({ name: "No email or username" });

    expect(res.status).toBe(400);
  });
});
