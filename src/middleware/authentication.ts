import { Elysia } from "elysia";
import { Auth } from "types/auth";
import { Role } from "types/enums";
import { db } from "..";
import { hashToken } from "lib/authentication";
import { Session } from "entities/Session";

export const authenticationMiddleware = new Elysia({
  name: "authenticationMiddleware",
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
          user: undefined,
          sessionToken: sessionTokenCookie.value as string | undefined,
        },
      };
    }
  )
  .macro(({ onBeforeHandle }) => ({
    // This is declaring a service method
    authenticate({
      requireLogin = false,
      requireRole,
    }: {
      requireLogin?: boolean;
      requireRole?: Role[];
    }) {
      onBeforeHandle(async ({ auth }: { auth: Auth }) => {
        requireLogin ||= Boolean(requireRole && requireRole.length > 0);
        if (!auth || !auth.sessionToken) {
          throw "Unauthorized.";
        }

        const em = db.em.fork();

        const sessionTokenHash = await hashToken(auth.sessionToken);
        const session = await em.findOne(Session, { id: sessionTokenHash });
        if (!session || !session.user || session.expiresAt < new Date()) {
          throw "Unauthorized.";
        }
        auth.isAuthenticated = true;
        auth.user = session.user;

        if (requireRole) {
          const userIsInGroup = requireRole.some((role) =>
            session.user.roles.includes(role)
          );
          if (!userIsInGroup) {
            throw "Unauthorized.";
          }
        }

        return;
      });
    },
  }));
