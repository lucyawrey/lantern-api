import openapi from "@elysiajs/openapi";
import { MikroORM } from "@mikro-orm/sqlite";
import { homeController } from "controllers/home";
import { userController } from "controllers/user";
import { Elysia } from "elysia";
import { User } from "entities/User";

export const db = await MikroORM.init();

const newUser = new User({
  name: "admin",
  displayName: "Lantern Administrator",
  roles: ["admin"],
  passwordHash: "hashed_password_here",
});
await db.em.fork().persist(newUser).flush();

const app = new Elysia()
  .use(openapi({ path: "/docs" }))
  .use(homeController)
  .use(userController)
  .listen(3000);

console.log(
  `🏮 Lantern API service started on: http://${app.server?.hostname}:${app.server?.port}`
);
function initORM() {
  throw new Error("Function not implemented.");
}
