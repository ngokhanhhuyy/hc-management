import React, { useState } from "react";
import type { SeatingBasicModel } from "#/models";
import { MapIcon, TableCellsIcon, ChevronLeftIcon } from "@heroicons/react/24/outline";

// Child components.
import SeatingMapTab from "./seatingMap/SeatingMapTab";
import OrderUpsertTab from "./orderUpsert/OrderUpsertTab";

// Components.
export default function DashboardPage(): React.ReactNode {
  // States.
  const [selectedSeating, setSelectedSeating] = useState<SeatingBasicModel | null>(null); 

  // Callbacks.
  function onSeatingSelected(seating: SeatingBasicModel): void {
    setSelectedSeating(seating);
  }

  // Templates.
  return (
    <div className="flex flex-col gap-3 p-3 size-full max-w-350">
      <div className="flex flex-col justify-center items-start w-full">
        <div className="flex justify-center items-center gap-2 my-3 text-xl self-center text-blue-700 uppercase">
          {!selectedSeating ? (
            <>
              <MapIcon className="size-6" />
              <span>Danh sách bàn ăn</span>
            </>
          ) : (
            <>
              <TableCellsIcon className="size-6" />
              <span>Danh sách gọi món</span>
            </>
          )}
        </div>

        {selectedSeating && (
          <button
            type="button"
            className="btn gap-1.5"
            onClick={() => setSelectedSeating(null)}
          >
            <ChevronLeftIcon className="size-4" />
            <span>Quay lại danh sách bàn ăn</span>
          </button>
        )}
      </div>
      
      {selectedSeating ? (
        <OrderUpsertTab seating={selectedSeating} />
      ) : (
        <SeatingMapTab onSeatingSelected={onSeatingSelected} />
      )}
    </div>
  );
}
