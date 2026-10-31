import { joinClassName } from "#/helpers";

// Child components.
import ConfirmationModal, { type ConfirmationModalHandler } from "./ConfirmationModal";

// Props.
type FormSubmissionSucceededModal = {
  ref: (handler: ConfirmationModalHandler) => void;
};

// Component.
export default function FormSubmissionFailedModal(props: FormSubmissionSucceededModal): JSXElement {
  // States.
  let baseModalHandler: ConfirmationModalHandler;

  // Handler.
  const handler: ConfirmationModalHandler = {
    async confirmAsync(): Promise<void> {
      await baseModalHandler.confirmAsync();
    }
  };

  props.ref(handler);

  // Template.
  function renderIcon(className: string): JSXElement {
    return <i class={joinClassName(className, "text-red-700 bi bi-exclamation-triangle-fill")} />;
  }

  return (
    <ConfirmationModal
      ref={(handler) => baseModalHandler = handler}
      title="Dữ liệu không hợp lệ"
      renderIcon={renderIcon}
      informationContent={["Dữ liệu đã nhập không hợp lệ.", "Vui lòng kiểm tra lại."]}
    />
  );
}
