"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import AnimatedButton from "@/components/ui/AnimatedButton";
import { motion } from "framer-motion";

export interface ProjectCardItem {
  id?: string;
  title: string;
  slug: string;
  description: string;
  imageUrl?: string | null;
  thumbnail?: string | null;
  src?: string;
  liveUrl?: string | null;
  demoUrl?: string | null;
  githubUrl?: string | null;
  status?: string | null;
  isLive?: boolean;
  featured?: boolean;
  tags?: string[];
}

export const ProjectCard = ({
  project,
}: {
  project: ProjectCardItem;
  idx?: number;
}) => {
  const imageSrc =
    project.thumbnail ||
    project.imageUrl ||
    project.src ||
    "/images/project section/image copy 2.png";

  const targetUrl = `/projects/${project.slug}`;
  const isLive = Boolean(project.isLive || project.liveUrl || project.demoUrl || project.status === "live");

  return (
    <div className="group relative rounded-lg border border-neutral-200 dark:border-neutral-800 p-3 bg-neutral-50/50 dark:bg-neutral-900/30 transition-all duration-300 hover:border-neutral-400 dark:hover:border-neutral-600 flex flex-col justify-between h-full">
      <div className="flex w-full flex-col gap-3">
        {/* Media Preview Container */}
        <Link
          href={targetUrl}
          className="relative block w-full aspect-[16/10] overflow-hidden rounded-md border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 select-none cursor-pointer"
        >
          <Image
            src={imageSrc}
            alt={`${project.title} preview`}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
          />

          {/* Top-Left Preview Label Overlay */}
          <div className="absolute top-2.5 left-2.5 z-10 px-2 py-0.5 rounded text-[10px] font-mono font-medium uppercase tracking-wider bg-neutral-900/80 text-neutral-200 dark:bg-black/80 dark:text-neutral-300 backdrop-blur-xs border border-white/10 dark:border-white/10 select-none">
            Preview
          </div>

          {/* Live Status Badge */}
          {isLive && (
            <div className="absolute top-2.5 right-2.5 z-10 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300/60 dark:border-emerald-800/60 select-none backdrop-blur-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Live</span>
            </div>
          )}
        </Link>

        {/* Content Details */}
        <div className="flex flex-col gap-1.5 px-0.5">
          <Link href={targetUrl} className="hover:underline">
            <h3 className="text-sm sm:text-base font-bold font-mono tracking-tight text-neutral-900 dark:text-neutral-100 transition-colors">
              {project.title}
            </h3>
          </Link>

          <p className="line-clamp-2 text-xs text-neutral-600 dark:text-neutral-400 font-sans leading-relaxed">
            {project.description}
          </p>
        </div>
      </div>

      {/* Bottom Action / Details Link */}
      <div className="mt-4 pt-2.5 border-t border-dashed border-neutral-200 dark:border-neutral-800 flex items-center justify-between font-mono text-xs">
        <Link
          href={targetUrl}
          className="font-medium text-neutral-800 dark:text-neutral-200 hover:text-neutral-950 dark:hover:text-white inline-flex items-center gap-1 group-hover:underline"
        >
          <span>View Details</span>
          <span className="text-neutral-400 dark:text-neutral-500">&rarr;</span>
        </Link>

        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] text-neutral-500 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white transition-colors"
          >
            Visit ↗
          </a>
        )}
      </div>
    </div>
  );
};

export interface ProjectsProps {
  projects?: any[];
  showAll?: boolean;
}

export function ProjectsSection({ projects = [], showAll = true }: ProjectsProps) {
  const displayProjects: ProjectCardItem[] = (projects || []).map((p: any) => ({
    id: p.id || p.slug,
    title: p.title,
    slug: p.slug,
    description: p.description,
    thumbnail: p.thumbnail || p.imageUrl || p.src,
    imageUrl: p.imageUrl || p.thumbnail,
    liveUrl: p.liveUrl || p.demoUrl,
    demoUrl: p.demoUrl || p.liveUrl,
    githubUrl: p.githubUrl || p.repoUrl,
    status: p.status,
    isLive: Boolean(p.isLive || p.liveUrl || p.demoUrl || p.status === "live"),
    featured: p.featured,
    tags: p.tags || [],
  }));

  if (!displayProjects || displayProjects.length === 0) {
    return null;
  }

  const projectList = showAll ? displayProjects : displayProjects.slice(0, 4);

  return (
    <div className="my-4 space-y-4">
      {/* 2-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-2">
        {projectList.map((project, idx) => (
          <motion.div
            key={project.slug || String(project.id || idx)}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
          >
            <ProjectCard project={project} idx={idx} />
          </motion.div>
        ))}
      </div>

      {!showAll && displayProjects.length > 4 && (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex justify-center mt-6"
        >
          <Link href="/projects">
            <AnimatedButton
              className="group relative overflow-hidden rounded-lg 
                      bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700
                      border border-neutral-300 dark:border-neutral-700 
                      text-neutral-800 dark:text-neutral-200 text-xs sm:text-sm font-mono px-6 py-2.5 
                      transition-all duration-200 cursor-pointer"
            >
              View all projects
            </AnimatedButton>
          </Link>
        </motion.div>
      )}
    </div>
  );
}

export default ProjectsSection;
