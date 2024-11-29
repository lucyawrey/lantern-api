import Elysia from "elysia";
import { isValidElement } from "preact";
import render from "preact-render-to-string";

export const jsxMiddleware = new Elysia({ name: "jsxMiddleware" }).mapResponse(
  { as: "global" },
  async ({ response }) => {
    if (isValidElement(response)) {
      const html = "<!DOCTYPE html>" + render(response);
      return new Response(html, { headers: { "content-type": "text/html; charset=utf8" } });
    }
    return;
  }
);
