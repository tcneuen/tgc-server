import auth from "./routes/auth";
import { authenticateToken } from "./token";
import express from "express";
import users from "./routes/users";

const router = express.Router();

router.use(authenticateToken);
router.use("/auth", auth);
router.use("/users", users);

export default router;
