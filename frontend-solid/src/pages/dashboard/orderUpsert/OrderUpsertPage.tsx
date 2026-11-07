import { useNavigate, useParams } from "@solidjs/router";
import { api } from "#/api";
import { createOrderUpsertModel, type OrderUpsertModel } from "#/models";

// Child components.
import OrderUpsertPageContent from "./OrderUpsertPageContent";

// Components.
export default function OrderUpsertPage(): JSXElement {
  // Dependencies.
  const params = useParams();
  const navigate = useNavigate();

  // States.
  const [model, setModel] = createSignal<OrderUpsertModel | null>(null);

  // Life cycle and effect.
  onMount(async () => {
    if (params.id == null) {
      navigate(-1);
      return;
    }

    const seatingResponseDto = await api.seating.getDetailAsync(parseInt(params.id));
    let orderModel = createOrderUpsertModel(seatingResponseDto);
    if (seatingResponseDto.activeOrder) {
      const orderResponseDto = await api.order.getDetailAsync(seatingResponseDto.activeOrder.id);
      orderModel = orderModel.mapFromResponseDto(orderResponseDto);
    }

    setModel(orderModel);
  });
  
  // Templates.
  return (
    <Show when={model()}>
      {(model) => (<OrderUpsertPageContent model={model()} />)}
    </Show>
  );
}
