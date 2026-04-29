import auth from "./routes/auth";
import { authenticateToken } from "./token";
import express from "express";
import users from "./routes/users";
import collections from "./routes/collections";
import lists from "./routes/lists";
import items from "./routes/items";

const router = express.Router();

router.use(authenticateToken);
router.use("/auth", auth);
router.use("/users", users);
router.use("/collections", collections);
router.use("/collections/:collectionId/lists", lists);
router.use("/collections/:collectionId/items", items);

export default router;
