'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

function useChartTheme() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  const dark = mounted && resolvedTheme === 'dark'
  return {
    tooltipBg: dark ? '#1a1333' : '#ffffff',
    tooltipBorder: dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
    tooltipLabel: dark ? '#94a3b8' : '#64748b',
    gridStroke: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)',
    axisColor: dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
    tickColor: dark ? '#64748b' : '#94a3b8',
  }
}

interface PointsChartProps {
  data: Array<{ date: string; points: number }>
}

export function PointsChart({ data }: PointsChartProps) {
  const t = useChartTheme()
  const chartStyle = {
    backgroundColor: t.tooltipBg,
    border: `1px solid ${t.tooltipBorder}`,
    borderRadius: '8px',
    fontSize: '12px',
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke={t.gridStroke} />
        <XAxis
          dataKey="date"
          tick={{ fill: t.tickColor, fontSize: 10 }}
          axisLine={{ stroke: t.axisColor }}
          interval="preserveStartEnd"
        />
        <YAxis
          tick={{ fill: t.tickColor, fontSize: 10 }}
          axisLine={{ stroke: t.axisColor }}
        />
        <Tooltip contentStyle={chartStyle} labelStyle={{ color: t.tooltipLabel }} />
        <Line
          type="monotone"
          dataKey="points"
          stroke="#f6c90e"
          strokeWidth={2}
          dot={{ fill: '#f6c90e', r: 3 }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

interface DayOfWeekChartProps {
  data: Array<{ day: string; avgPoints: number }>
}

export function DayOfWeekChart({ data }: DayOfWeekChartProps) {
  const t = useChartTheme()
  const chartStyle = {
    backgroundColor: t.tooltipBg,
    border: `1px solid ${t.tooltipBorder}`,
    borderRadius: '8px',
    fontSize: '12px',
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke={t.gridStroke} />
        <XAxis
          dataKey="day"
          tick={{ fill: t.tickColor, fontSize: 10 }}
          axisLine={{ stroke: t.axisColor }}
        />
        <YAxis
          tick={{ fill: t.tickColor, fontSize: 10 }}
          axisLine={{ stroke: t.axisColor }}
        />
        <Tooltip contentStyle={chartStyle} labelStyle={{ color: t.tooltipLabel }} />
        <Bar dataKey="avgPoints" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
