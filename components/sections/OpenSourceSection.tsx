"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { GitMerge, ExternalLink } from "lucide-react";

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

export default function OpenSourceSection({
  projects,
  mergedPRs,
  openPRs,
}: OpenSourceSectionProps) {
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

      return Object.values(groupMap);
    }

    return [];
  }, [projects, mergedPRs, openPRs]);

  const activeGroups = useMemo(() => {
    return repoGroups
      .map((group) => ({
        ...group,
        activePRs: group.mergedPRs || [],
      }))
      .filter((group) => group.activePRs.length > 0);
  }, [repoGroups]);

  if (activeGroups.length === 0) {
    return (
      <p className="text-xs font-mono text-neutral-500 dark:text-neutral-500 py-4">
        No merged pull requests found.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {activeGroups.map((group, gIdx) => (
        <motion.div
          key={group.id || gIdx}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: gIdx * 0.04 }}
          className="space-y-1.5"
        >
          <div className="flex items-center gap-2 mb-1.5">
            <a
              href={group.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group/repo inline-flex items-center gap-1 text-[12px] font-semibold tracking-wide text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
            >
              <span>{group.repoName}</span>
              <ExternalLink className="w-3 h-3 opacity-0 group-hover/repo:opacity-100 transition-opacity" />
            </a>
            <span className="text-[11px] text-neutral-400 dark:text-neutral-500 font-normal">
              ({group.activePRs.length} {group.activePRs.length === 1 ? "PR" : "PRs"})
            </span>
          </div>

          <div className="space-y-0.5 divide-y divide-neutral-100 dark:divide-neutral-800/40">
            {group.activePRs.map((pr) => {
              const dateString = pr.mergedAt || pr.createdAt;
              return (
                <a
                  key={pr.id}
                  href={pr.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/pr flex items-baseline justify-between gap-4 py-1.5 transition-colors"
                >
                  <div className="flex items-baseline gap-2.5 min-w-0">
                    <GitMerge className="w-3 h-3 text-purple-500 dark:text-purple-400 shrink-0 translate-y-px" />
                    <span className="text-[11px] sm:text-[12px] text-neutral-400 dark:text-neutral-500 shrink-0 font-normal">
                      #{pr.number}
                    </span>
                    <span className="text-[13px] font-normal text-neutral-700 dark:text-neutral-300 group-hover/pr:text-neutral-950 dark:group-hover/pr:text-neutral-50 group-hover/pr:underline truncate transition-colors">
                      {pr.title}
                    </span>
                  </div>
                  {dateString && (
                    <span className="text-[11px] sm:text-[12px] text-neutral-400 dark:text-neutral-500 shrink-0 hidden sm:block font-normal">
                      {dateString}
                    </span>
                  )}
                </a>
              );
            })}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
