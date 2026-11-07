import { useBeforeLeave } from "@solidjs/router";
import { api, type OrderDetailResponseDto } from "#/api";
import { createOrderItemUpsertModel, type OrderUpsertModel, type MenuItemBasicModel } from "#/models";
import { joinClassName } from "#/helpers";

// Child components.
import MenuItemListPanel from "./menuItemPanel/MenuItemListPanel";
import OrderUpsertPanel, { type LoadingState } from "./orderUpsertPanel/OrderUpsertPanel";

// Props.
type OrderUpsertPageContent = {
  model: OrderUpsertModel;
};

// Components.
export default function OrderUpsertPage(props: OrderUpsertPageContent): JSXElement {
  // States.
  const [model, setModel] = createSignal<OrderUpsertModel>(props.model);
  const [loadingState, setLoadingState] = createSignal<LoadingState>(null);
  const [renderingKey, setRenderingKey] = createSignal<number>(0);
  let currentTimeout: { id: number, callback: () => Promise<any> } | null = (null);

  // Callbacks.
  function onMenuItemPicked(pickedMenuItem: MenuItemBasicModel): void {
    batch(() => {
      setModel(previous => ({
        ...previous,
        items: [...previous.items, createOrderItemUpsertModel(pickedMenuItem)]
      }));
      setRenderingKey(previous => previous + 1);
    });
  }

  function handleModelUpdated(updatedData: Partial<OrderUpsertModel>): void {
    batch(() => {
      setModel(previous => ({ ...previous, ...updatedData }));
      setRenderingKey(previous => previous + 1);
    });
  }

  async function syncDataAsync(): Promise<void> {
    const currentModel = model();
    let responseDto: OrderDetailResponseDto;
    setLoadingState("syncing");
    if (currentModel.items.length) {
      if (!currentModel.id) {
        responseDto = await api.order.createAsync(currentModel.toRequestDto());
      } else {
        responseDto = await api.order.updateAsync(currentModel.id, currentModel.toRequestDto());
      }

      setModel(previous => previous.mapIdsFromResponseDto(responseDto));
    } else if (currentModel.id) {
      await api.order.deleteAsync(currentModel.id);
      setModel(previous => ({ ...previous, id: null }));
    }
  };

  function syncDataWithDelayAndDebounce(): void {
    if (currentTimeout) {
      window.clearTimeout(currentTimeout.id);
    }

    async function timeoutCallback(): Promise<void> {
      try {
        await Promise.all([
          syncDataAsync(),
          new Promise<void>(resolve => setTimeout(resolve, 300))
        ]);
      } finally {
        setLoadingState(null);
      }

      currentTimeout = null;
    }

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
    const id = model().id;
    if (id != null) {
      await api.order.finishAsync(id);
    }

    setLoadingState("finished");
  }

  // Life cycle and effect.
  onCleanup(clearDataAndSyncImmediately);

  createEffect(on(() => renderingKey(), () => {
    if (renderingKey() == 0) {
      return;
    }

    syncDataWithDelayAndDebounce();
  }));

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
      loadingState() === "syncing" && "opacity-50 pe-none"
    )}>
      <MenuItemListPanel
        pickedOrderItems={model().items}
        onPicked={onMenuItemPicked}
        disabled={loadingState() === "finished"}
      />

      <OrderUpsertPanel
        model={model()}
        loadingState={loadingState()}
        onModelUpdated={handleModelUpdated}
        onFinished={handleFinishedAsync}
        onSyncingRequestingAsync={clearDataAndSyncImmediately}
      />
    </div>
  );
}
