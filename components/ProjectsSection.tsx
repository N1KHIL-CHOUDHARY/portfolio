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
  backgroundImage?: string;
  featured?: boolean;
}

const BG_IMAGES = [
  "/images/project section/image copy 2.png",
  "/images/project section/image copy 3.png",
  "/images/project section/image copy 4.png",
  "/images/project section/image copy 5.png",
];

export const ProjectCard = ({
  project,
  idx,
}: {
  project: ProjectCardItem;
  idx: number;
}) => {
  const imageSrc =
    project.thumbnail ||
    project.imageUrl ||
    project.src ||
    "/images/project section/image copy 2.png";

  // Deterministic selection among copy 2 to 5 based on project slug/title and index
  const seed = (project.slug || project.title || "")
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), idx);
  const bgImage = BG_IMAGES[Math.abs(seed) % BG_IMAGES.length];

  const targetUrl = `/projects/${project.slug}`;

  return (
    <motion.div
      className="group relative z-10 rounded-xl border border-neutral-200 dark:border-neutral-800 p-3 transition-all duration-300 hover:border-neutral-300 dark:hover:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-900/30 hover:shadow-2xl hover:shadow-neutral-500/5 flex flex-col"
      initial="rest"
      whileHover="hover"
      animate="rest"
    >
      <div className="flex w-full flex-col gap-3.5 flex-1">
        {/* Ambient Background & Screenshot Container */}
        <Link
          href={targetUrl}
          className="block rounded-[12px] border border-neutral-200 dark:border-neutral-800 p-[4px] bg-neutral-100/80 dark:bg-neutral-900/50 cursor-pointer"
        >
          <div className="relative h-[210px] w-full overflow-hidden rounded-[8px] border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 select-none">
            {/* Ambient Background with Zoom */}
            <motion.div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url('${bgImage}')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
              variants={{
                rest: { opacity: 0, scale: 1 },
                hover: { opacity: 1, scale: 1.05 },
              }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />

            {/* View Project Hover Banner */}
            <motion.h1
              className="absolute text-[11px] font-bold font-mono text-neutral-900 dark:text-neutral-50 z-30 uppercase tracking-widest drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]"
              variants={{
                rest: {
                  left: "0.75rem",
                  top: "0.75rem",
                  x: "0%",
                  opacity: 0,
                },
                hover: {
                  left: "50%",
                  top: "22%",
                  x: "-50%",
                  opacity: 1,
                },
              }}
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
            >
              View Project
            </motion.h1>

            {/* Floating Screenshot Preview */}
            <motion.div
              className="absolute bottom-0 left-1/2 w-[82%] rounded-t-[6px] bg-white dark:bg-neutral-950 p-[2px] pb-0 shadow-2xl z-20 border-x border-t border-neutral-200 dark:border-neutral-800"
              variants={{
                rest: { height: "76%", y: 0, x: "-50%" },
                hover: { height: "70%", y: 4, x: "-50%" },
              }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
              <div className="size-full overflow-hidden rounded-t-[4px] relative">
                <Image
                  src={imageSrc}
                  alt={`${project.title} preview`}
                  width={600}
                  height={400}
                  className="size-full object-cover"
                />
              </div>
            </motion.div>
          </div>
        </Link>

        {/* Content Details */}
        <div className="flex flex-col flex-1 px-1 justify-between gap-3">
          <div className="space-y-1.5">
            <Link href={targetUrl} className="hover:underline">
              <h3 className="text-base font-bold font-mono tracking-tight text-neutral-900 dark:text-neutral-100 transition-colors duration-300">
                {project.title}
              </h3>
            </Link>

            <p className="line-clamp-2 text-xs text-neutral-600 dark:text-neutral-400 font-sans leading-relaxed">
              {project.description}
            </p>
          </div>

          {/* Bottom Action CTA */}
          <div className="pt-2 border-t border-dashed border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
            <Link
              href={targetUrl}
              className="text-xs font-mono font-medium text-neutral-800 dark:text-neutral-200 hover:underline flex items-center gap-1 group-hover:text-neutral-950 dark:group-hover:text-white transition-colors"
            >
              View Details ↗
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
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
    backgroundImage: p.backgroundImage || p.thumbnail || p.imageUrl,
    featured: p.featured,
  }));

  if (!displayProjects || displayProjects.length === 0) {
    return null;
  }

  const projectList = showAll ? displayProjects : displayProjects.slice(0, 2);

  return (
    <div className="mt-4 space-y-4">
      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4">
        {projectList.map((project, idx) => (
          <motion.div
            key={project.slug || String(project.id)}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
          >
            <ProjectCard project={project} idx={idx} />
          </motion.div>
        ))}
      </div>

      {!showAll && displayProjects.length > 2 && (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="flex justify-center mt-6"
        >
          <Link href="/projects">
            <AnimatedButton
              className="group relative overflow-hidden rounded-lg 
                      bg-gradient-to-b from-white to-neutral-100 dark:from-neutral-800 dark:to-neutral-900 
                      border border-neutral-200 dark:border-neutral-800 
                      text-neutral-800 dark:text-neutral-200 text-xs sm:text-sm font-mono px-6 py-2.5 
                      transition-all duration-300 
                      hover:from-neutral-50 hover:to-neutral-100 dark:hover:from-neutral-800 dark:hover:to-neutral-800
                      shadow-[0_1px_2px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,1)] 
                      dark:shadow-[0_1px_2px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.05)] cursor-pointer"
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
