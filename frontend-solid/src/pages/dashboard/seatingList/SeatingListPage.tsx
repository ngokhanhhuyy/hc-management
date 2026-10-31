// import React, { useState } from "react";
import { api } from "#/api";
import { SeatingBasicModel } from "#/models";

// Child components.
import SeatingListPanel from "./SeatingListPanel";

// Components.
export default function SeatingListPage(): JSXElement {
  // Dependencies.
  let model = $state<SeatingBasicModel[]>([]);

  $mount(async () => {
    const responseDtos = await api.seating.getAllAsync();
    model = responseDtos.map(dto => new SeatingBasicModel(dto));
  });

  // Templates.
  return (
    <div class="grid grid-cols-1">
      <SeatingListPanel model={model} />
    </div>
  );
}
