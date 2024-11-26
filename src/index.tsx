import swagger from "@elysiajs/swagger";
import { Elysia, t } from "elysia";
import { databaseUrl, encryptionKey } from "lib/env";
import { userController } from "controllers/user";
import { AuthService } from "services/auth";
import { ContentService } from "services/content";
import { JsxService } from "services/jsx";

if (databaseUrl == undefined || encryptionKey == undefined) {
  console.error("  Missing required enviornment variables, stopping server.");
  process.exit(0);
}

const app = new Elysia()
  .use(JsxService)
  .use(AuthService)
  .use(swagger({ path: "/docs", version: "0.0.1" }))
  .get(
    "/",
    ({ auth }) => (
      <html lang="en">
        <body style="background:black; color:white;">
          <h1>Lantern Tabletop</h1>
          <p>
            Welcome to Lantern's API service. Go to
            <a href="/docs">interactive API documentation</a>.
          </p>
          {auth.isAuthenticated ? <p>Current logged in user is: {auth.user.displayName}!</p> : ""}
        </body>
      </html>
    ),
    { authenticate: {} }
  )
  // TODO move this to own controller
  .put(
    "/content",
    async ({ auth, error, body, cookie: { sessionToken } }) => {
      if (!auth.isAuthenticated) {
        return error(401);
      }
      const contentRow = await ContentService.create(
        auth.user,
        body.name,
        body.data,
        body.visibility,
        body.indexes
      );
      if (!contentRow.ok) {
        return error(400, contentRow.error);
      }
      const content = contentRow.data;
      return { content };
    },
    {
      authenticate: { requireLogin: true },
      body: t.Object({
        name: t.String(),
        data: t.Optional(t.Unknown()),
        // TODO proper string union enum
        visibility: t.Optional(
          t.Union([
            t.Literal("public"),
            t.Literal("private"),
            t.Literal("limited"),
            t.Literal("friends"),
          ])
        ),
        indexes: t.Optional(t.Array(t.String())),
      }),
    }
  )
  .use(userController)
  .listen(3000);

console.log(
  `🏮 Lantern API service started on: http://${app.server?.hostname}:${app.server?.port}`
);
