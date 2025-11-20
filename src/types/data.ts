import { type Static, t } from "elysia";

/**
 * Dynamic data type used to represent JSON data in the database with unknown keys and values.
 * Some JSON data in the database will have a known structure that may include one or more of these dynamic data fields.
 */
export const Data = t.Record(t.String(), t.Unknown());
export type Data = Static<typeof Data>;
