import React from 'react'
import { notFound } from 'next/navigation'
import ProjectForm from '@/components/admin/projects/ProjectForm'
import { projectService } from '@/services/project.service'

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const res = await projectService.getProjectById(id)

  if (!res.success || !res.data) {
    notFound()
  }

  return <ProjectForm initialData={res.data} isEditing />
}
