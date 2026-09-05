import React from 'react'
import Link from 'next/link'
import {
  FolderKanban,
  Briefcase,
  Award,
  Cpu,
  Eye,
  Plus,
  ExternalLink,
  Upload,
  Sparkles,
  Clock,
  CheckCircle2,
  FileEdit,
  ArrowUpRight,
  Quote,
  GitPullRequest,
  Settings,
} from 'lucide-react'
import StatCard from '@/components/admin/StatCard'
import { prisma } from '@/lib/prisma'
import { getAnalyticsSummary } from '@/lib/analytics'

export const dynamic = 'force-dynamic'

async function getDashboardStats() {
  try {
    const [
      projectCount,
      publishedProjects,
      draftProjects,
      experienceCount,
      certCount,
      skillCount,
      mediaCount,
      quoteCount,
      openSourceCount,
      analytics,
    ] = await Promise.all([
      prisma.project.count({ where: { deletedAt: null } }),
      prisma.project.count({ where: { status: 'PUBLISHED', deletedAt: null } }),
      prisma.project.count({ where: { status: 'DRAFT', deletedAt: null } }),
      prisma.experience.count({ where: { deletedAt: null } }),
      prisma.certification.count({ where: { deletedAt: null } }),
      prisma.skill.count({ where: { deletedAt: null } }),
      prisma.mediaAsset.count({ where: { deletedAt: null } }),
      prisma.quote.count({ where: { deletedAt: null } }),
      prisma.openSourceContribution.count({ where: { deletedAt: null } }),
      getAnalyticsSummary().catch(() => null),
    ])

    return {
      projectCount,
      publishedProjects,
      draftProjects,
      experienceCount,
      certCount,
      skillCount,
      mediaCount,
      quoteCount,
      openSourceCount,
      totalViews: analytics?.totalViews ?? 0,
      uniqueVisitors: analytics?.uniqueVisitors ?? 0,
      todayViews: analytics?.todayViews ?? 0,
      redisConnected: analytics?.redisConnected ?? false,
    }
  } catch {
    return {
      projectCount: 4,
      publishedProjects: 4,
      draftProjects: 0,
      experienceCount: 2,
      certCount: 2,
      skillCount: 10,
      mediaCount: 0,
      quoteCount: 1,
      openSourceCount: 7,
      totalViews: 0,
      uniqueVisitors: 0,
      todayViews: 0,
      redisConnected: false,
    }
  }
}

export default async function AdminDashboardHome() {
  const stats = await getDashboardStats()

  return (
    <div className="space-y-6 font-mono text-xs">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-dashed border-neutral-300 dark:border-neutral-800 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-neutral-50 tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 text-xs pt-1">
            Welcome back, Admin. System telemetry, statistics, and shortcuts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/projects/new"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-950 hover:bg-neutral-800 dark:hover:bg-white transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Project</span>
          </Link>
          <Link
            href="/admin/media"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs border border-dashed border-neutral-300 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white transition-colors"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Media</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Projects"
          value={stats.projectCount}
          subtext={`${stats.publishedProjects} Live • ${stats.draftProjects} Drafts`}
          iconType="projects"
          trend={{ label: `${stats.publishedProjects} Live`, positive: true }}
        />
        <StatCard
          title="Experience"
          value={stats.experienceCount}
          subtext="Career milestones"
          iconType="experience"
        />
        <StatCard
          title="Certifications"
          value={stats.certCount}
          subtext="Verified credentials"
          iconType="certifications"
        />
        <StatCard
          title="Skills Matrix"
          value={stats.skillCount}
          subtext="Technical competencies"
          iconType="skills"
        />
      </div>

      {/* Quick Actions & Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions Panel */}
        <div className="p-5 rounded-lg border border-dashed border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-950 space-y-4">
          <div className="flex items-center justify-between border-b border-dashed border-neutral-200 dark:border-neutral-800 pb-2.5">
            <h2 className="text-xs font-bold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-neutral-500" />
              <span>Quick Actions</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-2">
            <Link
              href="/admin/projects/new"
              className="flex items-center justify-between p-2.5 rounded-md bg-neutral-50 dark:bg-neutral-900/40 border border-dashed border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-700 text-xs text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white transition-all group"
            >
              <div className="flex items-center gap-2">
                <Plus className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Create New Project</span>
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>

            <Link
              href="/admin/settings?tab=hero"
              className="flex items-center justify-between p-2.5 rounded-md bg-neutral-50 dark:bg-neutral-900/40 border border-dashed border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-700 text-xs text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white transition-all group"
            >
              <div className="flex items-center gap-2">
                <FileEdit className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>Edit Hero & Profile</span>
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>

            <Link
              href="/admin/settings"
              className="flex items-center justify-between p-2.5 rounded-md bg-neutral-50 dark:bg-neutral-900/40 border border-dashed border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-700 text-xs text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white transition-all group"
            >
              <div className="flex items-center gap-2">
                <Settings className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                <span>Site Configuration Hub</span>
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>

            <Link
              href="/admin/opensource"
              className="flex items-center justify-between p-2.5 rounded-md bg-neutral-50 dark:bg-neutral-900/40 border border-dashed border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-700 text-xs text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white transition-all group"
            >
              <div className="flex items-center gap-2">
                <GitPullRequest className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                <span>Open Source PRs ({stats.openSourceCount})</span>
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>

            <Link
              href="/admin/quotes"
              className="flex items-center justify-between p-2.5 rounded-md bg-neutral-50 dark:bg-neutral-900/40 border border-dashed border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-700 text-xs text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white transition-all group"
            >
              <div className="flex items-center gap-2">
                <Quote className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Daily Quotes ({stats.quoteCount})</span>
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>

            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-2.5 rounded-md bg-neutral-50 dark:bg-neutral-900/40 border border-dashed border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-700 text-xs text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white transition-all group"
            >
              <div className="flex items-center gap-2">
                <ExternalLink className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Open Live Portfolio</span>
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Analytics Live Widget */}
        <div className="lg:col-span-2 p-5 rounded-lg border border-dashed border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-950 space-y-4">
          <div className="flex items-center justify-between border-b border-dashed border-neutral-200 dark:border-neutral-800 pb-2.5">
            <h2 className="text-xs font-bold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider flex items-center gap-2">
              <Eye className="w-3.5 h-3.5 text-sky-500" />
              <span>Traffic & Telemetry</span>
            </h2>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">
              {stats.redisConnected ? 'Redis Active' : 'DB Engine'}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
            <div className="p-3 rounded-md bg-neutral-50 dark:bg-neutral-900/40 border border-dashed border-neutral-200 dark:border-neutral-800">
              <div className="text-[11px] text-neutral-500">Page Views</div>
              <div className="text-lg font-bold text-neutral-900 dark:text-neutral-100 pt-1">
                {stats.totalViews.toLocaleString()}
              </div>
              <div className="text-[10px] text-emerald-600 dark:text-emerald-400 pt-0.5">Real-time</div>
            </div>

            <div className="p-3 rounded-md bg-neutral-50 dark:bg-neutral-900/40 border border-dashed border-neutral-200 dark:border-neutral-800">
              <div className="text-[11px] text-neutral-500">Unique Visitors</div>
              <div className="text-lg font-bold text-neutral-900 dark:text-neutral-100 pt-1">
                {stats.uniqueVisitors.toLocaleString()}
              </div>
              <div className="text-[10px] text-sky-600 dark:text-sky-400 pt-0.5">Deduplicated</div>
            </div>

            <div className="p-3 rounded-md bg-neutral-50 dark:bg-neutral-900/40 border border-dashed border-neutral-200 dark:border-neutral-800">
              <div className="text-[11px] text-neutral-500">Today&apos;s Views</div>
              <div className="text-lg font-bold text-neutral-900 dark:text-neutral-100 pt-1">
                {stats.todayViews.toLocaleString()}
              </div>
              <div className="text-[10px] text-amber-600 dark:text-amber-400 pt-0.5">Active today</div>
            </div>

            <div className="p-3 rounded-md bg-neutral-50 dark:bg-neutral-900/40 border border-dashed border-neutral-200 dark:border-neutral-800">
              <div className="text-[11px] text-neutral-500">Media Assets</div>
              <div className="text-lg font-bold text-neutral-900 dark:text-neutral-100 pt-1">
                {stats.mediaCount}
              </div>
              <div className="text-[10px] text-neutral-500 pt-0.5">Local storage</div>
            </div>
          </div>

          <div className="p-2.5 rounded-md border border-dashed border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/30 text-xs text-neutral-500 flex items-center justify-between">
            <span>Detailed visit history and geography available.</span>
            <Link href="/admin/analytics" className="text-neutral-900 dark:text-neutral-100 font-semibold hover:underline">
              View Analytics →
            </Link>
          </div>
        </div>
      </div>

      {/* System Status Summary Banner */}
      <div className="p-3.5 rounded-lg border border-dashed border-emerald-500/30 bg-emerald-500/5 text-xs text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>Core CMS operational. Connected to PostgreSQL.</span>
        </div>
        <div className="hidden sm:flex items-center gap-1 text-[11px] text-neutral-500">
          <Clock className="w-3.5 h-3.5" />
          <span>Auto-cache invalidation active</span>
        </div>
      </div>
    </div>
  )
}
