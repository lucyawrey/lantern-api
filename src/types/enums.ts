export type Role = "user" | "organization" | "admin";

export type AccessType =
  | "inviteOnly"
  | "friends"
  | "tables"
  | "friendsAndTables"
  | "public"
  | "members";

export type ContentMode = "static" | "interactive";

export type ContentCategory =
  | "other"
  | "page"
  | "character"
  | "item"
  | "npc"
  | "container";
