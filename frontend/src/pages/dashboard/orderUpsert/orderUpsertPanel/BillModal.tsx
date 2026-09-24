import React, { useState, useRef, useMemo } from "react";
import type { OrderUpsertModel } from "#/models";
import { calculateOrderAmount, calculateOrderItemAmount, getDisplayAmountText, joinClassName } from "#/helpers";
import { useReactToPrint } from "react-to-print";

// Child components.
import { XMarkIcon, PrinterIcon, CheckIcon } from "@heroicons/react/24/outline";
import { BaseModal } from "#/components/ui";
import Bill from "./Bill";

// Props.
type BillModalProps = {
  model: OrderUpsertModel;
  isOpen: boolean;
  onClosed(): any;
  onFinished(): any;
};

// Components.
export default function BillModal(props: BillModalProps): React.ReactNode {
  // States.
  const billElementRef = useRef<HTMLTableElement | null>(null);

  // Computed.
  const orderAmount = useMemo(() => {
    return calculateOrderAmount(props.model.toRequestDto());
  }, [props.model.items]);

  // Callbacks.
  const handlePrint = useReactToPrint({
    contentRef: billElementRef,
    documentTitle: `Hoá đơn thanh toán ${props.model.seating.name}`,
    pageStyle: `
      @page {
        size: 80mm auto;
        margin: 0;
      }

      @media print {
        html,
        body {
          margin: 0;
          padding: 0;
        }

        #bill {
          width: 80mm;
          margin: 0;
          padding: 0;
        }
      }
    `,
  });

  // Template.
  return (
    <BaseModal
      title={`Chi tiết thanh toán ${props.model.seating.name}`}
      modalClassName="max-w-xl"
      isOpen={props.isOpen}
      onClosed={props.onClosed}
      headerChildren={
        <button
          type="button"
          className="btn btn-sm not-hover:border-transparent p-0 w-fit aspect-square"
          onClick={props.onClosed}
        >
          <XMarkIcon className="size-4.5 scale-120" />
        </button>
      }
      footerChildren={
        <div className="flex gap-2 justify-between items-center w-full">
          <button type="button" className="btn" onClick={props.onClosed}>
            <XMarkIcon />
            <span>Huỷ bỏ</span>
          </button>

          <div className="flex gap-2">
            <button type="button" className="btn" onClick={handlePrint}>
              <PrinterIcon />
              <span>In tạm tính</span>
            </button>

            <button type="button" className="btn btn-primary-outline" onClick={props.onFinished}>
              <CheckIcon />
              <span>Hoàn tất</span>
            </button>
          </div>
        </div>
      }
    >
      <div className="h-full max-h-[80vh] overflow-y-auto">
        <table className="data-table w-full">
          <thead>
            <tr className="font-bold">
              <th>#</th>
              <th>Tên món ăn/thức uống</th>
              <th>Giá</th>
              <th>VAT</th>
              <th>S.lượng</th>
              <th>Giá tiền</th>
            </tr>
          </thead>

          <tbody>
            {props.model.items.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{item.menuItem.name}</td>
                <td>{getDisplayAmountText(item.amountBeforeVatPerUnit)}</td>
                <td>{item.vatPercentagePerUnit}%</td>
                <td>{item.quantity}</td>
                <td>{getDisplayAmountText(calculateOrderItemAmount(item))}</td>
              </tr>
            ))}

            <tr>
              <td className="opacity-0" colSpan={6}>_</td>
            </tr>

            <tr>
              <td className="font-bold text-end" colSpan={4}>Giá tiền trước thuế</td>
              <td colSpan={2}>{getDisplayAmountText(orderAmount.amountBeforeVat)}</td>
            </tr>

            <tr>
              <td className="font-bold text-end" colSpan={4}>Tổng thuế</td>
              <td colSpan={2}>{getDisplayAmountText(orderAmount.vatAmount)}</td>
            </tr>

            <tr>
              <td className="font-bold text-end" colSpan={4}>Tổng đơn giá</td>
              <td className="text-blue-600 font-bold" colSpan={2}>{getDisplayAmountText(orderAmount.totalAmount)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="hidden">
        <Bill model={props.model} ref={billElementRef} />
      </div>
    </BaseModal>
  );
}
