import React, { useRef, useImperativeHandle, forwardRef } from "react";

// Child components.
import ConfirmationModal, { type ConfirmationModalHandler } from "./ConfirmationModal";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";

// Component.
const FormSubmissionSucceededModal = forwardRef<ConfirmationModalHandler, { }>((_, ref): React.ReactNode => {
  // States.
  const componentRef = useRef<ConfirmationModalHandler>(null!);

  // Handle.
  useImperativeHandle(ref, () => ({
    async confirmAsync(): Promise<void> {
      await componentRef.current.confirmAsync();
    }
  }));

  // Template.
  return (
    <ConfirmationModal
      ref={componentRef}
      title="Dữ liệu không hợp lệ"
      IconComponent={ExclamationCircleIcon}
      iconClassName="text-emerald-700"
      informationContent={["Dữ liệu đã được lưu thành công.", "Bạn sẽ được đưa trở lại trang trước."]}
    />
  );
});

FormSubmissionSucceededModal.displayName = "FormSubmissionSucceededModal";
export default FormSubmissionSucceededModal;
