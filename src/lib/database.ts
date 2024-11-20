import { CamelCasePlugin, Kysely } from "kysely";
import { BunWorkerDialect } from "kysely-bun-worker";
import { DB } from "types/database";
import { databaseUrl } from "lib/env";

const bunSqliteDialect = new BunWorkerDialect({
  url: databaseUrl,
})

export const db = new Kysely<DB>({
    dialect: bunSqliteDialect,
    plugins: [new CamelCasePlugin()],
});
