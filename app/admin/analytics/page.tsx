'use client'

import React, { useState } from 'react'
import {
  BarChart3,
  TrendingUp,
  Eye,
  Users,
  Database,
  Server,
  RefreshCw,
  Clock,
  Globe,
  Sparkles,
  ShieldCheck,
  Flame,
  MapPin,
  Compass,
} from 'lucide-react'
import useSWR from 'swr'

interface PopularPage {
  path: string
  views: number
}

interface VisitorLocationItem {
  id: string
  timestamp: string
  path: string
  country?: string
  countryCode?: string
  region?: string
  city?: string
  timezone?: string
  formattedLocation: string
  flag: string
}

interface TopLocationItem {
  name: string
  views: number
  code?: string
  flag?: string
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
  recentVisitors: VisitorLocationItem[]
  topCountries: TopLocationItem[]
  topCities: TopLocationItem[]
  recentVisits: VisitLog[]
  redisConnected: boolean
  dbConnected: boolean
  lastSyncedAt: string
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

function formatRelativeTime(dateStr: string): string {
  try {
    const date = new Date(dateStr)
    const now = new Date()
    const diffSecs = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (isNaN(diffSecs) || diffSecs < 10) return 'Just now'
    if (diffSecs < 60) return `${diffSecs}s ago`
    const diffMins = Math.floor(diffSecs / 60)
    if (diffMins < 60) return `${diffMins}m ago`
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours}h ago`
    const diffDays = Math.floor(diffHours / 24)
    return `${diffDays}d ago`
  } catch {
    return 'Just now'
  }
}

export default function AdminAnalyticsPage() {
  const [refreshKey, setRefreshKey] = useState(0)
  const { data, isLoading, mutate } = useSWR<{ success: boolean; data: AnalyticsData }>(
    `/api/analytics/stats?k=${refreshKey}`,
    fetcher,
    { refreshInterval: 15000, revalidateOnFocus: true }
  )

  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      // Send refresh request to bust server-side tag cache
      await fetch('/api/analytics/stats?refresh=true')
      setRefreshKey((prev) => prev + 1)
      await mutate()
    } catch {
      // Ignore network errors on refresh
    } finally {
      setTimeout(() => setIsRefreshing(false), 500)
    }
  }

  const stats: AnalyticsData = data?.data || {
    totalViews: 0,
    uniqueVisitors: 0,
    todayViews: 0,
    todayUnique: 0,
    monthViews: 0,
    popularPages: [],
    recentVisitors: [],
    topCountries: [],
    topCities: [],
    recentVisits: [],
    redisConnected: false,
    dbConnected: false,
    lastSyncedAt: new Date().toISOString(),
  }

  const totalPageViewsSum =
    stats.popularPages.reduce((acc, p) => acc + p.views, 0) || stats.totalViews || 1
  const topCountryMaxViews =
    stats.topCountries.length > 0 ? Math.max(...stats.topCountries.map((c) => c.views), 1) : 1
  const topCityMaxViews =
    stats.topCities.length > 0 ? Math.max(...stats.topCities.map((c) => c.views), 1) : 1

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-400" />
            <h1 className="text-xl sm:text-2xl font-bold font-mono text-white tracking-tight">
              Portfolio View & Geolocation Analytics
            </h1>
          </div>
          <p className="text-xs text-zinc-400 font-mono pt-1">
            Canonical source: Upstash Redis (atomic memory cache) • Fast read layer: Next.js Data Cache • Server-side IP Geolocation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing || isLoading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300 hover:text-white hover:border-zinc-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
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
              <div className="text-[10px] font-mono text-zinc-500">Source of Truth & Deduplication</div>
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
              <div className="text-[10px] font-mono text-zinc-500">Persistent Audit Log History</div>
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
        {/* Total Page Views */}
        <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-900/60 space-y-2">
          <div className="text-xs font-mono text-zinc-400 flex items-center justify-between">
            <span>Total Views (Redis)</span>
            <Eye className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-mono font-bold text-white tracking-tight">
            {stats.totalViews.toLocaleString()}
          </div>
          <div className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            <span>Cached server read</span>
          </div>
        </div>

        {/* Total Unique Visitors */}
        <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-900/60 space-y-2">
          <div className="text-xs font-mono text-zinc-400 flex items-center justify-between">
            <span>Unique Visitors</span>
            <Users className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-3xl font-mono font-bold text-white tracking-tight">
            {stats.uniqueVisitors.toLocaleString()}
          </div>
          <div className="text-[10px] font-mono text-sky-400">
            HyperLogLog 24h Deduplicated
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
          <div className="text-[10px] font-mono text-emerald-400">Active monthly telemetry</div>
        </div>
      </div>

      {/* Geolocation Section: Recent Visitors & Top Locations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Visitors Geolocation Feed */}
        <div className="lg:col-span-2 p-6 rounded-2xl border border-zinc-800 bg-zinc-900/60 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold font-mono text-white">
                Recent Visitor Locations
              </h3>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Approximate IP Telemetry
            </span>
          </div>

          <div className="space-y-2.5 font-mono text-xs max-h-[380px] overflow-y-auto pr-1">
            {stats.recentVisitors && stats.recentVisitors.length > 0 ? (
              stats.recentVisitors.map((v) => {
                const flag = v.flag || '🌐'
                const label = v.formattedLocation && v.formattedLocation !== 'Location unavailable'
                  ? v.formattedLocation
                  : v.country
                  ? v.country
                  : '🌐 Location unavailable'

                return (
                  <div
                    key={v.id}
                    className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800/80 flex items-center justify-between gap-3 text-xs hover:border-zinc-700 transition-colors"
                  >
                    <div className="flex items-center gap-3 truncate">
                      <span className="text-lg leading-none shrink-0" title={v.country || 'Global'}>
                        {flag}
                      </span>
                      <div className="truncate space-y-0.5">
                        <div className="text-zinc-200 font-medium truncate">
                          {label}
                        </div>
                        <div className="text-[10px] text-zinc-500 truncate flex items-center gap-2">
                          <span>Path: {v.path}</span>
                          {v.timezone && <span>• {v.timezone}</span>}
                        </div>
                      </div>
                    </div>

                    <div className="text-[10px] text-zinc-400 shrink-0 font-mono">
                      {formatRelativeTime(v.timestamp)}
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="p-8 text-center text-zinc-500 text-xs font-mono border border-dashed border-zinc-800 rounded-xl">
                No visitor locations recorded yet. Visit public pages to stream location telemetry!
              </div>
            )}
          </div>
        </div>

        {/* Top Locations & Cities Summary */}
        <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/60 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-sky-400" />
              <h3 className="text-sm font-bold font-mono text-white">Top Locations</h3>
            </div>
            <span className="text-[10px] font-mono text-zinc-500">Aggregated</span>
          </div>

          {/* Top Countries */}
          <div className="space-y-3">
            <div className="text-[11px] font-mono text-zinc-400 font-bold uppercase tracking-wider">
              Top Countries
            </div>
            {stats.topCountries && stats.topCountries.length > 0 ? (
              <div className="space-y-2 font-mono text-xs">
                {stats.topCountries.slice(0, 5).map((country, idx) => {
                  const pct = Math.round((country.views / topCountryMaxViews) * 100)
                  return (
                    <div key={country.name || idx} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-zinc-300 flex items-center gap-1.5 truncate">
                          <span>{country.flag || '🌐'}</span>
                          <span className="truncate">{country.name}</span>
                        </span>
                        <span className="text-emerald-400 font-medium shrink-0">
                          {country.views.toLocaleString()} {country.views === 1 ? 'view' : 'views'}
                        </span>
                      </div>
                      <div className="w-full bg-zinc-900 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                          style={{ width: `${Math.max(pct, 6)}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-xs text-zinc-500 font-mono py-2">
                No country aggregates yet.
              </div>
            )}
          </div>

          {/* Top Cities */}
          <div className="space-y-3 pt-2 border-t border-zinc-800/80">
            <div className="text-[11px] font-mono text-zinc-400 font-bold uppercase tracking-wider">
              Top Cities
            </div>
            {stats.topCities && stats.topCities.length > 0 ? (
              <div className="space-y-2 font-mono text-xs">
                {stats.topCities.slice(0, 5).map((city, idx) => {
                  const pct = Math.round((city.views / topCityMaxViews) * 100)
                  return (
                    <div key={city.name || idx} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-zinc-300 truncate">📍 {city.name}</span>
                        <span className="text-sky-400 font-medium shrink-0">
                          {city.views.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full bg-zinc-900 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-sky-500 h-full rounded-full transition-all duration-500"
                          style={{ width: `${Math.max(pct, 6)}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-xs text-zinc-500 font-mono py-2">
                No city aggregates yet.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Popular Pages & PostgreSQL Audit Feed */}
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

        {/* Live Visitor Feed from PostgreSQL Audit */}
        <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/60 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-sky-400" />
              <span>Recent Visit Logs (PostgreSQL Audit)</span>
            </h3>
            <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Audit Stream
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
