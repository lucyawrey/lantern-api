import { Entity, ManyToOne, Unique } from "@mikro-orm/core";
import { User } from "entities/User";
import { Base, GetBase, type BaseInit } from "entities/Base";
import { t } from "elysia";

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

export const ChangeFriendship = t.Intersect([
  t.Object({
    userARef: t.String(),
    userBRef: t.String(),
  }),
]);

export const GetFriendship = t.Intersect([
  GetBase,
  t.Object({
    userAId: t.String(),
    userBId: t.String(),
  }),
]);
