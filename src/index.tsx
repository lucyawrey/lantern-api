import swagger from "@elysiajs/swagger";
import { Elysia } from "elysia";
import { databaseUrl, encryptionKey } from "lib/env";
import { userController } from "controllers/user";
import { authMiddleware } from "middleware/auth";
import { jsxMiddleware } from "middleware/jsx";
import { contentController } from "controllers/content";

if (databaseUrl == undefined || encryptionKey == undefined) {
  console.error("  Missing required enviornment variables, stopping server.");
  process.exit(0);
}

const app = new Elysia()
  .use(jsxMiddleware)
  .use(authMiddleware)
  .use(swagger({ path: "/docs", version: "0.0.1" }))
  .get(
    "/",
    ({ auth }) => (
      <html lang="en">
        <body style="background:black; color:white;">
          <h1>Lantern Tabletop</h1>
          <p>
            Welcome to Lantern's API service. Go to{" "}
            <a href="/docs">interactive API documentation</a>.
          </p>
          {auth.isAuthenticated ? <p>Current logged in user is: {auth.user.displayName}!</p> : ""}
        </body>
      </html>
    ),
    { authenticate: {} }
  )
  .use(userController)
  .use(contentController)
  .listen(3000);

console.log(
  `🏮 Lantern API service started on: http://${app.server?.hostname}:${app.server?.port}`
);
