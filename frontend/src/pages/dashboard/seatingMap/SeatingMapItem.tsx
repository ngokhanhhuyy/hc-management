import React from "react";
import type { SeatingMapItemModel } from "./seatingMapModel";
import { joinClassName } from "#/helpers";
import styles from "./SeatingMapItem.module.css";

// Props.
type SeatingMapItemProps = {
  model: SeatingMapItemModel;
};

// Components.
export default function SeatingMapItem(props: SeatingMapItemProps): React.ReactNode {
  // Templates.
  return (
    <div className={joinClassName("d-flex flex-column rounded-3 overflow-hidden", styles.seatingMapItem)}>
      <div className={joinClassName(
        "bg-white border-bottom border-secondary-subtle",
        "p-2 d-flex flex-column"
      )}>
        <div className="d-flex justify-content-between align-items-center">
          <span className="text-bold">
            Tình trạng
          </span>

          {props.model.isActive ? (
            <span className="text-success">
              Đang có khách
            </span>
          ): (
            <span className="opacity-50">
              Trống
            </span>
          )}
        </div>
        <div className="d-flex justify-content-between align-items-center">
          <span className="text-bold">
            Giá tiền
          </span>

          {props.model.isActive ? (
            <span className="text-success">
              Đang có khách
            </span>
          ): (
            <span className="opacity-50">
              0 vnđ
            </span>
          )}
        </div>
      </div>

      <div className="bg-secondary-subtle px-3 text-center fw-bold">
        {props.model.name}
      </div>
    </div>
  );
}
