import { useParams, useLocation, A } from "@solidjs/router";
import { displayNames } from "#/api";
import { joinClassName } from "#/helpers"; 

// Child components.
import {
  YesNoModal,
  FormSubmissionSucceededModal,
  type YesNoModalHandler,
  type ConfirmationModalHandler
} from "#/components/ui";
import EditorPageContext, { type EditorPageContextPayload } from "./context";

// Types.
interface IBasic {
  id: number;
  name: string;
}

// Props.
type EditorPageProps<TBasicModel extends IBasic> = {
  resourceName: "seating" | "menuItem" | "category";
  model: TBasicModel[];
  children?: JSXElement;
  editorRoutePath: string;
  editorCreateRoutePath: string;
  getEditorUpdateRoutePath(id: number): string;
  onItemRemoved(id: number): any;
  onReloading(): any
  onDeletingAsync(id: number): Promise<any>;
  renderItemIcon(className: string): JSXElement;
  renderItemDescription?(item: TBasicModel): JSXElement;
  renderUpperArea?(isEditorRoutePath: boolean, semiTransparentClassName: string): JSXElement;
  renderLowerArea?(isEditorRoutePath: boolean, semiTransparentClassName: string): JSXElement;
};

// Components.
export default function EditorPage<TBasicModel extends IBasic>(props: EditorPageProps<TBasicModel>): JSXElement {
  // Dependencies.
  const location = useLocation();
  const params = useParams();

  // States.
  let yesNoModalHandler: YesNoModalHandler;
  let deletionSuccessModalHandler: ConfirmationModalHandler;

  // Computed.
  const displayName = $memo<string>(() => {
    return displayNames[props.resourceName]?.toLowerCase() ?? props.resourceName;
  });

  const children = $children(props.children);

  const isEditorRoutePath = $memo(() => {
    return location.pathname === props.editorRoutePath;
  });

  const semiTransparentClassName = $memo(() => "opacity-25 pointer-events-none select-none");

  function isSelected(seating: TBasicModel): boolean {
    return params.id === seating.id.toString();
  }

  // Callbacks.
  async function handleDeletionAsync(seating: TBasicModel): Promise<void> {
    if (!yesNoModalHandler) {
      return;
    }

    const answer = await yesNoModalHandler.getAnswerAsync();
    if (answer) {
      await props.onDeletingAsync(seating.id);
      await deletionSuccessModalHandler.confirmAsync();
      props.onItemRemoved(seating.id);
    }
  }

  // Context.
  const contextPayload: EditorPageContextPayload = {
    requestReload() {
      props.onReloading();
    }
  };
  
  // Templates.
  function renderConfirmationModalIcon(className: string): JSXElement {
    return <i class={joinClassName(className, "text-yellow-500 bi bi-exclamation-triangle-fill")} />;
  }

  return (
    <div class={joinClassName("grid w-full gap-3 h-fit", !children ? "grid-cols-1" : "grid-cols-2")}>
      <div class="panel flex-1">
        <div class="panel-header">
          <span class="panel-header-title">
            Danh sách {displayNames[props.resourceName]}
          </span>
          
          <Show when={isEditorRoutePath}>
            <A class="btn btn-sm gap-0.5" href={props.editorCreateRoutePath}>
              <i class="bi bi-plus-lg" />
              <span>Thêm {displayNames[props.resourceName].toLowerCase()} mới</span>
            </A>
          </Show>
        </div>

        <div class="panel-body p-3 flex flex-col gap-3">
          {props.renderUpperArea?.(isEditorRoutePath, semiTransparentClassName)}

          <ul class="list-group bg-black/2.5">
            <For each={props.model}>
              {(item) => (
                <li class="list-group-item flex p-0">
                  <div class={joinClassName(
                    "flex gap-2 p-2 justify-start items-center w-full",
                    (children != null && !isSelected(item)) && semiTransparentClassName
                  )}>
                    <div class="img-thumbnail size-11 flex justify-center items-center">
                      {props.renderItemIcon("text-lg opacity-25")}
                    </div>

                    <div class="flex flex-col justify-center flex-1">
                      <div class="flex gap-1.5 items-center">
                        <span class={joinClassName(
                          "font-bold",
                          (!children|| isSelected(item)) && "text-blue-700"
                        )}>
                          {item.name}
                        </span>
                      </div>

                      {props.renderItemDescription?.(item)}
                    </div>

                    <div class="flex gap-2">
                      <Show when={!params.id}>
                        <A type="button" class="btn btn-primary-outline" href={props.getEditorUpdateRoutePath(item.id)}>
                          <i class="bi bi-pencil-square" />
                        </A>
                      </Show>

                      <Show when={(isEditorRoutePath || isSelected(item))}>
                        <button type="button" class="btn btn-danger-outline" onClick={() => handleDeletionAsync(item)}>
                          <i class="bi bi-trash3" />
                        </button>
                      </Show>
                    </div>
                  </div>
                </li>
              )}
            </For>
          </ul>

          {props.renderLowerArea?.(isEditorRoutePath, semiTransparentClassName)}
        </div>
      </div>

      <EditorPageContext.Provider value={contextPayload}>
        {children}
      </EditorPageContext.Provider>

      <YesNoModal
        title={`Xác nhận xoá ${displayName}`}
        renderIcon={renderConfirmationModalIcon}
        yesButtonClassName="btn btn-danger-outline"
        questionContent={[
          "Dữ liệu đã xoá có thể sẽ không thể khôi phục lại",
          `Bạn có chắc chắn muốn xoá ${displayName} này?`
        ]}
        ref={(handler) => yesNoModalHandler = handler}
      />

      <FormSubmissionSucceededModal ref={(handler) => deletionSuccessModalHandler = handler} />
    </div>
  );
}
