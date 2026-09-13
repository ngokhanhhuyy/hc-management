import { api } from "#/api";
import { createSeatingBasicModel, type SeatingBasicModel } from "#/models";

export async function loadDataAsync(): Promise<SeatingBasicModel[]> {
  const responseDtos = await api.seating.getAllAsync();
  return responseDtos.map(createSeatingBasicModel);
}
