import Elysia from "elysia";
import { jsxMiddleware } from "middleware/jsx";

export const homeController = new Elysia().use(jsxMiddleware).get("/", () => (
  <html lang="en">
    <body style="background:gray; color:white;">
      <h1>Lantern Tabletop</h1>
      <p>
        Welcome to Lantern's API service. Go to{" "}
        <a href="/docs">interactive API documentation</a>.
      </p>
    </body>
  </html>
));
