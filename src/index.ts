import swagger from "@elysiajs/swagger";
import { Elysia, error } from "elysia";
import { createSession, generateSessionToken } from "lib/authentication";

const app = new Elysia()
  .use(swagger({path: "/docs", version: "0.0.1"}))
  .get("/", ({cookie: { sessionToken }}) => {
    return "Hello Elysia, session token is: " + sessionToken + ".";
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
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
);
