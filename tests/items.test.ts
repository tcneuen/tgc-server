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
    .send({ name: "Ranked", startingRating: 1400 });
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
  it("creates the first item as the head (prevId=null, nextId=null)", async () => {
    const res = await request(app)
      .post(`/v1/collections/${collectionId}/items`)
      .set("Authorization", `token ${token}`)
      .send({
        name: "The Dark Knight",
        description: "2008 film by Christopher Nolan",
        listId,
      });

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ name: "The Dark Knight", prevId: null, nextId: null });
    itemId = res.body.id;
  });

  it("appends a second item (afterId omitted = after existing head)", async () => {
    const res = await request(app)
      .post(`/v1/collections/${collectionId}/items`)
      .set("Authorization", `token ${token}`)
      .send({
        name: "Inception",
        description: "2010 film by Christopher Nolan",
        listId,
        afterId: itemId,
      });

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ prevId: itemId, nextId: null });
  });

  it("inserts item at the head when afterId is null", async () => {
    const res = await request(app)
      .post(`/v1/collections/${collectionId}/items`)
      .set("Authorization", `token ${token}`)
      .send({
        name: "Interstellar",
        description: "2014 film",
        listId,
        afterId: null,
      });

    expect(res.status).toBe(201);
    // New item becomes head: prevId null, nextId points to old head
    expect(res.body.prevId).toBeNull();
    expect(res.body.nextId).toBe(itemId);
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
  it("returns all items in linked-list order", async () => {
    const res = await request(app)
      .get(`/v1/collections/${collectionId}/items`)
      .set("Authorization", `token ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    // Each item's nextId should match the next item's id
    for (let i = 0; i < res.body.length - 1; i++) {
      expect(res.body[i].nextId).toBe(res.body[i + 1].id);
    }
    // Last item has nextId = null
    if (res.body.length > 0) {
      expect(res.body[res.body.length - 1].nextId).toBeNull();
    }
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
  it("moves an item to the head of a different list", async () => {
    const targetRes = await request(app)
      .post(`/v1/collections/${collectionId}/lists`)
      .set("Authorization", `token ${token}`)
      .send({ name: "Move Target" });
    const targetListId = targetRes.body.id;

    const res = await request(app)
      .patch(`/v1/collections/${collectionId}/items/${itemId}/move`)
      .set("Authorization", `token ${token}`)
      .send({ listId: targetListId, afterId: null });

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ listId: targetListId, prevId: null });
  });

  it("returns 400 when listId is missing from the move body", async () => {
    const res = await request(app)
      .patch(`/v1/collections/${collectionId}/items/${itemId}/move`)
      .set("Authorization", `token ${token}`)
      .send({ afterId: null });

    expect(res.status).toBe(400);
  });
});

describe("DELETE /v1/collections/:collectionId/items/:itemId", () => {
  it("deletes an item and repairs the linked list", async () => {
    const seqListRes = await request(app)
      .post(`/v1/collections/${collectionId}/lists`)
      .set("Authorization", `token ${token}`)
      .send({ name: "Sequence Test List" });
    const seqListId = seqListRes.body.id;

    const first = await request(app)
      .post(`/v1/collections/${collectionId}/items`)
      .set("Authorization", `token ${token}`)
      .send({ name: "First", description: "", listId: seqListId });
    const second = await request(app)
      .post(`/v1/collections/${collectionId}/items`)
      .set("Authorization", `token ${token}`)
      .send({ name: "Second", description: "", listId: seqListId, afterId: first.body.id });

    const deleteRes = await request(app)
      .delete(`/v1/collections/${collectionId}/items/${first.body.id}`)
      .set("Authorization", `token ${token}`);
    expect(deleteRes.status).toBe(204);

    const itemsRes = await request(app)
      .get(`/v1/collections/${collectionId}/items?listId=${seqListId}`)
      .set("Authorization", `token ${token}`);
    expect(itemsRes.body).toHaveLength(1);
    // Second item is now the head after first was deleted
    expect(itemsRes.body[0]).toMatchObject({ id: second.body.id, prevId: null });
  });

  it("returns 404 for a non-existent item", async () => {
    const res = await request(app)
      .delete(`/v1/collections/${collectionId}/items/999999`)
      .set("Authorization", `token ${token}`);

    expect(res.status).toBe(404);
  });
});
