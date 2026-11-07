import type { OrderUpsertModel, OrderItemUpsertModel } from "#/models";
import { joinClassName, getDisplayAmountText, calculateOrderAmount } from "#/helpers";

// Child components.
import BillModal from "./BillModal";
import OrderItem from "./OrderItem";

// Props.
export type LoadingState = "syncing" | "finishing" | "finished" | null;
type OrderUpsertPanelProps = {
  model: OrderUpsertModel;
  loadingState: LoadingState;
  onModelUpdated(updatedData: Partial<OrderUpsertModel>): void;
  onFinished(): any;
  onSyncingRequestingAsync(): Promise<any>;
};

// Components.
export default function OrderUpsertPanel(props: OrderUpsertPanelProps): JSXElement {
  // States.
  const [isBillModalVisible, setIsBillModalVisible] = createSignal<boolean>(false);

  // Computed.
  const amountDisplayText = createMemo(() => {
    const amount = calculateOrderAmount(props.model.toRequestDto());
    return {
      amountBeforeVat: getDisplayAmountText(amount.amountBeforeVat, { suffix: " vnđ" }),
      vatAmount: getDisplayAmountText(amount.vatAmount, { suffix: " vnđ" }),
      totalAmount: getDisplayAmountText(amount.totalAmount, { suffix: " vnđ" })
    };
  });

  // Callbacks.
  function handleClearAllItemsButtonClicked(): void {
    props.onModelUpdated({ items: [] });
  }

  function handleItemUpdated(guid: string, updatedData: Partial<OrderItemUpsertModel>): void {
    const items = props.model.items.map(item => {
      if (item.guid === guid) {
        return { ...item, ...updatedData };
      }

      return item;
    });

    props.onModelUpdated({ items });
  }

  function handleItemDeleted(guid: string): void {
    props.onModelUpdated({ items: props.model.items.filter(item => item.guid !== guid) });
  }

  async function handlePurchaseButtonClicked(): Promise<void> {
    await props.onSyncingRequestingAsync();
    setIsBillModalVisible(true);
  }

  function handleBillModalFinishedButtonClicked(): void {
    setIsBillModalVisible(false);
    props.onFinished();
  }

  // Templates.
  const emptyNotificationElement = (
    <div class="flex flex-1 justify-center items-center w-full">
      <span class="text-3xl opacity-30 text-center">
        Chưa chọn<br/>món ăn/nước uống
      </span>
    </div>
  );

  return (
    <div class="panel h-fit min-h-150 sticky top-[calc(var(--topbar-height)+(--spacing(3)))]">
      <div class="panel-header">
        <span class="panel-header-title">
          Danh sách món ăn {props.model.seating.name}
        </span>
      </div>

      <div class="panel-body flex flex-col h-full">
        <Show when={props.model.items.length > 0} fallback={emptyNotificationElement}>
          <ul class={joinClassName(
            "list-group list-group-flush flex-1",
            props.loadingState === "finished" && "opacity-50 pointer-events-none"
          )}>
            <For each={props.model.items}>
              {(item, index) => (
                <OrderItem
                  model={item}
                  onUpdated={updatedData => handleItemUpdated(item.guid, updatedData)}
                  onDeleted={() => handleItemDeleted(item.guid)}
                  index={index()}
                  disabled={props.loadingState === "finished"}
                />
              )}
            </For>
          </ul>

          <div class="flex flex-col px-3 pt-1 pb-2 border-t border-black/15">
            <div class="flex justify-between">
              <span>Giá trước thuế</span>
              <span class="text-blue-700">{amountDisplayText().amountBeforeVat}</span>
            </div>
            
            <div class="flex justify-between">
              <span>Thuế VAT</span>
              <span class="text-blue-700">{amountDisplayText().vatAmount}</span>
            </div>
            
            <div class="flex justify-between mt-3">
              <span class="font-bold">Tổng tiền</span>
              <span class="text-blue-700 font-bold">{amountDisplayText().totalAmount}</span>
            </div>
          </div>
        </Show>

        <Show when={props.loadingState === "syncing"}>
          <div class="flex justify-end items-center gap-3 p-1 border-t border-black/10">
            <span class="opacity-50">Đang đồng bộ</span>
            <div class="h-4 aspect-1/2 overflow-hidden animate-spin origin-[center_right] -translate-x-full">
              <div class="h-full aspect-square border-2 border-blue-700 rounded-full" />
            </div>
          </div>
        </Show>
      </div>

      <Show when={props.model.items.length > 0}>
        <div class="panel-footer flex p-2 gap-2">
          <button
            type="button"
            class="btn btn-danger-outline gap-1"
            onClick={handleClearAllItemsButtonClicked}
            disabled={!props.model.items.length || props.loadingState == "finished"}
          >
            <i class="bi bi-trash3" />
            <span>Xóa hết</span>
          </button>
          
          <button
            type="button"
            class="btn gap-1"
            onClick={handlePurchaseButtonClicked}
            disabled={!props.model.items.length || props.loadingState == "finished"}
          >
            <i class="bi bi-coin" />
            <span>Thanh toán</span>
          </button>
        </div>
      </Show>

      <BillModal
        model={props.model}
        isOpen={isBillModalVisible()}
        onClosed={() => setIsBillModalVisible(false)}
        onFinished={handleBillModalFinishedButtonClicked}
      />
    </div>
  );
}
