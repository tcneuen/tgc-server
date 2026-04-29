import dotenv from "dotenv";
import express from "express";
import fs from "fs";
import https from "https";

import { errorHandler } from "./error";
import v1 from "./v1";

const app = express();

app.use(express.json());

app.use("/v1", v1);

app.use(errorHandler);

const server = https.createServer(
  {
    key: fs.readFileSync("dist/key.pem"),
    cert: fs.readFileSync("dist/cert.pem"),
  },
  app,
);
dotenv.config();
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server ready at: https://localhost:${PORT}`);
});
