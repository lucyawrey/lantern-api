import { Entity, ManyToOne, Unique } from "@mikro-orm/core";
import { User } from "entities/User";
import { Base, GetBase, type BaseInit } from "entities/Base";
import { Static, t } from "elysia";

@Entity()
@Unique({ properties: ["userA", "userB"] })
export class Friendship extends Base {
  @ManyToOne()
  userA!: User;

  @ManyToOne()
  userB!: User;

  constructor(init: { userA: User; userB: User } & BaseInit) {
    super(init);
  }
}

export const ChangeFriendship = t.Composite([
  t.Object({
    userARef: t.String(),
    userBRef: t.String(),
  }),
]);
export type ChangeFriendship = Static<typeof ChangeFriendship>;

export const GetFriendship = t.Composite([
  GetBase,
  t.Object({
    userAId: t.String(),
    userBId: t.String(),
  }),
]);
export type GetFriendship = Static<typeof GetFriendship>;
