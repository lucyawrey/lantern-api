import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Static, t } from "elysia";
import { generateId } from "lib/auth";

@Entity({ abstract: true })
export abstract class Base {
  @PrimaryKey()
  id: string = generateId();

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  constructor(init: BaseInit) {
    Object.assign(this, init);
  }
}

export interface BaseInit {}

export const GetBase = t.Object({
  id: t.String(),
  createdAt: t.Date(),
  updatedAt: t.Date(),
});
export type GetBase = Static<typeof GetBase>;
