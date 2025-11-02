import { Entity, PrimaryKey, Property, ManyToOne } from "@mikro-orm/core";
import { User } from "entities/User";
import { generateSessionToken } from "lib/authentication";

@Entity()
export class Session {
  @PrimaryKey()
  id: string = generateSessionToken();

  @Property()
  expiresAt: Date = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  @ManyToOne()
  user!: User;
}
