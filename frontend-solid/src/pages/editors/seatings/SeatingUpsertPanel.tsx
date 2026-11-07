import { useParams, useNavigate } from "@solidjs/router";
import { api, seatingContracts } from "#/api";
import { createSeatingUpsertModel, type SeatingUpsertModel } from "#/models";
import { getSeatingEditorRoutePath } from "#/helpers";

// Child components.
import UpsertPanel from "../base/UpsertPanel";

// Components.
export default function SeatingUpsertPanel(): JSXElement {
  // Dependencies.
  const navigate = useNavigate();
  const params = useParams();

  // States.
  const [model, setModel] = createSignal<SeatingUpsertModel>(createSeatingUpsertModel());
  
  // Callbacks.
  async function handleCreatingAsync(): Promise<void> {
    await api.seating.createAsync(model().toRequestDto());
  }

  async function handleUpdatingAsync(id: number): Promise<void> {
    await api.seating.updateAsync(id, model().toRequestDto());
  }

  // Life cycle hooks.
  onMount(async () => {
    if (params.id == null) {
      return;
    }

    const id = parseInt(params.id);
    if (isNaN(id)) {
      navigate(-1, { replace: true });
      return;
    }

    const responseDto = await api.seating.getDetailAsync(id);
    setModel(createSeatingUpsertModel(responseDto));
  });

  // Templates.
  return (
    <UpsertPanel<SeatingUpsertModel>
      resourceName="seating"
      editorRoutePath={getSeatingEditorRoutePath()}
      model={model()}
      nameMaxLength={seatingContracts.nameMaxLength}
      onModelUpdated={updatedData => setModel(previous => ({ ...previous, ...updatedData }))}
      onCreatingAsync={handleCreatingAsync}
      onUpdatingAsync={handleUpdatingAsync}
    />
  );
}
