import { lazy } from "react";
import { Navigate, type RouteObject } from "react-router";
import { getSeatingListRoutePath } from "#/helpers";

const DashboardLayout = lazy(() => import("#/pages/dashboard/DashboardLayout"));
const SeatingListPage = lazy(() => import("#/pages/dashboard/seatingList/SeatingListPage"));
const OrderUpsertPage = lazy(() => import("#/pages/dashboard/orderUpsert/OrderUpsertPage"));

export const dashboardRoutes: RouteObject = {
  path: "dashboard",
  Component: DashboardLayout,
  handle: {
    pageTitle: "Bảng điều khiển"
  },
  children: [
    {
      index: true,
      element: <Navigate to={getSeatingListRoutePath()} replace />
    },
    {
      path: "seatings",
      children: [
        {
          index: true,
          Component: SeatingListPage,
          loader: async () => {
            const module = await import("#/pages/dashboard/seatingList/dataLoader");
            return await module.loadDataAsync();
          },
          handle: {
            breadcrumbTitle: "Sơ đồ bàn ăn"
          }
        },
        {
          path: ":id",
          Component: OrderUpsertPage,
          loader: async ({ params }) => {
            const module = await import("#/pages/dashboard/orderUpsert/dataLoader");
            return await module.loadDataAsync(parseInt(params.id ?? ""));
          },
          handle: {
            breadcrumbTitle: "Gọi món"
          }
        }
      ]
    }
  ]
};
