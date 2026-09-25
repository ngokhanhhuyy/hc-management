import { lazy } from "react";
import { Navigate, type RouteObject } from "react-router";
import { getSeatingEditorRoutePath } from "#/helpers";

// Components
const SeatingEditorPage = lazy(() => import("#/pages/editors/seatings/SeatingEditorPage"));
const SeatingUpsertPanel = lazy(() => import("#/pages/editors/seatings/SeatingUpsertPanel"));

export const editorRoutes: RouteObject = {
  path: "editors",
  handle: {
    pageTitle: "Chỉnh sửa"
  },
  children: [
    {
      index: true,
      element: <Navigate to={getSeatingEditorRoutePath()} replace />
    },
    {
      path: "seatings",
      Component: SeatingEditorPage,
      loader: async () => {
        const module = await import("#/pages/editors/seatings/dataLoader");
        return await module.loadSeatingListDataAsync();
      },
      handle: {
        breadcrumbTitle: "Danh sách bàn ăn"
      },
      children: [
        {
          path: ":id",
          Component: SeatingUpsertPanel,
          loader: async ({ params }) => {
            const module = await import("#/pages/editors/seatings/dataLoader");
            const { id } = params;
            const parsedId = parseInt(id!);
            return await module.loadSeatingUpsertDataAsync(parsedId);
          },
        },
        {
          path: "create",
          Component: SeatingUpsertPanel,
          loader: async () => {
            const module = await import("#/pages/editors/seatings/dataLoader");
            return await module.loadSeatingUpsertDataAsync();
          },
        },
      ]
    }
  ]
};
