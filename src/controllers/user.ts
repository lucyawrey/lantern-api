import { Elysia, t } from "elysia";
import { GetUser, User, SignupUser, PushUser } from "entities/User";
import {
  generateRecoveryToken,
  generateSessionToken,
  hashPassword,
  setSessionCookie,
  verifyNameInput,
  verifyPasswordHash,
  verifyPasswordStrength,
} from "lib/auth";
import { db } from "lib/db";
import { Session } from "entities/Session";
import { authMiddleware } from "middleware/auth";
import { Ref, RefOptional } from "types/ref";

export const userController = new Elysia({
  prefix: "/api/user",
  tags: ["User"],
})
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
      if (body.generateRecoveryToken) {
        [recoveryToken, recoveryTokenHash] = await generateRecoveryToken();
      }

      const passwordHash = await hashPassword(body.password);
      const user = new User({
        name: body.name,
        displayName: body.displayName,
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
          ...user,
        },
        sessionToken,
        recoveryToken,
      };
    },
    {
      body: t.Intersect([
        SignupUser,
        t.Object({
          setCookie: t.Optional(t.Boolean({ default: true })),
        }),
      ]),
      response: t.Object({
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
        user: GetUser,
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
      body: t.Optional(
        t.Object({
          deleteCookie: t.Optional(t.Boolean({ default: true })),
          logoutAllSessions: t.Optional(t.Boolean({ default: false })),
        })
      ),
      response: t.Object({ loggedOut: t.Literal(true) }),
      auth: { requireLogin: true },
    }
  )
  .post(
    "/push",
    async ({ body, auth }) => {
      const em = db.em.fork();
      return {
        user: {},
      } as any;
    },
    {
      body: PushUser,
      response: t.Object({
        user: GetUser,
      }),
      auth: { requireLogin: true },
    }
  )
  .post(
    "/find",
    async ({ body, auth }) => {
      const em = db.em.fork();
      const user = body?.ref
        ? ((await em.findOne(User, body.ref)) ??
          (await em.findOne(User, { name: body.ref })))
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
      body: RefOptional,
      response: t.Object({
        user: GetUser,
      }),
      auth: {},
    }
  )
  .post(
    "/delete",
    async ({ body, auth }) => {
      const em = db.em.fork();
      return { deleted: true };
    },
    {
      body: Ref,
      response: t.Object({ deleted: t.Literal(true) }),
      auth: { requireLogin: true },
    }
  );
