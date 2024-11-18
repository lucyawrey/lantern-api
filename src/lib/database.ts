import { CamelCasePlugin, Kysely } from "kysely";
import { BunWorkerDialect } from "kysely-bun-worker";
import { DB } from "types/database";

const bunSqliteDialect = new BunWorkerDialect({
  url: process.env.DATABASE_URL || ":memory:",
})

export const database = new Kysely<DB>({
    dialect: bunSqliteDialect,
    plugins: [new CamelCasePlugin()],
});
