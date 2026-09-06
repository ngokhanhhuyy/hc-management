import React from "react";
import type { OrderUpsertModel } from "#/models";

// Child components.
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

      {props.model.items.length ? (
        <ul className="list-group list-group-flush">
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
      ) : (
        <></>
      )}
    </div>
  );
}
