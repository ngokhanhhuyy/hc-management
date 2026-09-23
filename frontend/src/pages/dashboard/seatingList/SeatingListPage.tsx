import React, { useState } from "react";
import { useNavigate, useLoaderData } from "react-router";
import { api, type SeatingBasicResponseDto } from "#/api";
import { createSeatingBasicModel, type SeatingBasicModel } from "#/models";
import { getSeatingOrderUpsertRoutePath } from "#/helpers";

// Child components.
import SeatingListItem from "./SeatingListItem";

// Components.
export default function SeatingListPage(): React.ReactNode {
  // Dependencies.
  const navigate = useNavigate();
  const initialResponseDtos = useLoaderData<SeatingBasicResponseDto[]>();

  // States.
  const [model] = useState<SeatingBasicModel[]>(() => initialResponseDtos.map(createSeatingBasicModel));

  // Templates.
  return (
    <div className="grid xl:grid-cols-6 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 items-start gap-3">
      {model.map((seating) => (
        <SeatingListItem
          model={seating}
          onClick={() => navigate(getSeatingOrderUpsertRoutePath(seating.id))}
          key={seating.id}
        />
      ))}
    </div>
  );
}
