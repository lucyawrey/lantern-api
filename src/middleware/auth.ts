import { Elysia, error } from "elysia";
import { Selectable } from "kysely";
import { SessionService } from "services/session";
import type { Session, User } from "types/database";
import type { Group } from "types/enums";

export const authMiddleware = new Elysia({ name: "authMiddleware" })
  .derive(
    { as: "scoped" },
    ({
      headers,
      cookie: { sessionToken },
    }): {
      auth:
        | {
            isAuthenticated: false;
            user: undefined;
            session: undefined;
            token: string | undefined;
          }
        | {
            isAuthenticated: true;
            user: Selectable<User>;
            session: Session;
            token: string;
          };
    } => {
      return {
        auth: {
          isAuthenticated: false,
          user: undefined,
          session: undefined,
          token:
            sessionToken.value ||
            (headers["Authorization"]?.startsWith("Bearer ")
              ? headers["Authorization"].slice(7)
              : undefined),
        },
      };
    }
  )
  .macro(({ onBeforeHandle }) => ({
    // This is declaring a service method
    authenticate({
      requireLogin,
      requireGroup,
    }: {
      requireLogin?: boolean;
      requireGroup?: Group[];
    }) {
      onBeforeHandle(async ({ auth }) => {
        requireLogin ||= Boolean(requireGroup);
        if (!auth) {
          return requireLogin ? error(401) : undefined;
        }
        if (!auth.token) {
          return requireLogin ? error(401) : undefined;
        }
        const validationResult = await SessionService.validateSessionToken(auth.token);
        if (!validationResult.ok) {
          return requireLogin ? error(401, validationResult.error) : undefined;
        }
        if (requireGroup) {
          const userIsInGroup = requireGroup.some((group) =>
            validationResult.data.user.groups.includes(group)
          );
          if (!userIsInGroup) {
            return error(401, "Unauthorized. User is not in required group.");
          }
        }
        auth.isAuthenticated = true;
        auth.session = validationResult.data.session;
        auth.user = validationResult.data.user;
        return;
      });
    },
  }));
