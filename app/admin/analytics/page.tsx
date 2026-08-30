'use client'

import React, { useState, useEffect } from 'react'
import {
  BarChart3,
  TrendingUp,
  Eye,
  Users,
  Database,
  Server,
  RefreshCw,
  Clock,
  CheckCircle2,
  Globe,
  Sparkles,
  ShieldCheck,
  Flame,
} from 'lucide-react'
import useSWR from 'swr'

interface PopularPage {
  path: string
  views: number
}

interface VisitLog {
  id: string
  path: string
  visitorHash: string
  referrer: string | null
  userAgent: string | null
  isUnique: boolean
  createdAt: string
}

interface AnalyticsData {
  totalViews: number
  uniqueVisitors: number
  todayViews: number
  todayUnique: number
  monthViews: number
  popularPages: PopularPage[]
  recentVisits: VisitLog[]
  redisConnected: boolean
  dbConnected: boolean
  lastSyncedAt: string
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function AdminAnalyticsPage() {
  const { data, error, isLoading, mutate } = useSWR<{ success: boolean; data: AnalyticsData }>(
    '/api/analytics/stats',
    fetcher,
    { refreshInterval: 10000 }
  )

  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await mutate()
    setTimeout(() => setIsRefreshing(false), 500)
  }

  const stats = data?.data || {
    totalViews: 0,
    uniqueVisitors: 0,
    todayViews: 0,
    todayUnique: 0,
    monthViews: 0,
    popularPages: [],
    recentVisits: [],
    redisConnected: false,
    dbConnected: false,
    lastSyncedAt: new Date().toISOString(),
  }

  const totalPageViewsSum = stats.popularPages.reduce((acc, p) => acc + p.views, 0) || stats.totalViews || 1

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-400" />
            <h1 className="text-xl sm:text-2xl font-bold font-mono text-white tracking-tight">
              Portfolio View Analytics
            </h1>
          </div>
          <p className="text-xs text-zinc-400 font-mono pt-1">
            Real-time telemetry powered by Upstash Redis (atomic memory cache) & Neon PostgreSQL persistence.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing || isLoading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300 hover:text-white hover:border-zinc-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <div className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-mono text-emerald-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            <span>Privacy Hash Active</span>
          </div>
        </div>
      </div>

      {/* Connection Health Indicator */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Server className={`w-4 h-4 ${stats.redisConnected ? 'text-emerald-400' : 'text-amber-400'}`} />
            <div>
              <div className="text-xs font-mono font-medium text-zinc-200">Upstash Redis</div>
              <div className="text-[10px] font-mono text-zinc-500">Atomic In-Memory Deduplication</div>
            </div>
          </div>
          <span
            className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
              stats.redisConnected
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
            }`}
          >
            {stats.redisConnected ? 'Connected (Live)' : 'Connecting / Fallback'}
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Database className={`w-4 h-4 ${stats.dbConnected ? 'text-emerald-400' : 'text-amber-400'}`} />
            <div>
              <div className="text-xs font-mono font-medium text-zinc-200">Neon PostgreSQL</div>
              <div className="text-[10px] font-mono text-zinc-500">Persistent Storage & Audit Logs</div>
            </div>
          </div>
          <span
            className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
              stats.dbConnected
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
            }`}
          >
            {stats.dbConnected ? 'Synced (Active)' : 'Connecting'}
          </span>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Unique Visitors */}
        <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-900/60 space-y-2">
          <div className="text-xs font-mono text-zinc-400 flex items-center justify-between">
            <span>Unique Visitors</span>
            <Users className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-3xl font-mono font-bold text-white tracking-tight">
            {stats.uniqueVisitors.toLocaleString()}
          </div>
          <div className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            <span>Redis HyperLogLog Deduplicated</span>
          </div>
        </div>

        {/* Total Page Views */}
        <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-900/60 space-y-2">
          <div className="text-xs font-mono text-zinc-400 flex items-center justify-between">
            <span>Total Page Views</span>
            <Eye className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-mono font-bold text-white tracking-tight">
            {stats.totalViews.toLocaleString()}
          </div>
          <div className="text-[10px] font-mono text-zinc-400">
            Across portfolio pages
          </div>
        </div>

        {/* Today's Views */}
        <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-900/60 space-y-2">
          <div className="text-xs font-mono text-zinc-400 flex items-center justify-between">
            <span>Today&apos;s Views</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-mono font-bold text-white tracking-tight">
            {stats.todayViews.toLocaleString()}
          </div>
          <div className="text-[10px] font-mono text-amber-400">
            {stats.todayUnique.toLocaleString()} unique today
          </div>
        </div>

        {/* This Month's Views */}
        <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-900/60 space-y-2">
          <div className="text-xs font-mono text-zinc-400 flex items-center justify-between">
            <span>This Month</span>
            <TrendingUp className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-3xl font-mono font-bold text-white tracking-tight">
            {stats.monthViews.toLocaleString()}
          </div>
          <div className="text-[10px] font-mono text-emerald-400">Active telemetry</div>
        </div>
      </div>

      {/* Popular Pages & Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/60 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-400" />
              <span>Top Visited Paths & Pages</span>
            </h3>
            <span className="text-[10px] font-mono text-zinc-500">Live Ranked</span>
          </div>

          <div className="space-y-2.5 font-mono text-xs">
            {stats.popularPages && stats.popularPages.length > 0 ? (
              stats.popularPages.map((item, idx) => {
                const percentage = Math.min(100, Math.round((item.views / totalPageViewsSum) * 100))
                return (
                  <div
                    key={item.path || idx}
                    className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800/80 space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-zinc-200 font-bold truncate">
                        <span className="text-zinc-500 text-[10px]">#{idx + 1}</span>
                        <span className="truncate">{item.path === '/' ? 'Home (/) ' : item.path}</span>
                      </div>
                      <span className="text-emerald-400 shrink-0 font-medium">
                        {item.views.toLocaleString()} views ({percentage}%)
                      </span>
                    </div>

                    <div className="w-full bg-zinc-900 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(percentage, 4)}%` }}
                      />
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="p-6 text-center text-zinc-500 text-xs font-mono">
                No path data recorded yet. Visit public pages to see traffic analytics!
              </div>
            )}
          </div>
        </div>

        {/* Live Visitor Feed */}
        <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/60 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-sky-400" />
              <span>Recent Visit Logs (PostgreSQL Audit)</span>
            </h3>
            <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live Feed
            </span>
          </div>

          <div className="space-y-2 font-mono text-xs max-h-[380px] overflow-y-auto pr-1">
            {stats.recentVisits && stats.recentVisits.length > 0 ? (
              stats.recentVisits.map((visit) => {
                const dateObj = new Date(visit.createdAt)
                const timeString = isNaN(dateObj.getTime())
                  ? 'Just now'
                  : dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })

                return (
                  <div
                    key={visit.id}
                    className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80 flex items-center justify-between gap-3 text-[11px]"
                  >
                    <div className="space-y-0.5 truncate">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white truncate">{visit.path}</span>
                        {visit.isUnique && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                            Unique
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-zinc-500 truncate">
                        Visitor: {visit.visitorHash.substring(0, 8)}...
                        {visit.referrer ? ` • Ref: ${visit.referrer}` : ''}
                      </div>
                    </div>

                    <div className="text-[10px] text-zinc-400 shrink-0 font-mono">
                      {timeString}
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="p-6 text-center text-zinc-500 text-xs font-mono">
                No recent visit logs found in PostgreSQL.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
