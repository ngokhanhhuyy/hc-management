import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/client";

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

mainAsync();

async function mainAsync(): Promise<void> {
  const createdMenuItemCategoryIds = await seedMenuItemCategoriesAsync();
  await seedMenuItemsAsync(createdMenuItemCategoryIds);
  await seedSeatingAsync();
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

async function seedMenuItemsAsync(categoryIds: number[]): Promise<number[]> {
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

  const getRandomCategoryId = () => categoryIds[Math.floor(Math.random() * categoryIds.length)]

  const createdRecords = await prisma.menuItem.createManyAndReturn({
    data: menuItemNames.map(name => ({
      name,
      categoryId: getRandomCategoryId()
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
    data: Array.from({ length: 10 }).map((_, index) => ({
      name: `Bàn ${index + 1}`
    })),
    select: {
      id: true
    }
  })

  return createdRecords.map(record => record.id);
}
