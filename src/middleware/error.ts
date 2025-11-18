import Elysia from "elysia";

function addDefaultErrorMessage(defaultMessage: string, message?: string) {
  return defaultMessage + (message ? " " + message : "");
}

export class ValidationError extends Error {
  constructor(public message: string = "") {
    message = addDefaultErrorMessage("Validation Error.", message);
    super(message);
  }
}

export class AuthError extends Error {
  constructor(public message: string = "") {
    message = addDefaultErrorMessage("Unauthorized.", message);
    super(message);
  }
}

export class NotFoundError extends Error {
  constructor(public message: string = "") {
    message = addDefaultErrorMessage("Not Found.", message);
    super(message);
  }
}

export class UnimplementedError extends Error {
  constructor(public message: string = "") {
    message = addDefaultErrorMessage("Unimplemented.", message);
    super(message);
  }
}

export const errorMiddleware = new Elysia({ name: "errorMiddleware" })
  .error({ ValidationError, AuthError, NotFoundError, UnimplementedError })
  .onError({ as: "global" }, ({ code, error, status }) => {
    const msg = error.toString().replace("Error: ", "");
    if (msg !== "Error") {
      console.error(`❗ ${msg}`);
    }

    if (typeof code === "string") {
      if (
        code === "ValidationError" ||
        code === "VALIDATION" ||
        code === "PARSE" ||
        code === "INVALID_COOKIE_SIGNATURE"
      ) {
        code = 400;
      } else if (code === "AuthError") {
        code = 401;
      } else if (code === "NotFoundError" || code === "NOT_FOUND") {
        code = 404;
      } else if (code === "UnimplementedError") {
        code = 501;
      } else {
        code = 500;
      }
    }

    return status(code, { error: msg });
  });
