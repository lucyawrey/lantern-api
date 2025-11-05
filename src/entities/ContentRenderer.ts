import { Entity, ManyToOne, Property, type Rel } from "@mikro-orm/core";
import { ContentType } from "entities/ContentType";
import { Owned, OwnedInit } from "./Owned";

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
