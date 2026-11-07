import type { OrderItemUpsertModel } from "#/models";

// Child components.
import { FormField, NumberInput } from "#/components/form";

// Props.
type OrderItemProps = {
  model: OrderItemUpsertModel;
  onUpdated(updatedData: Partial<OrderItemUpsertModel>): void;
  onDeleted(): any;
  index: number;
  disabled: boolean;
};

// Components.
export default function OrderItem(props: OrderItemProps): JSXElement {
  // Callbacks.
  function onDecrementButtonClicked(): void {
    if (props.model.quantity - 1 === 0) {
      props.onDeleted();
      return;
    }

    props.onUpdated({ quantity: props.model.quantity - 1 });
  }

  // Templates.
  return (
    <li class="list-group-item grid grid-cols-1 gap-2 p-2 ps-3 pt-1">
      <div class="flex flex-col">
        <div class="flex gap-2 font-bold">
          <span class="text-blue-700">{props.index + 1}.</span>
          <span>{props.model.menuItem.name}</span>
        </div>

        <div class="grid grid-cols-[1.5fr_1fr_auto] gap-2">
          <FormField path={`items[${props.index}].amountBeforeVatPerUnit`} hideLabel>
            <div class="form-input-group">
              <NumberInput
                class="form-control-sm rounded-e-none text-end z-0"
                value={props.model.amountBeforeVatPerUnit}
                onInput={(amountBeforeVatPerUnit) => props.onUpdated({ amountBeforeVatPerUnit })}
                min={1}
                max={999_999_999}
              />
              <span class="form-input-group-text py-0 border-s-0 rounded-s-none">
                vnđ
              </span>
            </div>
          </FormField>

          <FormField path={`items[${props.index}].quantity`} hideLabel>
            <div class="flex">
              <button
                type="button"
                class="btn btn-sm rounded-e-none border-e-0 px-2"
                onClick={onDecrementButtonClicked}
              >
                <i class="bi bi-dash" />
              </button>

              <NumberInput
                class="form-control-sm rounded-none text-center z-0"
                value={props.model.quantity}
                onInput={quantity => props.onUpdated({ quantity })}
                min={1}
                max={999}
              />

              <button
                type="button"
                class="btn btn-sm rounded-s-none border-s-0 px-2"
                onClick={() => props.onUpdated({ quantity: props.model.quantity + 1 })}
              >
                <i class="bi bi-plus-lg" />
              </button>
            </div>
          </FormField>

          <button
            type="button"
            class="btn btn-danger-outline btn-sm aspect-square h-full"
            onClick={props.onDeleted}
          >
            <i class="bi bi-x-lg" />
          </button>
        </div>
      </div>
    </li>
  );
}
