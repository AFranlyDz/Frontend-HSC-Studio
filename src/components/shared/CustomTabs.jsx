"use client"

import { TabButton } from "./TabButton"

export const CustomTabs = ({ tabs, activeTab = 0, onTabChange }) => {
  const handleTabClick = (index) => {
    if (onTabChange) {
      onTabChange(index)
    }
  }

  return (
    <div className="w-full">
      <div className="flex space-x-1 mb-6 border-b">
        {tabs.map((tab, index) => (
          <TabButton key={index} isActive={activeTab === index} onClick={() => handleTabClick(index)}>
            {tab.label}
          </TabButton>
        ))}
      </div>
      <div className="tab-content">{tabs[activeTab].content}</div>
    </div>
  )
}
