import { homeController } from "controllers/home";
import { rulesetController } from "controllers/ruleset";
import { userController } from "controllers/user";
import { Elysia } from "elysia";
import { docsPlugin } from "lib/docs";

const app = new Elysia()
  .use(docsPlugin)
  .use(homeController)
  .use(userController)
  .use(rulesetController)
  .listen(3000);

console.log(
  `🏮 Lantern API service started on: http://${app.server?.hostname}:${app.server?.port}`
);
