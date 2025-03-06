import { TabNavigationProps } from "@/types/types";
import React from "react";

export default function TabNavigation({
  tabs,
  activeTab,
  onTabClick,
}: TabNavigationProps) {
  return (
    <div className="border-b border-gray-200 mb-8">
      {/* Add flex container with centering utilities */}
      <div className="flex justify-center">
        <div className="flex overflow-x-auto space-x-4 md:space-x-8 no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => onTabClick(tab)}
              className={`whitespace-nowrap px-2 md:px-4 py-2 text-xs md:text-sm font-medium ${
                activeTab === tab
                  ? "border-b-2 border-black text-black"
                  : "text-gray-500"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
