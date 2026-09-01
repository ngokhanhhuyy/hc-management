import React, { useState } from "react";
import { joinClassName } from "#/helpers";
import styles from "./TabPanel.module.css";

// Props.
export type TabPanelOption = {
  key: string;
  displayName: string;
  isDisabled?: boolean;
};

type TabPanelProps = {
  options: TabPanelOption[];
  currentTabKey: string;
  onTabSelected: (selectedTabKey: string) => any;
  render: (currentTabKey: string) => React.ReactNode;
};

type TabButtonProps = {
  isActive: boolean;
  displayName: string;
  isDisabled?: boolean;
  onTabClicked: () => any;
};

// Component.
export function TabPanel(props: TabPanelProps): React.ReactNode {
  // Templates.
  return (
    <div className="d-flex flex-column h-100">
      <div className={joinClassName("d-flex justify-content-start align-items-end px-3", styles.tabButtonContainer)}>
        {props.options.map((option, index) => (
          <TabButton
            isActive={props.currentTabKey === option.key}
            displayName={option.displayName}
            onTabClicked={() => props.onTabSelected(option.key)}
            isDisabled={option.isDisabled}
            key={index}
          />
        ))}
      </div>

      <div className="bg-white border rounded-3 flex-fill">
        {props.render(props.currentTabKey)}
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
      disabled={props.isDisabled}
      onClick={props.onTabClicked}
    >
      <span className="px-3 py-1">
        {props.displayName}
      </span>
    </button>
  );
}
