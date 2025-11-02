import openapi from "@elysiajs/openapi";
import { userController } from "controllers/user";
import { Elysia } from "elysia";
import { databaseUrl, encryptionKey } from "lib/env";
import { jsxMiddleware } from "middleware/jsx";

if (databaseUrl == undefined || encryptionKey == undefined) {
  console.error("  Missing required environment variables, stopping server.");
  process.exit(0);
}

const app = new Elysia()
  .use(jsxMiddleware)
  .use(openapi({ path: "/api" }))
  .use(userController)
  .listen(3000);

console.log(
  `🏮 Lantern API service started on: http://${app.server?.hostname}:${app.server?.port}`
);
