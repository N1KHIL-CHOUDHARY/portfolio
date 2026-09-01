"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import AnimatedButton from "@/components/ui/AnimatedButton";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

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
] as const;

export const ProjectCard = ({
  project,
  idx,
}: {
  project: ProjectCardItem;
  idx: number;
}) => {
  const bgImage = BG_IMAGES[idx +1  % BG_IMAGES.length] ?? BG_IMAGES[0];

  const imageSrc =
    project.thumbnail ||
    project.imageUrl ||
    project.src ||
    bgImage;

  const targetUrl = `/projects/${project.slug}`;

  return (
    <div className="group relative z-10 p-2.5 sm:p-3.5 flex flex-col h-full">
      <div className="flex w-full flex-col gap-2.5 flex-1">
        <Link
          href={targetUrl}
          className="block rounded-[10px] border border-neutral-200 dark:border-neutral-800 p-[3px] bg-neutral-100/80 dark:bg-neutral-900/50 cursor-pointer transition-colors duration-200"
        >
          <motion.div
            initial="rest"
            whileHover="hover"
            animate="rest"
            className="relative h-[175px] sm:h-[185px] md:h-[195px] w-full overflow-hidden rounded-[7px] border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 select-none transition-colors duration-200"
          >
            <motion.div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url('${bgImage}')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
              variants={{
                rest: { opacity: 0, scale: 1 },
                hover: { opacity: 1, scale: 1.08 },
              }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            />

            <motion.div
              className="absolute bottom-0 left-1/2 w-[85%] sm:w-[82%] p-[2px] pb-0 z-20"
              variants={{
                rest: { height: "78%", y: 0, x: "-50%" },
                hover: { height: "75%", y: 3, x: "-50%" },
              }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
              <div className="size-full rounded-t-[5px] relative">
                <Image
                  src={imageSrc}
                  alt={`${project.title} preview`}
                  width={600}
                  height={400}
                  className="size-full object-cover"
                />
              </div>
            </motion.div>
          </motion.div>
        </Link>

        <div className="flex flex-col flex-1 px-0.5 justify-between gap-2.5">
          <div>
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-[14px] font-semibold text-neutral-900 dark:text-neutral-100 tracking-tight leading-snug">
                {project.title}
              </h3>
              
              <span className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400">
                Live
              </span>
            </div>

            <p className="line-clamp-2 text-[13px] text-neutral-600 dark:text-neutral-400 font-normal leading-[1.5] mt-1.5">
              {project.description}
            </p>
          </div>

          <div className="pt-1 flex items-center justify-between">
            <Link
              href={targetUrl}
              className="group/link text-[12px] font-medium text-neutral-600 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-neutral-100 flex items-center gap-1 transition-colors duration-200"
            >
              View Details 
              <span className="group-hover/link:rotate-45 transition-transform duration-200">
                <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export interface ProjectsProps {
  projects?: any[];
  showAll?: boolean;
  hideViewAllButton?: boolean;
}

export function ProjectsSection({ projects = [], showAll = true, hideViewAllButton = false }: ProjectsProps) {
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
    <div className="relative overflow-hidden">
      <div className="grid grid-cols-1 sm:grid-cols-2">
        {projectList.map((project, idx) => {
          const isLeft = idx % 2 === 0;
          const isFirstRow = idx < 2;

          return (
            <motion.div
              key={project.slug || String(project.id)}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className={`
                relative

                /* Vertical center divider */
                ${isLeft
                  ? "sm:border-r sm:border-dashed sm:border-neutral-300 dark:sm:border-neutral-800"
                  : ""}

                /* Horizontal row divider */
                ${!isFirstRow
                  ? "sm:border-t sm:border-dashed sm:border-neutral-300 dark:sm:border-neutral-800"
                  : ""}

                /* Mobile */
                ${idx < projectList.length - 1
                  ? "max-sm:border-b max-sm:border-dashed max-sm:border-neutral-300 dark:max-sm:border-neutral-800"
                  : ""}
              `}
            >
              <ProjectCard project={project} idx={idx} />
            </motion.div>
          );
        })}
      </div>

      {!hideViewAllButton && (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex justify-center mt-5"
        >
          <Link href="/projects">
            <AnimatedButton
              className="group relative overflow-hidden rounded-lg 
                      bg-gradient-to-b from-white to-neutral-100 dark:from-neutral-800 dark:to-neutral-900 
                      border border-neutral-200 dark:border-neutral-800 
                      text-neutral-800 dark:text-neutral-200 text-[12px] sm:text-[13px] font-medium px-5 py-2 
                      transition-all duration-200 
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