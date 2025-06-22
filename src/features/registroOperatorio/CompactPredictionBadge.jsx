"use client"
import { CheckCircle, XCircle, Heart, AlertTriangle } from "lucide-react"
import { CircularProgress } from "@mui/material"

export const CompactPredictionBadge = ({ label, value, type, loading = false }) => {
  const getStyles = () => {
    if (type === "recurrence") {
      return value ? "bg-red-50 text-red-700 border-red-200" : "bg-green-50 text-green-700 border-green-200"
    } else {
      return value ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"
    }
  }

  const getIcon = () => {
    if (loading) {
      return <CircularProgress size={12} sx={{ color: "inherit" }} />
    }

    if (type === "recurrence") {
      return value ? <AlertTriangle className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />
    } else {
      return value ? <Heart className="w-3 h-3" /> : <XCircle className="w-3 h-3" />
    }
  }

  const getText = () => {
    if (loading) {
      return "Cargando..."
    }

    if (type === "recurrence") {
      return value ? "Sí" : "No"
    } else {
      return value ? "Vivo" : "Fallecido"
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-600 font-medium">{label}:</span>
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border bg-gray-50 text-gray-500 border-gray-200">
          {getIcon()}
          {getText()}
        </span>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-between text-xs">
      <span className="text-gray-600 font-medium">{label}:</span>
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${getStyles()}`}
      >
        {getIcon()}
        {getText()}
      </span>
    </div>
  )
}
