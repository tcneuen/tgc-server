import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../prisma/src/client/client";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL,
});
export const prisma = new PrismaClient({ adapter });

prisma.$extends({
  result: {
    user: {
      password: {
        needs: {},
        compute() {
          return undefined;
        },
      },
      resetPasswordExpires: {
        needs: {},
        compute() {
          return undefined;
        },
      },
      resetPasswordToken: {
        needs: {},
        compute() {
          return undefined;
        },
      },
    },
  },
});

export default prisma;
