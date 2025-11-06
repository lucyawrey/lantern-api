import { Elysia, t } from "elysia";
import { verifyNameInput } from "lib/auth";
import { db } from "lib/db";
import { authMiddleware } from "middleware/auth";
import { GetRuleset, Ruleset, PushRuleset, NewRuleset } from "entities/Ruleset";
import { Ref } from "types/ref";

export const rulesetController = new Elysia({
  prefix: "/api/ruleset",
  tags: ["Ruleset"],
})
  .use(authMiddleware)
  .post(
    "/push",
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
          ownerId: ruleset.owner.id,
          ...ruleset,
        },
      };
    },
    {
      body: NewRuleset,
      response: t.Object({
        ruleset: GetRuleset,
      }),
      auth: { requireLogin: true },
    }
  )
  .post(
    "/find",
    async ({ body }) => {
      const em = db.em.fork();
      const ruleset = await em.findOne(Ruleset, body.ref);
      // TODO get by ref
      if (!ruleset) {
        throw "Ruleset not found.";
      }
      return {
        ruleset: {
          ownerId: ruleset.owner.id,
          ...ruleset,
        },
      };
    },
    {
      body: Ref,
      response: t.Object({
        ruleset: GetRuleset,
      }),
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
