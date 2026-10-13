import React, { useState, useRef, useEffect } from "react";
import { useLoaderData, useBlocker, type BlockerFunction } from "react-router";
import { api, type OrderDetailResponseDto } from "#/api";
import {
  createOrderItemUpsertModel,
  type MenuItemBasicModel,
  type OrderUpsertModel,
} from "#/models";
import { joinClassName } from "#/helpers";

// Child components.
import type { DataLoadedResult } from "./dataLoader";
import MenuItemListPanel from "./menuItemPanel/MenuItemListPanel";
import OrderUpsertPanel, { type LoadingState } from "./orderUpsertPanel/OrderUpsertPanel";

// Components.
export default function OrderUpsertPage(): React.ReactNode {
  // Dependencies.
  const initialLoadedModels = useLoaderData<DataLoadedResult>();

  // States.
  const [model, setModel] = useState<OrderUpsertModel>(initialLoadedModels.orderUpsertModel);
  const [loadingState, setLoadingState] = useState<LoadingState>(null);
  const [renderingKey, setRenderingKey] = useState<number>(0);
  const currentTimeout = useRef<{ id: number, callback: () => Promise<any> } | null>(null);
  const currentRequestId = useRef<string | number>(null);
  
  // Blocker.
  const blocker = useBlocker(() => currentTimeout.current != null);

  // Callbacks.
  function onMenuItemPicked(pickedMenuItem: MenuItemBasicModel): void {
    setModel(m => ({ ...m, items: [...m.items, createOrderItemUpsertModel(pickedMenuItem)] }));
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
    if (currentTimeout.current) {
      window.clearTimeout(currentTimeout.current.id);
    }

    const timeoutCallback = async () => {
      try {
        await Promise.all([
          syncDataAsync(),
          new Promise<void>(resolve => setTimeout(resolve, 300))
        ]);
      } finally {
        setLoadingState(null);
      }

      currentTimeout.current = null;
    };

    const timeoutId = window.setTimeout(timeoutCallback, 10_000);

    currentTimeout.current = {
      id: timeoutId,
      callback: timeoutCallback
    };
  }

  async function clearDataAndSyncImmediately(): Promise<void> {
    if (currentTimeout.current) {
      window.clearTimeout(currentTimeout.current.id);
      await currentTimeout.current.callback();
      currentTimeout.current = null;
    }
  }

  async function handleFinishedAsync(): Promise<void> {
    if (model.id != null) {
      await api.order.finishAsync(model.id);
    }

    setLoadingState("finished");
  }

  // Effect.
  useEffect(() => {
    if (renderingKey == 0) {
      return;
    }

    syncDataWithDelayAndDebounce();
  }, [renderingKey]);

  useEffect(() => {
    return () => {
      clearDataAndSyncImmediately();
    };
  }, []);

  useEffect(() => {
    if (blocker.state === "blocked") {
      clearDataAndSyncImmediately().then(() => blocker.proceed?.());
    }
  }, [blocker.state]);

  // Templates.
  return (
    <div className={joinClassName(
      "grid grid-cols-[1fr_320px] gap-3 h-full transition-opacity",
      loadingState === "syncing" && "opacity-50 pe-none"
    )}>
      <MenuItemListPanel
        pickedOrderItems={model.items}
        onPicked={onMenuItemPicked}
        disabled={loadingState === "finished"}
      />

      <OrderUpsertPanel
        model={model}
        loadingState={loadingState}
        onModelUpdated={updatedData => {
          setModel(m => ({ ...m, ...updatedData }));
          setRenderingKey(key => key + 1);
        }}
        onFinished={handleFinishedAsync}
        onSyncingRequestingAsync={clearDataAndSyncImmediately}
      />
    </div>
  );
}
