"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, GitPullRequest, Bookmark } from "lucide-react";
import { OPEN_SOURCE_DATA } from "@/lib/data";

export interface PullRequestItem {
  id: string;
  title: string;
  number: number;
  url: string;
  repo: string;
  mergedAt?: string;
  createdAt?: string;
}

export interface OpenSourceProject {
  id: string;
  repoName: string;
  repoUrl: string;
  mergedPRs?: PullRequestItem[];
}

export interface OpenSourceRepo {
  name: string;
  url: string;
  description: string;
  stars?: number;
  forks?: number;
}

export interface MilestoneItem {
  id: string;
  title: string;
  organization: string;
  category: "certification" | "hackathon" | "recognition";
  date: string;
  url?: string;
  description?: string;
}

export interface SmallWinsSectionProps {
  milestones?: MilestoneItem[];
  repos?: OpenSourceRepo[];
  projects?: OpenSourceProject[];
  mergedPRs?: PullRequestItem[];
}

const DEFAULT_MILESTONES: MilestoneItem[] = [
  {
    id: "aws-cert",
    title: "AWS Certified Cloud Practitioner",
    organization: "Amazon Web Services",
    category: "certification",
    date: "2026",
    url: "https://www.credly.com/badges/bb48f20b-2d50-4dac-9a07-62b5a988bbac/public_url",
    description: "Cloud architecture, security fundamentals, and core services.",
  },
  {
    id: "sih-selection",
    title: "Smart India Hackathon (SIH) — Finalist",
    organization: "Internal Institute Selection",
    category: "hackathon",
    date: "2026",
    description: "Top 25 out of 200+ teams in college",
  },
];

export default function SmallWinsSection({
  milestones = DEFAULT_MILESTONES,
  repos,
  projects,
  mergedPRs,
}: SmallWinsSectionProps) {
  const activeRepos = useMemo(() => {
    if (repos && repos.length > 0) return repos;
    return OPEN_SOURCE_DATA?.repos || [];
  }, [repos]);

  const activePRs = useMemo(() => {
    if (projects && projects.length > 0) {
      return projects.flatMap((p) =>
        (p.mergedPRs || []).map((pr) => ({ ...pr, repoName: p.repoName }))
      );
    }
    return (mergedPRs || []).map((pr) => ({
      ...pr,
      repoName: pr.repo || "GitHub",
    }));
  }, [projects, mergedPRs]);

  return (
    <div className="w-full space-y-12 font-sans text-neutral-800 dark:text-neutral-200">
      {/* ─────────────────────────────────────────────────────────────
          1. Milestones & Recognition
      ─────────────────────────────────────────────────────────────── */}
      {milestones.length > 0 && (
        <section className="space-y-4">
          <header className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-900 pb-2">
            <h3 className="text-xs font-mono uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
              Milestones & Recognition
            </h3>
            <span className="text-xs font-mono text-neutral-400 dark:text-neutral-500">
              {milestones.length}
            </span>
          </header>

          <div className="divide-y divide-neutral-100 dark:divide-neutral-900">
            {milestones.map((item, idx) => {
              const Content = (
                <div className="group flex items-baseline justify-between gap-4 py-3 transition-colors hover:text-black dark:hover:text-white">
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium leading-snug">
                        {item.title}
                      </span>
                      {item.url && (
                        <ArrowUpRight className="h-3.5 w-3.5 text-neutral-400 opacity-0 transition-opacity group-hover:opacity-100" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                      <span>{item.organization}</span>
                      {item.description && (
                        <>
                          <span className="text-neutral-300 dark:text-neutral-700">·</span>
                          <span className="text-neutral-500 dark:text-neutral-500 line-clamp-1">
                            {item.description}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-2 text-xs font-mono text-neutral-400 dark:text-neutral-500">
                    <span className="hidden rounded bg-neutral-100 px-1.5 py-0.5 text-[10px] uppercase text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400 sm:inline">
                      {item.category}
                    </span>
                    <span>{item.date}</span>
                  </div>
                </div>
              );

              return (
                <motion.div
                  key={item.id || idx}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: idx * 0.04 }}
                >
                  {item.url ? (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block focus:outline-none focus-visible:ring-1 focus-visible:ring-neutral-400 rounded"
                    >
                      {Content}
                    </a>
                  ) : (
                    Content
                  )}
                </motion.div>
              );
            })}
          </div>
        </section>
      )}

      {/* ─────────────────────────────────────────────────────────────
          2. Open Source Work
      ─────────────────────────────────────────────────────────────── */}
      {(activeRepos.length > 0 || activePRs.length > 0) && (
        <section className="space-y-6">
          <header className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-900 pb-2">
            <h3 className="text-xs font-mono uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
              Open Source
            </h3>
            <span className="text-xs font-mono text-neutral-400 dark:text-neutral-500">
              {activeRepos.length + activePRs.length}
            </span>
          </header>

          {/* Sub-group: Repositories */}
          {activeRepos.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                <Bookmark className="h-3 w-3" />
                <span>Repositories</span>
              </div>
              <div className="divide-y divide-neutral-100 dark:divide-neutral-900">
                {activeRepos.map((repo, idx) => (
                  <motion.a
                    key={repo.name || idx}
                    href={repo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: idx * 0.03 }}
                    className="group flex items-baseline justify-between gap-4 py-2.5 transition-colors hover:text-black dark:hover:text-white"
                  >
                    <div className="flex min-w-0 items-baseline gap-2">
                      <span className="text-sm font-medium leading-snug">
                        {repo.name}
                      </span>
                      {repo.description && (
                        <span className="hidden text-xs text-neutral-500 dark:text-neutral-500 line-clamp-1 sm:inline">
                          — {repo.description}
                        </span>
                      )}
                    </div>
                    <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-neutral-400 opacity-0 transition-opacity group-hover:opacity-100" />
                  </motion.a>
                ))}
              </div>
            </div>
          )}

          {/* Sub-group: Pull Requests */}
          {activePRs.length > 0 && (
            <div className="space-y-2 pt-2">
              <div className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                <GitPullRequest className="h-3 w-3" />
                <span>Merged Contributions</span>
              </div>
              <div className="divide-y divide-neutral-100 dark:divide-neutral-900">
                {activePRs.map((pr, idx) => {
                  const dateString = pr.mergedAt || pr.createdAt;
                  return (
                    <motion.a
                      key={pr.id || idx}
                      href={pr.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25, delay: idx * 0.03 }}
                      className="group flex items-baseline justify-between gap-4 py-2.5 transition-colors hover:text-black dark:hover:text-white"
                    >
                      <div className="flex min-w-0 items-baseline gap-2.5">
                        <span className="shrink-0 font-mono text-xs text-neutral-400 dark:text-neutral-500">
                          {pr.repoName}#{pr.number}
                        </span>
                        <span className="truncate text-sm text-neutral-700 dark:text-neutral-300 group-hover:text-black dark:group-hover:text-white">
                          {pr.title}
                        </span>
                      </div>

                      <div className="flex shrink-0 items-center gap-2">
                        {dateString && (
                          <span className="hidden font-mono text-xs text-neutral-400 sm:inline">
                            {dateString}
                          </span>
                        )}
                        <ArrowUpRight className="h-3.5 w-3.5 text-neutral-400 opacity-0 transition-opacity group-hover:opacity-100" />
                      </div>
                    </motion.a>
                  );
                })}
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}