import { api } from "#/api";
import { createSeatingBasicModel, type SeatingBasicModel } from "#/models";

// Child components.
import SeatingListPanel from "./SeatingListPanel";

// Components.
export default function SeatingListPage(): JSXElement {
  // Dependencies.
  const [model, setModel] = createSignal<SeatingBasicModel[]>([]);

  onMount(async () => {
    const responseDtos = await api.seating.getAllAsync();
    setModel(responseDtos.map(dto => createSeatingBasicModel(dto)));
  });

  // Templates.
  return (
    <div class="grid grid-cols-1">
      <SeatingListPanel model={model()} />
    </div>
  );
}
