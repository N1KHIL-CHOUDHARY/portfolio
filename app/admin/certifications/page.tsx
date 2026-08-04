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
          ? (JSON.parse(cert.skills) as string[]).join(', ')
          : ''
      )
      setFeatured(cert.featured)
      setOrder(cert.order)
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
      toast.error('Title, Issuer, and Issue Date are required!')
      return
    }

    startTransition(async () => {
      const skills = skillsInput.split(',').map((s) => s.trim()).filter(Boolean)
      const payload = {
        title,
        issuer,
        issueDate,
        credentialUrl,
        credentialId,
        certificateImage,
        skills,
        featured,
        order,
      }

      let res
      if (editingId) {
        res = await updateCertificationAction(editingId, payload)
      } else {
        res = await createCertificationAction(payload)
      }

      if (res.success) {
        toast.success(editingId ? 'Certification updated' : 'Certification added')
        setIsModalOpen(false)
        loadCerts()
      } else {
        toast.error(res.error || 'Failed to save certification')
      }
    })
  }

  const handleSoftDelete = (id: string) => {
    startTransition(async () => {
      const res = await softDeleteCertificationAction(id)
      if (res.success) {
        toast.success('Certification deleted')
        setDeleteTargetId(null)
        loadCerts()
      } else {
        toast.error(res.error || 'Failed to delete certification')
      }
    })
  }

  const filteredCerts = certifications.filter(
    (c) =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.issuer.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const columns: Column<Certification>[] = [
    {
      key: 'title',
      header: 'Title & Issuer',
      render: (cert) => (
        <div className="space-y-0.5">
          <div className="font-mono font-bold text-white text-xs flex items-center gap-1.5">
            <span>{cert.title}</span>
            {cert.featured && (
              <span className="p-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Star className="w-3 h-3 fill-current" />
              </span>
            )}
          </div>
          <div className="text-xs text-zinc-400 font-mono">{cert.issuer}</div>
        </div>
      ),
    },
    {
      key: 'issueDate',
      header: 'Issue Date',
      render: (cert) => <span className="font-mono text-xs text-zinc-300">{cert.issueDate}</span>,
    },
    {
      key: 'credential',
      header: 'Credential ID',
      render: (cert) => (
        <div className="text-xs font-mono text-zinc-400 flex items-center gap-1.5">
          <span>{cert.credentialId || '—'}</span>
          {cert.credentialUrl && (
            <a
              href={cert.credentialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:underline inline-flex items-center gap-0.5"
            >
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (cert) => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => openModal(cert)}
            className="p-1.5 rounded-lg bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors"
            title="Edit Certification"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setDeleteTargetId(cert.id)}
            className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 transition-colors"
            title="Delete Certification"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-400" />
            <h1 className="text-xl sm:text-2xl font-bold font-mono text-white tracking-tight">
              Certifications CMS
            </h1>
          </div>
          <p className="text-xs text-zinc-400 font-mono pt-1">
            Manage your professional credentials, AWS, Meta, and Cloud certifications.
          </p>
        </div>

        <button
          onClick={() => openModal()}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-medium bg-zinc-100 text-zinc-950 hover:bg-white transition-all shadow-md shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Certification</span>
        </button>
      </div>

      <DataTable
        data={filteredCerts}
        columns={columns}
        isLoading={isLoading}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setIsModalOpen(false)} className="fixed inset-0 bg-black/70 backdrop-blur-xs" />

          <div className="relative z-10 w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-4 font-sans">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h2 className="text-base font-bold font-mono text-white">
                {editingId ? 'Edit Certification' : 'Add Certification'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-500 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 font-mono text-xs">
              <div className="space-y-1">
                <label className="text-zinc-400 block">Certification Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="AWS Solutions Architect"
                  className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-zinc-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-zinc-400 block">Issuer *</label>
                  <input
                    type="text"
                    required
                    value={issuer}
                    onChange={(e) => setIssuer(e.target.value)}
                    placeholder="Amazon Web Services"
                    className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-zinc-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-400 block">Issue Date *</label>
                  <input
                    type="text"
                    required
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                    placeholder="2024 / Nov 2024"
                    className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-zinc-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-zinc-400 block">Credential Verification URL</label>
                <input
                  type="text"
                  value={credentialUrl}
                  onChange={(e) => setCredentialUrl(e.target.value)}
                  placeholder="https://aws.amazon.com/..."
                  className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-zinc-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-400 block">Credential ID</label>
                <input
                  type="text"
                  value={credentialId}
                  onChange={(e) => setCredentialId(e.target.value)}
                  placeholder="AWS-ASA-98765"
                  className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-zinc-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-400 block">Skills / Topics (comma-separated)</label>
                <input
                  type="text"
                  value={skillsInput}
                  onChange={(e) => setSkillsInput(e.target.value)}
                  placeholder="AWS S3, EC2, Serverless, Docker"
                  className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-zinc-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="featured"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="rounded border-zinc-700 bg-zinc-950 text-emerald-400 cursor-pointer"
                />
                <label htmlFor="featured" className="text-zinc-300 cursor-pointer">
                  Feature on Portfolio Home
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-4 py-2 rounded-xl bg-emerald-500 text-zinc-950 font-bold hover:bg-emerald-400 flex items-center gap-1.5"
                >
                  {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                  <span>Save Certification</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteTargetId}
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
