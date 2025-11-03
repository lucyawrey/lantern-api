import { User } from "entities/User";

export type Auth =
  | {
      isAuthenticated: false;
      user: undefined;
      sessionToken: string | undefined;
    }
  | {
      isAuthenticated: true;
      user: User;
      sessionToken: string;
    };
