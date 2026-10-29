import { useNavigate, Navigate } from "@solidjs/router";
import { api, AuthenticationError } from "#/api";
import { useAuthenticationStore } from "#/stores/authenticationStore";
import { getSignInRoutePath } from "#/helpers";
import TopBar from "./TopBar";
import NavigationMenu from "./NavigationMenu";

// Props.
type MainPageLayoutProps = {
  children?: JSXElement;
};

// Components.
export default function MainPageLayout(props: MainPageLayoutProps): JSXElement {
  // Dependencies.
  const authenticationStore = useAuthenticationStore();
  const navigate = useNavigate();

  // Callbacks.
  const computeFallbackElement = (error: any) => {
    if (error instanceof AuthenticationError) {
      return <Navigate href="/dang-nhap" />;
    }
  };

  // Life cycle.
  $effect(() => {
    if (!authenticationStore.isAuthenticated) {
      api.authentication
        .clearAccessCookieAsync()
        .catch()
        .finally(() => navigate(getSignInRoutePath(), { replace: true }));
    }
  });

  // Template.
  return (
    <ErrorBoundary fallback={(error) => computeFallbackElement(error)}>
      {authenticationStore.isAuthenticated.toString()}
      <Show when={authenticationStore.isAuthenticated} fallback={<Navigate href={getSignInRoutePath()} />}>
        <TopBar />
        <div class="hidden lg:grid grid-cols-[200px_1fr] max-w-350 w-full mx-auto gap-3 p-3 mt-(--topbar-height) h-fit">
          <NavigationMenu />
          {props.children}
        </div>

        <div class="flex flex-col lg:hidden justify-center items-center size-full opacity-30">
          <span class="text-2xl">Ứng dụng không hỗ trợ kích thước màn hình này</span>
          <span class="text-lg">Vui lòng sử dụng màn hình có kích thước lớn hơn</span>
        </div>
      </Show>
    </ErrorBoundary>
  );
}
