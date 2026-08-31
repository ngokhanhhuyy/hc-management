import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../database/client";
import { BcryptPasswordHasher } from "../common/authentication/passwordHasher";

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

mainAsync();

type UserIdWithUserName = { id: number; userName: string; };
async function mainAsync(): Promise<void> {
  const userIdWithUserNames = await seedUserAsync();
  const createdMenuItemCategoryIds = await seedMenuItemCategoriesAsync();
  await seedMenuItemsAsync(userIdWithUserNames, createdMenuItemCategoryIds);
  await seedSeatingAsync();
}

async function seedUserAsync(): Promise<UserIdWithUserName[]> {
  const alreadyExistingRecords = await prisma.user.findMany({
    select: { id: true, userName: true }
  });

  if (alreadyExistingRecords.length) {
    return alreadyExistingRecords;
  }

  const passwordHasher = new BcryptPasswordHasher();
  const userNameWithPasswordHashes = [
    { userName: "admin", passwordHash: await passwordHasher.hashPasswordAsync("admin") },
    { userName: "developer", passwordHash: await passwordHasher.hashPasswordAsync("developer") },
  ];

  const createdRecords = await prisma.user.createManyAndReturn({
    data: userNameWithPasswordHashes.map(unwp => unwp),
    select: { id: true, userName: true }
  });

  return createdRecords;
}

async function seedMenuItemCategoriesAsync(): Promise<number[]> {
  const alreadyExistingRecords = await prisma.menuCategory.findMany({
    select: { id: true }
  });

  if (alreadyExistingRecords.length) {
    return alreadyExistingRecords.map(record => record.id);
  }

  const menuItemCategoryNames: string[] = [];
  for (let index = 0; index < 5; index += 1) {
    menuItemCategoryNames.push(`Category ${index + 1}`);
  }

  const createdRecords = await prisma.menuCategory.createManyAndReturn({
    data: menuItemCategoryNames.map(name => ({ name })),
    select: { id: true }
  });

  return createdRecords.map(record => record.id);
}

async function seedMenuItemsAsync(userIdWithUserNames: UserIdWithUserName[], categoryIds: number[]): Promise<number[]> {
  const alreadyExistingRecords = await prisma.menuItem.findMany({
    select: { id: true }
  });

  if (alreadyExistingRecords.length) {
    return alreadyExistingRecords.map(record => record.id);
  }

  const menuItemNames: string[] = [];
  for (let index = 0; index < 15; index += 1) {
    menuItemNames.push((index < 10 ? "Món ăn" : "Đồ uống") + ` ${index <= 10 ? index + 1 : index - 10}`);
  }

  const getRandomCategoryId = () => categoryIds[Math.floor(Math.random() * categoryIds.length)];
  const adminUser = userIdWithUserNames.find(u => u.userName === "admin")!;

  const createdRecords = await prisma.menuItem.createManyAndReturn({
    data: menuItemNames.map(name => ({
      name,
      categoryId: getRandomCategoryId(),
      createdUserId: adminUser.id
    })),
    select: { id: true }
  });

  return createdRecords.map(resource => resource.id);
}

async function seedSeatingAsync(): Promise<number[]> {
  const alreadyExistingRecords = await prisma.seating.findMany({
    select: {
      id: true
    }
  });

  if (alreadyExistingRecords.length) {
    return alreadyExistingRecords.map(record => record.id);
  }

  const createdRecords = await prisma.seating.createManyAndReturn({
    data: Array.from({ length: 30 }).map((_, index) => ({
      name: `Bàn ${index + 1}`
    })),
    select: {
      id: true
    }
  });

  return createdRecords.map(record => record.id);
}
