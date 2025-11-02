import { type Static, t } from "elysia";

/**
 * Dynamic data value type.
 */
export const DataValue = t.Union([t.String(), t.Number(), t.Boolean()]);
export type DataValue = Static<typeof DataValue>;

/**
 * Dynamic data type used to represent JSON data in the database with unknown keys and values.
 * Some JSON data in the database will have a known structure that may include one or more of these dynamic data fields.
 */
export const Data = t.Record(t.String(), DataValue, {});
export type Data = Static<typeof Data>;
