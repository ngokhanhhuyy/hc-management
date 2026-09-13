import React, { useState, useEffect, useTransition } from "react";
import { useNavigate, useLoaderData } from "react-router";
import { api } from "#/api";
import { createSeatingBasicModel, type SeatingBasicModel } from "#/models";
import { getSeatingOrderUpsertRoutePath } from "#/helpers";
import type { SeatingBasicResponseDto } from "@hc-management/shared/dtos";

// Child components.
import SeatingListItem from "./SeatingListItem";

// Components.
export default function SeatingListPage(): React.ReactNode {
  // Dependencies.
  const navigate = useNavigate();
  const initialResponseDtos = useLoaderData<SeatingBasicResponseDto[]>();

  // States.
  const [model, setModel] = useState<SeatingBasicModel[]>(() => initialResponseDtos.map(createSeatingBasicModel));
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
    <div className="grid 2xl:grid-cols-8 xl:grid-cols-6 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 items-start gap-3">
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
