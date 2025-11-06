import { Entity, ManyToOne, Property, type Rel } from "@mikro-orm/core";
import { ContentType } from "entities/ContentType";
import { PushOwned, GetOwned, Owned, type OwnedInit } from "entities/Owned";
import { Static, t } from "elysia";

@Entity()
export class ContentRenderer extends Owned {
  @ManyToOne(() => ContentType, { index: true })
  contentType!: Rel<ContentType>;

  @Property()
  cssStyles: string = "";

  @Property()
  changelingMarkup: string = "";

  constructor(
    init: {
      contentType: ContentType;
      cssStyles?: string;
      changelingMarkup?: string;
    } & OwnedInit
  ) {
    super(init);
  }
}

export const PushContentRenderer = t.Intersect([
  PushOwned,
  t.Object({
    contentTypeRef: t.Optional(t.String()),
    cssStyles: t.Optional(t.String()),
    changelingMarkup: t.Optional(t.String()),
  }),
]);
export type PushContentRenderer = Static<typeof PushContentRenderer>;

export const GetContentRenderer = t.Intersect([
  GetOwned,
  t.Object({
    contentTypeId: t.String(),
    cssStyles: t.String(),
    changelingMarkup: t.String(),
  }),
]);
export type GetContentRenderer = Static<typeof GetContentRenderer>;
