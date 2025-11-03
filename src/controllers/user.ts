import { Elysia, t } from "elysia";
import { User } from "entities/User";
import {
  generateRecoveryToken,
  generateSessionToken,
  hashPassword,
  setSessionCookie,
  verifyNameInput,
  verifyPasswordHash,
  verifyPasswordStrength,
} from "lib/auth";
import { db } from "..";
import { Session } from "entities/Session";
import { authMiddleware } from "middleware/auth";

export const userController = new Elysia({ prefix: "/api/user" })
  .use(authMiddleware)
  .post(
    "/signup",
    async ({ body, cookie: { sessionTokenCookie } }) => {
      const em = db.em.fork();
      if (await em.findOne(User, { name: body.name })) {
        throw "User already exists with that username.";
      }
      if (!verifyNameInput(body.name)) {
        throw "Invalid username. Username must be between 3 and 32 characters and can only contain letters, numbers, underscores, and hyphens.";
      }
      if (!verifyPasswordStrength(body.password)) {
        throw "Password is too weak. Password must be at least 8 characters long and not a commonly used password.";
      }

      let recoveryToken: string | undefined;
      let recoveryTokenHash: string | undefined;
      if (body.getRecoveryCode) {
        [recoveryToken, recoveryTokenHash] = await generateRecoveryToken();
      }

      const passwordHash = await hashPassword(body.password);
      const user = new User({
        name: body.name,
        displayName: body.displayName ?? body.name,
        passwordHash,
        iconUrl: body.iconUrl,
        recoveryTokenHash,
      });

      const [sessionToken, sessionTokenHash] = await generateSessionToken();
      const session = new Session({ id: sessionTokenHash, user });

      em.persist(session).flush();

      if (body.setCookie) {
        setSessionCookie(sessionTokenCookie, sessionToken, session.expiresAt);
      }

      return {
        user: {
          id: session.user.id,
          name: session.user.name,
          displayName: session.user.displayName,
          iconUrl: session.user.iconUrl,
        },
        sessionToken,
        recoveryToken,
      };
    },
    {
      body: t.Object({
        name: t.String(),
        password: t.String(),
        displayName: t.Optional(t.String()),
        iconUrl: t.Optional(t.String()),
        setCookie: t.Optional(t.Boolean({ default: true })),
        getRecoveryCode: t.Optional(t.Boolean({ default: true })),
      }),
      response: t.Object({
        user: t.Object({
          id: t.String(),
          name: t.String(),
          displayName: t.String(),
          iconUrl: t.Optional(t.String()),
        }),
        sessionToken: t.String(),
        recoveryToken: t.Optional(t.String()),
      }),
    }
  )
  .post(
    "/login",
    async ({ body, cookie: { sessionTokenCookie } }) => {
      const em = db.em.fork();
      const user = await em.findOne(User, { name: body.name });

      if (!user) {
        throw "Invalid username or password.";
      }
      const passwordIsVerified = await verifyPasswordHash(
        user.passwordHash,
        body.password
      );
      if (!passwordIsVerified) {
        throw "Invalid username or password.";
      }

      const [sessionToken, sessionTokenHash] = await generateSessionToken();
      const session = new Session({ id: sessionTokenHash, user });

      em.persist(session).flush();

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
      response: t.Object({
        user: t.Object({
          id: t.String(),
          name: t.String(),
          displayName: t.String(),
          iconUrl: t.Optional(t.String()),
        }),
        sessionToken: t.String(),
      }),
    }
  )
  .post(
    "/logout",
    async ({ body, auth, cookie: { sessionTokenCookie } }) => {
      if (!auth.isAuthenticated) {
        throw "Unauthorized.";
      }
      const em = db.em.fork();
      if (body?.deleteCookie) {
        sessionTokenCookie.remove();
      }
      if (body?.logoutAllSessions) {
        let sessions = await em.find(Session, { user: auth.session.user });
        em.remove(sessions).flush();
      } else {
        em.remove(auth.session).flush();
      }
      return { loggedOut: true };
    },
    {
      auth: { requireLogin: true },
      body: t.Optional(
        t.Object({
          deleteCookie: t.Optional(t.Boolean({ default: true })),
          logoutAllSessions: t.Optional(t.Boolean({ default: false })),
        })
      ),
      response: t.Object({ loggedOut: t.Literal(true) }),
    }
  )
  .post(
    "/get",
    async ({ body, auth }) => {
      const em = db.em.fork();
      const user = body?.userRef
        ? ((await em.findOne(User, body.userRef)) ??
          (await em.findOne(User, { name: body.userRef })))
        : auth.session?.user;
      if (!user) {
        throw "User not found.";
      }
      return {
        user: {
          ...user,
        },
      };
    },
    {
      auth: {},
      body: t.Optional(
        t.Object({
          userRef: t.Optional(t.String()),
        })
      ),
      response: t.Object({
        user: t.Object({
          id: t.String(),
          name: t.String(),
          displayName: t.String(),
          iconUrl: t.Optional(t.String()),
        }),
      }),
    }
  );
