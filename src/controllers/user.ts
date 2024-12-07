import { Elysia, error, t } from "elysia";
import { UserService } from "services/user";
import { SessionService } from "services/session";
import { setSessionCookie } from "lib/authentication";
import { authMiddleware } from "middleware/auth";
import { toDate, User } from "types/models";
import { responseSchema } from "lib/util";

export const userController = new Elysia({ prefix: "/user" })
  .use(authMiddleware)
  .put(
    "/signup",
    async ({ error, body, cookie: { sessionToken } }) => {
      const newUser = await UserService.createUser(
        body.username,
        body.email,
        body.password,
        false,
        ["user"],
        body.displayName,
        body.iconUrl
      );
      if (!newUser.ok) {
        return error(400, newUser.error);
      }
      const user = newUser.data;

      const sessionResult = await SessionService.createSession(user.id);
      if (!sessionResult.ok) {
        return error(500, sessionResult.error);
      }
      const { token, session } = sessionResult.data;
      if (body.setCookie) {
        setSessionCookie(sessionToken, token, toDate(session.expiresAt));
      }

      return { token, user };
    },
    {
      body: t.Object({
        username: t.String(),
        email: t.String(),
        password: t.String(),
        displayName: t.Optional(t.String()),
        iconUrl: t.Optional(t.String()),
        setCookie: t.Optional(t.Boolean({ default: true })),
      }),
      response: responseSchema({ token: t.String(), user: User }),
    }
  )
  .post(
    "/login",
    async ({ error, body, cookie: { sessionToken } }) => {
      const authenticationResult = await UserService.authenticateUser(
        body.usernameOrEmail,
        body.password
      );
      if (!authenticationResult.ok) {
        return error(401, authenticationResult.error);
      }
      const user = authenticationResult.data;
      const sessionResult = await SessionService.createSession(user.id);
      if (!sessionResult.ok) {
        return error(500, sessionResult.error);
      }
      const { token, session } = sessionResult.data;
      if (body.setCookie) {
        setSessionCookie(sessionToken, token, toDate(session.expiresAt));
      }

      return { token, user };
    },
    {
      body: t.Object({
        usernameOrEmail: t.String(),
        password: t.String(),
        setCookie: t.Optional(t.Boolean({ default: true })),
      }),
      response: responseSchema({ token: t.String(), user: User }),
    }
  )
  .delete(
    "/logout",
    async ({ error, auth, body, cookie: { sessionToken } }) => {
      if (!auth.isAuthenticated) {
        return error(401, "Not authorized.");
      }
      if (body?.deleteCookie) {
        sessionToken.remove();
      }

      let id: Result<string>;
      if (body?.logoutAllSessions) {
        id = await SessionService.invalidateAllUserSession(auth.user.id);
      } else {
        id = await SessionService.invalidateSession(auth.session.id);
      }
      if (id.ok) {
        return { id: id.data };
      }
      return error(500, id.error);
    },
    {
      authenticate: { requireLogin: true },
      body: t.Optional(
        t.Object({
          deleteCookie: t.Optional(t.Boolean({ default: true })),
          logoutAllSessions: t.Optional(t.Boolean({ default: false })),
        })
      ),
      response: responseSchema({ id: t.String() }),
    }
  );
