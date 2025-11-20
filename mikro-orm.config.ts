import { defineConfig } from "@mikro-orm/sqlite";

export default defineConfig({
  dbName: "lantern_db.sqlite",
  entities: ["src/entities"],
});
