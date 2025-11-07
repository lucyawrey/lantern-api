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
import { Auth } from "types/auth";

export async function pushUser(
  em: Em,
  pushUser: PushUser,
  auth: Auth = {
    isAuthenticated: false,
    session: undefined,
    sessionToken: undefined,
  }
): Promise<{ user: User; recoveryToken?: string }> {
  // Only admins can set user roles
  if (!hasRole(auth.session?.user, "admin")) {
    pushUser.roles = undefined;
  }

  if (pushUser.name && !verifyNameInput(pushUser.name)) {
    throw "Invalid username. Username must be between 3 and 32 characters and can only contain letters, numbers, underscores, and hyphens.";
  }
  if (pushUser.password && !verifyPasswordStrength(pushUser.password)) {
    throw "Password is too weak. Password must be at least 8 characters long and not a commonly used password.";
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
      throw "User already exists with that username.";
    }
    if (!pushUser.name) {
      throw "Missing user name.";
    }
    if (!passwordHash) {
      throw "Missing password.";
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
      throw "User with given ID not found.";
    }
    if (
      !auth.isAuthenticated ||
      !hasAccess("write", user, "inviteOnly", auth.session.user)
    ) {
      throw "Unauthorized.";
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

export async function createSessionForUser(
  em: Em,
  user: User
): Promise<{ session: Session; sessionToken: string }> {
  const [sessionToken, sessionTokenHash] = await generateSessionToken();
  const session = new Session({ id: sessionTokenHash, user });

  em.persist(session);
  return { session, sessionToken };
}

export async function loginUser(
  em: Em,
  name: string,
  password: string
): Promise<User> {
  const user = await em.findOne(User, { name });

  if (!user) {
    throw "Invalid username or password.";
  }

  const passwordIsVerified = await verifyPasswordHash(
    user.passwordHash,
    password
  );

  if (passwordIsVerified) {
    return user;
  }

  throw "Invalid username or password.";
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
