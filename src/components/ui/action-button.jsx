"use client"

import { Button } from "@/components/ui/button"

/**
 * ActionButton component for consistent action buttons in tables
 */
export default function ActionButton({ icon: Icon, onClick, label, color = "blue", ...props }) {
  // Map color names to Tailwind classes
  const colorMap = {
    blue: "bg-blue-500 hover:bg-blue-600",
    yellow: "bg-yellow-500 hover:bg-yellow-600",
    red: "bg-red-500 hover:bg-red-600",
    green: "bg-green-500 hover:bg-green-600",
    gray: "bg-gray-500 hover:bg-gray-600",
  }

  const colorClass = colorMap[color] || colorMap.blue

  return (
    <Button
      onClick={onClick}
      className={`p-1.5 ${colorClass} text-white rounded transition-colors`}
      title={label}
      aria-label={label}
      {...props}
    >
      <Icon size={16} />
    </Button>
  )
}
