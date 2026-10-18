import { ref, computed, readonly } from 'vue';
import { defineStore } from 'pinia';
import { api, AuthenticationError } from '#/api';
import { SignInModel, UserDetailModel } from '#/models';
const initialAuthenticatedUser = await getAuthenticatedUserAsync();

export const useAuthenticationStore = defineStore('authenticationStore', () => {
  const authenticatedUser = ref(initialAuthenticatedUser);
  const isAuthenticated = computed(() => authenticatedUser.value != null);

  async function signInAsync(model: SignInModel): Promise<void> {
    await api.authentication.getAccessCookieAsync(model.toRequestDto());
    authenticatedUser.value = await getAuthenticatedUserAsync();
  }

  async function signOutAsync(): Promise<void> {
    try {
      authenticatedUser.value = null;
      await api.authentication.clearAccessCookieAsync();
    } catch (error) {
      if (error instanceof AuthenticationError) {
        return;
      }

      throw error;
    }
  }

  return {
    authenticatedUser: readonly(authenticatedUser),
    isAuthenticated: readonly(isAuthenticated),
    signInAsync,
    signOutAsync
  };
});

async function getAuthenticatedUserAsync(): Promise<UserDetailModel | null> {
  try {
    const responseDto = await api.authentication.getCallerDetailAsync();
    return new UserDetailModel(responseDto);
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return null;
    }

    throw error;
  }
}
