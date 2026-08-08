import { z } from 'zod';

const credentialsSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z
    .string()
    .min(16, 'ADMIN_PASSWORD must contain at least 16 characters')
    .refine(
      (password) => password.toLowerCase() !== 'changeme123!',
      'Refusing a known default password',
    ),
  name: z.string().trim().min(1).default('Green Barbet Admin'),
});

export interface AdminCredentialEnvironment {
  ADMIN_EMAIL?: string;
  ADMIN_PASSWORD?: string;
  ADMIN_NAME?: string;
}

export function parseAdminCredentials(env: AdminCredentialEnvironment) {
  return credentialsSchema.parse({
    email: env.ADMIN_EMAIL,
    password: env.ADMIN_PASSWORD,
    name: env.ADMIN_NAME,
  });
}
