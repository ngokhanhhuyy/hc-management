import { Navigate } from "@solidjs/router";
import { AuthenticationError, NotFoundError } from "#/api";
import { getSignInRoutePath, getDashboardRoutePath } from "#/helpers";
import { AuthenticationContextProvider } from "#/stores";

// Props.
type RootLayoutProps = {
  children?: JSXElement;
};

// Components.
export default function RootLayout(props: RootLayoutProps): JSXElement {
  // Callbacks.
  const computeFallbackElement = (error: any) => {
    if (error instanceof AuthenticationError) {
      return <Navigate href={getSignInRoutePath()} />;
    }

    if (error instanceof NotFoundError) {
      return <Navigate href={getDashboardRoutePath()} />;
    };

    throw error;
  };

  // Template.
  return (
    <Suspense>
      <AuthenticationContextProvider>
        <ErrorBoundary fallback={(error) => computeFallbackElement(error)}>
          <main class="w-full h-full">
            {props.children}
          </main>
      </ErrorBoundary>
      </AuthenticationContextProvider>
    </Suspense>
  );
}
