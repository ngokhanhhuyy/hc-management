import React, { useMemo } from "react";
import type { OrderUpsertModel } from "#/models";
import { getDisplayAmountText } from "#/helpers";
import { calculateOrderAmount } from "@hc-management/shared/helpers";

// Child components.
import { TrashIcon, CurrencyDollarIcon } from "@heroicons/react/24/outline";
import OrderItem from "./OrderItem";

// Props.
export type LoadingState = "initialLoading" | "syncing" | "finishing" | null;
type OrderUpsertPanelProps = {
  model: OrderUpsertModel;
  onModelUpdated(updatedData: Partial<OrderUpsertModel>): any;
  loadingState: LoadingState;
};

// Components.
export default function OrderUpsertPanel(props: OrderUpsertPanelProps): React.ReactNode {
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
  function onClearAllItemsButtonClicked(): void {
    props.onModelUpdated({ items: [] });
  }

  // Templates.
  if (props.loadingState === "initialLoading") {
    return (
      <div className="flex flex-col justify-center items-center">
        <span className="opacity-50">
          Đang tải
        </span>
      </div>
    );
  }

  return (
    <div className="bg-white border border-black/15 rounded-lg flex flex-col h-full">
      <div className="text-xl text-center uppercase p-3 border-b border-black/15">
        {props.model.seating.name.toLowerCase()}
      </div>

      <ul className="list-group list-group-flush flex-1">
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
            key={index}
          />
        ))}
      </ul>

      {props.model.items.length > 0 && (
        <>
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

          <div className="flex border-t border-black/15 p-2 gap-2">
            <button
              type="button"
              className="btn btn-danger-outline gap-1"
              onClick={onClearAllItemsButtonClicked}
              disabled={!props.model.items.length}
            >
              <TrashIcon />
              <span>Xóa hết</span>
            </button>
            
            <button
              type="button"
              className="btn gap-1"
              onClick={onClearAllItemsButtonClicked}
              disabled={!props.model.items.length}
            >
              <CurrencyDollarIcon />
              <span>Thanh toán</span>
            </button>
          </div>
        </>
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
  );
}
