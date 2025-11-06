import { Entity, ManyToOne, Property, type Rel } from "@mikro-orm/core";
import { ContentType } from "entities/ContentType";
import { NewOwned, GetOwned, Owned, type OwnedInit } from "entities/Owned";
import { t } from "elysia";
import { Ref } from "types/ref";

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

export const NewContentRenderer = t.Intersect([
  NewOwned,
  t.Object({
    contentTypeRef: t.String(),
    cssStyles: t.Optional(t.String()),
    changelingMarkup: t.Optional(t.String()),
  }),
]);

export const PushContent = t.Union([
  NewContentRenderer,
  t.Intersect([Ref, t.Partial(NewContentRenderer)]),
]);

export const GetContentRenderer = t.Intersect([
  GetOwned,
  t.Object({
    contentTypeId: t.String(),
    cssStyles: t.String(),
    changelingMarkup: t.String(),
  }),
]);
