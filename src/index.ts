import swagger from "@elysiajs/swagger";
import { Elysia, error } from "elysia";
import { createSession, generateSessionToken } from "lib/authentication";

const app = new Elysia()
  .use(swagger({path: "/docs", version: "0.0.1"}))
  .get("/", ({cookie: { sessionToken }}) => {
    const text = sessionToken != undefined ? ` Current session token is: ${sessionToken}.` : "";
    return "Welcome to Lantern's API service. Go to '/docs' for interactive API documentation." + text;
  })
  .post("/signup", async ({cookie: { sessionToken }}) => {

  })
  .post("/login", async ({cookie: { sessionToken }}) => {
    const token = generateSessionToken();
    const session = await createSession(token, "9a3d6ecd-4d7a-4489-a03e-f1c1326c70c3");
    if (session.ok) {
      const expires = new Date(session.data.expiresAt);
      sessionToken.set({value: token, httpOnly: true, sameSite: "lax", path: "/", expires})
      return token;
    } else {
      return session.error;
    }
  })
  .listen(3000);

console.log(
  `🏮 Lantern API service started on: http://${app.server?.hostname}:${app.server?.port}`
);
