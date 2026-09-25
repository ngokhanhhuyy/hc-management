import { api } from "#/api";
import {
  createSeatingBasicModel,
  createSeatingUpsertModel,
  type SeatingBasicModel,
  type SeatingUpsertModel
} from "#/models";

export async function loadSeatingListDataAsync(): Promise<SeatingBasicModel[]> {
  const responseDtos = await api.seating.getAllAsync();
  return responseDtos.map(createSeatingBasicModel);
}

export async function loadSeatingUpsertDataAsync(id?: number): Promise<SeatingUpsertModel> {
  if (id != null) {
    const responseDto = await api.seating.getDetailAsync(id);
    return createSeatingUpsertModel(responseDto);
  }

  return createSeatingUpsertModel();
}
