import { Static, t } from "elysia";
import { Group } from "types/enums";

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
