import { Static, t, TSchema } from "elysia";

export type TProperties = Record<string | number, TSchema>;

export const ErrorResponse = t.Object({
  error: t.String(),
});
export type ErrorResponse = Static<typeof ErrorResponse>;

export function StandardResponse<Type extends TProperties>(type: Type) {
  return {
    200: t.Object(type),
    400: ErrorResponse,
    401: ErrorResponse,
    404: ErrorResponse,
    500: ErrorResponse,
  };
}
