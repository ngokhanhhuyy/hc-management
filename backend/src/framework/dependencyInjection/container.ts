import { createContainer, asClass, asValue, InjectionMode, AwilixContainer } from "awilix";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "#/core/database/client";
import { type IPasswordHasher, BcryptPasswordHasher } from "#/core/common/authentication/passwordHasher";
import { type IDtoFactory, DtoFactory } from "#/core/common/dtos";
import {
  PrismaDatabaseErrorHandler,
  ErrorFactory,
  type IDatabaseErrorHandler,
  type IErrorFactory
} from "#/core/common/errors";
import { type IClock, Clock } from "#/core/common/time";

export interface ISingletonContainer {
  prisma: PrismaClient;
  passwordHasher: IPasswordHasher;
  databaseErrorHandler: IDatabaseErrorHandler;
  dtoFactory: IDtoFactory;
  errorFactory: IErrorFactory;
  clock: IClock;
}

export const rootServiceContainer: AwilixContainer<ISingletonContainer> = createContainer<ISingletonContainer>({
  injectionMode: InjectionMode.PROXY,
});

rootServiceContainer.register({
  prisma: asValue(initializePrisma()),
  passwordHasher: asClass(BcryptPasswordHasher).singleton(),
  databaseErrorHandler: asClass(PrismaDatabaseErrorHandler).singleton(),
  dtoFactory: asClass(DtoFactory),
  errorFactory: asClass(ErrorFactory),
  clock: asClass(Clock).singleton()
} satisfies DependecyRegistrations<ISingletonContainer>);


function initializePrisma(): PrismaClient {
  const connectionString = `${process.env.DATABASE_URL}`;
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}
