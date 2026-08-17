import { createContainer, asClass, InjectionMode, AwilixContainer } from "awilix";
import { PrismaClient } from "../../prisma/generated/client";
import { type IPasswordHasher, BcryptPasswordHasher } from "../services/common/authentication/passwordHasher";

export interface IAppContainer {
  prisma: PrismaClient;
  passwordHasher: IPasswordHasher;
}

type Resolver<T> = { resolve(container: AwilixContainer<IAppContainer>): T; };
type AppContainerRegistrations = {
  [K in keyof IAppContainer]: Resolver<IAppContainer[K]>;
};

export const container: AwilixContainer<IAppContainer> = createContainer<IAppContainer>({
  injectionMode: InjectionMode.PROXY,
});

container.register({
  prisma: asClass(PrismaClient).scoped(),
  passwordHasher: asClass(BcryptPasswordHasher)
} satisfies AppContainerRegistrations);
