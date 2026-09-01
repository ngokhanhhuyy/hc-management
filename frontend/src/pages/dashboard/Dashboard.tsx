import React, { useState } from "react";
import type { SeatingBasicModel } from "#/models";
import { compute } from "#/helpers";

// Child components.
import { TabPanel, type TabPanelOption } from "#/components/ui";
import SeatingMapTab from "./seatingMap/SeatingMapTab";
import OrderUpsertTab from "./orderUpsert/OrderUpsertTab";

// Components.
export default function DashboardPage(): React.ReactNode {
  // States.
  const [selectedSeating, setSelectedSeating] = useState<SeatingBasicModel | null>(null); 

  // Computed.
  const currentTabKey = compute(() => selectedSeating ? "OrderUpsert" : "SeatingMap");

  const primaryTabPanelOptions = compute<TabPanelOption[]>(() => {
    return [
      { key: "SeatingMap", displayName: "Sơ đồ bàn ăn" },
      { key: "OrderUpsert", displayName: "Order", isDisabled: selectedSeating === null },
    ];
  });

  // Callbacks.
  function onSeatingSelected(seating: SeatingBasicModel): void {
    setSelectedSeating(seating);
  }

  function onTabSelected(selectedTabKey: string): void {
    if (selectedTabKey === "SeatingMap") {
      setSelectedSeating(null);
    }
  }

  // Templates.
  function renderTabContent(): React.ReactNode {
    if (selectedSeating) {
      return <OrderUpsertTab seating={selectedSeating} />;
    }

    return <SeatingMapTab onSeatingSelected={onSeatingSelected} />;
  }

  return (
    <div className="container-fluid bg-light w-100 h-100 p-2">
      <div className="row g-3 w-100 h-100">
        <div className="col h-100">
          <TabPanel
            options={primaryTabPanelOptions}
            currentTabKey={currentTabKey}
            onTabSelected={onTabSelected}
            render={renderTabContent}
          />
        </div>
      </div>
    </div>
  );
}
