import React, { useState, useMemo } from "react";
import type { OrderUpsertModel } from "#/models";
import { joinClassName, getDisplayAmountText, calculateOrderAmount } from "#/helpers";

// Child components.
import { TrashIcon, CurrencyDollarIcon } from "@heroicons/react/24/outline";
import BillModal from "./BillModal";
import Bill from "./Bill";
import OrderItem from "./OrderItem";

// Props.
export type LoadingState = "syncing" | "finishing" | "finished" | null;
type OrderUpsertPanelProps = {
  model: OrderUpsertModel;
  loadingState: LoadingState;
  onModelUpdated(updatedData: Partial<OrderUpsertModel>): any;
  onFinished(): any;
  onSyncingRequestingAsync(): Promise<any>;
};

// Components.
export default function OrderUpsertPanel(props: OrderUpsertPanelProps): React.ReactNode {
  // States.
  const [isBillModalVisible, setIsBillModalVisible] = useState<boolean>(false);

  // Computed.
  const amountDisplayText = useMemo(() => {
    const amount = calculateOrderAmount(props.model.toRequestDto());
    return {
      amountBeforeVat: getDisplayAmountText(amount.amountBeforeVat, { suffix: " vnđ" }),
      vatAmount: getDisplayAmountText(amount.vatAmount, { suffix: " vnđ" }),
      totalAmount: getDisplayAmountText(amount.totalAmount, { suffix: " vnđ" })
    };
  }, [props.model]);

  // Callbacks.
  function handleClearAllItemsButtonClicked(): void {
    props.onModelUpdated({ items: [] });
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
  return (
    <div className="panel h-fit min-h-150 sticky top-[calc(var(--topbar-height)+(--spacing(3)))]">
      <div className="panel-header">
        <span className="panel-header-title">
          Danh sách món ăn {props.model.seating.name}
        </span>
      </div>

      <div className="panel-body flex flex-col h-full">
        {props.model.items.length > 0 ? (
          <>
            <ul className={joinClassName(
              "list-group list-group-flush flex-1",
              props.loadingState === "finished" && "opacity-50 pointer-events-none"
            )}>
              {props.model.items.map((item, index) => (
                <OrderItem
                  model={item}
                  onUpdated={updatedData => {
                    props.onModelUpdated?.({
                      items: props.model.items.map(i => {
                        if (i.guid === item.guid) {
                          return { ...i, ...updatedData };
                        }

                        return i;
                      })
                    });
                  }}
                  onDeleted={() => {
                    props.onModelUpdated?.({ items: props.model.items.filter(i => i.guid !== item.guid) });
                  }}
                  index={index}
                  disabled={props.loadingState === "finished"}
                  key={index}
                />
              ))}
            </ul>

            <div className="flex flex-col px-3 pt-1 pb-2 border-t border-black/15">
              <div className="flex justify-between">
                <span>Giá trước thuế</span>
                <span className="text-blue-700">{amountDisplayText.amountBeforeVat}</span>
              </div>
              
              <div className="flex justify-between">
                <span>Thuế VAT</span>
                <span className="text-blue-700">{amountDisplayText.vatAmount}</span>
              </div>
              
              <div className="flex justify-between mt-3">
                <span className="font-bold">Tổng tiền</span>
                <span className="text-blue-700 font-bold">{amountDisplayText.totalAmount}</span>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-1 justify-center items-center w-full">
            <span className="text-3xl opacity-30 text-center">
              Chưa chọn<br/>món ăn/nước uống
            </span>
          </div>
        )}

        {props.loadingState === "syncing" && (
          <div className="flex justify-end items-center gap-3 p-1 border-t border-black/10">
            <span className="opacity-50">Đang đồng bộ</span>
            <div className="h-4 aspect-1/2 overflow-hidden animate-spin origin-[center_right] -translate-x-full">
              <div className="h-full aspect-square border-2 border-blue-700 rounded-full" />
            </div>
          </div>
        )}
      </div>

      {props.model.items.length > 0 && (
        <div className="panel-footer flex p-2 gap-2">
          <button
            type="button"
            className="btn btn-danger-outline gap-1"
            onClick={handleClearAllItemsButtonClicked}
            disabled={!props.model.items.length || props.loadingState == "finished"}
          >
            <TrashIcon />
            <span>Xóa hết</span>
          </button>
          
          <button
            type="button"
            className="btn gap-1"
            onClick={handlePurchaseButtonClicked}
            disabled={!props.model.items.length || props.loadingState == "finished"}
          >
            <CurrencyDollarIcon />
            <span>Thanh toán</span>
          </button>
        </div>
      )}

      <BillModal
        model={props.model}
        isOpen={isBillModalVisible}
        onClosed={() => setIsBillModalVisible(false)}
        onFinished={handleBillModalFinishedButtonClicked}
      />
    </div>
  );
}
