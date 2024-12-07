import { t } from "elysia";

export function responseSchema(schema: Parameters<typeof t.Object>[0]) {
  return {
    200: t.Object(schema),
    400: t.String(),
    401: t.String(),
    500: t.String(),
  };
}
