import type { OrderUpsertModel } from "#/models";
import { calculateOrderAmount, calculateOrderItemAmount, getDisplayAmountText } from "#/helpers";
import { createElementPrinter } from "#/helpers/printHelper";

// Child components.
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
export default function BillModal(props: BillModalProps): JSXElement {
  // States.
  let billElementRef: HTMLDivElement | undefined;
  const [isPrinting, setIsPrinting] = createSignal(false);
  const [printError, setPrintError] = createSignal<string | null>(null);
  const printer = createElementPrinter();
  onCleanup(() => printer.dispose());

  // Computed.
  const orderAmount = createMemo(() => calculateOrderAmount(props.model.toRequestDto()));

  // Callbacks.
  async function handlePrint(): Promise<void> {
    if (!billElementRef || isPrinting()) {
      return;
    }

    setIsPrinting(true);
    setPrintError(null);
    try {
      await printer.print(billElementRef, `Hoá đơn thanh toán ${props.model.seating.name}`);
    } catch (error) {
      setPrintError("Không thể chuẩn bị hóa đơn để in. Vui lòng thử lại.");
      console.error(error);
    } finally {
      setIsPrinting(false);
    }
  }

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
          class="btn btn-sm not-hover:border-transparent p-0 w-fit aspect-square"
          onClick={props.onClosed}
        >
          <i class="bi bi-x-lg scale-120" />
        </button>
      }
      footerChildren={
        <div class="flex gap-2 justify-between items-center w-full">
          <button type="button" class="btn btn-danger-outline" onClick={props.onClosed}>
            <i class="bi bi-x-lg" />
            <span>Huỷ bỏ</span>
          </button>

          <div class="flex gap-2">
            <button type="button" class="btn" onClick={handlePrint} disabled={isPrinting()}>
              <i class="bi bi-printer" />
              <span>In tạm tính</span>
            </button>

            <button type="button" class="btn btn-primary-outline" onClick={props.onFinished}>
              <i class="bi bi-check-lg" />
              <span>Hoàn tất</span>
            </button>
          </div>
        </div>
      }
    >
      <Show when={printError()}>
        <p role="alert" class="text-red-600 p-3">{printError()}</p>
      </Show>
      <div class="h-full max-h-[80vh] overflow-y-auto">
        <table class="data-table w-full">
          <thead>
            <tr class="font-bold">
              <th>#</th>
              <th>Tên món ăn/thức uống</th>
              <th>Giá</th>
              <th>VAT</th>
              <th>S.lượng</th>
              <th>Giá tiền</th>
            </tr>
          </thead>

          <tbody>
            <For each={props.model.items}>
              {(item, index) => (
                <tr>
                  <td>{index() + 1}</td>
                  <td>{item.menuItem.name}</td>
                  <td>{getDisplayAmountText(item.amountBeforeVatPerUnit)}</td>
                  <td>{item.vatPercentagePerUnit}%</td>
                  <td>{item.quantity}</td>
                  <td>{getDisplayAmountText(calculateOrderItemAmount(item))}</td>
                </tr>
              )}
            </For>

            <tr>
              <td class="opacity-0" colSpan={6}>_</td>
            </tr>

            <tr>
              <td class="font-bold text-end" colSpan={4}>Giá tiền trước thuế</td>
              <td colSpan={2}>{getDisplayAmountText(orderAmount().amountBeforeVat)}</td>
            </tr>

            <tr>
              <td class="font-bold text-end" colSpan={4}>Tổng thuế</td>
              <td colSpan={2}>{getDisplayAmountText(orderAmount().vatAmount)}</td>
            </tr>

            <tr>
              <td class="font-bold text-end" colSpan={4}>Tổng đơn giá</td>
              <td class="text-blue-600 font-bold" colSpan={2}>{getDisplayAmountText(orderAmount().totalAmount)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="hidden">
        <Bill model={props.model} ref={element => billElementRef = element} />
      </div>
    </BaseModal>
  );
}
