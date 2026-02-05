'use client'

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

const chartStyle = {
  backgroundColor: '#1a1333',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '8px',
  fontSize: '12px',
}

interface PointsChartProps {
  data: Array<{ date: string; points: number }>
}

export function PointsChart({ data }: PointsChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        <XAxis
          dataKey="date"
          tick={{ fill: '#64748b', fontSize: 10 }}
          axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
          interval="preserveStartEnd"
        />
        <YAxis
          tick={{ fill: '#64748b', fontSize: 10 }}
          axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
        />
        <Tooltip contentStyle={chartStyle} labelStyle={{ color: '#94a3b8' }} />
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
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        <XAxis
          dataKey="day"
          tick={{ fill: '#64748b', fontSize: 10 }}
          axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
        />
        <YAxis
          tick={{ fill: '#64748b', fontSize: 10 }}
          axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
        />
        <Tooltip contentStyle={chartStyle} labelStyle={{ color: '#94a3b8' }} />
        <Bar dataKey="avgPoints" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
