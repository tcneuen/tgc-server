import dotenv from "dotenv";
import { defineConfig } from "vitest/config";

dotenv.config();

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    env: {
      DATABASE_URL: "file:dist/test.db",
      TOKEN_SECRET: process.env.TOKEN_SECRET ?? "test-secret-for-vitest",
    },
    globalSetup: "./tests/globalSetup.ts",
    // Run test files sequentially — they share one SQLite test DB
    sequence: { concurrent: false },
  },
});
