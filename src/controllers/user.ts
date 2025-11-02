import { Elysia, t } from "elysia";
import { User } from "entities/User";
import { Role } from "types/enums";

export const userController = new Elysia({ prefix: "/api/user" })
  .post(
    "/signup",
    async ({ body }) => {
      const user = new User({
        name: body.name,
        displayName: body.displayName || body.name,
        roles: ["user"], // TODO role handling
        passwordHash: body.password,
        iconUrl: body.iconUrl,
      });
      return "TODO!";
    },
    {
      body: t.Object({
        name: t.String(),
        displayName: t.Optional(t.String()),
        roles: t.Optional(t.Array(Role)),
        password: t.String(),
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
        username: t.String(),
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
