import { create } from "zustand";
import { api } from "#/api";
import { AuthenticationError } from "@hc-management/shared/errors";

export type AuthenticationStore = {
  isAuthenticated: boolean;
  readonly setIsAuthenticated: (authenticated: boolean) => void;
};

const initialIsAuthenticated = await isAuthenticatedAsync();

export const useAuthenticationStore = create<AuthenticationStore>((set) => ({
  isAuthenticated: initialIsAuthenticated,
  setIsAuthenticated: (authenticated: boolean): void => {
    set({ isAuthenticated: authenticated });
  },
}));

async function isAuthenticatedAsync(): Promise<boolean> {
  try {
    await api.authentication.checkStatusAsync();
    return true;
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return false;
    }

    throw error;
  }
}
