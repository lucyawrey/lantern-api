import type { Insertable, Selectable } from "kysely";
import {
  hashPassword,
  verifyEmailInput,
  verifyPasswordHash,
  verifyPasswordStrength,
  verifyUsernameInput,
} from "lib/authentication";
import { db } from "lib/database";
import { Err, Ok } from "lib/result";
import type { Credential, User } from "types/database";

export abstract class UserService {
  static async checkEmailAvailability(email: string): Promise<Result> {
    const row = await db
      .selectFrom("user")
      .where("email", "=", email)
      .select(db.fn.countAll().as("count"))
      .executeTakeFirst();
    if (!row) {
      return Err("Failed to get email count from database.");
    }
    if (row.count != 0) {
      return Err("Email is already taken.");
    }
    return Ok();
  }

  static async createUser(
    username: string,
    email: string,
    password: string,
    isOrganization: boolean = false,
    groups?: string[],
    displayName?: string,
    iconUrl?: string
  ): Promise<Result<Selectable<User>>> {
    if (!verifyEmailInput(email)) {
      return Err("Invalid email.");
    }
    if (!verifyUsernameInput(username)) {
      return Err("Invalid username. Can only contain alphanumeric characters and '_'.");
    }
    const strongPassword = await verifyPasswordStrength(password);
    if (!strongPassword.ok) {
      return strongPassword;
    }
    const emailAvailable = await UserService.checkEmailAvailability(email);
    if (!emailAvailable.ok) {
      return emailAvailable;
    }

    const passwordHash = await hashPassword(password);
    const user: Insertable<User> = {
      id: crypto.randomUUID(),
      username,
      email,
      groups: groups ? JSON.stringify(groups) : undefined,
      isOrganization: isOrganization ? 1 : 0,
      displayName: displayName,
      iconUrl: iconUrl,
    };
    const credential: Insertable<Credential> = {
      id: crypto.randomUUID(),
      userId: user.id,
      passwordHash,
    };

    const userRow = await db.insertInto("user").values(user).returningAll().executeTakeFirst();
    if (!(userRow && userRow.id)) {
      return Err("Database error. Could not create user.");
    }
    const credentialRow = await db
      .insertInto("credential")
      .values(credential)
      .returning("id")
      .executeTakeFirst();
    if (!(credentialRow && credentialRow.id)) {
      await db.deleteFrom("user").where("id", "=", user.id).execute();
      return Err("Database error. Could not create user credential.");
    }

    return Ok(userRow);
  }

  /**
   * This is critical authentication logic and should only be changed with care.
   */
  static async authenticateUser(
    usernameOrEmail: string,
    password: string
  ): Promise<Result<Selectable<User>>> {
    usernameOrEmail = usernameOrEmail.trim();
    let user: Selectable<User> | undefined;
    if (verifyUsernameInput(usernameOrEmail)) {
      user = await db
        .selectFrom("user")
        .where("username", "=", usernameOrEmail)
        .selectAll()
        .executeTakeFirst();
    } else if (verifyEmailInput(usernameOrEmail)) {
      user = await db
        .selectFrom("user")
        .where("email", "=", usernameOrEmail)
        .selectAll()
        .executeTakeFirst();
    } else {
      return Err("Invalid username or email.");
    }
    if (user == undefined) {
      return Err("No user exists with that username/email and password.");
    }

    // Critical password verification logic
    const credential = await db
      .selectFrom("credential")
      .where("userId", "=", user.id)
      .select("passwordHash")
      .executeTakeFirst();
    if (credential == undefined) {
      return Err("Could not find authentication information for user.");
    }
    const passwordIsValid = await verifyPasswordHash(credential.passwordHash, password);
    if (passwordIsValid) {
      return Ok(user);
    }

    return Err("No user exists with that username/email and password.");
  }
}
