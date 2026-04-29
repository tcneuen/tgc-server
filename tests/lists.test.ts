import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import { app, getToken, TYLER } from "./helpers";

let token: string;
let collectionId: string;
let listId: string;

beforeAll(async () => {
  token = await getToken(TYLER.email, TYLER.password);

  const res = await request(app)
    .post("/v1/collections")
    .set("Authorization", `token ${token}`)
    .send({ name: "Test Collection for Lists" });
  collectionId = res.body.id;
});

afterAll(async () => {
  if (collectionId) {
    await request(app)
      .delete(`/v1/collections/${collectionId}`)
      .set("Authorization", `token ${token}`);
  }
});

describe("POST /v1/collections/:collectionId/lists", () => {
  it("creates a list", async () => {
    const res = await request(app)
      .post(`/v1/collections/${collectionId}/lists`)
      .set("Authorization", `token ${token}`)
      .send({ name: "S Tier", backgroundColor: "#FFD700" });

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ name: "S Tier", backgroundColor: "#FFD700" });
    listId = res.body.id;
  });

  it("creates a protected list", async () => {
    const res = await request(app)
      .post(`/v1/collections/${collectionId}/lists`)
      .set("Authorization", `token ${token}`)
      .send({ name: "Unrated", protected: true });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("protected", true);
  });

  it("returns 404 for a non-existent collection", async () => {
    const res = await request(app)
      .post("/v1/collections/00000000-0000-0000-0000-000000000000/lists")
      .set("Authorization", `token ${token}`)
      .send({ name: "Ghost List" });

    expect(res.status).toBe(404);
  });

  it("returns 400 when name is missing", async () => {
    const res = await request(app)
      .post(`/v1/collections/${collectionId}/lists`)
      .set("Authorization", `token ${token}`)
      .send({});

    expect(res.status).toBe(400);
  });
});

describe("GET /v1/collections/:collectionId/lists", () => {
  it("returns all lists for the collection", async () => {
    const res = await request(app)
      .get(`/v1/collections/${collectionId}/lists`)
      .set("Authorization", `token ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.some((l: { id: string }) => l.id === listId)).toBe(true);
  });
});

describe("PATCH /v1/collections/:collectionId/lists/:listId", () => {
  it("renames a list", async () => {
    const res = await request(app)
      .patch(`/v1/collections/${collectionId}/lists/${listId}`)
      .set("Authorization", `token ${token}`)
      .send({ name: "A Tier" });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("name", "A Tier");
  });

  it("updates the background color", async () => {
    const res = await request(app)
      .patch(`/v1/collections/${collectionId}/lists/${listId}`)
      .set("Authorization", `token ${token}`)
      .send({ backgroundColor: "#C0C0C0" });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("backgroundColor", "#C0C0C0");
  });

  it("updates startingRating", async () => {
    const res = await request(app)
      .patch(`/v1/collections/${collectionId}/lists/${listId}`)
      .set("Authorization", `token ${token}`)
      .send({ startingRating: 75 });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("startingRating", 75);
  });

  it("returns 404 for a non-existent list", async () => {
    const res = await request(app)
      .patch(`/v1/collections/${collectionId}/lists/00000000-0000-0000-0000-000000000000`)
      .set("Authorization", `token ${token}`)
      .send({ name: "Ghost" });

    expect(res.status).toBe(404);
  });
});

describe("DELETE /v1/collections/:collectionId/lists/:listId", () => {
  it("refuses to delete a protected list", async () => {
    const createRes = await request(app)
      .post(`/v1/collections/${collectionId}/lists`)
      .set("Authorization", `token ${token}`)
      .send({ name: "Protected List", protected: true });
    const protectedId = createRes.body.id;

    const res = await request(app)
      .delete(`/v1/collections/${collectionId}/lists/${protectedId}`)
      .set("Authorization", `token ${token}`);

    expect(res.status).toBe(403);
  });

  it("deletes a non-protected list", async () => {
    const createRes = await request(app)
      .post(`/v1/collections/${collectionId}/lists`)
      .set("Authorization", `token ${token}`)
      .send({ name: "To Delete" });
    const id = createRes.body.id;

    const res = await request(app)
      .delete(`/v1/collections/${collectionId}/lists/${id}`)
      .set("Authorization", `token ${token}`);

    expect(res.status).toBe(204);
  });
});
