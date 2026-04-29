import bcrypt from "bcryptjs";

import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "./src/client/client";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL,
});
export const prisma = new PrismaClient({ adapter });

async function main() {
  const tyler = await prisma.user.upsert({
    where: { email: "tcneuen@prisma.io" },
    update: {},
    create: {
      email: "tcneuen@prisma.io",
      name: "Tyler Neuenschwander",
      username: "tcneuen",
      password: bcrypt.hashSync("password123"),
    },
  });
  const bob = await prisma.user.upsert({
    where: { email: "bob@prisma.io" },
    update: {},
    create: {
      email: "bob@prisma.io",
      username: "bobprism",
      name: "Bob Prism",
      password: bcrypt.hashSync("password123"),
    },
  });

  console.log({
    tyler: { email: tyler.email, name: tyler.name, username: tyler.username },
    bob: { email: bob.email, name: bob.name, username: bob.username },
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
