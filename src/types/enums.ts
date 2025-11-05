import { type Static, t } from "elysia";

export const Role = t.UnionEnum(["user", "organization", "official", "admin"]);
export type Role = Static<typeof Role>;

export const AccessType = t.UnionEnum([
  "inviteOnly",
  "friends",
  "tables",
  "friendsAndTables",
  "public",
  "members",
]);
export type AccessType = Static<typeof AccessType>;

export const ContentMode = t.UnionEnum(["static", "interactive"]);
export type ContentMode = Static<typeof ContentMode>;

export const ContentCategory = t.UnionEnum([
  "other",
  "page",
  "character",
  "item",
  "npc",
  "container",
]);
export type ContentCategory = Static<typeof ContentCategory>;
