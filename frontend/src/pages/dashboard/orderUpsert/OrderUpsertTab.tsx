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
  const [renderingKey, setRenderingKey] = useState<number>(0);
  const id = useRef<number | null>(null);
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
      if (!id.current) {
        responseDto = await api.order.createAsync(model.toRequestDto());
        id.current = responseDto.id;
      } else {
        responseDto = await api.order.updateAsync(id.current, model.toRequestDto());
      }

      setModel(m => m.mapFromResponseDto(responseDto));
    } else if (id.current) {
      await api.order.deleteAsync(id.current);
      id.current = null;
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
    const loadAsync = async () => {
      if (props.seating.activeOrder) {
        const responseDto = await api.order.getDetailAsync(props.seating.activeOrder.id);
        setModel(m => m.mapFromResponseDto(responseDto));
        id.current = responseDto.id;
      }
    };

    loadAsync().finally(() => setLoadingState(null));
  }, []);

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
        loadingState={loadingState}
      />
    </div>
  );
}
