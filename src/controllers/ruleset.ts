import { Elysia, t } from "elysia";
import { verifyNameInput } from "lib/auth";
import { db } from "..";
import { authMiddleware } from "middleware/auth";
import { CreateRuleset, GetRuleset, Ruleset } from "entities/Ruleset";
import { CreateOwned, GetOwned } from "entities/Owned";

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
          ownerId: ruleset.owner.id,
          ...ruleset,
        },
      };
    },
    {
      auth: { requireLogin: true },
      body: CreateOwned,
      response: t.Object({
        ruleset: GetRuleset,
      }),
    }
  )
  .post(
    "/get",
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
      body: t.Object({
        ref: t.String(),
      }),
      response: t.Object({
        ruleset: GetRuleset,
      }),
    }
  );
