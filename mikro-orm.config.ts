import { TsMorphMetadataProvider } from "@mikro-orm/reflection";
import { Options, SqliteDriver } from "@mikro-orm/sqlite";

const config: Options = {
  dbName: "lantern.db",
  entities: ["./dist/entities"],
  entitiesTs: ["./src/entities"],
  driver: SqliteDriver,
  metadataProvider: TsMorphMetadataProvider,
  migrations: {
    path: "./dist/migrations",
    pathTs: "./src/migrations",
  },
  debug: process.env.NODE_ENV === "production" ? false : true,
};

export default config;
