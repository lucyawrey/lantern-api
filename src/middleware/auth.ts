import { Elysia, t } from "elysia";
import { Auth } from "types/auth";
import { Role } from "types/enums";
import { db } from "lib/db";
import { hashToken, hasRole } from "lib/auth";
import { Session } from "entities/Session";

export const authMiddleware = new Elysia({
  name: "authMiddleware",
})
  .derive(
    { as: "scoped" },
    ({
      headers,
      cookie: { sessionTokenCookie },
    }): {
      auth: Auth;
    } => {
      const cookieValue = sessionTokenCookie.value as string | undefined;
      let { authorization } = headers;
      if (authorization && authorization.startsWith("Bearer ")) {
        authorization = authorization.slice(7);
      }
      return {
        auth: {
          isAuthenticated: false,
          session: undefined,
          sessionToken: authorization ?? cookieValue,
        },
      };
    }
  )
  .macro(
    "auth",
    ({
      requireLogin,
      requireRole,
    }: {
      requireLogin?: boolean;
      requireRole?: Role[];
    }) => {
      return {
        async beforeHandle({ auth }) {
          requireLogin =
            requireLogin || (requireRole && requireRole.length > 0);
          if (!auth || !auth.sessionToken) {
            if (requireLogin) {
              throw "Unauthorized.";
            }
            return;
          }

          const em = db.em.fork();
          const sessionTokenHash = await hashToken(auth.sessionToken);
          const session = await em.findOne(Session, sessionTokenHash, {
            populate: ["user"],
          });

          if (session && session.user && session.expiresAt > new Date()) {
            session.id = ""; // hide session id
            session.user.passwordHash = ""; // hide password hash
            session.user.recoveryTokenHash = ""; // hide recovery token hash
            auth.isAuthenticated = true;
            auth.session = session;
          } else {
            if (requireLogin) {
              throw "Unauthorized.";
            }
            return;
          }

          if (requireRole) {
            if (!hasRole(session.user, ...requireRole)) {
              throw "Unauthorized.";
            }
          }
          return;
        },
      };
    }
  );
