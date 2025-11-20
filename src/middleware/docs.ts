import openapi from "@elysiajs/openapi";
import pkg from "../../package.json";

export const docsMiddleware = openapi({
  path: "/docs",
  documentation: {
    info: {
      title: "Lantern API Documentation",
      version: pkg.version,
      description: "Interactive developer documentation for Lantern's API.",
    },
    tags: [
      { name: "User", description: "Endpoints for user account management." },
      { name: "Ruleset", description: "Endpoints for managing rulesets." },
    ],
  },
});
