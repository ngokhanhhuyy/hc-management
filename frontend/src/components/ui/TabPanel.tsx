import React, { useState } from "react";
import { joinClassName } from "#/helpers";

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
    <div className="flex flex-col h-full">
      <div className="flex justify-start items-end px-4">
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

      <div className="bg-white border border-black/15 rounded-xl flex-fill overflow-hidden z-0 h-full">
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
      className={joinClassName(
        "bg-white border border-b-0 border-black/25 rounded-t-lg px-3",
        "flex justify-center items-center disabled:text-black/25 not-disabled:cursor-pointer",
        //styles.tabButton,
        props.isActive && "text-blue-600 font-bold border-blue-600 shadow-lg",
        props.isActive && "rounded-none relative is-active py-1.5",
        props.isActive && "outline-3 outline-blue-600/25",
        !props.isActive && "py-1 not-first:rounded-tl-none not-last:rounded-tr-none",
        !props.isActive && "[.is-active+&]:border-s-transparent has-[+_.is-active]:border-e-transparent"
      )}
      disabled={props.isDisabled}
      onClick={props.onTabClicked}
    >
      {props.displayName}
    </button>
  );
}
