"use client";
import { CheckCircle, XCircle, Heart, AlertTriangle } from "lucide-react";

export const CompactPredictionBadge = ({ label, value, type }) => {
  const getStyles = () => {
    if (type === "recurrence") {
      return value
        ? "bg-red-50 text-red-700 border-red-200"
        : "bg-green-50 text-green-700 border-green-200";
    } else {
      return value
        ? "bg-green-50 text-green-700 border-green-200"
        : "bg-red-50 text-red-700 border-red-200";
    }
  };

  const getIcon = () => {
    if (type === "recurrence") {
      return value ? (
        <AlertTriangle className="w-3 h-3" />
      ) : (
        <CheckCircle className="w-3 h-3" />
      );
    } else {
      return value ? (
        <Heart className="w-3 h-3" />
      ) : (
        <XCircle className="w-3 h-3" />
      );
    }
  };

  const getText = () => {
    if (type === "recurrence") {
      return value ? "Sí" : "No";
    } else {
      return value ? "Vivo" : "Fallecido";
    }
  };

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
  );
};
