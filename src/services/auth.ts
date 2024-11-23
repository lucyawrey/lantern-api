import { Elysia, error } from "elysia";
import { SessionService } from "services/session";
import { Session, SelectUser, Group } from "types/database";

export const AuthService = new Elysia({ name: "AuthService" })
  .derive(
    { as: "scoped" },
    (): {
      auth:
        | {
            isAuthenticated: false;
            user: undefined;
            session: undefined;
          }
        | {
            isAuthenticated: true;
            user: SelectUser;
            session: Session;
          };
    } => {
      return {
        auth: {
          isAuthenticated: false,
          user: undefined,
          session: undefined,
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
      onBeforeHandle(async ({ auth, headers, cookie: { sessionToken } }) => {
        requireLogin ||= Boolean(requireGroup);
        if (!auth) {
          return requireLogin ? error(401) : undefined;
        }
        const bearer = headers["Authorization"]?.startsWith("Bearer ")
          ? headers["Authorization"].slice(7)
          : undefined;
        const token = sessionToken.value || bearer;
        if (!token) {
          return requireLogin ? error(401) : undefined;
        }
        const validationResult = await SessionService.validateSessionToken(token);
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
