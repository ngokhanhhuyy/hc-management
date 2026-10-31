import type { OrderUpsertModel } from "#/models";
import { calculateOrderItemAmount, getDisplayAmountText } from "#/helpers";
import logoUrl from "#/assets/images/logo.png";

// Props.
type BillProps = {
  model: OrderUpsertModel;
  ref: (element: HTMLDivElement) => void;
};

// Components.
export default function Bill(props: BillProps): JSXElement {
  // Computed.
  const currentDateTimeText = $memo(() => {
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

  const totalAmountText = $memo<string>(() => {
    const amount = props.model.items.reduce((total, item) => {
      return total + calculateOrderItemAmount(item);
    }, 0);

    return getDisplayAmountText(amount);
  });

  // Templates.
  return (
    <div id="bill" class="flex flex-col px-3" ref={props.ref}>
      <div class="flex gap-4 justify-center items-center border-b border-black/50 border-dashed py-5">
        {/* Logo */}
        <img src={logoUrl} class="size-12 scale-150 invert grayscale-100 aspect-square" />
        
        <div class="flex flex-col justify-center items-start">
          <span class="font-bold uppercase text-center">
            Quán nhậu sân vườn
          </span>
          <span>04 Trịnh Tố Tâm, Tân Lợi, BMT</span>
          <span>0914 590 075</span>
        </div>
      </div>

      <div class="flex flex-col pt-5 pb-3">
        <div class="flex flex-col items-center">
          <span class="font-bold text-lg uppercase">Phiếu tạm tính</span>
          <span class="font-bold">{props.model.seating.name}</span>
        </div>

        <span class="text-sm mt-5">{currentDateTimeText.date}</span>
        <span class="text-sm">{currentDateTimeText.time}</span>
        <div class="border border-black/25">
          <table class="data-table w-full">
            <thead class=" text-xs">
              <tr class="font-bold">
                <th class="w-[5%] px-0">#</th>
                <th class="w-[32.5%]">Tên hàng</th>
                <th>SL</th>
                <th>Đ.giá</th>
                <th>T.tiền</th>
              </tr>
            </thead>

            <tbody>
              <For each={props.model.items}>
              {(item, index) => (
                <tr class="align-top text-xs">
                  <td class="px-0 pe-1 py-1 text-end">{index + 1}</td>
                  <td class="px-1.5 py-1">{item.menuItem.name}</td>
                  <td class="px-1.5 py-1 text-center">{item.quantity}</td>
                  <td class="px-1.5 py-1">{getDisplayAmountText(item.amountBeforeVatPerUnit)}</td>
                  <td class="px-1.5 py-1">{getDisplayAmountText(calculateOrderItemAmount(item))}</td>
                </tr>
              )}
              </For>

              <tr>
                <td class="opacity-0">_</td>
              </tr>

              <tr>
                <td class="font-bold text-end" colSpan={3}>Tổng tiền</td>
                <td class="font-bold" colSpan={2}>{totalAmountText}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="flex flex-col my-5 font-bold text-end">
          <span>Sacombank</span>
          <span>050012789235</span>
          <span>Nguyễn Thị Phương Chi</span>
        </div>

        <div class="text-center py-2 italic font-bold border-t border-dashed border-black/50">
          Cảm ơn & Hẹn gặp lại Quý khách!
        </div>
      </div>
    </div>
  );
}
