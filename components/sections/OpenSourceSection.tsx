"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import {
  GitMerge,
  ExternalLink,
  Award,
  Trophy,
  CheckCircle2,
  Calendar,
} from "lucide-react";

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
    url: "https://aws.amazon.com/verification",
    description: "Cloud architecture, security fundamentals, and core services.",
  },
  {
    id: "sih-selection",
    title: "Smart India Hackathon (SIH) — College Finalist",
    organization: "Internal Institute Selection",
    category: "hackathon",
    date: "2024",
    description: "Selected to represent the college at the national level.",
  },
];

export default function SmallWinsSection({
  milestones = DEFAULT_MILESTONES,
  projects,
  mergedPRs,
}: SmallWinsSectionProps) {
  // Normalize open source items
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

  const getCategoryIcon = (category: MilestoneItem["category"]) => {
    switch (category) {
      case "certification":
        return <Award className="w-3.5 h-3.5 text-amber-500 shrink-0 translate-y-px" />;
      case "hackathon":
        return <Trophy className="w-3.5 h-3.5 text-blue-500 shrink-0 translate-y-px" />;
      default:
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 translate-y-px" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* ─────────────────────────────────────────────────────────────
          1. Certifications, Competitions & Key Highlights
      ─────────────────────────────────────────────────────────────── */}
      <div className="space-y-2">
        <h3 className="text-[12px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 font-mono">
          Highlights &amp; Certifications
        </h3>

        <div className="space-y-0.5 divide-y divide-neutral-100 dark:divide-neutral-800/40">
          {milestones.map((item, idx) => {
            const Content = (
              <div className="group/item flex items-baseline justify-between gap-4 py-2 transition-colors">
                <div className="flex items-baseline gap-2.5 min-w-0">
                  {getCategoryIcon(item.category)}
                  <span className="text-[13px] font-normal text-neutral-800 dark:text-neutral-200 group-hover/item:text-neutral-950 dark:group-hover/item:text-neutral-50 transition-colors">
                    {item.title}
                  </span>
                  <span className="text-[11px] text-neutral-400 dark:text-neutral-500 shrink-0 hidden sm:inline">
                    · {item.organization}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[11px] sm:text-[12px] text-neutral-400 dark:text-neutral-500 font-mono">
                    {item.date}
                  </span>
                  {item.url && (
                    <ExternalLink className="w-3 h-3 text-neutral-400 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                  )}
                </div>
              </div>
            );

            return (
              <motion.div
                key={item.id || idx}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15, delay: idx * 0.04 }}
              >
                {item.url ? (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
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
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. Open Source Merged PRs
      ─────────────────────────────────────────────────────────────── */}
      {activePRs.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-[12px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 font-mono">
              Open Source Contributions
            </h3>
            <span className="text-[11px] text-neutral-400 dark:text-neutral-500 font-normal">
              {activePRs.length} {activePRs.length === 1 ? "PR merged" : "PRs merged"}
            </span>
          </div>

          <div className="space-y-0.5 divide-y divide-neutral-100 dark:divide-neutral-800/40">
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
                  transition={{ duration: 0.15, delay: (milestones.length + idx) * 0.03 }}
                  className="group/pr flex items-baseline justify-between gap-4 py-1.5 transition-colors"
                >
                  <div className="flex items-baseline gap-2.5 min-w-0">
                    <GitMerge className="w-3.5 h-3.5 text-purple-500 dark:text-purple-400 shrink-0 translate-y-px" />
                    <span className="text-[11px] text-neutral-500 dark:text-neutral-400 shrink-0 font-medium">
                      {pr.repoName}
                    </span>
                    <span className="text-[11px] text-neutral-400 dark:text-neutral-500 shrink-0 font-normal">
                      #{pr.number}
                    </span>
                    <span className="text-[13px] font-normal text-neutral-700 dark:text-neutral-300 group-hover/pr:text-neutral-950 dark:group-hover/pr:text-neutral-50 group-hover/pr:underline truncate transition-colors">
                      {pr.title}
                    </span>
                  </div>

                  {dateString && (
                    <span className="text-[11px] sm:text-[12px] text-neutral-400 dark:text-neutral-500 shrink-0 hidden sm:block font-mono">
                      {dateString}
                    </span>
                  )}
                </motion.a>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}