import { Elysia, t } from "elysia";

export const userController = new Elysia({ prefix: "/api/user" })
  .post(
    "/signup",
    async ({ body }) => {
      return "TODO!";
    },
    {
      body: t.Object({
        username: t.String(),
        email: t.String(),
        password: t.String(),
        displayName: t.Optional(t.String()),
        iconUrl: t.Optional(t.String()),
        setCookie: t.Optional(t.Boolean({ default: true })),
      }),
      response: t.String(),
    }
  )
  .post(
    "/login",
    async ({ body }) => {
      return "TODO";
    },
    {
      body: t.Object({
        usernameOrEmail: t.String(),
        password: t.String(),
        setCookie: t.Optional(t.Boolean({ default: true })),
      }),
      response: t.String(),
    }
  )
  .post(
    "/logout",
    async ({ body }) => {
      return "TODO";
    },
    {
      body: t.Optional(
        t.Object({
          deleteCookie: t.Optional(t.Boolean({ default: true })),
          logoutAllSessions: t.Optional(t.Boolean({ default: false })),
        })
      ),
      response: t.String(),
    }
  );
