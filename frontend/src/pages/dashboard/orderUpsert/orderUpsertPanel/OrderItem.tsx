import React from "react";
import type { OrderItemUpsertModel } from "#/models";

// Child components.
import { PlusIcon, MinusIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { FormField, NumberInput } from "#/components/form";

// Props.
type OrderItemProps = {
  model: OrderItemUpsertModel;
  onUpdated(updatedData: Partial<OrderItemUpsertModel>): any;
  onDeleted(): any;
  index: number;
};

// Components.
export default function OrderItem(props: OrderItemProps): React.ReactNode {
  // Callbacks.
  function onDecrementButtonClicked(): void {
    if (props.model.quantity - 1 === 0) {
      props.onDeleted();
      return;
    }

    props.onUpdated({ quantity: props.model.quantity - 1});
  }

  // Templates.
  return (
    <li className="list-group-item grid grid-cols-1 gap-2 p-2 pt-1">
      <div className="flex flex-col">
        <div className="flex gap-2 font-bold">
          <span className="text-blue-700">{props.index + 1}.</span>
          <span>{props.model.menuItem.name}</span>
        </div>

        <div className="grid grid-cols-[1.5fr_1fr_auto] gap-2">
          <FormField path={`items[${props.index}].amountBeforeVatPerUnit`} hideLabel>
            <div className="form-input-group">
              <NumberInput
                className="form-control-sm rounded-e-none text-end z-0"
                value={props.model.amountBeforeVatPerUnit}
                onInput={amountBeforeVatPerUnit => props.onUpdated({ amountBeforeVatPerUnit })}
                min={1}
                max={999}
              />
              <span className="form-input-group-text py-0 border-s-0 rounded-s-none">
                vnđ
              </span>
            </div>
          </FormField>

          <FormField path={`items[${props.index}].quantity`} hideLabel>
            <div className="flex">
              <button
                type="button"
                className="btn btn-sm rounded-e-none border-e-0 px-2"
                onClick={onDecrementButtonClicked}
              >
                <MinusIcon />
              </button>

              <NumberInput
                className="form-control-sm rounded-none text-center z-0"
                value={props.model.quantity}
                onInput={quantity => props.onUpdated({ quantity })}
                min={1}
                max={999}
              />

              <button
                type="button"
                className="btn btn-sm rounded-s-none border-s-0 px-2"
                onClick={() => props.onUpdated({ quantity: props.model.quantity + 1 })}
              >
                <PlusIcon />
              </button>
            </div>
          </FormField>

          <button type="button" className="btn btn-danger-outline btn-sm aspect-square" onClick={props.onDeleted}>
            <XMarkIcon />
          </button>
        </div>
      </div>
    </li>
  );
}
