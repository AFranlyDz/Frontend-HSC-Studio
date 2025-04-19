import { AlertCircle, CheckCircle, Info, XCircle } from "lucide-react"

/**
 * Alert component for displaying messages
 */
export default function Alert({ type = "info", title, children, className = "", ...props }) {
  // Map alert types to styles and icons
  const alertStyles = {
    info: {
      containerClass: "bg-blue-50 border-blue-200 text-blue-800",
      iconClass: "text-blue-400",
      Icon: Info,
    },
    success: {
      containerClass: "bg-green-50 border-green-200 text-green-800",
      iconClass: "text-green-400",
      Icon: CheckCircle,
    },
    warning: {
      containerClass: "bg-yellow-50 border-yellow-200 text-yellow-800",
      iconClass: "text-yellow-400",
      Icon: AlertCircle,
    },
    error: {
      containerClass: "bg-red-50 border-red-200 text-red-800",
      iconClass: "text-red-400",
      Icon: XCircle,
    },
  }

  const { containerClass, iconClass, Icon } = alertStyles[type] || alertStyles.info

  return (
    <div className={`p-4 border rounded-md flex items-start ${containerClass} ${className}`} role="alert" {...props}>
      <div className={`flex-shrink-0 mr-3 ${iconClass}`}>
        <Icon size={20} aria-hidden="true" />
      </div>
      <div>
        {title && <h3 className="text-sm font-medium mb-1">{title}</h3>}
        <div className="text-sm">{children}</div>
      </div>
    </div>
  )
}
