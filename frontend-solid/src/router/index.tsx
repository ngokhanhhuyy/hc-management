import { lazy, type JSX } from "solid-js";
import { Router, Route, Navigate } from "@solidjs/router";
import { getSeatingListRoutePath } from "#/helpers";

// Pages.
import RootLayout from "#/components/layouts/RootLayout";
import MainPageLayout from "#/components/layouts/MainPageLayout";
import SignInPage from "#/pages/authentication/SignInPage";
const SeatingListPage = lazy(() => import("#/pages/dashboard/seatingList/SeatingListPage"));
const OrderUpsertPage = lazy(() => import("#/pages/dashboard/orderUpsert/OrderUpsertPage"));

// Components.
export function Routes(): JSX.Element {
  // Templates.
  return (
    <Router root={RootLayout}>
      <Route path="/dang-nhap" component={SignInPage} />
      <Route path="/" component={MainPageLayout}>
        <Route path="/" component={() => <Navigate href={getSeatingListRoutePath()} />} />
        <Route path="/bang-dieu-khien">
          <Route path="/" component={() => <Navigate href={getSeatingListRoutePath()} />} />
          <Route path="/ban-an" component={SeatingListPage} />
          <Route path="/goi-mon/:id" component={OrderUpsertPage} />
        </Route>
      </Route>
    </Router>
  );
}
