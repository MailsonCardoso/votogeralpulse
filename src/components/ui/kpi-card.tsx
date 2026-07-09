'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { cn } from '~/lib/utils'
import { Card } from '~/components/ui/card'

export function StatTrend({
  value,
  className,
}: {
  value: number
  className?: string
}) {
  const positive = value >= 0
  return (
    <span
      className={cn(
        'inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-xs font-medium',
        positive
          ? 'bg-success/15 text-success'
          : 'bg-destructive/15 text-destructive',
        className,
      )}
    >
      {positive ? (
        <ArrowUpRight className="size-3" />
      ) : (
        <ArrowDownRight className="size-3" />
      )}
      {Math.abs(value)}%
    </span>
  )
}

export function KpiCard({
  title,
  value,
  hint,
  trend,
  icon: Icon,
  delay = 0,
  footer,
}: {
  title: string
  value: string
  hint?: string
  trend?: number
  icon?: React.ComponentType<{ className?: string }>
  delay?: number
  footer?: React.ReactNode
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <Card className="group relative overflow-hidden p-5 hover:shadow-elegant transition-shadow">
        <div className="pointer-events-none absolute -right-8 -top-8 size-24 rounded-full bg-brand/10 blur-2xl transition-opacity group-hover:opacity-100 opacity-60" />
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-semibold tracking-tight">{value}</p>
          </div>
          {Icon && (
            <div className="flex size-9 items-center justify-center rounded-lg bg-brand/15 text-brand">
              <Icon className="size-4" />
            </div>
          )}
        </div>
        {(trend !== undefined || hint || footer) && (
          <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
            {trend !== undefined && <StatTrend value={trend} />}
            {hint && <span>{hint}</span>}
            {footer}
          </div>
        )}
      </Card>
    </motion.div>
  )
}
