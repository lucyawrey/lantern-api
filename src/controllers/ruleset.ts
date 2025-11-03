import { Elysia, t } from "elysia";
import { verifyNameInput } from "lib/auth";
import { db } from "..";
import { authMiddleware } from "middleware/auth";
import { AccessType } from "types/enums";
import { Ruleset } from "entities/Ruleset";

export const rulesetController = new Elysia({ prefix: "/api/ruleset" })
  .use(authMiddleware)
  .post(
    "/create",
    async ({ body, auth }) => {
      const em = db.em.fork();
      if (!auth.isAuthenticated) {
        throw "Unauthorized.";
      }
      if (await em.findOne(Ruleset, { name: body.name })) {
        throw "Ruleset already exists with that name.";
      }
      if (!verifyNameInput(body.name)) {
        throw "Invalid name. Name must be between 3 and 32 characters and can only contain letters, numbers, underscores, and hyphens.";
      }
      const ruleset = new Ruleset({
        name: body.name,
        displayName: body.displayName ?? body.name,
        owner: auth.session.user,
        hasReadAccess: body.hasReadAccess,
        hasWriteAccess: body.hasWriteAccess,
      });
      em.persist(ruleset).flush();
      return {
        ruleset: {
          ...ruleset,
        },
      };
    },
    {
      auth: { requireLogin: true },
      body: t.Object({
        name: t.String(),
        displayName: t.Optional(t.String()),
        ownerRef: t.String(),
        hasReadAccess: t.Optional(AccessType),
        hasWriteAccess: t.Optional(AccessType),
      }),
      response: t.Object({
        ruleset: t.Object({
          id: t.String(),
          name: t.String(),
          displayName: t.Optional(t.String()),
        }),
      }),
    }
  );
