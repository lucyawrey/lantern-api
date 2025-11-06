import { Static, t } from "elysia";

export const Ref = t.Object({ ref: t.String() });
export type Ref = Static<typeof Ref>;
