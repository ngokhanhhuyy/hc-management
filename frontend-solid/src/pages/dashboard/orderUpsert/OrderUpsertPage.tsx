import { useParams, useBeforeLeave } from "@solidjs/router";
import { api, type OrderDetailResponseDto } from "#/api";
import { OrderItemUpsertModel, OrderUpsertModel, type MenuItemBasicModel } from "#/models";
import { joinClassName } from "#/helpers";

// Child components.
import type { DataLoadedResult } from "./dataLoader";
import MenuItemListPanel from "./menuItemPanel/MenuItemListPanel";
import OrderUpsertPanel, { type LoadingState } from "./orderUpsertPanel/OrderUpsertPanel";

// Components.
export default function OrderUpsertPage(): JSXElement {
  // Dependencies.
  const params = useParams();

  // States.
  const model = $state<OrderUpsertModel | null>(null);
  let loadingState = $signal<LoadingState>(null);
  let renderingKey = $signal<number>(0);
  let currentTimeout: { id: number, callback: () => Promise<any> } | null = (null);
  let currentRequestId: string | number | null = null;

  // Callbacks.
  function onMenuItemPicked(pickedMenuItem: MenuItemBasicModel): void {
    $batch(() => {
      model.items.push(new OrderItemUpsertModel(pickedMenuItem));
      renderingKey += 1;
    });
  }

  async function syncDataAsync(): Promise<void> {
    const requestId = crypto.randomUUID();
    currentRequestId = requestId;

    let responseDto: OrderDetailResponseDto;
    loadingState = "syncing";
    if (model.items.length) {
      if (!model.id) {
        responseDto = await api.order.createAsync(model.toRequestDto());
      } else {
        responseDto = await api.order.updateAsync(model.id, model.toRequestDto());
      }

      model.mapFromResponseDto(responseDto);
    } else if (model.id) {
      await api.order.deleteAsync(model.id);
      $batch(() => {
        model.id = null;
        model.items = [];
      });
    }
  };

  function syncDataWithDelayAndDebounce(): void {
    if (currentTimeout) {
      window.clearTimeout(currentTimeout.id);
    }

    const timeoutCallback = async () => {
      try {
        await Promise.all([
          syncDataAsync(),
          new Promise<void>(resolve => setTimeout(resolve, 300))
        ]);
      } finally {
        loadingState = null;
      }

      currentTimeout = null;
    };

    const timeoutId = window.setTimeout(timeoutCallback, 10_000);

    currentTimeout = {
      id: timeoutId,
      callback: timeoutCallback
    };
  }

  async function clearDataAndSyncImmediately(): Promise<void> {
    if (currentTimeout) {
      window.clearTimeout(currentTimeout.id);
      await currentTimeout.callback();
      currentTimeout = null;
    }
  }

  async function handleFinishedAsync(): Promise<void> {
    if (model.id != null) {
      await api.order.finishAsync(model.id);
    }

    loadingState = "finished";
  }

  // Life cycle and effect.
  $mount(async () => {
    if 
  });

  $cleanup(clearDataAndSyncImmediately);

  $watch(() => renderingKey, () => {
    if (renderingKey == 0) {
      return;
    }

    syncDataWithDelayAndDebounce();
  });

  useBeforeLeave(async (event) => {
    if (currentTimeout != null) {
      event.preventDefault();
      await clearDataAndSyncImmediately();
      event.retry();
    }
  });

  // Templates.
  return (
    <div class={joinClassName(
      "grid grid-cols-[1fr_320px] gap-3 h-full transition-opacity",
      loadingState === "syncing" && "opacity-50 pe-none"
    )}>
      <MenuItemListPanel
        pickedOrderItems={model.items}
        onPicked={onMenuItemPicked}
        disabled={loadingState === "finished"}
      />

      {/* <OrderUpsertPanel
        model={model}
        loadingState={loadingState}
        onModelUpdated={updatedData => {
          setModel(m => ({ ...m, ...updatedData }));
          setRenderingKey(key => key + 1);
        }}
        onFinished={handleFinishedAsync}
        onSyncingRequestingAsync={clearDataAndSyncImmediately}
      /> */}
    </div>
  );
}
