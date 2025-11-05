import { Entity, ManyToOne, Property, type Rel } from "@mikro-orm/core";
import type { ContentMode, ContentCategory } from "types/enums";
import { Ruleset } from "entities/Ruleset";
import type { Schema } from "types/schema";
import { ContentRenderer } from "entities/ContentRenderer";
import { Owned, OwnedInit } from "./Owned";

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
