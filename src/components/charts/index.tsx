'use client'

import * as React from 'react'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'
import { useThemeStore } from '~/stores/theme'

function useChartColors() {
  const dark = useThemeStore((s) => s.theme === 'dark')
  return {
    grid: dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
    axis: dark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.45)',
    brand: '#6366f1',
    emerald: '#10b981',
  }
}

const tooltipClass = {
  contentStyle: {
    borderRadius: 12,
    border: '1px solid var(--card-border)',
    background: 'var(--card)',
    color: 'var(--fg)',
    fontSize: 12,
    boxShadow: '0 10px 30px -10px rgba(0,0,0,0.4)',
  },
} as const

export function AreaTrendChart({
  data,
  xKey,
  series,
}: {
  data: Record<string, any>[]
  xKey: string
  series: { key: string; color?: string; name?: string }[]
}) {
  const c = useChartColors()
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ left: -16, right: 8, top: 8 }}>
        <defs>
          <linearGradient id="grad-brand" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={c.brand} stopOpacity={0.4} />
            <stop offset="100%" stopColor={c.brand} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={c.grid} vertical={false} />
        <XAxis dataKey={xKey} stroke={c.axis} fontSize={12} tickLine={false} />
        <YAxis stroke={c.axis} fontSize={12} tickLine={false} axisLine={false} />
        <Tooltip {...tooltipClass} />
        {series.map((s, i) => (
          <Area
            key={s.key}
            type="monotone"
            dataKey={s.key}
            name={s.name ?? s.key}
            stroke={s.color ?? (i === 0 ? c.brand : c.emerald)}
            strokeWidth={2}
            fill="url(#grad-brand)"
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  )
}

export function BarChartCard({
  data,
  xKey,
  bars,
  height = 260,
}: {
  data: Record<string, any>[]
  xKey: string
  bars: { key: string; color?: string; name?: string }[]
  height?: number
}) {
  const c = useChartColors()
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ left: -16, right: 8, top: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={c.grid} vertical={false} />
        <XAxis dataKey={xKey} stroke={c.axis} fontSize={12} tickLine={false} />
        <YAxis stroke={c.axis} fontSize={12} tickLine={false} axisLine={false} />
        <Tooltip {...tooltipClass} cursor={{ fill: c.grid }} />
        {bars.map((b, i) => (
          <Bar
            key={b.key}
            dataKey={b.key}
            name={b.name ?? b.key}
            fill={b.color ?? (i === 0 ? c.brand : c.emerald)}
            radius={[6, 6, 0, 0]}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  )
}

const PALETTE = [
  '#6366f1',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#3b82f6',
  '#a855f7',
  '#14b8a6',
  '#ec4899',
]

export function DonutChart({
  data,
  nameKey,
  valueKey,
  height = 220,
}: {
  data: Record<string, any>[]
  nameKey: string
  valueKey: string
  height?: number
}) {
  const c = useChartColors()
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          dataKey={valueKey}
          nameKey={nameKey}
          innerRadius={55}
          outerRadius={85}
          paddingAngle={2}
          stroke="none"
        >
          {data.map((_, i) => (
            <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
          ))}
        </Pie>
        <Tooltip {...tooltipClass} />
        <Legend
          iconType="circle"
          wrapperStyle={{ fontSize: 12, color: c.axis }}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}
