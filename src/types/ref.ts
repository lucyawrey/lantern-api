import { Static, t } from "elysia";

export const Ref = t.Object({ ref: t.String() });
export type Ref = Static<typeof Ref>;

export const RefOptional = t.Optional(
  t.Object({ ref: t.Optional(t.String()) })
);
export type RefOptional = Static<typeof RefOptional>;
