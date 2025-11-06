import { t, type TSchema } from "elysia";

export function Push<Type extends TSchema>(type: Type) {
  return t.Union([
    t.Intersect([t.Object({ ref: t.Undefined() }), type]),
    t.Intersect([t.Object({ ref: t.String() }), t.Partial(type)]),
  ]);
}
