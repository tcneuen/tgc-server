import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import { app, getToken, TYLER } from "./helpers";

let token: string;
let collectionId: string;

beforeAll(async () => {
  token = await getToken(TYLER.email, TYLER.password);
});

afterAll(async () => {
  if (collectionId) {
    await request(app)
      .delete(`/v1/collections/${collectionId}`)
      .set("Authorization", `token ${token}`);
  }
});

describe("POST /v1/collections", () => {
  it("creates a collection and returns it with an empty lists array", async () => {
    const res = await request(app)
      .post("/v1/collections")
      .set("Authorization", `token ${token}`)
      .send({ name: "Movies" });

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ name: "Movies" });
    expect(Array.isArray(res.body.lists)).toBe(true);
    collectionId = res.body.id;
  });

  it("returns 403 without a token", async () => {
    const res = await request(app)
      .post("/v1/collections")
      .send({ name: "Movies" });

    expect(res.status).toBe(403);
  });

  it("returns 400 when name is missing", async () => {
    const res = await request(app)
      .post("/v1/collections")
      .set("Authorization", `token ${token}`)
      .send({});

    expect(res.status).toBe(400);
  });
});

describe("GET /v1/collections", () => {
  it("returns only the current user's collections", async () => {
    const res = await request(app)
      .get("/v1/collections")
      .set("Authorization", `token ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.some((c: { id: string }) => c.id === collectionId)).toBe(true);
  });

  it("does not return another user's collections", async () => {
    // Bob's token should not see Tyler's collection
    const bobToken = await getToken("bob@prisma.io", "password123");
    const res = await request(app)
      .get("/v1/collections")
      .set("Authorization", `token ${bobToken}`);

    expect(res.status).toBe(200);
    expect(res.body.some((c: { id: string }) => c.id === collectionId)).toBe(false);
  });
});

describe("GET /v1/collections/:id", () => {
  it("returns the collection with lists and items", async () => {
    const res = await request(app)
      .get(`/v1/collections/${collectionId}`)
      .set("Authorization", `token ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("id", collectionId);
    expect(res.body).toHaveProperty("lists");
    expect(res.body).toHaveProperty("items");
  });

  it("returns 404 for a non-existent id", async () => {
    const res = await request(app)
      .get("/v1/collections/00000000-0000-0000-0000-000000000000")
      .set("Authorization", `token ${token}`);

    expect(res.status).toBe(404);
  });

  it("returns 404 when accessing another user's collection", async () => {
    const bobToken = await getToken("bob@prisma.io", "password123");
    const res = await request(app)
      .get(`/v1/collections/${collectionId}`)
      .set("Authorization", `token ${bobToken}`);

    expect(res.status).toBe(404);
  });
});

describe("PATCH /v1/collections/:id", () => {
  it("renames the collection", async () => {
    const res = await request(app)
      .patch(`/v1/collections/${collectionId}`)
      .set("Authorization", `token ${token}`)
      .send({ name: "Favourite Movies" });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("name", "Favourite Movies");
  });

  it("updates defaultListId", async () => {
    const listRes = await request(app)
      .post(`/v1/collections/${collectionId}/lists`)
      .set("Authorization", `token ${token}`)
      .send({ name: "Unrated" });
    const listId = listRes.body.id;

    const res = await request(app)
      .patch(`/v1/collections/${collectionId}`)
      .set("Authorization", `token ${token}`)
      .send({ defaultListId: listId });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("defaultListId", listId);
  });
});

describe("DELETE /v1/collections/:id", () => {
  it("deletes the collection and cascades to lists and items", async () => {
    const createRes = await request(app)
      .post("/v1/collections")
      .set("Authorization", `token ${token}`)
      .send({ name: "Temporary" });
    const id = createRes.body.id;

    const deleteRes = await request(app)
      .delete(`/v1/collections/${id}`)
      .set("Authorization", `token ${token}`);
    expect(deleteRes.status).toBe(204);

    const getRes = await request(app)
      .get(`/v1/collections/${id}`)
      .set("Authorization", `token ${token}`);
    expect(getRes.status).toBe(404);
  });
});
