import React, { useState, useRef, useMemo, useEffect } from "react";
import { useLoaderData } from "react-router";
import { api } from "#/api";
import {
  createOrderItemUpsertModel,
  type MenuItemBasicModel,
  type OrderUpsertModel,
  type OrderItemUpsertModel
} from "#/models";
import type { OrderDetailResponseDto } from "@hc-management/shared/dtos";
// import { joinClassName } from "#/helpers";

// Child components.
import type { DataLoadedResult } from "./dataLoader";
import MenuItemListPanel, { type MenuItemWithPickedQuantity } from "./menuItemPanel/MenuItemListPanel";
import OrderUpsertPanel, { type LoadingState } from "./orderUpsertPanel/OrderUpsertPanel";

// Components.
export default function OrderUpsertPage(): React.ReactNode {
  // Dependencies.
  const initialLoadedModels = useLoaderData<DataLoadedResult>();

  // States.
  const [model, setModel] = useState<OrderUpsertModel>(initialLoadedModels.orderUpsertModel);
  const [loadingState, setLoadingState] = useState<LoadingState>(null);
  const [renderingKey, setRenderingKey] = useState<number>(0);
  const currentTimeoutId = useRef<number | null>(null);
  const currentRequestId = useRef<string | number>(null);
  
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

    setRenderingKey(key => key + 1);
  }

  async function syncDataAsync(): Promise<void> {
    const requestId = crypto.randomUUID();
    currentRequestId.current = requestId;

    let responseDto: OrderDetailResponseDto;
    setLoadingState("syncing");
    if (model.items.length) {
      if (!model.id) {
        responseDto = await api.order.createAsync(model.toRequestDto());
      } else {
        responseDto = await api.order.updateAsync(model.id, model.toRequestDto());
      }

      setModel(m => m.mapFromResponseDto(responseDto));
    } else if (model.id) {
      await api.order.deleteAsync(model.id);
      setModel(m => ({ ...m, id: null }));
    }
  };

  function syncDataWithDelayAndDebounce(): void {
    if (currentTimeoutId.current) {
      window.clearTimeout(currentTimeoutId.current);
    }

    currentTimeoutId.current = window.setTimeout(async () => {
      try {
        await Promise.all([
          syncDataAsync(),
          new Promise<void>(resolve => setTimeout(resolve, 300))
        ]);
      } finally {
        setLoadingState(null);
      }

      currentTimeoutId.current = null;
    }, 500);
  }

  // Effect.
  useEffect(() => {
    if (renderingKey > 0) {
      syncDataWithDelayAndDebounce();
    }
  }, [renderingKey]);

  // Templates.
  return (
    <div className="grid grid-cols-[1fr_320px] gap-3">
      <MenuItemListPanel pickedItems={pickedMenuItems} onPicked={onMenuItemPicked} />
      <OrderUpsertPanel
        model={model}
        onModelUpdated={updatedData => {
          setModel(m => ({ ...m, ...updatedData }));
          setRenderingKey(key => key + 1);
        }}
      />
    </div>
  );
}
