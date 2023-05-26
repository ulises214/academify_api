import { PrismaClient } from '@prisma/client';

const client = new PrismaClient();
const adminUsers = (process.env.ADMIN_EMAILS ?? '').split(',');
async function main() {
  await client.$connect();

  const users = await client.user.findMany();

  if (users.length === 0) {
    await client.user.createMany({
      data: adminUsers.map((email, i) => ({
        name: `Admin ${i + 1}`,
        email,
        role: 'ADMIN',
      })),
    });
  }
  await client.$disconnect();
}

main().catch((e) => console.error(e));
