
import { api, AuthenticationError, type UserDetailResponseDto } from "#/api";
import { SignInModel, UserDetailModel } from "#/models";

export type AuthenticationStore = {
  readonly authenticatedUser: UserDetailModel | null;
  readonly isAuthenticated: boolean;
  readonly setAuthenticatedUser: (user: UserDetailModel | UserDetailResponseDto | null) => void;
  readonly signInAsync: (model: SignInModel) => Promise<void>;
  readonly signOutAsync: () => Promise<void>;
};

const Context = $createContext<AuthenticationStore>({
  authenticatedUser: null,
  isAuthenticated: false,
  setAuthenticatedUser: () => { },
  signInAsync: () => Promise.resolve(),
  signOutAsync: () => Promise.resolve()
});

export function useAuthenticationStore() {
  return $useContext(Context);
}

export function AuthenticationContextProvider(props: { children: JSXElement }): JSXElement {
  // States.
  let authenticatedUser = $state(initialAuthenticatedUser);
  const isAuthenticated = $memo(() => authenticatedUser != null);
  const payload: AuthenticationStore = {
    get authenticatedUser(): UserDetailModel | null {
      return authenticatedUser;
    },
    get isAuthenticated(): boolean {
      return isAuthenticated;
    },
    setAuthenticatedUser: (user: UserDetailModel | UserDetailResponseDto | null): void => {
      authenticatedUser = user;
    },
    signInAsync,
    signOutAsync,
  };

  // Callbacks.
  async function signInAsync(model: SignInModel): Promise<void> {
    await api.authentication.getAccessCookieAsync(model.toRequestDto());
    authenticatedUser = await getAuthenticatedUserAsync();
    console.log(authenticatedUser);
  }

  async function signOutAsync(): Promise<void> {
    try {
      authenticatedUser = null;
      await api.authentication.clearAccessCookieAsync();
    } catch (error) {
      if (error instanceof AuthenticationError) {
        return;
      }

      throw error;
    }
  }

  return (
    <Context.Provider value={payload}>
      {props.children}
    </Context.Provider>
  );
}

const initialAuthenticatedUser = await getAuthenticatedUserAsync();

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
