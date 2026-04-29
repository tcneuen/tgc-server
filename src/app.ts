import express from "express";
import { errorHandler } from "./error";
import v1 from "./v1";

export const app = express();
app.use(express.json());
app.use("/v1", v1);
app.use(errorHandler);
