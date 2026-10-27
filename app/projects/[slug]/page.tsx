import type { Metadata } from 'next'
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowUpRight, Globe, Layers } from 'lucide-react'
import { IconBrandGithub } from '@tabler/icons-react'
import { getPortfolioProjectBySlug, getPortfolioProjects } from '@/lib/db'
import BlueprintLayout from '@/components/layout/BlueprintLayout'
import TechStackBadges from '@/components/features/TechStackBadges'
import { getProjectJsonLd, SITE_NAME, SITE_URL } from '@/lib/seo'
import { normalizeMediaPath } from '@/lib/utils'

export async function generateStaticParams() {
  const projects = await getPortfolioProjects()
  return projects.map((project) => ({
    slug: project.slug,
  }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const project = await getPortfolioProjectBySlug(slug)
  if (!project) return { title: 'Project Not Found' }

  const projectImage = project.thumbnail?.startsWith('http')
    ? project.thumbnail
    : project.thumbnail
    ? `${SITE_URL}${project.thumbnail}`
    : `${SITE_URL}/banner.png`

  return {
    title: project.title,
    description: project.description,
    keywords: [
      project.title,
      ...(project.tags || []),
      'Case Study',
      'Full Stack Project',
      'Nikhil H',
    ],
    alternates: {
      canonical: `/projects/${project.slug}`,
    },
    openGraph: {
      title: `${project.title} | ${SITE_NAME}`,
      description: project.description,
      url: `${SITE_URL}/projects/${project.slug}`,
      type: 'article',
      images: [
        {
          url: projectImage,
          width: 1200,
          height: 630,
          alt: `${project.title} Preview`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${project.title} | ${SITE_NAME}`,
      description: project.description,
      images: [projectImage],
    },
  }
}

export default async function ProjectCaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const project = await getPortfolioProjectBySlug(slug)

  if (!project) {
    notFound()
  }

  const jsonLd = getProjectJsonLd(project)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />
      <BlueprintLayout>
        <div className="w-full space-y-6 font-mono text-xs sm:text-sm">
          
          {/* Header Navigation & Title */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200/80 dark:border-neutral-800/80 pb-3.5">
            <div className="flex items-center gap-2.5">
              <Link
                className="group/back p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-neutral-100 transition-colors flex items-center"
                href="/projects"
                aria-label="Back to projects"
              >
                <ArrowLeft className="w-4 h-4 transition-transform group-hover/back:-translate-x-0.5" />
              </Link>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-bold text-base sm:text-lg text-neutral-900 dark:text-neutral-100">
                    {project.title}
                  </h1>
                 
                </div>
                
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/code inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-neutral-300/80 dark:border-neutral-700/80 bg-neutral-100/70 dark:bg-neutral-900/80 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-200/80 dark:hover:bg-neutral-800 transition-all"
                >
                  <IconBrandGithub className="w-3.5 h-3.5 text-neutral-700 dark:text-neutral-300" />
                  <span>Code</span>
                  <ArrowUpRight className="w-3 h-3 text-neutral-400 opacity-60 group-hover/code:opacity-100 group-hover/code:translate-x-0.5 group-hover/code:-translate-y-0.5 transition-all" />
                </a>
              )}

              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/live inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-all shadow-sm"
                >
                  <Globe className="w-3.5 h-3.5 text-neutral-300 dark:text-neutral-600" />
                  <span>Live</span>
                  <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover/live:translate-x-0.5 group-hover/live:-translate-y-0.5" />
                </a>
              )}
            </div>
          </div>

          {/* Media Player / Image Showcase */}
          <div className="w-full flex flex-col items-center justify-center gap-3">
            <div className="w-full max-w-[680px] rounded-xl overflow-hidden border border-neutral-200/80 dark:border-neutral-800/80 bg-neutral-100 dark:bg-neutral-900/40">
              {project.videoUrl ? (
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                
                  className="w-full h-auto mx-auto block"
                >
                  <source src={normalizeMediaPath(project.videoUrl)} type="video/mp4" />
                </video>
              ) : project.thumbnail ? (
                <div className="relative w-full aspect-video">
                  <Image
                    src={normalizeMediaPath(project.thumbnail)}
                    alt={project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 680px"
                    className="object-cover"
                    priority

                  />
                </div>
              ) : null}
            </div>
          </div>

          {/* Overview & Content */}
          <div className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed font-sans space-y-4">
            <p className="font-medium text-neutral-900 dark:text-neutral-100">
              {project.description}
            </p>
            {project.content && (
              <div className="whitespace-pre-line text-neutral-600 dark:text-neutral-400">
                {project.content}
              </div>
            )}
          </div>

         
         

          {/* Tech Stack Badges */}
          {project.tags && project.tags.length > 0 && (
            <div className="pt-3 border-t border-neutral-200/80 dark:border-neutral-800/80 space-y-2">
              <div className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400" />
                <h2 className="text-xs font-bold font-mono text-neutral-900 dark:text-neutral-100 uppercase tracking-wider">
                  Stack Used
                </h2>
              </div>
              <TechStackBadges skills={project.tags.map((t) => ({ name: t }))} />
            </div>
          )}

        </div>
      </BlueprintLayout>  
    </>
  )
}