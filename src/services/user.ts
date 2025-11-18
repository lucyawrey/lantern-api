import { Session } from "entities/Session";
import { PushUser, User } from "entities/User";
import {
  generateRecoveryToken,
  generateSessionToken,
  hasAccess,
  hashPassword,
  hasRole,
  verifyNameInput,
  verifyPasswordHash,
  verifyPasswordStrength,
} from "lib/auth";
import type { Em } from "lib/db";
import { Auth, authDefault } from "types/auth";
import { AuthError, NotFoundError, ValidationError } from "middleware/error";
import { Err, Ok } from "lib/result";

export async function pushUser(
  em: Em,
  pushUser: PushUser,
  auth: Auth = authDefault
): Promise<{ user: User; recoveryToken?: string }> {
  // Only admins can set user roles
  if (!hasRole(auth.session?.user, "admin")) {
    pushUser.roles = undefined;
  }

  if (pushUser.name && !verifyNameInput(pushUser.name)) {
    throw new ValidationError(
      "Name must be between 3 and 32 characters and can only contain letters, numbers, underscores, and hyphens."
    );
  }
  if (pushUser.password && !verifyPasswordStrength(pushUser.password)) {
    throw new ValidationError(
      "Password is too weak. Password must be at least 8 characters long and not a commonly used password."
    );
  }

  let user: User | null = null;
  const [recoveryToken, recoveryTokenHash] = pushUser.generateRecoveryToken
    ? await generateRecoveryToken()
    : [undefined, undefined];
  const passwordHash = pushUser.password
    ? await hashPassword(pushUser.password)
    : undefined;

  if (!pushUser.id) {
    if (await em.findOne(User, { name: pushUser.name })) {
      throw new ValidationError("User already exists with that username.");
    }
    if (!pushUser.name) {
      throw new ValidationError("Missing user name.");
    }
    if (!passwordHash) {
      throw new ValidationError("Missing password.");
    }
    user = new User({
      name: pushUser.name,
      displayName: pushUser.displayName,
      roles: pushUser.roles,
      hasReadAccess: pushUser.hasReadAccess,
      iconUrl: pushUser.iconUrl,
      passwordHash,
      recoveryTokenHash,
    });
  } else {
    user = await em.findOne(User, pushUser.id);
    if (!user) {
      throw new NotFoundError("User with given ID not found.");
    }
    if (!hasAccess("write", user, user, auth.session?.user)) {
      throw new AuthError();
    }
    user.name = pushUser.name ?? user.name;
    user.displayName = pushUser.displayName ?? user.displayName;
    user.roles = pushUser.roles ?? user.roles;
    user.hasReadAccess = pushUser.hasReadAccess ?? user.hasReadAccess;
    user.iconUrl = pushUser.iconUrl ?? user.iconUrl;
    if (passwordHash) {
      user.passwordHash = passwordHash;
    }
    if (recoveryTokenHash) {
      user.recoveryTokenHash = recoveryTokenHash;
    }
  }

  em.persist(user);
  return { user, recoveryToken };
}

export async function loginUser(
  em: Em,
  name: string,
  password: string
): Promise<User> {
  const user = await em.findOne(User, { name });

  if (!user) {
    throw new AuthError("Invalid username or password.");
  }

  const passwordIsVerified = await verifyPasswordHash(
    user.passwordHash,
    password
  );

  if (passwordIsVerified) {
    return user;
  }

  throw new AuthError("Invalid username or password.");
}

export async function logoutUser(
  em: Em,
  session: Session,
  logoutAllSessions: boolean = false
): Promise<void> {
  if (logoutAllSessions) {
    let sessions = await em.find(Session, { user: session.user });
    em.remove(sessions).flush();
  } else {
    em.remove(session).flush();
  }
}

export async function deleteUserById(
  em: Em,
  id: string,
  auth: Auth = authDefault
): Promise<void> {
  const user = await em.findOne(User, id);
  if (!user) {
    throw new NotFoundError();
  }
  if (!hasAccess("write", user, user, auth.session?.user)) {
    throw new AuthError();
  }
  em.remove(user);
}

export async function createSessionForUser(
  em: Em,
  user: User
): Promise<{ session: Session; sessionToken: string }> {
  const [sessionToken, sessionTokenHash] = await generateSessionToken();
  const session = new Session({ id: sessionTokenHash, user });

  em.persist(session);
  return { session, sessionToken };
}

export async function findUserByRef(
  em: Em,
  ref?: string
): Promise<Result<User, NotFoundError>> {
  if (!ref) {
    return Err(new NotFoundError());
  }
  const user = await em.findOne(User, { $or: [{ id: ref }, { name: ref }] });
  if (!user) {
    return Err(new NotFoundError());
  }
  return Ok(user);
}
