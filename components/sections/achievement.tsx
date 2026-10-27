"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
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
    date: "2024",
    url: "https://www.credly.com/badges/bb48f20b-2d50-4dac-9a07-62b5a988bbac/public_url",
    description: "Cloud architecture, security fundamentals, and core services.",
  },
  {
    id: "sih-selection",
    title: "Smart India Hackathon (SIH) — Finalist",
    organization: "Internal Institute Selection",
    category: "hackathon",
    date: "2024",
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
    <div className="w-full space-y-8 font-sans">
      {/* ─────────────────────────────────────────────────────────────
          1. Milestones Storyline
      ─────────────────────────────────────────────────────────────── */}
      {milestones.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
            <span>Milestones & Recognition</span>
            <span className="text-[11px] lowercase font-normal">
              {milestones.length} logged
            </span>
          </div>

          <div className="relative pl-5 border-l border-neutral-200 dark:border-neutral-800 ml-1.5 space-y-4">
            {milestones.map((item, idx) => {
              const InnerContent = (
                <div className="group relative -ml-[27px] flex items-start gap-3">
                  {/* Subtle Node */}
                  <div className="mt-1 flex items-center justify-center w-3.5 h-3.5 rounded-full bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 transition-colors group-hover:border-neutral-500">
                    <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 dark:bg-neutral-500 group-hover:bg-neutral-900 dark:group-hover:bg-neutral-100 transition-colors" />
                  </div>

                  {/* Text Details */}
                  <div className="flex-1 min-w-0 -mt-0.5">
                    <div className="flex items-baseline justify-between gap-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-[13px] font-medium text-neutral-800 dark:text-neutral-200 group-hover:text-black dark:group-hover:text-white transition-colors truncate">
                          {item.title}
                        </span>
                        <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded border border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 leading-none shrink-0">
                          {item.category === "certification" ? "certification" : item.category}
                        </span>
                      </div>

                      <span className="text-[11px] font-mono text-neutral-400 dark:text-neutral-500 shrink-0">
                        {item.date}
                      </span>
                    </div>

                    <div className="mt-0.5 flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
                      <span>{item.organization}</span>
                      {item.description && (
                        <>
                          <span className="text-neutral-300 dark:text-neutral-700">·</span>
                          <span className="truncate text-neutral-400 dark:text-neutral-500">
                            {item.description}
                          </span>
                        </>
                      )}
                      {item.url && (
                        <ExternalLink className="w-3 h-3 text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity ml-1 shrink-0" />
                      )}
                    </div>
                  </div>
                </div>
              );

              return (
                <motion.div
                  key={item.id || idx}
                  initial={{ opacity: 0, y: 3 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: idx * 0.04 }}
                >
                  {item.url ? (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block focus:outline-none focus-visible:ring-1 focus-visible:ring-neutral-400 rounded"
                    >
                      {InnerContent}
                    </a>
                  ) : (
                    InnerContent
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          2. Open Source Storyline
      ─────────────────────────────────────────────────────────────── */}
      {(activeRepos.length > 0 || activePRs.length > 0) && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
            <span>Open Source Contributions</span>
            <span className="text-[11px] lowercase font-normal">
              {activeRepos.length + activePRs.length} total
            </span>
          </div>

          <div className="relative pl-5 border-l border-neutral-200 dark:border-neutral-800 ml-1.5 space-y-3">
            {/* Repositories */}
            {activeRepos.map((repo, idx) => (
              <motion.a
                key={repo.name || idx}
                href={repo.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.2,
                  delay: (milestones.length + idx) * 0.03,
                }}
                className="group relative -ml-[27px] flex items-start gap-3"
              >
                <div className="mt-1 flex items-center justify-center w-3.5 h-3.5 rounded-full bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 transition-colors group-hover:border-neutral-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 dark:bg-neutral-500 group-hover:bg-neutral-900 dark:group-hover:bg-neutral-100 transition-colors" />
                </div>

                <div className="flex items-baseline justify-between gap-3 flex-1 min-w-0 -mt-0.5">
                  <div className="flex items-baseline gap-2 min-w-0">
                    <span className="text-[13px] font-medium text-neutral-800 dark:text-neutral-200 group-hover:text-black dark:group-hover:text-white transition-colors truncate">
                      {repo.name}
                    </span>
                    {repo.description && (
                      <span className="text-xs text-neutral-400 dark:text-neutral-500 truncate hidden sm:inline">
                        — {repo.description}
                      </span>
                    )}
                  </div>

                  <ExternalLink className="w-3 h-3 text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                </div>
              </motion.a>
            ))}

            {/* Pull Requests */}
            {activePRs.map((pr, idx) => {
              const dateString = pr.mergedAt || pr.createdAt;
              return (
                <motion.a
                  key={pr.id || idx}
                  href={pr.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 3 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.2,
                    delay:
                      (milestones.length + activeRepos.length + idx) * 0.03,
                  }}
                  className="group relative -ml-[27px] flex items-start gap-3"
                >
                  <div className="mt-1 flex items-center justify-center w-3.5 h-3.5 rounded-full bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 transition-colors group-hover:border-neutral-500">
                    <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 dark:bg-neutral-500 group-hover:bg-neutral-900 dark:group-hover:bg-neutral-100 transition-colors" />
                  </div>

                  <div className="flex items-baseline justify-between gap-3 flex-1 min-w-0 -mt-0.5">
                    <div className="flex items-baseline gap-2 min-w-0">
                      <span className="font-mono text-[11px] text-neutral-400 dark:text-neutral-500 shrink-0">
                        {pr.repoName}#{pr.number}
                      </span>
                      <span className="text-[13px] text-neutral-700 dark:text-neutral-300 group-hover:text-neutral-950 dark:group-hover:text-white transition-colors truncate">
                        {pr.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 font-mono text-[11px] text-neutral-400">
                      {dateString && (
                        <span className="hidden sm:inline">{dateString}</span>
                      )}
                      <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </motion.a>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}