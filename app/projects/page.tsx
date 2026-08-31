import BlueprintLayout from "@/components/layout/BlueprintLayout";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { getProjects } from "@/actions/projects";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Projects — Nikhil",
  description: "Featured projects, open source software, and applications built by Nikhil.",
};

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <BlueprintLayout>
      <div className="flex items-center gap-2 mb-2 text-neutral-800 dark:text-neutral-200 text-sm">
        <Link
          href="/"
          className="p-1 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors flex items-center"
        >
          <ArrowLeft className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
        </Link>
        <h1 className="font-semibold text-[20px] tracking-[-0.01em] text-neutral-900 dark:text-neutral-50">
          <span>Projects</span>
        </h1>
      </div>

      <p className="tracking-normal text-neutral-600 dark:text-neutral-400 max-w-2xl text-[14px] font-normal leading-[1.65] mt-1 mb-5">
        Everything That I Have Shipped
      </p>

      <div className="-mx-6 sm:-mx-8 h-px border-t border-dashed border-neutral-300 dark:border-neutral-800 my-4" />

      <ProjectsSection projects={projects} showAll={true} hideViewAllButton={true} />

      {/* FOOTER TEXT */}
      <p className="text-center text-[12px] sm:text-[13px] font-normal text-neutral-500 dark:text-neutral-400 mt-10">
        For more cool projects, visit my{" "}
        <a
          href="https://github.com/n1khil-choudhary"
          target="_blank"
          rel="noopener noreferrer"
          className="underline font-medium text-neutral-800 dark:text-neutral-200"
        >
          GitHub
        </a>
        .
      </p>
    </BlueprintLayout>
  );
}
