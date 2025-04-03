import { useState } from "react";
import { TabButton } from "./TabButton";

export const CustomTabs = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="w-full">
      <div className="flex space-x-1 mb-6 border-b overflow-x-auto">
        {tabs.map((tab, index) => (
          <TabButton
            key={index}
            isActive={activeTab === index}
            onClick={() => setActiveTab(index)}
          >
            {tab.label}
          </TabButton>
        ))}
      </div>
      <div className="tab-content w-full">{tabs[activeTab].content}</div>
    </div>
  );
};
