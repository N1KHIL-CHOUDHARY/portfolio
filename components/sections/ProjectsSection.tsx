"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { ProjectItem } from "@/lib/data";

export const ProjectCard = ({ project }: { project: ProjectItem }) => {
  const projectHref = `/projects/${project.slug || project.id}`;

  return (
    <motion.div
      initial="rest"
      whileHover="hover"
      animate="rest"
      className="group flex flex-col overflow-hidden rounded-2xl border border-neutral-200/80 bg-white p-3.5 transition-colors duration-200 hover:border-neutral-300 dark:border-neutral-800 dark:bg-neutral-900/60 dark:hover:border-neutral-700"
    >
      {/* 1. Backdrop Frame */}
      <Link href={projectHref} className="block overflow-hidden rounded-xl">
        <div
          className={`relative h-60 w-full overflow-hidden rounded-xl bg-gradient-to-br ${project.gradientClass}`}
        >
          {/* Ribbon Badge (if present) */}
          {project.badge && (
            <div className="absolute -right-11 top-6 z-30 rotate-45 bg-[#ffdc48] px-10 py-0.5 text-[11px] font-semibold text-neutral-900 shadow-sm">
              {project.badge}
            </div>
          )}

          {/* 2. Mockup Container (Bottom-Right Anchored + Diagonal Float on Hover) */}
          <motion.div
            variants={{
              rest: {
                x: 10,      
                y: 12,
              },
              hover: {
                x: 7,      
                y: 7,
              },
            }}
            transition={{ type: "spring", stiffness: 220, damping: 20 }}
            className="absolute bottom-0 right-0 h-[88%] w-[90%] overflow-hidden rounded-tl-xl border-l border-t border-white/20 bg-white dark:bg-neutral-950"
          >
            {project.thumbnail && (
              <Image
                src={project.thumbnail}
                alt={`${project.title} preview`}
                fill
                className="object-cover object-top"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            )}
          </motion.div>
        </div>
      </Link>

      {/* 3. Text Details */}
      <div className="flex flex-1 flex-col pt-4">
        <div className="flex items-center justify-between">
          <Link href={projectHref}>
            <h3 className="text-[17px] font-bold tracking-tight text-neutral-900 hover:text-neutral-700 dark:text-neutral-100 dark:hover:text-neutral-300">
              {project.title}
            </h3>
          </Link>

         
        </div>

        <p className="mt-0.5 text-[12px] font-medium text-neutral-500 dark:text-neutral-400">
          {project.subtitle}
        </p>

        {/* View Details Action Button */}
        <div className="mt-4 pt-3 flex items-center justify-between">
          <Link
            href={projectHref}
            className="group/btn inline-flex items-center gap-0.5 text-[12px] font-medium text-neutral-700 transition-all duration-200 hover:text-neutral-950 dark:text-neutral-300 dark:hover:text-white"
          >
            <span>View Details</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover/btn:translate-x-0.5" />
          </Link>

          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[12px] font-medium text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors"
            >
              <span>Visit</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export interface ProjectsProps {
  projects?: ProjectItem[];
  showAll?: boolean;
  hideViewAllButton?: boolean;
}

export function ProjectsSection({
  projects = [],
  showAll = true,
  hideViewAllButton = true,
}: ProjectsProps) {
  if (!projects || projects.length === 0) return null;

  const projectList = showAll ? projects : projects.slice(0, 2);

  return (
    <div className="relative overflow-hidden">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {projectList.map((project, idx) => (
          <motion.div
            key={project.slug || project.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: idx * 0.08 }}
          >
            <ProjectCard project={project} />
          </motion.div>
        ))}
      </div>

      
    </div>
  );
}

export default ProjectsSection;