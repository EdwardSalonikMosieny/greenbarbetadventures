// Fails fast at startup rather than signing tokens with `undefined` if the env is misconfigured.
// The explicit `: string` annotation (rather than exporting the checked variable directly)
// is what lets TypeScript treat every import site as definitely-a-string, not string | undefined.
const rawSecret = process.env.JWT_SECRET;
if (!rawSecret) {
  throw new Error('JWT_SECRET is not set — check backend/.env');
}
export const JWT_SECRET: string = rawSecret;
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? '7d';

export interface AdminTokenPayload {
  sub: string;
  email: string;
}
