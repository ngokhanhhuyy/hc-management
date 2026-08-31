import React, { useState, useEffect, startTransition } from "react";
import { api } from "#/api";
import { AuthenticationError } from "@hc-management/shared/errors";
import "#/assets/css/style.css";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-icons/font/bootstrap-icons.css";

// Child components.
import SignInPage from "#/pages/authentication/SignInPage";
import DashboardPage from "#/pages/dashboard/Dashboard";

// Components.
export default function App(): React.ReactNode {
  // States.
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  // Callbacks.
  function onAuthenticated(): void {
    setIsAuthenticated(true);
  }

  async function onSignOutAsync(): Promise<void> {
    await api.authentication.clearAccessCookieAsync();
    window.location.reload();
  }

  // Effect.
  useEffect(() => {
    startTransition(async () => {
      try {
        await api.authentication.checkStatusAsync();
        setIsAuthenticated(true);
      } catch (error) {
        if (error instanceof AuthenticationError) {
          setIsAuthenticated(false);
          return;
        }

        throw error;
      }
    });
  }, []);

  // Template.
  if (isAuthenticated === null) {
    return null;
  }

  if (!isAuthenticated) {
    return (
      <SignInPage onSignedIn={onAuthenticated} />
    );
  }

  return <DashboardPage />;
}
