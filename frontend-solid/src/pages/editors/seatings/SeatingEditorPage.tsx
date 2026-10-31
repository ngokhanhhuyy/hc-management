import { api } from "#/api";
import { SeatingBasicModel } from "#/models";
import {
  getSeatingEditorRoutePath,
  getSeatingEditorCreateRoutePath,
  getSeatingEditorUpdateRoutePath,
  joinClassName
} from "#/helpers"; 

// Child components.
import EditorPage from "../base/EditorPage";

// Props.
type SeatingEditorPageProps = {
  children?: JSXElement;
};

// Components.
export default function SeatingEditorPage(props: SeatingEditorPageProps): JSXElement {
  // States.
  const model = $state<SeatingBasicModel[]>([]);

  // Callbacks.
  async function loadAsync(): Promise<void> {
    const responseDtos = await api.seating.getAllAsync();
    model.length = 0;
    for (const dto of responseDtos) {
      model.push(new SeatingBasicModel(dto));
    }
  }

  async function handleDeleteAsync(id: number): Promise<void> {
    await api.seating.deleteAsync(id);
  }

  function handleItemRemoved(id: number): void {
    const index = model.findIndex(i => i.id === id);
    if (index > -1) {
      model.splice(index, 1);
    }
  }

  // Life cycle hooks.
  $mount(loadAsync);

  // Templates.
  return (
    <EditorPage<SeatingBasicModel>
      resourceName="seating"
      model={model}
      editorRoutePath={getSeatingEditorRoutePath()}
      editorCreateRoutePath={getSeatingEditorCreateRoutePath()}
      getEditorUpdateRoutePath={getSeatingEditorUpdateRoutePath}
      onReloading={loadAsync}
      onDeletingAsync={handleDeleteAsync}
      onItemRemoved={handleItemRemoved}
      renderItemIcon={(className) => <i class={joinClassName(className, "bi bi-grid")} />}
      renderItemDescription={(item) => (
        <div class="flex gap-1">
          <span class="opacity-50 text-sm">
            Mã số #{item.id}
          </span>

          {item.activeOrder && (
            <span class="alert alert-emerald-outline alert-sm">
              Đang có khách
            </span>
          )}
        </div>
      )}
    >
      {props.children}
    </EditorPage>
  );
}
