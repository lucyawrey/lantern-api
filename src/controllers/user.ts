import { Elysia, NotFoundError, t } from "elysia";
import { GetUser, SignupUser, PushUser } from "entities/User";
import { hasAccess, hasRole, setSessionCookie } from "lib/auth";
import { db } from "lib/db";
import { authMiddleware } from "middleware/auth";
import { Id, RefOptional } from "types/ref";
import {
  createSessionForUser,
  deleteUserById,
  findUserByRef,
  loginUser,
  logoutUser,
  pushUser,
} from "services/user";
import { StandardResponse } from "types/response";
import { AuthError } from "middleware/error";

export const userController = new Elysia({
  prefix: "/api/user",
  tags: ["User"],
})
  .use(authMiddleware)
  .post(
    "/signup",
    async ({ body, cookie: { sessionTokenCookie } }) => {
      const em = db.em.fork();

      const { user, recoveryToken } = await pushUser(em, body);
      const { session, sessionToken } = await createSessionForUser(em, user);

      em.flush();

      if (body.setCookie) {
        setSessionCookie(sessionTokenCookie, sessionToken, session.expiresAt);
      }

      return {
        user: {
          ...user,
        },
        sessionToken,
        recoveryToken,
      };
    },
    {
      body: t.Composite([
        SignupUser,
        t.Object({
          setCookie: t.Optional(t.Boolean({ default: true })),
        }),
      ]),
      response: StandardResponse({
        user: GetUser,
        sessionToken: t.String(),
        recoveryToken: t.Optional(t.String()),
      }),
    }
  )
  .post(
    "/login",
    async ({ body, cookie: { sessionTokenCookie } }) => {
      const em = db.em.fork();

      const user = await loginUser(em, body.name, body.password);
      const { session, sessionToken } = await createSessionForUser(em, user);

      em.flush();

      if (body.setCookie) {
        setSessionCookie(sessionTokenCookie, sessionToken, session.expiresAt);
      }

      return {
        user: {
          ...user,
        },
        sessionToken,
      };
    },
    {
      body: t.Object({
        name: t.String(),
        password: t.String(),
        setCookie: t.Optional(t.Boolean({ default: true })),
      }),
      response: StandardResponse({
        user: GetUser,
        sessionToken: t.String(),
      }),
    }
  )
  .post(
    "/logout",
    async ({ body, auth, cookie: { sessionTokenCookie } }) => {
      if (!auth.isAuthenticated) {
        throw new AuthError();
      }
      const em = db.em.fork();

      await logoutUser(em, auth.session, body?.logoutAllSessions);
      em.flush();

      if (body?.deleteCookie) {
        sessionTokenCookie.remove();
      }
      return { loggedOut: true };
    },
    {
      body: t.Optional(
        t.Object({
          deleteCookie: t.Optional(t.Boolean({ default: true })),
          logoutAllSessions: t.Optional(t.Boolean({ default: false })),
        })
      ),
      response: StandardResponse({ loggedOut: t.Literal(true) }),
      auth: { requireLogin: true },
    }
  )
  .post(
    "/push",
    async ({ body, auth }) => {
      const em = db.em.fork();

      if (!body.id && !hasRole(auth.session?.user, "admin")) {
        throw new AuthError("Only admins can create new users.");
      }

      const { user, recoveryToken } = await pushUser(em, body, auth);

      em.flush();

      return {
        user: {
          ...user,
        },
        recoveryToken,
      };
    },
    {
      body: PushUser,
      response: StandardResponse({
        user: GetUser,
        recoveryToken: t.Optional(t.String()),
      }),
      auth: { requireLogin: true },
    }
  )
  .post(
    "/find",
    async ({ body, auth }) => {
      const em = db.em.fork();

      if (!body?.ref) {
        if (auth.isAuthenticated) {
          return { user: auth.session.user };
        }
        throw new NotFoundError();
      }

      const res = await findUserByRef(em, body?.ref);
      if (!res.ok) {
        throw res.error;
      }

      if (!hasAccess("read", res.data, res.data, auth.session?.user)) {
        throw new AuthError("You do not have access to this user.");
      }

      return { user: res.data };
    },
    {
      body: RefOptional,
      response: StandardResponse({
        user: GetUser,
      }),
      auth: {},
    }
  )
  .post(
    "/delete",
    async ({ body, auth }) => {
      const em = db.em.fork();

      deleteUserById(em, body.id, auth);
      em.flush();

      return { deleted: true };
    },
    {
      body: Id,
      response: StandardResponse({ deleted: t.Literal(true) }),
      auth: { requireLogin: true },
    }
  );
