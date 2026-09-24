import React, { useMemo } from "react";
import type { OrderUpsertModel } from "#/models";
import { compute, calculateOrderItemAmount, getDisplayAmountText } from "#/helpers";
import logoUrl from "#/assets/images/logo.png";

// Props.
type BillProps = {
  model: OrderUpsertModel;
  ref: React.RefObject<HTMLDivElement | null>;
};

// Components.
export default function Bill(props: BillProps): React.ReactNode {
  // Computed.
  const currentDateTimeText = compute(() => {
    const now = new Date();
    const date = now.getDate().toString().padStart(2, "0");
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    const year = now.getFullYear();
    const hour = now.getHours().toString().padStart(2, "0");
    const minute = now.getMinutes().toString().padStart(2, "0");

    return {
      date: `Ngày ${date} tháng ${month} năm ${year}`,
      time: `${hour} giờ ${minute} phút`
    };
  });

  const totalAmountText = useMemo<string>(() => {
    const amount = props.model.items.reduce((total, item) => {
      return total + calculateOrderItemAmount(item);
    }, 0);

    return getDisplayAmountText(amount);
  }, []);

  // Templates.
  return (
    <div id="bill" className="flex flex-col px-3" ref={props.ref}>
      <div className="flex gap-4 justify-center items-center border-b border-black/50 border-dashed py-5">
        {/* Logo */}
        <img src={logoUrl} className="size-12 scale-150 invert grayscale-100 aspect-square" />
        
        <div className="flex flex-col justify-center items-start">
          <span className="font-bold uppercase text-center">
            Quán nhậu sân vườn
          </span>
          <span>04 Trịnh Tố Tâm, Tân Lợi, BMT</span>
          <span>0914 590 075</span>
        </div>
      </div>

      <div className="flex flex-col pt-5 pb-3">
        <div className="flex flex-col items-center">
          <span className="font-bold text-lg uppercase">Phiếu tạm tính</span>
          <span className="font-bold">{props.model.seating.name}</span>
        </div>

        <span className="text-sm mt-5">{currentDateTimeText.date}</span>
        <span className="text-sm">{currentDateTimeText.time}</span>
        <div className="border border-black/25">
          <table className="data-table w-full">
            <thead className=" text-xs">
              <tr className="font-bold">
                <th className="w-[5%] px-0">#</th>
                <th className="w-[32.5%]">Tên hàng</th>
                <th>SL</th>
                <th>Đ.giá</th>
                <th>T.tiền</th>
              </tr>
            </thead>

            <tbody>
              {props.model.items.map((item, index) => (
                <tr className="align-top text-xs" key={index}>
                  <td className="px-0 pe-1 py-1 text-end">{index + 1}</td>
                  <td className="px-1.5 py-1">{item.menuItem.name}</td>
                  <td className="px-1.5 py-1 text-center">{item.quantity}</td>
                  <td className="px-1.5 py-1">{getDisplayAmountText(item.amountBeforeVatPerUnit)}</td>
                  <td className="px-1.5 py-1">{getDisplayAmountText(calculateOrderItemAmount(item))}</td>
                </tr>
              ))}

              <tr>
                <td className="opacity-0">_</td>
              </tr>

              <tr>
                <td className="font-bold text-end" colSpan={3}>Tổng tiền</td>
                <td className="font-bold" colSpan={2}>{totalAmountText}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="flex flex-col my-5 font-bold text-end">
          <span>Sacombank</span>
          <span>050012789235</span>
          <span>Nguyễn Thị Phương Chi</span>
        </div>

        <div className="text-center py-2 italic font-bold border-t border-dashed border-black/50">
          Cảm ơn & Hẹn gặp lại Quý khách!
        </div>
      </div>
    </div>
  );
}
