import { execSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const testEnv = { ...process.env, DATABASE_URL: "file:dist/test.db" };

export async function setup() {
  // Apply all pending migrations to the test database
  execSync("npx prisma migrate deploy", { cwd: root, env: testEnv, stdio: "inherit" });
  // Seed the test database with known users
  execSync("tsx prisma/seed.ts", { cwd: root, env: testEnv, stdio: "inherit" });
}
