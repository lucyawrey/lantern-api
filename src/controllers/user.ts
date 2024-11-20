import { Elysia, t } from "elysia";
import { createSession, generateSessionToken } from "lib/authentication";
import { createUser } from "lib/user";

export const user = new Elysia()
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
  });
