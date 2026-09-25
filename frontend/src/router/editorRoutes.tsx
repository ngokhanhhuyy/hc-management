import { lazy } from "react";
import { Navigate, type RouteObject } from "react-router";
import { getSeatingEditorRoutePath } from "#/helpers";

// Components
const SeatingEditorPage = lazy(() => import("#/pages/editors/seatings/SeatingEditorPage"));
const SeatingUpsertPanel = lazy(() => import("#/pages/editors/seatings/SeatingUpsertPanel"));
const MenuItemEditorPage = lazy(() => import("#/pages/editors/menuItems/MenuItemEditorPage"));
const MenuItemUpsertPanel = lazy(() => import("#/pages/editors/menuItems/MenuItemUpsertPanel"));

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
    },
    {
      path: "menu-items",
      Component: MenuItemEditorPage,
      loader: async () => {
        const module = await import("#/pages/editors/menuItems/dataLoader");
        return await module.loadMenuItemListDataAsync();
      },
      handle: {
        breadcrumbTitle: "Danh sách món ăn/nước uống"
      },
      children: [
        {
          path: ":id",
          Component: MenuItemUpsertPanel,
          loader: async ({ params }) => {
            const module = await import("#/pages/editors/menuItems/dataLoader");
            const { id } = params;
            const parsedId = parseInt(id!);
            return await module.loadMenuItemUpsertDataAsync(parsedId);
          },
        },
        {
          path: "create",
          Component: MenuItemUpsertPanel,
          loader: async () => {
            const module = await import("#/pages/editors/menuItems/dataLoader");
            return await module.loadMenuItemUpsertDataAsync();
          },
        },
      ]
    }
  ]
};
