import { useParams, useNavigate } from "@solidjs/router";
import { api, seatingContracts } from "#/api";
import { SeatingUpsertModel } from "#/models";
import { getSeatingEditorRoutePath } from "#/helpers";

// Child components.
import UpsertPanel from "../base/UpsertPanel";

// Components.
export default function SeatingUpsertPanel(): JSXElement {
  // Dependencies.
  const navigate = useNavigate();
  const params = useParams();

  // States.
  const model = $state<SeatingUpsertModel>(new SeatingUpsertModel());
  let isLoaded = $state<boolean>(false);
  
  // Callbacks.
  async function handleCreatingAsync(): Promise<void> {
    await api.seating.createAsync(model.toRequestDto());
  }

  async function handleUpdatingAsync(id: number): Promise<void> {
    await api.seating.updateAsync(id, model.toRequestDto());
  }

  // Life cycle hooks.
  $mount(async () => {
    try {
      if (params.id == null) {
        return;
      }

      const id = parseInt(params.id);
      if (isNaN(id)) {
        navigate(-1, { replace: true });
        return;
      }

      const responseDto = await api.seating.getDetailAsync(id);
      model.mapFromResponseDto(responseDto);
    } finally {
      isLoaded = true;
    }
  });

  // Templates.
  return (
    <UpsertPanel<SeatingUpsertModel>
      resourceName="seating"
      editorRoutePath={getSeatingEditorRoutePath()}
      model={model}
      nameMaxLength={seatingContracts.nameMaxLength}
      onModelUpdated={(mutator) => mutator(model)}
      onCreatingAsync={handleCreatingAsync}
      onUpdatingAsync={handleUpdatingAsync}
    />
  );
}
