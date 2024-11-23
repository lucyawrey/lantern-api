export const contentIndexCount = 10;

/**
 * Will always be defined despite being from an external enviornment variable due to
 * the fact that the server will not start without `DATABASE_URL` defined.
 */
export const databaseUrl = process.env.DATABASE_URL as string;

/**
 * Will always be defined despite being from an external enviornment variable due to
 * the fact that the server will not start without `ENCRYPTION_KEY` defined.
 */
export const encryptionKey = process.env.ENCRYPTION_KEY as string;
