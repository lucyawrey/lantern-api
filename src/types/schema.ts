import { type Static, t } from "elysia";

export const SchemaProperty = t.Recursive((self) =>
  t.Union([
    t.Object({
      type: t.UnionEnum(["string", "number", "boolean", "any"]),
    }),
    t.Object({
      type: t.Literal("array"),
      itemType: self,
    }),
    t.Object({
      type: t.Literal("object"),
      entries: t.Record(t.String(), self),
    }),
    t.Object({
      type: t.Literal("localType"),
      key: t.String(),
    }),
    t.Object({
      type: t.UnionEnum(["contentType", "contentRef"]),
      ref: t.String(),
    }),
  ])
);
export type SchemaProperty = Static<typeof SchemaProperty>;

export const Schema = t.Record(t.String(), SchemaProperty);
export type Schema = Static<typeof Schema>;
