import React, { useState, useRef, useMemo, useEffect } from "react";
import { api } from "#/api";
import {
  createOrderUpsertModel,
  createOrderItemUpsertModel,
  type MenuItemBasicModel,
  type SeatingBasicModel,
  type OrderUpsertModel,
  type OrderItemUpsertModel
} from "#/models";
import type { OrderDetailResponseDto } from "@hc-management/shared/dtos";
// import { joinClassName } from "#/helpers";

// Child components.
import MenuItemListPanel, { type MenuItemWithPickedQuantity } from "./menuItemPanel/MenuItemListPanel";
import OrderUpsertPanel, { type LoadingState } from "./orderUpsertPanel/OrderUpsertPanel";

// Props.
type OrderUpsertTabProps = {
  seating: SeatingBasicModel;
};

// Components.
export default function OrderUpsertTab(props: OrderUpsertTabProps): React.ReactNode {
  // States.
  const [model, setModel] = useState<OrderUpsertModel>(() => createOrderUpsertModel(props.seating));
  const [loadingState, setLoadingState] = useState<LoadingState>("initialLoading");
  const id = useRef<number | null>(null);
  const syncingTimeout = useRef<number | null>(null);
  
  // Computed.
  const pickedMenuItems = useMemo<MenuItemWithPickedQuantity[]>(() => {
    return model.items
      .filter(oi => oi.quantity > 0)
      .map(oi => ({
        item: oi.menuItem,
        quantity: oi.quantity
      }));
  }, [model.items]);

  // Callbacks.
  function onMenuItemPicked(pickedMenuItem: MenuItemBasicModel): void {
    setModel(m => {
      let isPickedMenuItemAlreadyPicked = false;
      const newItems: OrderItemUpsertModel[] = m.items.map(i => {
        if (i.menuItem.id === pickedMenuItem.id) {
          isPickedMenuItemAlreadyPicked = true;
          return { ...i, quantity: i.quantity + 1 };
        }

        return i;
      });

      if (!isPickedMenuItemAlreadyPicked) {
        newItems.push(createOrderItemUpsertModel(pickedMenuItem));
      }

      return { ...m, items: newItems };
    });
  }

  async function syncDataAsync(): Promise<void> {
    const timeout = setTimeout(() => { }, 0);
    let responseDto: OrderDetailResponseDto;
    setLoadingState("syncing");
    if (!id.current) {
      responseDto = await api.order.createAsync(model.toRequestDto());
      id.current = responseDto.id;
    } else {
      responseDto = await api.order.updateAsync(id.current, model.toRequestDto());
    }

    setModel(m => m.mapFromResponseDto(responseDto));
  };

  // Effect.
  useEffect(() => {
    const loadAsync = async () => {
      if (props.seating.activeOrder) {
        const responseDto = await api.order.getDetailAsync(props.seating.activeOrder.id);
        setModel(m => m.mapFromResponseDto(responseDto));
        id.current = responseDto.id;
      }
    };

    loadAsync().finally(() => setLoadingState(null));
  }, []);

  // Templates.
  return (
    <div className="grid grid-cols-[1fr_320px] gap-3 h-full">
      <MenuItemListPanel pickedItems={pickedMenuItems} onPicked={onMenuItemPicked} />
      <OrderUpsertPanel
        model={model}
        onModelUpdated={updatedData => setModel(m => ({ ...m, ...updatedData }))}
        loadingState={loadingState}
      />
    </div>
  );
}
