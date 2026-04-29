import { RequestHandler } from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface User {
      id: number;
      email: string;
      name: string;
    }
    interface Request {
      user?: User;
    }
  }
}

dotenv.config();
if (!process.env.TOKEN_SECRET)
  throw new Error("No token secret found in .env file");
const TOKEN_SECRET = process.env.TOKEN_SECRET;

function generateAccessToken(user: Express.Request["user"]) {
  return jwt.sign(user as object, TOKEN_SECRET, { expiresIn: "3d" });
}

const authenticateToken: RequestHandler = (req, res, next) => {
  if (req.originalUrl === "/v1/auth/token") return next();

  const authHeader = req.headers.authorization;
  const token = authHeader ? authHeader.split(" ")[1] : "";
  if (token == null) {
    res.sendStatus(401);
    return;
  }

  jwt.verify(token, TOKEN_SECRET, (err, user) => {
    console.log(err);

    if (err) return res.sendStatus(403);
    if (user === undefined || typeof user !== "object")
      return res.sendStatus(403);

    req.user = user as Express.Request["user"];

    next();
  });
};

export { authenticateToken, generateAccessToken };
