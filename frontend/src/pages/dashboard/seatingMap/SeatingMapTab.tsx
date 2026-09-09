import React, { useState, useEffect, useTransition } from "react";
import { api } from "#/api";
import { createSeatingBasicModel, type SeatingBasicModel } from "#/models";

// Child components.
import SeatingMapItem from "./SeatingMapItem";

// Props.
type SeatingMapTabProps = {
  onSeatingSelected(seating: SeatingBasicModel): any;
};

// Components.
export default function SeatingMapTab(props: SeatingMapTabProps): React.ReactNode {
  // States.
  const [model, setModel] = useState<SeatingBasicModel[]>([]);
  const [isLoading, startTransition] = useTransition();

  // Effect.
  useEffect(() => {
    startTransition(async () => {
      const responseDtos = await api.seating.getAllAsync();
      setModel(responseDtos.map(createSeatingBasicModel));
    });
  }, []);

  // Templates.
  if (isLoading) {
    return (
      <div className="flex justify-center items-center opacity-50">
        Đang tải
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-[1fr_320px] items-start gap-3">
      <div className="grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 items-start gap-3">
        {model.map((seating) => (
          <SeatingMapItem
            model={seating}
            onClick={() => props.onSeatingSelected(seating)}
            key={seating.id}
          />
        ))}
      </div>

      <div className="bg-white border border-black/15 flex flex-col justify-center items-center rounded-lg h-full">
        <span className="text-3xl opacity-50">
          Chưa chọn bàn ăn
        </span>

        <span className="opacity-25">
          Chọn bàn ăn để thêm mục gọi món
        </span>
      </div>
    </div>
  );
}
