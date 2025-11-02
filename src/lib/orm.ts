import { MikroORM } from "@mikro-orm/sqlite";

const orm = await MikroORM.init({
  entities: ["./dist/entities"], // path to your JS entities (dist), relative to `baseDir`
  dbName: "my-db-name",
});
