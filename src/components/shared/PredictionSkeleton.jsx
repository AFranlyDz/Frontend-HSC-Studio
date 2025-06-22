"use client"
import { Skeleton, Box } from "@mui/material"

export const PredictionSkeleton = () => {
  return (
    <Box className="border-t border-gray-100 pt-2 space-y-1">
      <div className="flex items-center justify-between text-xs">
        <Skeleton variant="text" width={60} height={16} />
        <Skeleton variant="rounded" width={80} height={20} />
      </div>
      <div className="flex items-center justify-between text-xs">
        <Skeleton variant="text" width={70} height={16} />
        <Skeleton variant="rounded" width={70} height={20} />
      </div>
    </Box>
  )
}
