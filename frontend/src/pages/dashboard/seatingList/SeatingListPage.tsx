import React, { useState } from "react";
import { useNavigate, useLoaderData } from "react-router";
import { api, type SeatingBasicResponseDto } from "#/api";
import { createSeatingBasicModel, type SeatingBasicModel } from "#/models";
import { getSeatingOrderUpsertRoutePath } from "#/helpers";

// Child components.
import SeatingListPanel from "./SeatingListPanel";

// Components.
export default function SeatingListPage(): React.ReactNode {
  // Dependencies.
  const navigate = useNavigate();
  const model = useLoaderData<SeatingBasicModel[]>();

  // Templates.
  return (
    <div className="grid grid-cols-[3fr_1fr]">
      <SeatingListPanel model={model} />
    </div>
  );
}
