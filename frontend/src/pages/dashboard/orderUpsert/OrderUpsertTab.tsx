import React, { useState, useEffect, useTransition } from "react";
import { api } from "#/api";
import {
  createMenuItemListModel,
  createOrderUpsertModel,
  type OrderBasicModel,
  type OrderUpsertModel,
  type SeatingBasicModel,
  type MenuItemBasicModel,
  type MenuCategoryBasicModel,
  type MenuItemListModel,
} from "#/models";

// Child components.
import MenuItemListPanel from "./menuItemPanel/MenuItemListPanel";
import OrderUpsertPanel from "./orderUpsertPanel/OrderUpsertPanel";

// Props.
type OrderUpsertTabProps = {
  seating: SeatingBasicModel;
};

// Components.
export default function OrderUpsertTab(props: OrderUpsertTabProps): React.ReactNode {
  return (
    <div className="grid 2xl:grid-cols-[5fr_1fr] xl:grid-cols-[4fr_1fr] lg:grid-cols-[3fr_1fr] p-0 h-full items-start">
      <MenuItemListPanel />

      <div className="flex flex-col gap-3 border-s border-black/15 h-full">
        <OrderUpsertPanel seating={props.seating} />
      </div>
    </div>
  );
}
