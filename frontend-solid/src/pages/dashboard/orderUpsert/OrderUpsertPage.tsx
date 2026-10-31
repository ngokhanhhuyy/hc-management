import { useNavigate, useParams } from "@solidjs/router";
import { api } from "#/api";
import { OrderUpsertModel } from "#/models";

// Child components.
import OrderUpsertPageContent from "./OrderUpsertPageContent";

// Components.
export default function OrderUpsertPage(): JSXElement {
  // Dependencies.
  const params = useParams();
  const navigate = useNavigate();

  // States.
  let model = $state<OrderUpsertModel | null>(null);

  // Life cycle and effect.
  $mount(async () => {
    if (params.id == null) {
      navigate(-1);
      return;
    }

    const seatingResponseDto = await api.seating.getDetailAsync(parseInt(params.id));
    model = new OrderUpsertModel(seatingResponseDto);
    if (seatingResponseDto.activeOrder) {
      const orderResponseDto = await api.order.getDetailAsync(seatingResponseDto.activeOrder.id);
      model.mapFromResponseDto(orderResponseDto);
    }
  });
  
  // Templates.
  return (
    <Show when={model}>
      {(model) => (<OrderUpsertPageContent model={model} />)}
    </Show>
  );
}
