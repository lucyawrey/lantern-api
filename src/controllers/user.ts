import { Elysia, t } from "elysia";
import { UserService } from "services/user";
import { SessionService } from "services/session";
import { db } from "lib/database";
import { setSessionCookie } from "lib/authentication";

export const user = new Elysia()
  .post("/user/signup", async ({error, body, cookie: { sessionToken }}) => {
    const newUser = await UserService.createUser(body.username, body.email, body.password, false, [], body.displayName, body.iconUrl);
    if (!newUser.ok) {
      return error(400, newUser.error);
    }
    const user = newUser.data;

    const sessionResult = await SessionService.createSession(user.id);
    if (!sessionResult.ok) {
      return error(500, sessionResult.error);
    }
    const [token, session] = sessionResult.data;
    if (body.setCookie) {
      setSessionCookie(sessionToken, token, new Date(session.expiresAt));
    }
    
    return { token, session, user };
  }, {
    body: t.Object({username: t.String(), email: t.String(), password: t.String(), displayName: t.Optional(t.String()), iconUrl: t.Optional(t.String()), setCookie: t.Optional(t.Boolean())}),
  })
  .post("/user/login", async ({error, body, cookie: { sessionToken }}) => {
    const authenticationResult = await UserService.authenticateUser(body.usernameOrEmail, body.password);
    if (!authenticationResult.ok) {
      return error(401, authenticationResult.error);
    }
    const user = authenticationResult.data;

    const sessionResult = await SessionService.createSession(user.id);
    if (!sessionResult.ok) {
      return error(500, sessionResult.error);
    }
    const [token, session] = sessionResult.data;
    if (body.setCookie) {
      setSessionCookie(sessionToken, token, new Date(session.expiresAt));
    }
    
    return { token, session, user };
  }, {
    body: t.Object({usernameOrEmail: t.String(), password: t.String(), setCookie: t.Optional(t.Boolean())}),
  });
