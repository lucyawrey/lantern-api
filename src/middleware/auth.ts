import { Elysia, t } from "elysia";
import { Auth } from "types/auth";
import { Role } from "types/enums";
import { db } from "..";
import { hashToken } from "lib/auth";
import { Session } from "entities/Session";

export const authMiddleware = new Elysia({
  name: "authMiddleware",
})
  .derive(
    { as: "scoped" },
    ({
      cookie: { sessionTokenCookie },
    }): {
      auth: Auth;
    } => {
      return {
        auth: {
          isAuthenticated: false,
          session: undefined,
          sessionToken: sessionTokenCookie.value as string | undefined,
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
            auth.isAuthenticated = true;
            auth.session = session;
          } else {
            if (requireLogin) {
              throw "Unauthorized.";
            }
            return;
          }

          if (requireRole) {
            const userIsInGroup = requireRole.some((role) =>
              session.user.roles.includes(role)
            );
            if (!userIsInGroup) {
              throw "Unauthorized.";
            }
          }
          return;
        },
      };
    }
  );
