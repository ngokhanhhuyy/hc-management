import { api, AuthenticationError, type UserDetailResponseDto } from "#/api";
import { createUserDetailModel, type SignInModel, type UserDetailModel } from "#/models";

export type AuthenticationStore = {
  readonly authenticatedUser: Accessor<UserDetailModel | null>;
  readonly isAuthenticated: Accessor<boolean>;
  readonly setAuthenticatedUser: (user: UserDetailModel | UserDetailResponseDto | null) => void;
  readonly signInAsync: (model: SignInModel) => Promise<void>;
  readonly signOutAsync: () => Promise<void>;
};

const Context = createContext<AuthenticationStore>({
  authenticatedUser: () => null,
  isAuthenticated: () => false,
  setAuthenticatedUser: () => { },
  signInAsync: () => Promise.resolve(),
  signOutAsync: () => Promise.resolve()
});

export function useAuthenticationStore() {
  return useContext(Context);
}

export function AuthenticationContextProvider(props: { children: JSXElement }): JSXElement {
  // States.
  const [authenticatedUser, setAuthenticatedUser] = createSignal(initialAuthenticatedUser);
  const isAuthenticated = createMemo(() => authenticatedUser() != null);
  const payload: AuthenticationStore = {
    authenticatedUser,
    isAuthenticated,
    setAuthenticatedUser: (user: UserDetailModel | UserDetailResponseDto | null): void => {
      setAuthenticatedUser(user);
    },
    signInAsync,
    signOutAsync,
  };

  // Callbacks.
  async function signInAsync(model: SignInModel): Promise<void> {
    await api.authentication.getAccessCookieAsync(model.toRequestDto());
    setAuthenticatedUser(await getAuthenticatedUserAsync());
  }

  async function signOutAsync(): Promise<void> {
    try {
      setAuthenticatedUser(null);
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
    return createUserDetailModel(responseDto);
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return null;
    }

    throw error;
  }
}
