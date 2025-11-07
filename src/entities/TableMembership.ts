import { Entity, ManyToOne, Unique } from "@mikro-orm/core";
import { User } from "entities/User";
import { Table } from "entities/Table";
import { Base, BaseInit } from "entities/Base";
import { Static, t } from "elysia";

@Entity()
@Unique({ properties: ["table", "user"] })
export class TableMembership extends Base {
  @ManyToOne()
  table!: Table;

  @ManyToOne()
  user!: User;

  constructor(init: { table: Table; user: User } & BaseInit) {
    super(init);
  }
}

export const ChangeTableMembership = t.Composite([
  t.Object({
    tableRef: t.String(),
    userRef: t.String(),
  }),
]);
export type ChangeTableMembership = Static<typeof ChangeTableMembership>;

export const GetTableMembership = t.Composite([
  t.Object({
    tableId: t.String(),
    userId: t.String(),
  }),
]);
export type GetTableMembership = Static<typeof GetTableMembership>;
