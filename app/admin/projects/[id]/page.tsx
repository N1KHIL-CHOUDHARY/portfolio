import React from 'react'
import { notFound } from 'next/navigation'
import ProjectForm from '@/components/admin/projects/ProjectForm'
import { prisma } from '@/lib/prisma'

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const project = await prisma.project.findUnique({
    where: { id },
  })

  if (!project) {
    notFound()
  }

  return <ProjectForm initialData={project} isEditing />
}
