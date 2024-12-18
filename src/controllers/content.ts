import { Elysia, t } from "elysia";
import { ContentKey } from "types/enums";
import { authMiddleware } from "middleware/auth";
import { ContentService } from "services/content";
import { Visibility } from "types/enums";

export const contentController = new Elysia({ prefix: "/content" })
  .use(authMiddleware)
  .put(
    "",
    async ({ auth, error, body }) => {
      if (!auth.isAuthenticated) {
        return error(401);
      }
      const contentRow = await ContentService.create(
        auth.user,
        body.name,
        body.data,
        body.visibility,
        body.indexes
      );
      if (!contentRow.ok) {
        return error(400, contentRow.error);
      }
      const content = contentRow.data;
      return { content };
    },
    {
      authenticate: { requireLogin: true },
      body: t.Object({
        name: t.String(),
        data: t.Optional(t.Unknown()),
        visibility: t.Optional(Visibility),
        indexes: t.Optional(t.Array(t.String())),
      }),
    }
  )
  .get(
    ":id",
    async ({ auth, error, params, query }) => {
      const contentRow = await ContentService.readOne(params.id, query.s, query.flat, auth.user);
      if (!contentRow.ok) {
        return error(400, contentRow.error);
      }
      const content = contentRow.data;
      return { content };
    },
    {
      authenticate: {},
      params: t.Object({
        id: t.String(),
      }),
      query: t.Object({
        s: t.Array(ContentKey),
        flat: t.Optional(t.Boolean({ default: false })),
      }),
    }
  )
  .delete(
    ":id",
    async ({ auth, error, params }) => {
      if (!auth.isAuthenticated) {
        return error(401);
      }
      const result = await ContentService.deleteOne(params.id, auth.user);
      if (!result.ok) {
        return error(400, result.error);
      }
      return { deleted: true };
    },
    {
      authenticate: { requireLogin: true },
      params: t.Object({
        id: t.String(),
      }),
    }
  );
