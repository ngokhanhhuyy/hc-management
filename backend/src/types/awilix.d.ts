import type { AwilixContainer } from "awilix";

declare global {
  type DependencyResolver<TContainer extends object, TService> = {
    resolve(container: AwilixContainer<TContainer>): TService;
  };

  type DependecyRegistrations<TContainer extends object> = {
    [K in keyof TContainer]: DependencyResolver<TContainer, TContainer[K]>;
  };
}
