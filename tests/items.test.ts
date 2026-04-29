import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import { app, getToken, TYLER } from "./helpers";

let token: string;
let collectionId: string;
let listId: string;
let itemId: number;

beforeAll(async () => {
  token = await getToken(TYLER.email, TYLER.password);

  const colRes = await request(app)
    .post("/v1/collections")
    .set("Authorization", `token ${token}`)
    .send({ name: "Test Collection for Items" });
  collectionId = colRes.body.id;

  const listRes = await request(app)
    .post(`/v1/collections/${collectionId}/lists`)
    .set("Authorization", `token ${token}`)
    .send({ name: "Ranked" });
  listId = listRes.body.id;
});

afterAll(async () => {
  if (collectionId) {
    await request(app)
      .delete(`/v1/collections/${collectionId}`)
      .set("Authorization", `token ${token}`);
  }
});

describe("POST /v1/collections/:collectionId/items", () => {
  it("creates an item and auto-assigns order = 1 for the first item", async () => {
    const res = await request(app)
      .post(`/v1/collections/${collectionId}/items`)
      .set("Authorization", `token ${token}`)
      .send({
        name: "The Dark Knight",
        description: "2008 film by Christopher Nolan",
        listId,
      });

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ name: "The Dark Knight", order: 1 });
    itemId = res.body.id;
  });

  it("appends a second item with order = 2", async () => {
    const res = await request(app)
      .post(`/v1/collections/${collectionId}/items`)
      .set("Authorization", `token ${token}`)
      .send({
        name: "Inception",
        description: "2010 film by Christopher Nolan",
        listId,
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("order", 2);
  });

  it("accepts an explicit order value", async () => {
    const res = await request(app)
      .post(`/v1/collections/${collectionId}/items`)
      .set("Authorization", `token ${token}`)
      .send({
        name: "Interstellar",
        description: "2014 film",
        listId,
        order: 1,
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("order", 1);
  });

  it("returns 400 when listId is missing", async () => {
    const res = await request(app)
      .post(`/v1/collections/${collectionId}/items`)
      .set("Authorization", `token ${token}`)
      .send({ name: "No List", description: "Missing listId" });

    expect(res.status).toBe(400);
  });

  it("returns 404 for a non-existent collection", async () => {
    const res = await request(app)
      .post("/v1/collections/00000000-0000-0000-0000-000000000000/items")
      .set("Authorization", `token ${token}`)
      .send({ name: "Ghost", description: "...", listId });

    expect(res.status).toBe(404);
  });
});

describe("GET /v1/collections/:collectionId/items", () => {
  it("returns all items ordered by order asc", async () => {
    const res = await request(app)
      .get(`/v1/collections/${collectionId}/items`)
      .set("Authorization", `token ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    const orders = res.body.map((i: { order: number }) => i.order);
    expect(orders).toEqual([...orders].sort((a, b) => a - b));
  });

  it("filters items by listId query param", async () => {
    const res = await request(app)
      .get(`/v1/collections/${collectionId}/items?listId=${listId}`)
      .set("Authorization", `token ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.every((i: { listId: string }) => i.listId === listId)).toBe(true);
  });
});

describe("PATCH /v1/collections/:collectionId/items/:itemId", () => {
  it("updates item name and description", async () => {
    const res = await request(app)
      .patch(`/v1/collections/${collectionId}/items/${itemId}`)
      .set("Authorization", `token ${token}`)
      .send({ name: "The Dark Knight (2008)", description: "Updated description" });

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      name: "The Dark Knight (2008)",
      description: "Updated description",
    });
  });

  it("returns 404 for a non-existent item", async () => {
    const res = await request(app)
      .patch(`/v1/collections/${collectionId}/items/999999`)
      .set("Authorization", `token ${token}`)
      .send({ name: "Ghost" });

    expect(res.status).toBe(404);
  });
});

describe("PATCH /v1/collections/:collectionId/items/:itemId/move", () => {
  it("moves an item to a different list", async () => {
    const targetRes = await request(app)
      .post(`/v1/collections/${collectionId}/lists`)
      .set("Authorization", `token ${token}`)
      .send({ name: "Move Target" });
    const targetListId = targetRes.body.id;

    const res = await request(app)
      .patch(`/v1/collections/${collectionId}/items/${itemId}/move`)
      .set("Authorization", `token ${token}`)
      .send({ listId: targetListId, order: 1 });

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ listId: targetListId, order: 1 });
  });

  it("returns 400 when listId is missing from the move body", async () => {
    const res = await request(app)
      .patch(`/v1/collections/${collectionId}/items/${itemId}/move`)
      .set("Authorization", `token ${token}`)
      .send({ order: 1 });

    expect(res.status).toBe(400);
  });
});

describe("DELETE /v1/collections/:collectionId/items/:itemId", () => {
  it("deletes an item and re-sequences remaining items", async () => {
    // Create two items and delete the first; the second should shift to order 1
    const secondListRes = await request(app)
      .post(`/v1/collections/${collectionId}/lists`)
      .set("Authorization", `token ${token}`)
      .send({ name: "Sequence Test List" });
    const seqListId = secondListRes.body.id;

    const first = await request(app)
      .post(`/v1/collections/${collectionId}/items`)
      .set("Authorization", `token ${token}`)
      .send({ name: "First", description: "", listId: seqListId });
    const second = await request(app)
      .post(`/v1/collections/${collectionId}/items`)
      .set("Authorization", `token ${token}`)
      .send({ name: "Second", description: "", listId: seqListId });

    const deleteRes = await request(app)
      .delete(`/v1/collections/${collectionId}/items/${first.body.id}`)
      .set("Authorization", `token ${token}`);
    expect(deleteRes.status).toBe(204);

    const itemsRes = await request(app)
      .get(`/v1/collections/${collectionId}/items?listId=${seqListId}`)
      .set("Authorization", `token ${token}`);
    expect(itemsRes.body).toHaveLength(1);
    expect(itemsRes.body[0]).toMatchObject({ id: second.body.id, order: 1 });
  });

  it("returns 404 for a non-existent item", async () => {
    const res = await request(app)
      .delete(`/v1/collections/${collectionId}/items/999999`)
      .set("Authorization", `token ${token}`);

    expect(res.status).toBe(404);
  });
});
