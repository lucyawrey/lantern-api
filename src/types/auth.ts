import { Session } from "entities/Session";

export type Auth =
  | {
      isAuthenticated: false;
      session: undefined;
      sessionToken: string | undefined;
    }
  | {
      isAuthenticated: true;
      session: Session;
      sessionToken: string;
    };
