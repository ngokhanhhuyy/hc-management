import React, { useState, useEffect } from "react";
import { api } from "#/api";
import { createOrderUpsertModel, type OrderUpsertModel, type SeatingBasicModel } from "#/models";

type OrderUpsertPanelProps = {
  seating: SeatingBasicModel;
};

// Components.
export default function OrderUpsertPanel(props: OrderUpsertPanelProps): React.ReactNode {
  // States.
  const [model, setModel] = useState<OrderUpsertModel | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Effect.
  useEffect(() => {
    const loadAsync = async () => {
      if (props.seating.activeOrder) {
        const orderDetailResponseDto = await api.order.getDetailAsync(props.seating.activeOrder.id);
        setModel(createOrderUpsertModel(orderDetailResponseDto));
        return;
      }

      setModel(createOrderUpsertModel(props.seating));
    };

    loadAsync().finally(() => setIsLoading(false));
  }, []);

  // Templates.
  if (isLoading || !model) {
    return (
      <div className="flex flex-col justify-center items-center">
        <span className="opacity-50">
          Đang tải
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col p-3">
      <span className="text-lg text-center">
        Danh sách gọi món của {model.seating.name.toLowerCase()}
      </span>
    </div>
  );
}
