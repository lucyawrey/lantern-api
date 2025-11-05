import { Entity, PrimaryKey, Property, ManyToOne } from "@mikro-orm/core";
import { User } from "entities/User";

@Entity()
export class Session {
  @PrimaryKey()
  id!: string;

  @Property()
  expiresAt: Date = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  @ManyToOne()
  user!: User;

  constructor(init: { id: string; user: User }) {
    Object.assign(this, init);
  }
}
