import type { Metadata } from 'next'
import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Globe, Newspaper } from 'lucide-react'
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

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const project = await getPortfolioProjectBySlug(slug)
  if (!project) return { title: 'Project Not Found' }

  const projectImage = project.imageUrl?.startsWith('http')
    ? project.imageUrl
    : project.imageUrl
    ? `${SITE_URL}${project.imageUrl}`
    : `${SITE_URL}/banner.png`

  return {
    title: project.title,
    description: project.description,
    keywords: [project.title, ...(project.tags || []), 'Case Study', 'Full Stack Project', 'Nikhil Choudhary'],
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

export default async function ProjectCaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
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
      <div className="w-full space-y-4 font-mono text-xs sm:text-sm">
        
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-200/80 dark:border-neutral-800/80 pb-3">
          <div className="flex items-center gap-2">
            <Link
              className="p-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              href="/projects"
            >
              <ArrowLeft className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
            </Link>
            <span className="font-bold text-base sm:text-lg text-neutral-900 dark:text-neutral-100">
              {project.title}
            </span>
          </div>
        </div>

        <div className="w-full flex flex-col items-center justify-center gap-3 py-1">
          <div className="w-full max-w-[560px] sm:max-w-[680px] rounded-lg overflow-hidden shadow-sm">
            {project.videoUrl ? (
              <video
                src={normalizeMediaPath(project.videoUrl)}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-auto mx-auto block"
              >
                <source src={normalizeMediaPath(project.videoUrl)} type="video/mp4" />
                <source src={normalizeMediaPath(project.videoUrl)} type="video/webm" />
              </video>
            ) : (
              <img
                src={normalizeMediaPath(project.coverImage || project.thumbnail) || '/images/placeholder.png'}
                alt={project.title}
                className="w-full h-auto mx-auto block"
              />
            )}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {project.showGithub && project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border border-neutral-300 dark:border-neutral-700 bg-neutral-100/80 dark:bg-neutral-900/80 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
              >
                <IconBrandGithub className="w-3.5 h-3.5" />
                <span>Code</span>
              </a>
            )}

            {project.showLive && project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors shadow-sm"
              >
                <span>Live</span>
                <Globe className="w-3.5 h-3.5" />
              </a>
            )}

            {project.showPost && project.postUrl && (
              <a
                href={project.postUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border border-neutral-300 dark:border-neutral-700 bg-neutral-100/80 dark:bg-neutral-900/80 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
              >
                <Newspaper className="w-3.5 h-3.5" />
                <span>Post</span>
              </a>
            )}
          </div>
        </div>

        <div className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed font-sans space-y-2">
          <p>{project.description}</p>
          {project.longDescription && (
            <div className="whitespace-pre-wrap">{project.longDescription}</div>
          )}
        </div>

        {project.tags && project.tags.length > 0 && (
          <div className="pt-3 border-t border-neutral-200/80 dark:border-neutral-800/80 space-y-1.5">
            <h2 className="text-xs font-bold font-mono text-neutral-900 dark:text-neutral-100 uppercase tracking-wider">
              Stack Used
            </h2>
            <TechStackBadges skills={project.tags.map((t) => ({ name: t }))} />
          </div>
        )}
      </div>
    </BlueprintLayout>
    </>
  )
}