import { Static, t } from "elysia";

export const Group = t.UnionEnum(["user", "admin"]);
export const Visibility = t.UnionEnum(["public", "private", "limited", "friends"]);

export type Group = Static<typeof Group>;
export type Visibility = Static<typeof Visibility>;

export * from "gen/enums";
