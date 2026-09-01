import React, { useState, useEffect, useTransition } from "react";
import { api } from "#/api";
import {
  createMenuItemListModel,
  createOrderUpsertModel,
  type OrderBasicModel,
  type OrderUpsertModel,
  type SeatingBasicModel,
  type MenuItemBasicModel,
  type MenuCategoryBasicModel,
  type MenuItemListModel,
} from "#/models";

// Props.
type OrderUpsertTabProps = {
  seating: SeatingBasicModel;
};

// Components.
export default function OrderUpsertTab(props: OrderUpsertTabProps): React.ReactNode {
  // States.
  const [isLoading, startTransition] = useTransition();
  const [orderUpsertModel, setOrderUpsertModel] = useState<OrderUpsertModel | null>(null);
  const [menuItemListModel, setMenuItemListModel] = useState<MenuItemListModel>(createMenuItemListModel);

  // Effect.
  useEffect(() => {
    startTransition(async () => {
      const initialLoadedModels = await Promise.all([
        initialLoadOrderUpsertModelAsync(props.seating),
        initialLoadMenuItemListModelAsync()
      ]);

      setOrderUpsertModel(initialLoadedModels[0]);
      setMenuItemListModel(initialLoadedModels[1]);
    });
  }, []);

  // Templates.
  if (isLoading || !orderUpsertModel) {
    return (
      <div className="d-flex justify-content-center align-items-center">
        <span className="opacity-50">
          Đang tải
        </span>
      </div>
    );
  }

  return (
    <div className="container-fluid h-100">
      <div className="row g-3 h-100">
        <div className="col">
          <div className="row g-3">
            {menuItemListModel.items.map(menuItem => (
              <div className="col col-2" key={menuItem.id}>
                <div className="border rounded-3 px-3 py-2">{menuItem.name}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="col col-xxl-2 col-xl-3 col-lg-4 p-3 d-flex flex-column gap-3 border-start">
          <h3 className="text-center">
            Order của {orderUpsertModel.seating.name.toLowerCase()}
          </h3>
        </div>
      </div>
    </div>
  );
}

async function initialLoadOrderUpsertModelAsync(seating: SeatingBasicModel): Promise<OrderUpsertModel> {
  if (seating.activeOrder) {
    const orderDetailResponseDto = await api.order.getDetailAsync(seating.activeOrder.id);
    return createOrderUpsertModel(orderDetailResponseDto);
  }

  return createOrderUpsertModel(seating);
}

async function initialLoadMenuItemListModelAsync(): Promise<MenuItemListModel> {
  const model = createMenuItemListModel();
  const responseDto = await api.menuItem.getListAsync(model.toRequestDto());
  return model.mapFromResponseDto(responseDto);
}
