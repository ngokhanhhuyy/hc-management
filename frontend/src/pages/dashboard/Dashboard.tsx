import React, { useMemo } from "react";

// Child components.
import { TabPanel, type TabPanelOption } from "#/components/ui";
import SeatingMapTab from "./seatingMap/SeatingMapTab";

// Components.
export default function DashboardPage(): React.ReactNode {
  // Computed.
  const primaryTabPanelOptions = useMemo<TabPanelOption[]>(() => {
    return [
      { key: "SeatingMap", displayName: "Sơ đồ bàn ăn" },
      { key: "MenuItemList", displayName: "Danh sách món ăn" },
    ];
  }, []);
  
  const secondaryTabPanelOptions = useMemo<TabPanelOption[]>(() => {
    return [{ key: "", displayName: "Danh sách order" }];
  }, []);

  // Templates.
  function renderTabContent(currentTabKey: string): React.ReactNode {
    if (currentTabKey === "SeatingMap") {
      return <SeatingMapTab />;
    }

    return <></>;
  }

  return (
    <div className="container-fluid bg-light w-100 h-100 p-2">
      <div className="row g-3 w-100 h-100">
        <div className="col h-100">
          <TabPanel
            options={primaryTabPanelOptions}
            render={renderTabContent}
          />
        </div>
        
        <div className="col col-auto h-100" style={{ width: 450 }}>
          <TabPanel
            options={secondaryTabPanelOptions}
            render={renderTabContent}
          />
        </div>
      </div>
    </div>
  );
}
