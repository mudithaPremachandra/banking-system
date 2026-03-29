/**
 * Database Seed Script — Test Users
 * OWNER: Kasunara (Database Administrator)
 *
 * PURPOSE:
 * Since there is no registration flow, this script pre-populates the database
 * with test user accounts for development and demonstration purposes.
 *
 * HOW TO RUN:
 *   cd services/auth-service
 *   npx ts-node prisma/seed.ts
 *
 * Or add to package.json and run via Prisma:
 *   "prisma": { "seed": "ts-node prisma/seed.ts" }
 *   npx prisma db seed
 *
 * IMPORTANT:
 * - Run AFTER migrations/db push (tables must exist first)
 * - Safe to re-run — uses upsert so existing users won't be duplicated
 * - These credentials are for development only, not production
 *
 * TODO (Kasunara):
 * 1. Add as many test users as needed for demo purposes
 * 2. Make sure the passwords below are shared with the team
 * 3. Optionally add seed data for accounts too (in account-service/prisma/seed.ts)
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const TEST_USERS = [
  {
    email: "john.silva@example.com",
    password: "password123",
    fullName: "John Silva",
    phone: "+94771234567",
  },
  {
    email: "mary.perera@example.com",
    password: "password123",
    fullName: "Mary Perera",
    phone: "+94779876543",
  },
  {
    email: "admin@bankingsystem.dev",
    password: "admin1234",
    fullName: "Admin User",
  },
];

async function main() {
  console.log("Seeding auth database...");

  for (const user of TEST_USERS) {
    const passwordHash = await bcrypt.hash(user.password, 10);

    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        email: user.email,
        passwordHash,
        fullName: user.fullName,
        phone: user.phone,
      },
    });

    console.log(`  ✓ ${user.email} (password: ${user.password})`);
  }

  console.log("Seeding complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
