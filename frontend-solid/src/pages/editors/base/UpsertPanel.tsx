import { useNavigate, useParams, A } from "@solidjs/router";
import { displayNames } from "#/api";

// Child components.
import { Form, FormField, TextInput } from "#/components/form";
import { FormSubmissionSucceededModal, type ConfirmationModalHandler } from "#/components/ui"; 
import EditorPageContext from "./context";

// Types.
interface IUpsertModel {
  name: string;
}

// Props.
type UpsertPanelProps<TUpsertModel extends IUpsertModel> = {
  resourceName: "seating" | "menuItem" | "category";
  editorRoutePath: string;
  model: TUpsertModel;
  nameMaxLength: number;
  onModelUpdated(updatedData: Partial<TUpsertModel>): void;
  onCreatingAsync(): Promise<any>;
  onUpdatingAsync(id: number): Promise<any>;
  children?: JSXElement | JSXElement[];
};

// Components.
function UpsertPanel<TUpsertModel extends IUpsertModel>(props: UpsertPanelProps<TUpsertModel>): JSXElement {
  // Dependencies.
  const editorPageContext = useContext(EditorPageContext);
  const navigate = useNavigate();
  const params = useParams();

  // States.
  let modalHandler: ConfirmationModalHandler;

  // Computed.
  const title = createMemo(() => {
    if (params.id == null) {
      return `Tạo ${displayNames[props.resourceName]} mới`;
    }

    return `Chỉnh sửa ${displayNames[props.resourceName]}`;
  });

  // Callbacks.
  async function submitAsync(): Promise<void> {
    if (params.id == null) {
      await props.onCreatingAsync();
      return;
    }

    await props.onUpdatingAsync(parseInt(params.id));
  }

  async function handleSubmissionSucceeeded(): Promise<void> {
    await modalHandler.confirmAsync();
    navigate(props.editorRoutePath);
    editorPageContext.requestReload();
  }

  // Templates.
  return (
    <div class="panel h-fit sticky top-[calc(var(--topbar-height)+(--spacing(3)))]">
      <div class="panel-header">
        <span class="panel-header-title">
          {title()}
        </span>
      </div>

      <div class="panel-body p-3">
        <Form
          id={`${props.resourceName}-upsert-form`}
          class="bg-black/2.5 border border-black/15 rounded-lg flex flex-col gap-3 p-3 pt-2"
          action={submitAsync}
          onSucceeded={handleSubmissionSucceeeded}
        >
          <FormField path="name">
            <TextInput
              maxLength={props.nameMaxLength}
              value={props.model.name}
              onInput={(name) => props.onModelUpdated({ name } as Partial<TUpsertModel>)}
            />
          </FormField>

          {props.children}
        </Form>
      </div>

      <div class="panel-footer flex justify-end">
        <div class="grid grid-cols-2 gap-2 w-fit">
          <A class="btn" href={props.editorRoutePath}>
            <i class="bi bi-x-lg" />
            <span>Huỷ bỏ</span>
          </A>

          <button type="submit" class="btn btn-primary-outline" form={`${props.resourceName}-upsert-form`}>
            <i class="bi bi-floppy" />
            <span>Lưu</span>
          </button>
        </div>
      </div>

      <FormSubmissionSucceededModal ref={(handler) => modalHandler = handler} />
    </div>
  );
}

export default UpsertPanel;
