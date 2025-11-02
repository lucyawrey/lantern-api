import { TsMorphMetadataProvider } from "@mikro-orm/reflection";
import { Options, SqliteDriver } from "@mikro-orm/sqlite";
import { databaseUrl } from "lib/env";

const config: Options = {
  dbName: databaseUrl,
  entities: ["./dist/entities"],
  entitiesTs: ["./src/entities"],
  driver: SqliteDriver,
  metadataProvider: TsMorphMetadataProvider,
  debug: process.env.NODE_ENV === "production" ? false : true,
};

export default config;
