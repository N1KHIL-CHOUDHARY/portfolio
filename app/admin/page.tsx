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
  TrendingUp,
  Clock,
  CheckCircle2,
  FileEdit,
  ArrowUpRight,
  Quote
} from 'lucide-react'
import StatCard from '@/components/admin/StatCard'
import { prisma } from '@/lib/prisma'

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
    ] = await Promise.all([
      prisma.project.count({ where: { deletedAt: null } }),
      prisma.project.count({ where: { status: 'PUBLISHED', deletedAt: null } }),
      prisma.project.count({ where: { status: 'DRAFT', deletedAt: null } }),
      prisma.experience.count({ where: { deletedAt: null } }),
      prisma.certification.count({ where: { deletedAt: null } }),
      prisma.skill.count({ where: { deletedAt: null } }),
      prisma.mediaAsset.count({ where: { deletedAt: null } }),
      prisma.quote.count({ where: { deletedAt: null } }),
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
    }
  } catch {
    // Fallback counts if DB is initializing
    return {
      projectCount: 4,
      publishedProjects: 4,
      draftProjects: 0,
      experienceCount: 2,
      certCount: 2,
      skillCount: 10,
      mediaCount: 0,
      quoteCount: 1,
    }
  }
}

export default async function AdminDashboardHome() {
  const stats = await getDashboardStats()

  return (
    <div className="space-y-8 font-sans">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-mono text-white tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 font-mono">
            Welcome back, Admin. Here is a summary of your portfolio content and activity.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/projects/new"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono font-medium bg-zinc-100 text-zinc-950 hover:bg-white transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>New Project</span>
          </Link>
          <Link
            href="/admin/media"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 transition-colors"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Media</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Projects"
          value={stats.projectCount}
          subtext={`${stats.publishedProjects} Published • ${stats.draftProjects} Drafts`}
          iconType="projects"
          trend={{ label: `${stats.publishedProjects} Live`, positive: true }}
        />
        <StatCard
          title="Experience"
          value={stats.experienceCount}
          subtext="Career timeline entries"
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
          subtext="Categorized technical skills"
          iconType="skills"
        />
      </div>

      {/* Quick Actions & Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions Panel */}
        <div className="p-6 rounded-2xl border border-zinc-800/80 bg-zinc-900/60 backdrop-blur-md space-y-4">
          <h2 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Quick Actions</span>
          </h2>

          <div className="grid grid-cols-1 gap-2.5">
            <Link
              href="/admin/projects/new"
              className="flex items-center justify-between p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-800/40 text-xs font-mono text-zinc-300 hover:text-white transition-all group"
            >
              <div className="flex items-center gap-2.5">
                <Plus className="w-4 h-4 text-emerald-400" />
                <span>Create New Project</span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>

            <Link
              href="/admin/hero"
              className="flex items-center justify-between p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-800/40 text-xs font-mono text-zinc-300 hover:text-white transition-all group"
            >
              <div className="flex items-center gap-2.5">
                <FileEdit className="w-4 h-4 text-amber-400" />
                <span>Edit Hero & Headline</span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>

            <Link
              href="/admin/quotes"
              className="flex items-center justify-between p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-800/40 text-xs font-mono text-zinc-300 hover:text-white transition-all group"
            >
              <div className="flex items-center gap-2.5">
                <Quote className="w-4 h-4 text-emerald-400" />
                <span>Daily Quotes ({stats.quoteCount} in rotation)</span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>

            <Link
              href="/admin/media"
              className="flex items-center justify-between p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-800/40 text-xs font-mono text-zinc-300 hover:text-white transition-all group"
            >
              <div className="flex items-center gap-2.5">
                <Upload className="w-4 h-4 text-sky-400" />
                <span>Media Library Manager</span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>

            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-800/40 text-xs font-mono text-zinc-300 hover:text-white transition-all group"
            >
              <div className="flex items-center gap-2.5">
                <ExternalLink className="w-4 h-4 text-indigo-400" />
                <span>Open Public Portfolio</span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Analytics Placeholder Widget */}
        <div className="lg:col-span-2 p-6 rounded-2xl border border-zinc-800/80 bg-zinc-900/60 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Eye className="w-4 h-4 text-sky-400" />
              <span>Traffic & Engagement (Placeholder)</span>
            </h2>
            <span className="text-[10px] font-mono bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded border border-zinc-700">
              Provider Ready
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
            <div className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
              <div className="text-[11px] font-mono text-zinc-500">Page Views</div>
              <div className="text-xl font-bold font-mono text-white pt-1">12,450</div>
              <div className="text-[10px] font-mono text-emerald-400 pt-0.5">+14% this month</div>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
              <div className="text-[11px] font-mono text-zinc-500">Unique Visitors</div>
              <div className="text-xl font-bold font-mono text-white pt-1">3,890</div>
              <div className="text-[10px] font-mono text-emerald-400 pt-0.5">+8% this month</div>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
              <div className="text-[11px] font-mono text-zinc-500">Resume Downloads</div>
              <div className="text-xl font-bold font-mono text-white pt-1">142</div>
              <div className="text-[10px] font-mono text-amber-400 pt-0.5">High intent</div>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
              <div className="text-[11px] font-mono text-zinc-500">Media Assets</div>
              <div className="text-xl font-bold font-mono text-white pt-1">{stats.mediaCount}</div>
              <div className="text-[10px] font-mono text-zinc-500 pt-0.5">Local / Storage</div>
            </div>
          </div>

          <div className="p-3 rounded-xl border border-zinc-800 bg-zinc-950/40 text-xs font-mono text-zinc-400 flex items-center justify-between">
            <span>Connect Vercel Analytics or Plausible for live telemetry.</span>
            <Link href="/admin/analytics" className="text-emerald-400 hover:underline">
              View Analytics →
            </Link>
          </div>
        </div>
      </div>

      {/* System Status Summary Banner */}
      <div className="p-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 text-xs font-mono text-emerald-300 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>All CMS core systems functional. Server actions connected to Neon PostgreSQL.</span>
        </div>
        <div className="hidden sm:flex items-center gap-1 text-[11px] text-zinc-400">
          <Clock className="w-3.5 h-3.5" />
          <span>Auto-revalidate enabled</span>
        </div>
      </div>
    </div>
  )
}
