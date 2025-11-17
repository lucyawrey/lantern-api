import Elysia from "elysia";

export const errorMiddleware = new Elysia({ name: "errorMiddleware" }).onError(
  { as: "global" },
  ({ error, status }) => {
    const msg = error.toString().replace("Error: ", "");
    if (msg !== "Error") {
      console.error(`❗ ${msg}`);
    }
    return status(500, { error: msg });
  }
);
