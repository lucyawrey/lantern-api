import openapi from "@elysiajs/openapi";
import { homeController } from "controllers/home";
import { userController } from "controllers/user";
import { Elysia } from "elysia";
import { User } from "entities/User";
import { databaseUrl, encryptionKey } from "lib/env";
import { orm } from "lib/orm";

if (databaseUrl == undefined || encryptionKey == undefined) {
  console.error("  Missing required environment variables, stopping server.");
  process.exit(0);
}

const newUser = new User({
  name: "admin",
  displayName: "Lantern Administrator",
  roles: ["admin"],
  passwordHash: "hashed_password_here",
});
await orm.em.persist(newUser).flush();

const app = new Elysia()
  .use(openapi({ path: "/docs" }))
  .use(homeController)
  .use(userController)
  .listen(3000);

console.log(
  `🏮 Lantern API service started on: http://${app.server?.hostname}:${app.server?.port}`
);
