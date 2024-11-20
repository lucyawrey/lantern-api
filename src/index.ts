import swagger from "@elysiajs/swagger";
import { Elysia } from "elysia";
import { databaseUrl, encryptionKey } from "lib/env";
import { user } from "controllers/user";

if (databaseUrl == undefined || encryptionKey == undefined) {
  console.error("  Missing required enviornment variables, stopping server.");
  process.exit(0);
}

const app = new Elysia()
  .use(swagger({path: "/docs", version: "0.0.1"}))
  .get("/", ({set, cookie: { sessionToken }}) => {
    set.headers["content-type"] = "text/html; charset=utf8";
    const text = (sessionToken.value) ? `<p>Current session token is: ${sessionToken.value}.</p>` : "";
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
  })
  .use(user)
  .listen(3000);

console.log(`🏮 Lantern API service started on: http://${app.server?.hostname}:${app.server?.port}`);
