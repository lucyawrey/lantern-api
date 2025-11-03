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

      em.persistAndFlush(session);

      if (body.setCookie) {
        setSessionCookie(sessionTokenCookie, sessionToken, session.expiresAt);
      }

      return { userId: user.id, sessionToken, recoveryToken };
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
        userId: t.String(),
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

      em.persistAndFlush(session);

      if (body.setCookie) {
        setSessionCookie(sessionTokenCookie, sessionToken, session.expiresAt);
      }

      return { sessionToken };
    },
    {
      body: t.Object({
        name: t.String(),
        password: t.String(),
        setCookie: t.Optional(t.Boolean({ default: true })),
      }),
      response: t.Object({
        sessionToken: t.String(),
      }),
    }
  )
  .post(
    "/logout",
    async ({ body, auth }) => {
      return JSON.stringify(auth);
    },
    {
      authenticate: { requireLogin: true },
      body: t.Optional(
        t.Object({
          deleteCookie: t.Optional(t.Boolean({ default: true })),
          logoutAllSessions: t.Optional(t.Boolean({ default: false })),
        })
      ),
      response: t.String(),
    }
  );
