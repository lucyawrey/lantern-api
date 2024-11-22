import swagger from "@elysiajs/swagger";
import { Elysia } from "elysia";
import { databaseUrl, encryptionKey } from "lib/env";
import { user } from "controllers/user";
import { AuthService } from "services/auth";

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
      set.headers["content-type"] = "text/html; charset=utf8";
      const text = auth.isAuthenticated
        ? `<p>Current logged in user is: ${auth.user.displayName}!</p>`
        : "";
      return `
    <!DOCTYPE html>
    <html>
      <body style="background:black; color:white;">
        <h1>Lantern Tabletop</h1>
        <p>Welcome to Lantern's API service. Go to <a href="/docs">interactive API documentation</a>.</p>
        ${text}
      </body>
    </html>
    `;
    },
    { authenticate: {} }
  )
  .get(
    "/admin-route",
    () => {
      return "Secret stuff.";
    },
    { authenticate: { requireGroup: ["admin"] } }
  )
  .use(user)
  .listen(3000);

console.log(
  `🏮 Lantern API service started on: http://${app.server?.hostname}:${app.server?.port}`
);
