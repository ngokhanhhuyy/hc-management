import React, { useState } from "react";
import { joinClassName } from "#/helpers";
import styles from "./TabPanel.module.css";

// Props.
export type TabPanelOption = {
  key: string;
  displayName: string;
};

type TabPanelProps = {
  options: TabPanelOption[];
  render: (currentTabKey: string) => React.ReactNode;
};

type TabButtonProps = {
  isActive: boolean;
  displayName: string;
  onTabClicked: () => any;
};

// Component.
export function TabPanel(props: TabPanelProps): React.ReactNode {
  // States.
  const [currentTabKey, setCurrentTabKey] = useState<string>(props.options[0].key);

  // Templates.
  return (
    <div className="d-flex flex-column h-100">
      <div className={joinClassName("d-flex justify-content-start align-items-end px-3", styles.tabButtonContainer)}>
        {props.options.map((option, index) => (
          <TabButton
            isActive={currentTabKey === option.key}
            displayName={option.displayName}
            key={index}
            onTabClicked={() => setCurrentTabKey(option.key)}
          />
        ))}
      </div>

      <div className="bg-white border rounded-3 flex-fill">
        {props.render(currentTabKey)}
      </div>
    </div>
  );
}

export function TabButton(props: TabButtonProps): React.ReactNode {
  // Templates.
  return (
    <button
      type="button"
      className={joinClassName(styles.tabButton, props.isActive && styles.isActive)}
      onClick={props.onTabClicked}
    >
      <span className="px-3 py-1">
        {props.displayName}
      </span>
    </button>
  );
}
