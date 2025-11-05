import { Entity, ManyToOne, Property, type Rel } from "@mikro-orm/core";
import { ContentType } from "entities/ContentType";
import { CreateOwned, GetOwned, Owned, type OwnedInit } from "entities/Owned";
import { GetBase } from "./Base";
import { t } from "elysia";

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

export const CreateContentRenderer = t.Intersect([
  CreateOwned,
  t.Object({
    contentTypeRef: t.String(),
    cssStyles: t.Optional(t.String()),
    changelingMarkup: t.Optional(t.String()),
  }),
]);

export const UpdateContentRenderer = t.Partial(CreateContentRenderer);

export const GetContentRenderer = t.Intersect([
  GetOwned,
  t.Object({
    contentTypeId: t.String(),
    cssStyles: t.String(),
    changelingMarkup: t.String(),
  }),
]);
