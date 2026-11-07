import { api } from "#/api";
import { createMenuCategoryBasicModel, type MenuCategoryBasicModel } from "#/models";
import {
  getMenuCategoryEditorRoutePath,
  getMenuCategoryEditorCreateRoutePath,
  getMenuCategoryEditorUpdateRoutePath,
  joinClassName
} from "#/helpers"; 

// Child components.
import EditorPage from "../base/EditorPage";

// Props.
type MenuCategoryEditorPageProps = {
  children?: JSXElement;
};

// Components.
export default function MenuCategoryEditorPage(props: MenuCategoryEditorPageProps): JSXElement {

  // States.
  const [model, setModel] = createSignal<MenuCategoryBasicModel[]>([]);

  // Callbacks.
  async function loadAsync(): Promise<void> {
    const responseDtos = await api.menuCategory.getAllAsync();
    setModel(responseDtos.map(createMenuCategoryBasicModel));
  }

  async function handleDeleteAsync(id: number): Promise<void> {
    await api.menuCategory.deleteAsync(id);
  }

  function handleItemRemoved(id: number): void {
    setModel(previous => previous.filter(item => item.id !== id));
  }

  // Life cycle hooks.
  onMount(loadAsync);

  // Templates.
  return (
    <EditorPage<MenuCategoryBasicModel>
      resourceName="menuItem"
      model={model()}
      editorRoutePath={getMenuCategoryEditorRoutePath()}
      editorCreateRoutePath={getMenuCategoryEditorCreateRoutePath()}
      getEditorUpdateRoutePath={getMenuCategoryEditorUpdateRoutePath}
      onReloading={loadAsync}
      onDeletingAsync={handleDeleteAsync}
      onItemRemoved={handleItemRemoved}
      renderItemIcon={(className) => <i class={joinClassName(className, "bi bi-tag")} />}
      renderItemDescription={(item) => (
        <span class="opacity-50 text-sm">
          Mã số #{item.id}
        </span>
      )}
    >
      {props.children}
    </EditorPage>
  );
}
