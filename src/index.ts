import { homeController } from "controllers/home";
import { rulesetController } from "controllers/ruleset";
import { userController } from "controllers/user";
import { Elysia } from "elysia";
import { authMiddleware } from "middleware/auth";
import { docsMiddleware } from "middleware/docs";
import { errorMiddleware } from "middleware/error";
import { jsxMiddleware } from "middleware/jsx";

const app = new Elysia()
  .use(errorMiddleware)
  //.use(jsxMiddleware)
  .use(docsMiddleware)
  .use(homeController)
  .use(userController)
  .use(rulesetController)
  .listen(3000);

console.log(
  `🏮 Lantern API service started on: http://${app.server?.hostname}:${app.server?.port}`
);
