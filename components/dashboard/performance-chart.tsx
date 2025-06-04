"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"

interface PerformanceData {
  date: string
  views: number
  readerReviews: number
  aiScore: number
}

interface PerformanceChartProps {
  timeframe: string
  data: PerformanceData[]
}

export default function PerformanceChart({ timeframe, data }: PerformanceChartProps) {
  const [selectedMetric, setSelectedMetric] = useState<"views" | "readerReviews" | "aiScore">("views")

  const metrics = [
    { key: "views" as const, label: "Views", color: "bg-[#F79B72]" },
    { key: "readerReviews" as const, label: "Reader Reviews", color: "bg-[#90D1CA]" },
    { key: "aiScore" as const, label: "AI Score", color: "bg-[#2A4759]" },
  ]

  const getMaxValue = () => {
    return Math.max(...data.map((d) => d[selectedMetric]))
  }

  const formatValue = (value: number) => {
    if (selectedMetric === "views") {
      return value.toLocaleString()
    }
    return value.toString()
  }

  const getChangePercentage = () => {
    if (data.length < 2) return 0
    const latest = data[data.length - 1][selectedMetric]
    const previous = data[data.length - 2][selectedMetric]
    return previous === 0 ? 0 : Math.round(((latest - previous) / previous) * 100)
  }

  const maxValue = getMaxValue()
  const changePercentage = getChangePercentage()

  return (
    <div className="space-y-4">
      {/* Metric Selector */}
      <div className="flex gap-2">
        {metrics.map((metric) => (
          <button
            key={metric.key}
            onClick={() => setSelectedMetric(metric.key)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              selectedMetric === metric.key ? "bg-[#2A4759] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {metric.label}
          </button>
        ))}
      </div>

      {/* Chart Summary */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-2xl font-bold text-[#2A4759]">
            {formatValue(data[data.length - 1]?.[selectedMetric] || 0)}
          </div>
          <div className="text-sm text-gray-600">
            {metrics.find((m) => m.key === selectedMetric)?.label} ({timeframe})
          </div>
        </div>
        <div className="text-right">
          <Badge
            variant={changePercentage >= 0 ? "default" : "destructive"}
            className={changePercentage >= 0 ? "bg-green-100 text-green-800" : ""}
          >
            {changePercentage >= 0 ? "+" : ""}
            {changePercentage}%
          </Badge>
          <div className="text-xs text-gray-500 mt-1">vs previous period</div>
        </div>
      </div>

      {/* Simple Bar Chart */}
      <div className="space-y-2">
        {data.slice(-10).map((point, index) => {
          const value = point[selectedMetric]
          const percentage = maxValue === 0 ? 0 : (value / maxValue) * 100
          const selectedColor = metrics.find((m) => m.key === selectedMetric)?.color || "bg-gray-400"

          return (
            <div key={index} className="flex items-center gap-3">
              <div className="text-xs text-gray-500 w-16">
                {new Date(point.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </div>
              <div className="flex-1 bg-gray-100 rounded-full h-6 relative">
                <div
                  className={`${selectedColor} h-6 rounded-full transition-all duration-300 flex items-center justify-end pr-2`}
                  style={{ width: `${Math.max(percentage, 5)}%` }}
                >
                  <span className="text-xs text-white font-medium">{formatValue(value)}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Chart Footer */}
      <div className="text-xs text-gray-500 text-center pt-2 border-t">
        Showing last {Math.min(data.length, 10)} data points for {timeframe}
      </div>
    </div>
  )
}
