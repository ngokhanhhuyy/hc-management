import { createContainer, asClass, asValue, InjectionMode, AwilixContainer } from "awilix";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "#/prisma/client";
import { type IPasswordHasher, BcryptPasswordHasher } from "../services/common/authentication/passwordHasher";
import { type IDatabaseErrorHandler, PrismaDatabaseErrorHandler } from "../services/common/errors";
import { type IClock, Clock } from "../services/common/time";

export interface ISingletonContainer {
  prisma: PrismaClient;
  passwordHasher: IPasswordHasher;
  databaseErrorHandler: IDatabaseErrorHandler;
  clock: IClock;
}

export const rootServiceContainer: AwilixContainer<ISingletonContainer> = createContainer<ISingletonContainer>({
  injectionMode: InjectionMode.PROXY,
});

rootServiceContainer.register({
  prisma: asValue(initializePrisma()),
  passwordHasher: asClass(BcryptPasswordHasher).singleton(),
  databaseErrorHandler: asClass(PrismaDatabaseErrorHandler).singleton(),
  clock: asClass(Clock).singleton()
} satisfies DependecyRegistrations<ISingletonContainer>);


function initializePrisma(): PrismaClient {
  const connectionString = `${process.env.DATABASE_URL}`;
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}
