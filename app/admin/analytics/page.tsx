'use client'

import React from 'react'
import { BarChart3, TrendingUp, Eye, Download, MousePointer, ShieldCheck } from 'lucide-react'

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-400" />
            <h1 className="text-xl sm:text-2xl font-bold font-mono text-white tracking-tight">
              Analytics Overview (Placeholder)
            </h1>
          </div>
          <p className="text-xs text-zinc-400 font-mono pt-1">
            Telemetry metrics ready to connect with Vercel Analytics, Plausible, or PostHog.
          </p>
        </div>

        <div className="px-3 py-1 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-mono text-emerald-400 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4" />
          <span>Privacy Compliant</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-900/60 space-y-2">
          <div className="text-xs font-mono text-zinc-400 flex items-center justify-between">
            <span>Total Visitors</span>
            <Eye className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-mono font-bold text-white">4,820</div>
          <div className="text-[10px] font-mono text-emerald-400">+12% vs last month</div>
        </div>

        <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-900/60 space-y-2">
          <div className="text-xs font-mono text-zinc-400 flex items-center justify-between">
            <span>Page Views</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-mono font-bold text-white">16,940</div>
          <div className="text-[10px] font-mono text-emerald-400">+18% vs last month</div>
        </div>

        <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-900/60 space-y-2">
          <div className="text-xs font-mono text-zinc-400 flex items-center justify-between">
            <span>Resume Downloads</span>
            <Download className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-mono font-bold text-white">184</div>
          <div className="text-[10px] font-mono text-amber-400">High hiring intent</div>
        </div>

        <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-900/60 space-y-2">
          <div className="text-xs font-mono text-zinc-400 flex items-center justify-between">
            <span>Contact Clicks</span>
            <MousePointer className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-mono font-bold text-white">62</div>
          <div className="text-[10px] font-mono text-emerald-400">+5 new inquiries</div>
        </div>
      </div>

      <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/60 space-y-4">
        <h3 className="text-sm font-bold font-mono text-white">Popular Projects (Most Viewed)</h3>
        <div className="space-y-2 font-mono text-xs">
          <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800 flex items-center justify-between">
            <span className="font-bold text-white">Universal App Opener</span>
            <span className="text-zinc-400">2,410 views (42%)</span>
          </div>
          <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800 flex items-center justify-between">
            <span className="font-bold text-white">Cursor Code Indexer</span>
            <span className="text-zinc-400">1,890 views (31%)</span>
          </div>
          <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800 flex items-center justify-between">
            <span className="font-bold text-white">DevPulse Telemetry Dashboard</span>
            <span className="text-zinc-400">920 views (15%)</span>
          </div>
        </div>
      </div>
    </div>
  )
}
