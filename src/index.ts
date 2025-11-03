import openapi from "@elysiajs/openapi";
import { MikroORM } from "@mikro-orm/sqlite";
import { homeController } from "controllers/home";
import { userController } from "controllers/user";
import { Elysia } from "elysia";

export const db = await MikroORM.init();

const app = new Elysia()
  .use(openapi({ path: "/docs" }))
  .use(homeController)
  .use(userController)
  .listen(3000);

console.log(
  `🏮 Lantern API service started on: http://${app.server?.hostname}:${app.server?.port}`
);
