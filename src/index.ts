import dotenv from "dotenv";
import fs from "fs";
import https from "https";

import { app } from "./app";

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
