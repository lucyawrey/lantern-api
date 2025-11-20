import { homeController } from "controllers/home";
import { rulesetController } from "controllers/ruleset";
import { userController } from "controllers/user";
import { Elysia } from "elysia";
import { docsMiddleware } from "middleware/docs";
import { errorMiddleware } from "middleware/error";

const app = new Elysia()
  .use(errorMiddleware)
  .use(docsMiddleware)
  .use(homeController)
  .use(userController)
  .use(rulesetController)
  .listen(3000);

console.log(
  `🏮 Lantern API service started on: http://${app.server?.hostname}:${app.server?.port}`
);
