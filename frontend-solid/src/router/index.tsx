import { lazy, type JSX } from "solid-js";
import { Router, Route, Navigate } from "@solidjs/router";
import { getDashboardRoutePath, getSeatingListRoutePath } from "#/helpers";

// Pages.
import RootLayout from "#/components/layouts/RootLayout";
import MainPageLayout from "#/components/layouts/MainPageLayout";
import SignInPage from "#/pages/authentication/SignInPage";
const SeatingListPage = lazy(() => import("#/pages/dashboard/seatingList/SeatingListPage"));
const OrderUpsertPage = lazy(() => import("#/pages/dashboard/orderUpsert/OrderUpsertPage"));
const MenuCategoryEditorPage = lazy(() => import("#/pages/editors/menuCategories/MenuCategoryEditorPage"));
const MenuCategoryUpsertPanel = lazy(() => import("#/pages/editors/menuCategories/MenuCategoryUpsertPanel"));
const SeatingCategoryEditorPage = lazy(() => import("#/pages/editors/seatings/SeatingEditorPage"));
const SeatingUpsertPanel = lazy(() => import("#/pages/editors/seatings/SeatingUpsertPanel"));

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

        <Route path="/chinh-sua">
          <Route path="/ban-an" component={SeatingCategoryEditorPage}>
            <Route path="/" />
            <Route path="/tao-moi" component={SeatingUpsertPanel} />
            <Route path="/:id" component={SeatingUpsertPanel} />
          </Route>

          <Route path="/phan-loai" component={MenuCategoryEditorPage}>
            <Route path="/" />
            <Route path="/tao-moi" component={MenuCategoryUpsertPanel} />
            <Route path="/:id" component={MenuCategoryUpsertPanel} />
          </Route>
        </Route>
      </Route>

      <Route path="*404" component={() => <Navigate href={getDashboardRoutePath()} />} />
    </Router>
  );
}
