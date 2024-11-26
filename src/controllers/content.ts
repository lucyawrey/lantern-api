import { Elysia, t } from "elysia";
import { AuthService } from "services/auth";
import { ContentService } from "services/content";

export const contentController = new Elysia({ prefix: "/content" })
  .use(AuthService)
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
        visibility: t.Optional(t.UnionEnum(["public", "private", "limited", "friends"])),
        indexes: t.Optional(t.Array(t.String())),
      }),
    }
  )
  .get(
    ":id",
    async ({ auth, error, params, query }) => {
      if (!auth.isAuthenticated) {
        return error(401);
      }
      const select = query.select.includes("all") ? "all" : query.select.split(",");
      const contentRow = await ContentService.readOne(params.id, select, query.flat, auth.user);
      if (!contentRow.ok) {
        return error(400, contentRow.error);
      }
      const content = contentRow.data;
      return { content };
    },
    {
      authenticate: { requireLogin: true },
      params: t.Object({
        id: t.String(),
      }),
      query: t.Object({
        select: t.Union([t.String(), t.Literal("all")]),
        flat: t.Boolean({ default: false }),
      }),
    }
  );
