import React from "react"
import { cn } from "@/libs/utils"

const buttonVariants = {
  default: "bg-blue-600 text-white hover:bg-blue-700 shadow",
  destructive: "bg-red-600 text-white hover:bg-red-700 shadow-sm",
  outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 shadow-sm",
  secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300 shadow-sm",
  ghost: "text-gray-700 hover:bg-gray-100",
  link: "text-blue-600 underline-offset-4 hover:underline",
}

const buttonSizes = {
  default: "h-10 px-4 py-2",
  sm: "h-8 px-3 text-sm",
  lg: "h-12 px-6 text-lg",
  icon: "h-10 w-10",
}

export function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  disabled = false,
  children,
  ...props
}) {
  const Comp = asChild ? React.Fragment : "button"

  return (
    <Comp
      className={cn(
        "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50",
        buttonVariants[variant],
        buttonSizes[size],
        className,
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </Comp>
  )
}

