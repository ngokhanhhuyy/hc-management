import { createContainer, asClass, asValue, InjectionMode, AwilixContainer } from "awilix";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "#/services/database/client";
import { type IPasswordHasher, BcryptPasswordHasher } from "#/services/common/authentication/passwordHasher";
import {
  type IUserDtoFactory,
  type IMenuCategoryDtoFactory,
  type IMenuItemDtoFactory,
  UserDtoFactory,
  MenuCategoryDtoFactory,
  MenuItemDtoFactory
} from "#/services/common/dtos";
import { type IDatabaseErrorHandler, PrismaDatabaseErrorHandler } from "#/services/common/errors";
import { type IClock, Clock } from "#/services/common/time";

export interface ISingletonContainer {
  prisma: PrismaClient;
  passwordHasher: IPasswordHasher;
  databaseErrorHandler: IDatabaseErrorHandler;
  userDtoFactory: IUserDtoFactory;
  menuItemDtoFactory: IMenuItemDtoFactory;
  menuCategoryDtoFactory: IMenuCategoryDtoFactory;
  clock: IClock;
}

export const rootServiceContainer: AwilixContainer<ISingletonContainer> = createContainer<ISingletonContainer>({
  injectionMode: InjectionMode.PROXY,
});

rootServiceContainer.register({
  prisma: asValue(initializePrisma()),
  passwordHasher: asClass(BcryptPasswordHasher).singleton(),
  databaseErrorHandler: asClass(PrismaDatabaseErrorHandler).singleton(),
  userDtoFactory: asClass(UserDtoFactory),
  menuItemDtoFactory: asClass(MenuItemDtoFactory),
  menuCategoryDtoFactory: asClass(MenuCategoryDtoFactory),
  clock: asClass(Clock).singleton()
} satisfies DependecyRegistrations<ISingletonContainer>);


function initializePrisma(): PrismaClient {
  const connectionString = `${process.env.DATABASE_URL}`;
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}
