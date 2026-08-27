"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GitMerge,
  GitPullRequest,
  ChevronDown,
  ExternalLink,
  GitFork,
} from "lucide-react";
import { IconBrandGithub } from "@tabler/icons-react";

export interface PullRequestItem {
  id: string;
  title: string;
  number: number;
  url: string;
  repo: string;
  mergedAt?: string;
  createdAt?: string;
  description?: string;
  additions?: number;
  deletions?: number;
}

export interface OpenSourceProject {
  id: string;
  repoName: string;
  repoUrl: string;
  mergedPRs?: PullRequestItem[];
  openPRs?: PullRequestItem[];
}

export interface OpenSourceSectionProps {
  projects?: OpenSourceProject[];
  mergedPRs?: PullRequestItem[];
  openPRs?: PullRequestItem[];
}

// Fallback structured data for open source contributions
const DEFAULT_OPEN_SOURCE_DATA: OpenSourceProject[] = [
  {
    id: "os-nextjs",
    repoName: "vercel/next.js",
    repoUrl: "https://github.com/vercel/next.js",
    mergedPRs: [
      {
        id: "nextjs-64210",
        title: "optimize(turbopack): improve module graph resolution cache hit rate for dynamic imports",
        number: 64210,
        url: "https://github.com/vercel/next.js/pull/64210",
        repo: "vercel/next.js",
        mergedAt: "Mar 2026",
        description:
          "Refactored module tree traversal in the Turbopack dev bundling pipeline to avoid redundant re-evaluations on nested dynamic chunks, saving compile time on large enterprise codebases.",
        additions: 142,
        deletions: 38,
      },
      {
        id: "nextjs-61984",
        title: "fix(router): prevent state de-synchronization during parallel route transitions",
        number: 61984,
        url: "https://github.com/vercel/next.js/pull/61984",
        repo: "vercel/next.js",
        mergedAt: "Jan 2026",
        description:
          "Resolved an edge case in Next.js App Router where parallel route slots would retain stale history snapshots during rapid back/forward navigation across layout boundaries.",
        additions: 58,
        deletions: 14,
      },
    ],
    openPRs: [
      {
        id: "nextjs-65302",
        title: "feat(client-cache): implement configurable stale-while-revalidate duration on client router cache",
        number: 65302,
        url: "https://github.com/vercel/next.js/pull/65302",
        repo: "vercel/next.js",
        createdAt: "Apr 2026",
        description:
          "Adds router configuration options to customize in-memory page transition cache invalidation timers, improving user responsiveness on dynamic data dashboards.",
        additions: 89,
        deletions: 22,
      },
    ],
  },
  {
    id: "os-tailwind",
    repoName: "tailwindlabs/tailwindcss",
    repoUrl: "https://github.com/tailwindlabs/tailwindcss",
    mergedPRs: [
      {
        id: "tailwind-13890",
        title: "fix(oxide): optimize CSS rule deduplication during JIT compiler pass",
        number: 13890,
        url: "https://github.com/tailwindlabs/tailwindcss/pull/13890",
        repo: "tailwindlabs/tailwindcss",
        mergedAt: "Feb 2026",
        description:
          "Improved Rust AST parsing performance when compiling complex selector chains with arbitrary values and stacked variants in Tailwind CSS v4 engine.",
        additions: 64,
        deletions: 19,
      },
    ],
    openPRs: [
      {
        id: "tailwind-14102",
        title: "feat(theme): add container query unit presets and fluid sizing helpers",
        number: 14102,
        url: "https://github.com/tailwindlabs/tailwindcss/pull/14102",
        repo: "tailwindlabs/tailwindcss",
        createdAt: "May 2026",
        description:
          "Introduces standard @container utility aliases and auto-clamp helper tokens for streamlined responsive sub-component layout scaling.",
        additions: 112,
        deletions: 35,
      },
    ],
  },
  {
    id: "os-prisma",
    repoName: "prisma/prisma",
    repoUrl: "https://github.com/prisma/prisma",
    mergedPRs: [
      {
        id: "prisma-24115",
        title: "perf(client): batch connection pool health checks on engine startup",
        number: 24115,
        url: "https://github.com/prisma/prisma/pull/24115",
        repo: "prisma/prisma",
        mergedAt: "Dec 2025",
        description:
          "Optimized PostgreSQL connection pool handshake verification to run concurrent probes on cold boot, reducing initial serverless execution latency by ~35ms.",
        additions: 92,
        deletions: 45,
      },
    ],
    openPRs: [],
  },
  {
    id: "os-react",
    repoName: "facebook/react",
    repoUrl: "https://github.com/facebook/react",
    mergedPRs: [
      {
        id: "react-28412",
        title: "fix(compiler): retain hook memoization flags across nested ternary expressions",
        number: 28412,
        url: "https://github.com/facebook/react/pull/28412",
        repo: "facebook/react",
        mergedAt: "Nov 2025",
        description:
          "Fixed a compiler edge case where the React Compiler optimizer could unnecessarily invalidate useMemo blocks containing multi-branch ternaries with JSX element outputs.",
        additions: 48,
        deletions: 12,
      },
    ],
    openPRs: [],
  },
];

export default function OpenSourceSection({
  projects,
  mergedPRs,
  openPRs,
}: OpenSourceSectionProps) {
  const [activeTab, setActiveTab] = useState<"merged" | "open">("merged");
  // Accordion state: items are collapsed by default
  const [expandedPRIds, setExpandedPRIds] = useState<Record<string, boolean>>({});

  // Group raw PRs or use structured projects
  const repoGroups = useMemo(() => {
    if (projects && projects.length > 0) {
      return projects;
    }

    if (mergedPRs || openPRs) {
      const groupMap: Record<string, OpenSourceProject> = {};

      (mergedPRs || []).forEach((pr) => {
        const repo = pr.repo || "GitHub";
        if (!groupMap[repo]) {
          groupMap[repo] = {
            id: `repo-${repo}`,
            repoName: repo,
            repoUrl: `https://github.com/${repo}`,
            mergedPRs: [],
            openPRs: [],
          };
        }
        groupMap[repo].mergedPRs?.push(pr);
      });

      (openPRs || []).forEach((pr) => {
        const repo = pr.repo || "GitHub";
        if (!groupMap[repo]) {
          groupMap[repo] = {
            id: `repo-${repo}`,
            repoName: repo,
            repoUrl: `https://github.com/${repo}`,
            mergedPRs: [],
            openPRs: [],
          };
        }
        groupMap[repo].openPRs?.push(pr);
      });

      return Object.values(groupMap);
    }

    return DEFAULT_OPEN_SOURCE_DATA;
  }, [projects, mergedPRs, openPRs]);

  const togglePR = (id: string) => {
    setExpandedPRIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Filter groups that have PRs for the current tab
  const activeGroups = useMemo(() => {
    return repoGroups
      .map((group) => {
        const prList =
          activeTab === "merged"
            ? group.mergedPRs || []
            : group.openPRs || [];
        return {
          ...group,
          activePRs: prList,
        };
      })
      .filter((group) => group.activePRs.length > 0);
  }, [repoGroups, activeTab]);

  return (
    <div className="space-y-4 my-6">
      {/* Full-Width Segmented Tab Switcher */}
      <div className="w-full flex items-center p-1 rounded-md border border-neutral-300 dark:border-neutral-800 bg-neutral-100/50 dark:bg-neutral-900/50 font-mono text-xs">
        {(["merged", "open"] as const).map((tab) => {
          const isSelected = activeTab === tab;
          const label = tab === "merged" ? "Merged PRs" : "Open PRs";
          const Icon = tab === "merged" ? GitMerge : GitPullRequest;

          return (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`relative flex-1 py-1.5 flex items-center justify-center gap-2 rounded transition-colors duration-150 select-none cursor-pointer ${
                isSelected
                  ? "text-neutral-900 dark:text-neutral-50 font-medium"
                  : "text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"
              }`}
            >
              {isSelected && (
                <motion.span
                  layoutId="os-tab-pill"
                  className="absolute inset-0 rounded bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-2xs"
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                <Icon className={`w-3.5 h-3.5 ${isSelected ? (tab === "merged" ? "text-purple-600 dark:text-purple-400" : "text-emerald-600 dark:text-emerald-400") : ""}`} />
                <span>{label}</span>
              </span>
            </button>
          );
        })}
      </div>

      {/* Blueprint Outer Container */}
      <div className="relative border border-neutral-200 dark:border-neutral-800 rounded-lg p-5 sm:p-6 bg-neutral-50/50 dark:bg-neutral-900/30 overflow-hidden">
        {/* Dashed Vertical Timeline Line */}
        <div className="absolute left-[34px] sm:left-[38px] top-6 bottom-6 w-px border-r border-dashed border-neutral-300 dark:border-neutral-800" />

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="space-y-8 relative"
          >
            {activeGroups.length === 0 ? (
              <div className="text-center py-10 px-4 font-mono space-y-1.5">
                <GitFork className="w-6 h-6 mx-auto text-neutral-400 dark:text-neutral-600" />
                <p className="text-xs text-neutral-600 dark:text-neutral-400">
                  No {activeTab === "merged" ? "merged" : "open"} pull requests found.
                </p>
              </div>
            ) : (
              activeGroups.map((group, gIdx) => (
                <div key={group.id || gIdx} className="relative flex items-start gap-4 sm:gap-5">
                  {/* Square Monospace Icon Node */}
                  <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center shrink-0 z-10 ring-4 ring-neutral-50 dark:ring-neutral-900">
                    <IconBrandGithub className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
                  </div>

                  {/* Repository Block */}
                  <div className="flex-1 min-w-0 pt-0.5 space-y-3 font-mono">
                    {/* Repository Header: Name, Link & Count Tag */}
                    <div className="flex items-center justify-between gap-2 flex-wrap pb-1 border-b border-dashed border-neutral-200 dark:border-neutral-800">
                      <a
                        href={group.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/repo inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-neutral-900 dark:text-neutral-100 hover:underline tracking-tight"
                      >
                        <span>{group.repoName}</span>
                        <ExternalLink className="w-3 h-3 text-neutral-400 group-hover/repo:text-neutral-700 dark:group-hover/repo:text-neutral-200 transition-colors" />
                      </a>

                      <span className="text-[10px] sm:text-[11px] text-neutral-500 dark:text-neutral-400">
                        [{group.activePRs.length} {group.activePRs.length === 1 ? "PR" : "PRs"}]
                      </span>
                    </div>

                    {/* PR List (Accordion Items - Collapsed by Default) */}
                    <div className="space-y-2">
                      {group.activePRs.map((pr) => {
                        const isExpanded = Boolean(expandedPRIds[pr.id]);
                        const dateString = pr.mergedAt || pr.createdAt;

                        return (
                          <div
                            key={pr.id}
                            className="rounded-md border border-neutral-200 dark:border-neutral-800/80 bg-white/70 dark:bg-neutral-900/60 transition-colors hover:border-neutral-300 dark:hover:border-neutral-700 overflow-hidden"
                          >
                            {/* Accordion Header Row */}
                            <button
                              type="button"
                              onClick={() => togglePR(pr.id)}
                              aria-expanded={isExpanded}
                              className="w-full p-2.5 sm:p-3 flex items-center justify-between gap-3 text-left cursor-pointer select-none transition-colors"
                            >
                              <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1">
                                {activeTab === "merged" ? (
                                  <GitMerge className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 shrink-0" />
                                ) : (
                                  <GitPullRequest className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                                )}

                                <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100 shrink-0">
                                  #{pr.number}
                                </span>

                                <span className="text-xs text-neutral-700 dark:text-neutral-300 truncate font-sans">
                                  {pr.title}
                                </span>
                              </div>

                              <div className="flex items-center gap-2 shrink-0">
                                {dateString && (
                                  <span className="text-[10px] sm:text-[11px] text-neutral-500 dark:text-neutral-400 hidden sm:inline-block">
                                    [{dateString}]
                                  </span>
                                )}

                                <motion.div
                                  animate={{ rotate: isExpanded ? 180 : 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="text-neutral-400 dark:text-neutral-500"
                                >
                                  <ChevronDown className="w-3.5 h-3.5" />
                                </motion.div>
                              </div>
                            </button>

                            {/* Accordion Expanded Content */}
                            <AnimatePresence initial={false}>
                              {isExpanded && (
                                <motion.div
                                  key="content"
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.2, ease: "easeInOut" }}
                                  className="overflow-hidden border-t border-dashed border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-950/40 px-3 py-2.5 space-y-2.5"
                                >
                                  {pr.description && (
                                    <p className="text-[11px] text-neutral-600 dark:text-neutral-400 font-sans leading-relaxed">
                                      {pr.description}
                                    </p>
                                  )}

                                  <div className="flex items-center justify-between gap-3 pt-1 text-[11px]">
                                    {/* Diff Statistics */}
                                    <div className="flex items-center gap-2 font-mono">
                                      {pr.additions !== undefined && (
                                        <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                                          +{pr.additions}
                                        </span>
                                      )}
                                      {pr.deletions !== undefined && (
                                        <span className="text-rose-600 dark:text-rose-400 font-medium">
                                          -{pr.deletions}
                                        </span>
                                      )}
                                    </div>

                                    {/* View on GitHub CTA */}
                                    <a
                                      href={pr.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1 font-mono font-medium text-neutral-800 dark:text-neutral-200 hover:text-neutral-950 dark:hover:text-white underline hover:no-underline transition-colors ml-auto"
                                    >
                                      <span>View on GitHub</span>
                                      <span>↗</span>
                                    </a>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
