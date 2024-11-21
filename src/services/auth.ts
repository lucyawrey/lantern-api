import { Elysia } from "elysia";
import { SessionService } from "services/session";
import { Session, SelectUser } from "types/database";

export const AuthService = new Elysia({ name: "Service.Auth" })
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
    authenticate(enabled: boolean) {
      if (!enabled) return;
      onBeforeHandle(async ({ auth, headers, cookie: { sessionToken } }) => {
        if (!auth) {
          return;
        }
        const bearer = headers["Authorization"]?.startsWith("Bearer ")
          ? headers["Authorization"].slice(7)
          : undefined;
        const token = sessionToken.value || bearer;
        if (!token) {
          return;
        }
        const validationResult = await SessionService.validateSessionToken(token);
        if (!validationResult.ok) {
          return;
        }
        auth.isAuthenticated = true;
        auth.session = validationResult.data.session;
        auth.user = validationResult.data.user;
      });
    },
    authorize(enabled: boolean) {
      if (!enabled) return;
      onBeforeHandle(async ({ error, auth }) => {
        if (!auth || !auth.isAuthenticated) {
          return error(401);
        }
      });
    },
  }));
