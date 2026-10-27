import { MetadataRoute } from 'next'
import { getPortfolioProjects } from '@/lib/db'
import { SITE_URL } from '@/lib/seo'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects] = await Promise.all([
    getPortfolioProjects().catch(() => []),
  ])

  const now = new Date()

  // 1. Static Core Pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/projects`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/development`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/gears`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/certifications`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ]

  // 2. Dynamic Project Case Studies
  const projectRoutes: MetadataRoute.Sitemap = (projects || []).map((project) => ({
    url: `${SITE_URL}/projects/${project.slug}`,
    lastModified: (project as any).updatedAt ? new Date((project as any).updatedAt) : now,
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  

  return [...staticRoutes, ...projectRoutes]
}