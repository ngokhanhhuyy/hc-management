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
    <div className="grid grid-cols-[3fr_1fr] items-start h-full">
      <div className="grid 2xl:grid-cols-7 xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-2 items-start gap-3 p-3">
        {model.map((seating) => (
          <SeatingMapItem
            model={seating}
            onClick={() => props.onSeatingSelected(seating)}
            key={seating.id}
          />
        ))}
      </div>

      <div className="border-s border-black/15 h-full">
        
      </div>
    </div>
  );
}
