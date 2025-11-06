import { t, type TSchema } from "elysia";

/**
 * A helper function to create "push" types for Elysia TypeBox schemas.
 * This creates a union type that requires either a full entity init object
 * or a partial containing a reference to an existing entity.
 * Currently this does not work due to limitations in Elysia's TypeBox validation system.
 * @param type - The Elysia schema type to be used for the push operation.
 * @returns A new Elysia schema that supports push semantics.
 */
export function Push<Type extends TSchema>(type: Type) {
  return t.Union([
    t.Intersect([t.Object({ ref: t.Undefined() }), type]),
    t.Intersect([t.Object({ ref: t.String() }), t.Partial(type)]),
  ]);
}
