import { Entity, Property, ManyToOne, Embedded } from "@mikro-orm/core";
import { ContentType } from "entities/ContentType";
import type { Data } from "types/data";
import { ContentRenderer } from "entities/ContentRenderer";
import { Indexes } from "entities/Indexes";
import { Owned, type OwnedInit } from "entities/Owned";

@Entity()
export class Content extends Owned {
  @ManyToOne({ index: true })
  contentType!: ContentType;

  @Property({ type: "json" })
  indexKeys: string[] = [];

  @Embedded()
  indexes: Indexes = new Indexes();

  @Property({ type: "json" })
  data: Data = {};

  @ManyToOne({ nullable: true })
  contentRenderer?: ContentRenderer;

  constructor(
    init: {
      contentType: ContentType;
      indexKeys?: string[];
      indexes?: Indexes;
      data?: Data;
      contentRenderer?: ContentRenderer;
    } & OwnedInit
  ) {
    super(init);
  }
}
