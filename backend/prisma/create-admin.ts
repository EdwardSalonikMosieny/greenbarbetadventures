import 'dotenv/config';
import bcrypt from 'bcrypt';
import { parseAdminCredentials } from '../src/lib/adminCredentials';
import prisma from '../src/config/prisma';

async function main() {
  const credentials = parseAdminCredentials(process.env);
  const saltRounds = Number.parseInt(process.env.BCRYPT_SALT_ROUNDS ?? '12', 10);
  const passwordHash = await bcrypt.hash(credentials.password, saltRounds);

  await prisma.admin.upsert({
    where: { email: credentials.email },
    update: { passwordHash, name: credentials.name },
    create: {
      email: credentials.email,
      passwordHash,
      name: credentials.name,
    },
  });

  console.log(`Administrator ${credentials.email} created or rotated.`);
}

main()
  .catch((err) => {
    console.error(err instanceof Error ? err.message : err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
