import { Static, t } from "elysia";
import { Selectable } from "kysely";
import { Group } from "types/enums";
import { User as DbUser } from "types/database";

/**
 * Dynamic data type used to represent JSON data in the database with unknown keys and values.
 * This definition is equivalent to `Record\<string, string\>` but with a named key.
 * Some JSON data in the database will have a known structure that may include one or more of these dynamic data fields.
 */
export const Data = t.Record(t.String(), t.String(), {});
export type Data = Static<typeof Data>;

export const User = t.Object({
  id: t.String(),
  createdAt: t.Date(),
  updatedAt: t.Date(),
  username: t.String(),
  email: t.String(),
  groups: t.Array(Group),
  emailIsVerified: t.Boolean(),
  isOrganization: t.Boolean(),
  displayName: t.Optional(t.String()),
  iconUrl: t.Optional(t.String()),
});
export type User = Static<typeof User>;

export function toDate(timestamp: number): Date {
  return new Date(timestamp * 1000);
}

/**
 * Gets the current unix timestamp in seconds. Useful because SQLite uses this format.
 * @returns unix integer timestamp in the `number` type.
 */
export function now() {
  return Math.floor(Date.now() / 1000);
}

export function toUser(userRow: Selectable<DbUser> & { userId?: string }): User {
  return {
    id: userRow.userId || userRow.id,
    createdAt: toDate(userRow.createdAt),
    updatedAt: toDate(userRow.updatedAt),
    username: userRow.username,
    email: userRow.email,
    groups: JSON.parse(userRow.groups),
    emailIsVerified: !!userRow.emailIsVerified,
    isOrganization: !!userRow.isOrganization,
    displayName: userRow.displayName || undefined,
    iconUrl: userRow.displayName || undefined,
  };
}
