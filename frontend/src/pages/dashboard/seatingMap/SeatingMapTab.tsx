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
      <div className="d-flex justify-content-center align-items-center opacity-50">
        Đang tải
      </div>
    );
  }
  
  return (
    <div className="row g-0 h-100">
      <div className="col h-100">
        <div className="row g-3 p-2">
          {model.map((seating) => (
            <div className="col col-xxl-2 col-xl-3 col-lg-4 col-md-4 col-6" key={seating.id}>
              <SeatingMapItem
                model={seating}
                onClick={() => props.onSeatingSelected(seating)}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="col col-xxl-2 col-xl-3 col-lg-4 border-start">
        
      </div>
    </div>
  );
}
