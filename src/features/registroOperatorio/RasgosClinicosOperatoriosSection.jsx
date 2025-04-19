"use client"

import { RasgosClinicosOperatoriosItem } from "./RasgosClinicosOperatoriosItem"

export const RasgosClinicosOperatoriosSection = ({ title, items }) => {
  return (
    <div className="border-b pb-6 last:border-b-0">
      <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
        {title}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item, index) => (
          <RasgosClinicosOperatoriosItem key={index} item={item} />
        ))}
      </div>
    </div>
  )
}