import swagger from "@elysiajs/swagger";
import { Elysia, t } from "elysia";
import { createSession, generateSessionToken } from "lib/authentication";
import { createUser } from "lib/user";
import { databaseUrl, encryptionKey } from "utils/env";

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
  .post("/signup", async ({error, body, cookie: { sessionToken }}) => {
    const newUser = await createUser(body.username, body.email, body.password, body.isOrganization, body.groups, body.displayName, body.iconUrl);
    if (newUser.ok) {
      return { user: newUser.data };
    }
    return error(400, newUser.error);
  }, {
    body: t.Object({username: t.String(), email: t.String(), password: t.String(), isOrganization: t.Optional(t.Boolean()), groups: t.Optional(t.Array(t.String())), displayName: t.Optional(t.String()), iconUrl: t.Optional(t.String())}),
  })
  .post("/login", async ({error, cookie: { sessionToken }}) => {
    const token = generateSessionToken();
    const session = await createSession(token, "9a3d6ecd-4d7a-4489-a03e-f1c1326c70c3");
    if (session.ok) {
      const expires = new Date(session.data.expiresAt);
      sessionToken.set({value: token, httpOnly: true, sameSite: "lax", path: "/", expires})
      return token;
    } else {
      return error(500, session.error);
    }
  })
  .listen(3000);

console.log(`🏮 Lantern API service started on: http://${app.server?.hostname}:${app.server?.port}`);
