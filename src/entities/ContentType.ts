import { Entity, ManyToOne, Property, type Rel } from "@mikro-orm/core";
import { ContentMode, ContentCategory } from "types/enums";
import { Ruleset } from "entities/Ruleset";
import { Schema } from "types/schema";
import { ContentRenderer } from "entities/ContentRenderer";
import { NewOwned, GetOwned, Owned, type OwnedInit } from "entities/Owned";
import { t } from "elysia";

@Entity()
export class ContentType extends Owned {
  @ManyToOne({ index: true })
  ruleset!: Ruleset;

  @Property()
  contentMode: ContentMode = "static";

  @Property()
  contentCategory: ContentCategory = "other";

  @Property()
  hasDynamicSchema: boolean = true;

  @Property({ type: "json" })
  indexKeys: string[] = [];

  @Property({ type: "json" })
  schema: Schema = {
    properties: {},
    types: {},
  };

  @ManyToOne(() => ContentRenderer, { nullable: true })
  defaultContentRenderer?: Rel<ContentRenderer>;

  constructor(
    init: {
      ruleset: Ruleset;
      contentMode?: ContentMode;
      contentCategory?: ContentCategory;
      hasDynamicSchema?: boolean;
      indexKeys?: string[];
      schema?: Schema;
      defaultContentRenderer?: ContentRenderer;
    } & OwnedInit
  ) {
    super(init);
  }
}

export const NewContentType = t.Intersect([
  NewOwned,
  t.Object({
    rulesetRef: t.String(),
    contentMode: t.Optional(ContentMode),
    contentCategory: t.Optional(ContentCategory),
    hasDynamicSchema: t.Optional(t.Boolean()),
    indexKeys: t.Optional(t.Array(t.String())),
    schema: t.Optional(Schema),
    defaultContentRendererRef: t.Optional(t.String()),
  }),
]);

export const UpdateContentType = t.Partial(NewContentType);

export const GetContentType = t.Intersect([
  GetOwned,
  t.Object({
    rulesetId: t.String(),
    contentMode: ContentMode,
    contentCategory: ContentCategory,
    hasDynamicSchema: t.Boolean(),
    indexKeys: t.Array(t.String()),
    schema: Schema,
    defaultContentRendererId: t.Optional(t.String()),
  }),
]);
