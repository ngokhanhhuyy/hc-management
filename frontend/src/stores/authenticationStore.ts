import { create } from "zustand";
import { api, AuthenticationError, type UserDetailResponseDto } from "#/api";
import { createUserDetailModel, type UserDetailModel } from "#/models";

export type AuthenticationStore = {
  authenticatedUser: UserDetailModel | null;
  readonly isAuthenticated: boolean;
  readonly setAuthenticationUser: (user: UserDetailModel | UserDetailResponseDto | null) => void;
};

const initialAuthenticatedUser = await getAuthenticatedUserAsync();

export const useAuthenticationStore = create<AuthenticationStore>((set) => ({
  authenticatedUser: initialAuthenticatedUser,
  isAuthenticated: initialAuthenticatedUser != null,
  setAuthenticationUser: (user: UserDetailModel | UserDetailResponseDto | null): void => {
    set({
      authenticatedUser: user,
      isAuthenticated: user != null
    });
  },
}));

async function getAuthenticatedUserAsync(): Promise<UserDetailModel | null> {
  try {
    const responseDto = await api.authentication.getCallerDetailAsync();
    return createUserDetailModel(responseDto);
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return null;
    }

    throw error;
  }
}
