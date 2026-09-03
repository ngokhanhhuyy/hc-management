import React from "react";
import type { SeatingBasicModel } from "#/models";
import { joinClassName } from "#/helpers";
import styles from "./SeatingMapItem.module.css";

// Props.
type SeatingMapItemProps = {
  isSelected?: boolean;
  model: SeatingBasicModel;
  onClick(): any;
};

// Components.
export default function SeatingMapItem(props: SeatingMapItemProps): React.ReactNode {
  // Templates.
  return (
    <div
      className={joinClassName(
        "seating-map-item border border-black/15 hover:border-blue-600/35",
        "text-black hover:text-blue-800 flex flex-col rounded-lg overflow-hidden",
        "hover:shadow-md hover:cursor-pointer transition-shadow duration-150",
      )}
      onClick={props.onClick}
    >
      <div className={joinClassName(
        "bg-white in-[.seating-map-item:hover]:bg-blue-600/10",
        "flex flex-col p-2"
      )}>
        <div className="flex justify-between items-center">
          <span className="text-bold">
            Tình trạng
          </span>

          {props.model.activeOrder != null ? (
            <span className="text-success">
              Đang có khách
            </span>
          ): (
            <span className="opacity-50">
              Trống
            </span>
          )}
        </div>
        <div className="flex justify-between items-center">
          <span className="text-bold">
            Giá tiền
          </span>

          {props.model.activeOrder != null ? (
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

      <div className={joinClassName(
        "bg-black/7.5 in-[.seating-map-item:hover]:bg-blue-600/20 border-t border-t-black/10",
        "in-[.seating-map-item:hover]:border-t-blue-600/20 px-3 text-center font-bold"
      )}>
        {props.model.name}
      </div>
    </div>
  );
}
