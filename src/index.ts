import { homeController } from "controllers/home";
import { rulesetController } from "controllers/ruleset";
import { userController } from "controllers/user";
import { Elysia } from "elysia";
import { authMiddleware } from "middleware/auth";
import { docsMiddleware } from "middleware/docs";
import { jsxMiddleware } from "middleware/jsx";

const app = new Elysia()
  .onError(({ error, status }) => {
    const msg = error.toString().replace("Error: ", "");
    if (msg !== "Error") {
      console.error(`❗ ${msg}`);
    }
    return status(500, { error: msg });
  })
  .use(authMiddleware)
  //.use(jsxMiddleware)
  .use(docsMiddleware)
  .use(homeController)
  .use(userController)
  .use(rulesetController)
  .listen(3000);

console.log(
  `🏮 Lantern API service started on: http://${app.server?.hostname}:${app.server?.port}`
);
