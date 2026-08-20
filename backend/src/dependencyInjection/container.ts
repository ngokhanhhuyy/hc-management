import { Context } from "hono";
import { createContainer, asClass, asValue, InjectionMode, AwilixContainer } from "awilix";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "#/prisma/client";
import { type IPasswordHasher, BcryptPasswordHasher } from "../services/common/authentication/passwordHasher";

export interface ISingletonContainer {
  prisma: PrismaClient;
  passwordHasher: IPasswordHasher;
}

export const rootServiceContainer: AwilixContainer<ISingletonContainer> = createContainer<ISingletonContainer>({
  injectionMode: InjectionMode.PROXY,
});

rootServiceContainer.register({
  prisma: asValue(initializePrisma()),
  passwordHasher: asClass(BcryptPasswordHasher).singleton(),
} satisfies DependecyRegistrations<ISingletonContainer>);


function initializePrisma(): PrismaClient {
  const connectionString = `${process.env.DATABASE_URL}`;
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}
