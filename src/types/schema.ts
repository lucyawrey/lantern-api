import { type Static, t } from "elysia";

export const SchemaPropertyDefinition = t.Recursive((self) =>
  t.Union([
    t.Object({
      type: t.UnionEnum(["string", "number", "boolean", "contentRef", "any"]),
    }),
    t.Object({
      type: t.Literal("array"),
      itemType: self,
    }),
    t.Object({
      type: t.UnionEnum(["localTypeObject", "contentTypeObject"]),
      ref: t.String(),
    }),
  ])
);
export type SchemaPropertyDefinition = Static<typeof SchemaPropertyDefinition>;

export const Schema = t.Object({
  properties: t.Record(t.String(), SchemaPropertyDefinition),
  types: t.Record(t.String(), t.Record(t.String(), SchemaPropertyDefinition)),
});
export type Schema = Static<typeof Schema>;
