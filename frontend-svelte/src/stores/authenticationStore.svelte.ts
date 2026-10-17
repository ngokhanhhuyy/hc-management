import { api, AuthenticationError, type UserDetailResponseDto } from "#/api";
import { UserDetailModel } from "#/models";

class AuthenticationStore {
  private _authenticatedUser: UserDetailModel | null;
  private _isAuthenticated: boolean;

  public constructor(initialAuthenticatedUser: UserDetailModel | null) {
    this._authenticatedUser = $state(initialAuthenticatedUser);
    this._isAuthenticated = $state(initialAuthenticatedUser != null);
  }

  public get authenticatedUser(): UserDetailModel | null {
    return this._authenticatedUser;
  }

  public get isAuthenticated(): boolean {
    return this._isAuthenticated;
  }

  public setAuthenticatedUser(user: UserDetailModel | UserDetailResponseDto | null): void {
    this._authenticatedUser = user;
    this._isAuthenticated = user != null;
  }
}

const initialAuthenticatedUser = await getAuthenticatedUserAsync();
const authenticationStore = new AuthenticationStore(initialAuthenticatedUser);

async function getAuthenticatedUserAsync(): Promise<UserDetailModel | null> {
  try {
    await api.authentication.checkAuthenticationStatusAsync();
    const responseDto = await api.authentication.getCallerDetailAsync();
    return new UserDetailModel(responseDto);
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return null;
    }

    throw error;
  }
}

export { authenticationStore, type AuthenticationStore };
