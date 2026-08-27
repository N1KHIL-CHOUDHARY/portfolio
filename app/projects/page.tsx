import BlueprintLayout from "@/components/BlueprintLayout";
import { ProjectsSection } from "@/components/ProjectsSection";
import { getProjects } from "@/actions/projects";
import Link from "next/link";

export const metadata = {
  title: "Projects — Nikhil",
  description: "Featured projects, open source software, and applications built by Nikhil.",
};

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <BlueprintLayout>
      <div className="flex items-center gap-2 mb-2 text-neutral-800 dark:text-neutral-200 font-mono text-sm">
        <Link href="/" className="hover:opacity-70 transition-opacity flex items-center">
          <span>&larr;</span>
        </Link>
        <h1 className="font-semibold text-xl tracking-tight text-neutral-900 dark:text-neutral-50 font-mono">
          <span className="link--elara">Projects</span>
        </h1>
      </div>

      <p className="tracking-tight text-neutral-600 dark:text-neutral-400 max-w-xl text-sm md:text-base mt-2 mb-6">
        Hi there! I love building stuff for people and am passionate about contributing to open source. Here are my projects and open source contributions—feel free to take a look.
      </p>

      {/* DASHED DIVIDER */}
      <div className="-mx-6 sm:-mx-8 h-px border-t border-dashed border-neutral-300 dark:border-neutral-800 my-6" />

      {/* PROJECTS GRID */}
      <ProjectsSection projects={projects} />

      {/* FOOTER TEXT */}
      <p className="text-center font-mono text-xs text-neutral-500 dark:text-neutral-400 mt-12">
        For more cool projects, visit my{" "}
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="underline font-medium text-neutral-800 dark:text-neutral-200"
        >
          Github
        </a>
        .
      </p>
    </BlueprintLayout>
  );
}
