import { Entity, Property, ManyToOne, Embedded } from "@mikro-orm/core";
import { ContentType } from "entities/ContentType";
import { Data } from "types/data";
import { ContentRenderer } from "entities/ContentRenderer";
import { Indexes } from "entities/Indexes";
import { GetOwned, NewOwned, Owned, type OwnedInit } from "entities/Owned";
import { Static, t } from "elysia";
import { Push } from "types/push";

@Entity()
export class Content extends Owned {
  @ManyToOne({ index: true })
  contentType!: ContentType;

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

export const NewContent = t.Intersect([
  NewOwned,
  t.Object({
    contentTypeRef: t.String(),
    data: t.Optional(Data),
    contentRendererRef: t.Optional(t.String()),
  }),
]);
export type NewContent = Static<typeof NewContent>;

export const PushContent = Push(NewContent);
export type PushContent = Static<typeof PushContent>;

export const GetContent = t.Intersect([
  GetOwned,
  t.Object({
    contentTypeId: t.String(),
    data: Data,
    contentRendererId: t.Optional(t.String()),
  }),
]);
export type GetContent = Static<typeof GetContent>;
