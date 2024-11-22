import swagger from "@elysiajs/swagger";
import { Elysia, t } from "elysia";
import { databaseUrl, encryptionKey } from "lib/env";
import { userController } from "controllers/user";
import { AuthService } from "services/auth";
import render from "preact-render-to-string";
import { ContentService } from "services/content";
import { Visibility } from "types/database";

if (databaseUrl == undefined || encryptionKey == undefined) {
  console.error("  Missing required enviornment variables, stopping server.");
  process.exit(0);
}

const app = new Elysia()
  .use(AuthService)
  .use(swagger({ path: "/docs", version: "0.0.1" }))
  .get(
    "/",
    ({ set, auth }) => {
      const html = render(
        <body style="background:black; color:white;">
          <h1>Lantern Tabletop</h1>
          <p>
            Welcome to Lantern's API service. Go to
            <a href="/docs">interactive API documentation</a>.
          </p>
          {auth.isAuthenticated ? <p>Current logged in user is: {auth.user.displayName}!</p> : ""}
        </body>
      );
      set.headers["content-type"] = "text/html; charset=utf8";
      return `<!DOCTYPE html><html>${html}</html>`;
    },
    { authenticate: {} }
  )
  // TODO move this to own controller
  .put(
    "/content",
    async ({ auth, error, body, cookie: { sessionToken } }) => {
      if (!auth.isAuthenticated) {
        return error(401);
      }
      const contentRow = await ContentService.createContent(
        auth.user,
        body.name,
        body.data,
        body.visibility as Visibility
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
        data: t.Unknown(),
        // TODO proper string union enum
        visibility: t.String(),
      }),
    }
  )
  .use(userController)
  .listen(3000);

console.log(
  `🏮 Lantern API service started on: http://${app.server?.hostname}:${app.server?.port}`
);
