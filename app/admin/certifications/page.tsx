'use client'

import React, { useState, useEffect, useTransition } from 'react'
import { Plus, Edit2, Trash2, Award, ExternalLink, CheckCircle2, Loader2, X, Star } from 'lucide-react'
import DataTable, { Column } from '@/components/admin/ui/DataTable'
import ConfirmDialog from '@/components/admin/ui/ConfirmDialog'
import { toast } from 'sonner'
import { fetchCertificationsAction, createCertificationAction, updateCertificationAction, softDeleteCertificationAction } from '@/actions/certifications'
import { Certification } from '@prisma/client'

export default function AdminCertificationsPage() {
  const [certifications, setCertifications] = useState<Certification[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  // Form State
  const [title, setTitle] = useState('')
  const [issuer, setIssuer] = useState('')
  const [issueDate, setIssueDate] = useState('')
  const [credentialUrl, setCredentialUrl] = useState('')
  const [credentialId, setCredentialId] = useState('')
  const [certificateImage, setCertificateImage] = useState('')
  const [skillsInput, setSkillsInput] = useState('')
  const [featured, setFeatured] = useState(false)
  const [order, setOrder] = useState(0)

  const loadCerts = async () => {
    setIsLoading(true)
    try {
      const res = await fetchCertificationsAction()
      if (res.success && res.items) {
        setCertifications(res.items as Certification[])
      }
    } catch {
      toast.error('Failed to load certifications')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadCerts()
  }, [])

  const openModal = (cert?: any) => {
    if (cert) {
      setEditingId(cert.id)
      setTitle(cert.title)
      setIssuer(cert.issuer)
      setIssueDate(cert.issueDate)
      setCredentialUrl(cert.credentialUrl || '')
      setCredentialId(cert.credentialId || '')
      setCertificateImage(cert.certificateImage || '')
      setSkillsInput(
        Array.isArray(cert.skills)
          ? cert.skills.join(', ')
          : typeof cert.skills === 'string'
          ? cert.skills
          : ''
      )
      setFeatured(cert.featured)
      setOrder(cert.order || 0)
    } else {
      setEditingId(null)
      setTitle('')
      setIssuer('')
      setIssueDate('')
      setCredentialUrl('')
      setCredentialId('')
      setCertificateImage('')
      setSkillsInput('')
      setFeatured(false)
      setOrder(certifications.length + 1)
    }
    setIsModalOpen(true)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !issuer || !issueDate) {
      toast.error('Title, issuer, and date are required!')
      return
    }

    const skillsArray = skillsInput
      ? skillsInput.split(',').map((s) => s.trim()).filter(Boolean)
      : []

    startTransition(async () => {
      try {
        if (editingId) {
          const res = await updateCertificationAction(editingId, {
            title,
            issuer,
            issueDate,
            credentialUrl: credentialUrl || undefined,
            credentialId: credentialId || undefined,
            certificateImage: certificateImage || undefined,
            skills: skillsArray,
            featured,
            order,
          })
          if (res.success) {
            toast.success('Certification updated successfully!')
            setIsModalOpen(false)
            loadCerts()
          } else {
            toast.error(res.error || 'Failed to update certification')
          }
        } else {
          const res = await createCertificationAction({
            title,
            issuer,
            issueDate,
            credentialUrl: credentialUrl || undefined,
            credentialId: credentialId || undefined,
            certificateImage: certificateImage || undefined,
            skills: skillsArray,
            featured,
            order,
          })
          if (res.success) {
            toast.success('Certification added successfully!')
            setIsModalOpen(false)
            loadCerts()
          } else {
            toast.error(res.error || 'Failed to add certification')
          }
        }
      } catch (err: any) {
        toast.error(err?.message || 'Failed to save certification')
      }
    })
  }

  const handleSoftDelete = (id: string) => {
    startTransition(async () => {
      try {
        const res = await softDeleteCertificationAction(id)
        if (res.success) {
          toast.success('Certification deleted')
          setDeleteTargetId(null)
          loadCerts()
        } else {
          toast.error(res.error || 'Failed to delete certification')
        }
      } catch (err: any) {
        toast.error(err?.message || 'Failed to delete certification')
      }
    })
  }

  const columns: Column<Certification>[] = [
    {
      key: 'title',
      header: 'Certification & Issuer',
      render: (cert: any) => (
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="font-bold text-neutral-900 dark:text-neutral-100 text-xs">{cert.title}</span>
            {cert.featured && (
              <span className="p-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                <Star className="w-3 h-3 fill-current" />
              </span>
            )}
          </div>
          <div className="text-[11px] text-neutral-500">{cert.issuer}</div>
        </div>
      ),
    },
    {
      key: 'issueDate',
      header: 'Issue Date',
      render: (cert: any) => (
        <span className="text-xs text-neutral-600 dark:text-neutral-400 font-mono">{cert.issueDate}</span>
      ),
    },
    {
      key: 'skills',
      header: 'Skills / Credential',
      render: (cert: any) => {
        const skills = Array.isArray(cert.skills) ? cert.skills : []
        return (
          <div className="space-y-1 max-w-xs">
            {skills.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {skills.slice(0, 3).map((sk: string) => (
                  <span
                    key={sk}
                    className="px-1.5 py-0.2 rounded text-[10px] bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400"
                  >
                    {sk}
                  </span>
                ))}
                {skills.length > 3 && (
                  <span className="text-[10px] text-neutral-400">+{skills.length - 3}</span>
                )}
              </div>
            )}
            {cert.credentialUrl && (
              <a
                href={cert.credentialUrl}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-neutral-500 hover:text-neutral-900 dark:hover:text-white inline-flex items-center gap-1"
              >
                <span>Verify</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        )
      },
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (cert: any) => (
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => openModal(cert)}
            className="p-1.5 rounded-md border border-dashed border-neutral-300 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
            title="Edit"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setDeleteTargetId(cert.id)}
            className="p-1.5 rounded-md bg-rose-500/10 text-rose-700 dark:text-rose-400 hover:bg-rose-500/20 border border-rose-500/30 transition-colors cursor-pointer"
            title="Delete"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6 font-mono text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-dashed border-neutral-300 dark:border-neutral-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-neutral-500" />
            <h1 className="text-xl font-bold text-neutral-900 dark:text-neutral-50 tracking-tight">
              Certifications CMS
            </h1>
          </div>
          <p className="text-neutral-500 dark:text-neutral-400 text-xs pt-1">
            Manage your verified industry accreditations, cloud certifications, and technical credentials.
          </p>
        </div>

        <button
          type="button"
          onClick={() => openModal()}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md text-xs font-medium bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-950 hover:bg-neutral-800 dark:hover:bg-white transition-colors shadow-xs shrink-0 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Certification</span>
        </button>
      </div>

      <DataTable
        data={certifications}
        columns={columns}
        isLoading={isLoading}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="relative z-10 w-full max-w-md bg-white dark:bg-neutral-900 border border-dashed border-neutral-300 dark:border-neutral-800 rounded-lg p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-dashed border-neutral-200 dark:border-neutral-800 pb-3">
              <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                {editingId ? 'Edit Certification' : 'Add Certification'}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-neutral-500 hover:text-neutral-900 dark:hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 font-mono text-xs">
              <div>
                <label className="text-neutral-600 dark:text-neutral-400 block mb-1 font-semibold">Certification Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="AWS Solutions Architect"
                  className="w-full px-3 py-2 bg-transparent border border-dashed border-neutral-300 dark:border-neutral-800 rounded-md text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-neutral-600 dark:text-neutral-400 block mb-1 font-semibold">Issuer *</label>
                  <input
                    type="text"
                    required
                    value={issuer}
                    onChange={(e) => setIssuer(e.target.value)}
                    placeholder="Amazon Web Services"
                    className="w-full px-3 py-2 bg-transparent border border-dashed border-neutral-300 dark:border-neutral-800 rounded-md text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-neutral-600 dark:text-neutral-400 block mb-1 font-semibold">Issue Date *</label>
                  <input
                    type="text"
                    required
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                    placeholder="Nov 2024"
                    className="w-full px-3 py-2 bg-transparent border border-dashed border-neutral-300 dark:border-neutral-800 rounded-md text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-neutral-600 dark:text-neutral-400 block mb-1 font-semibold">Verification URL</label>
                <input
                  type="text"
                  value={credentialUrl}
                  onChange={(e) => setCredentialUrl(e.target.value)}
                  placeholder="https://aws.amazon.com/..."
                  className="w-full px-3 py-2 bg-transparent border border-dashed border-neutral-300 dark:border-neutral-800 rounded-md text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-neutral-600 dark:text-neutral-400 block mb-1 font-semibold">Credential ID</label>
                <input
                  type="text"
                  value={credentialId}
                  onChange={(e) => setCredentialId(e.target.value)}
                  placeholder="AWS-ASA-98765"
                  className="w-full px-3 py-2 bg-transparent border border-dashed border-neutral-300 dark:border-neutral-800 rounded-md text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-neutral-600 dark:text-neutral-400 block mb-1 font-semibold">Skills / Topics (comma-separated)</label>
                <input
                  type="text"
                  value={skillsInput}
                  onChange={(e) => setSkillsInput(e.target.value)}
                  placeholder="AWS S3, EC2, Serverless, Docker"
                  className="w-full px-3 py-2 bg-transparent border border-dashed border-neutral-300 dark:border-neutral-800 rounded-md text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="featured"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="rounded border-neutral-300 dark:border-neutral-700"
                />
                <label htmlFor="featured" className="text-neutral-700 dark:text-neutral-300 text-xs cursor-pointer">
                  Feature on Portfolio Home
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-dashed border-neutral-200 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 rounded-md border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-3.5 py-1.5 rounded-md bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-950 font-medium text-xs cursor-pointer"
                >
                  Save Certification
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={Boolean(deleteTargetId)}
        title="Delete Certification?"
        description="Are you sure you want to delete this certification?"
        confirmText="Delete"
        isDestructive
        isLoading={isPending}
        onConfirm={() => deleteTargetId && handleSoftDelete(deleteTargetId)}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  )
}
