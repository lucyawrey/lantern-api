import type { Insertable, Selectable, Updateable } from "kysely";
import type { Session, User, Credential, Content } from "gen/database-types";

/**
 * Dynamic data type used to represent JSON data in the database with unknown keys and values.
 * This definition is equivalent to Record\<string, string\> but with a named key.
 * Some JSON data in the database will have a known structure that may include one or more of these dynamic data fields.
 */
export type Group = "user" | "admin";
export type Visibility = "public" | "friends" | "limited" | "private";
export type Data = { [key: string]: string };

export type SelectUser = Selectable<User>;
export type NewUser = Insertable<User>;
export type UserUpdate = Updateable<User>;

export type SelectCredential = Selectable<Credential>;
export type NewCredential = Insertable<Credential>;
export type CredentialUpdate = Updateable<Credential>;

export type SelectSession = Selectable<Session>;
export type NewSession = Insertable<Session>;
export type SessionUpdate = Updateable<Session>;

export type SelectContent = Selectable<Content>;
export type NewContent = Insertable<Content>;
export type ContentUpdate = Updateable<Content>;

export type * from "gen/database-types";
