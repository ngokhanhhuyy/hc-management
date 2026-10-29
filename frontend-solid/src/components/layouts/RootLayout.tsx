import { Suspense } from "solid-js";
import { AuthenticationContextProvider } from "#/stores";

// Props.
type RootLayoutProps = {
  children?: JSXElement;
};

// Components.
export default function RootLayout(props: RootLayoutProps): JSXElement {
  // Template.
  return (
    <Suspense>
      <AuthenticationContextProvider>
        <main class="w-full h-full">
          {props.children}
        </main>
      </AuthenticationContextProvider>
    </Suspense>
  );
}
