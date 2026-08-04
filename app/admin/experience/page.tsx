'use client'

import React, { useState, useEffect, useTransition } from 'react'
import { Plus, Edit2, Trash2, Briefcase, Building, MapPin, Calendar, CheckCircle2, Loader2, X } from 'lucide-react'
import DataTable, { Column } from '@/components/admin/ui/DataTable'
import ConfirmDialog from '@/components/admin/ui/ConfirmDialog'
import { toast } from 'sonner'
import { fetchExperiencesAction, createExperienceAction, updateExperienceAction, softDeleteExperienceAction } from '@/actions/experience'
import { Experience, EmploymentType } from '@prisma/client'

const PRESET_TECH = [
  'Next.js',
  'React',
  'TypeScript',
  'JavaScript',
  'Tailwind CSS',
  'Node.js',
  'Express.js',
  'Python',
  'PostgreSQL',
  'MongoDB',
  'AWS',
  'Docker',
  'Git',
  'GitHub',
  'Framer Motion',
  'GraphQL',
  'Redis',
]

export default function AdminExperiencePage() {
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  // Form inputs
  const [company, setCompany] = useState('')
  const [role, setRole] = useState('')
  const [location, setLocation] = useState('')
  const [employmentType, setEmploymentType] = useState<EmploymentType>(EmploymentType.FULL_TIME)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [currentJob, setCurrentJob] = useState(false)
  const [description, setDescription] = useState('')
  const [responsibilitiesInput, setResponsibilitiesInput] = useState('')
  const [technologiesInput, setTechnologiesInput] = useState('')
  const [companyLogo, setCompanyLogo] = useState('')
  const [order, setOrder] = useState(0)

  const loadExperiences = async () => {
    setIsLoading(true)
    try {
      const res = await fetchExperiencesAction()
      if (res.success && res.items) {
        setExperiences(res.items as Experience[])
      }
    } catch {
      toast.error('Failed to load experience entries')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadExperiences()
  }, [])

  const openModal = (exp?: Experience) => {
    if (exp) {
      setEditingId(exp.id)
      setCompany(exp.company)
      setRole(exp.role)
      setLocation(exp.location || '')
      setEmploymentType(exp.employmentType)
      setStartDate(exp.startDate)
      setEndDate(exp.endDate || '')
      setCurrentJob(exp.currentJob)
      setDescription(exp.description)
      setResponsibilitiesInput(
        Array.isArray(exp.responsibilities)
          ? (exp.responsibilities as string[]).join('\n')
          : typeof exp.responsibilities === 'string'
          ? (JSON.parse(exp.responsibilities) as string[]).join('\n')
          : ''
      )
      setTechnologiesInput(
        Array.isArray(exp.technologies)
          ? (exp.technologies as string[]).join(', ')
          : typeof exp.technologies === 'string'
          ? (JSON.parse(exp.technologies) as string[]).join(', ')
          : ''
      )
      setCompanyLogo(exp.companyLogo || '')
      setOrder(exp.order)
    } else {
      setEditingId(null)
      setCompany('')
      setRole('')
      setLocation('')
      setEmploymentType(EmploymentType.FULL_TIME)
      setStartDate('')
      setEndDate('')
      setCurrentJob(false)
      setDescription('')
      setResponsibilitiesInput('')
      setTechnologiesInput('')
      setCompanyLogo('')
      setOrder(experiences.length + 1)
    }
    setIsModalOpen(true)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!company || !role || !description) {
      toast.error('Company, Role, and Description are required!')
      return
    }

    startTransition(async () => {
      const responsibilities = responsibilitiesInput
        .split('\n')
        .map((r) => r.trim())
        .filter(Boolean)

      const technologies = technologiesInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)

      const payload = {
        company,
        role,
        location,
        employmentType,
        startDate,
        endDate: currentJob ? 'Present' : endDate,
        currentJob,
        description,
        responsibilities,
        technologies,
        companyLogo,
        order,
      }

      let res
      if (editingId) {
        res = await updateExperienceAction(editingId, payload)
      } else {
        res = await createExperienceAction(payload)
      }

      if (res.success) {
        toast.success(editingId ? 'Experience updated' : 'Experience added')
        setIsModalOpen(false)
        loadExperiences()
      } else {
        toast.error(res.error || 'Failed to save experience entry')
      }
    })
  }

  const handleSoftDelete = (id: string) => {
    startTransition(async () => {
      const res = await softDeleteExperienceAction(id)
      if (res.success) {
        toast.success('Experience deleted')
        setDeleteTargetId(null)
        loadExperiences()
      } else {
        toast.error(res.error || 'Failed to delete entry')
      }
    })
  }

  const filteredExperiences = experiences.filter(
    (exp) =>
      exp.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.role.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const columns: Column<Experience>[] = [
    {
      key: 'role',
      header: 'Role & Company',
      render: (exp) => (
        <div className="space-y-1">
          <div className="font-mono font-bold text-white text-xs flex items-center gap-2">
            <span>{exp.role}</span>
            {exp.currentJob && (
              <span className="px-1.5 py-0.2 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Present
              </span>
            )}
          </div>
          <div className="text-xs text-zinc-400 font-mono flex items-center gap-1">
            <Building className="w-3 h-3 text-zinc-500" />
            <span>{exp.company}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'timeline',
      header: 'Timeline & Location',
      render: (exp) => (
        <div className="text-xs font-mono text-zinc-400 space-y-0.5">
          <div>{exp.startDate} – {exp.endDate || (exp.currentJob ? 'Present' : '')}</div>
          <div className="text-[10px] text-zinc-500 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-zinc-600" />
            <span>{exp.location || 'Remote'}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Type',
      render: (exp) => (
        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-800 text-zinc-300 border border-zinc-700">
          {exp.employmentType.replace('_', ' ')}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (exp) => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => openModal(exp)}
            className="p-1.5 rounded-lg bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors"
            title="Edit Experience"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setDeleteTargetId(exp.id)}
            className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 transition-colors"
            title="Delete Experience"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-emerald-400" />
            <h1 className="text-xl sm:text-2xl font-bold font-mono text-white tracking-tight">
              Experience CMS
            </h1>
          </div>
          <p className="text-xs text-zinc-400 font-mono pt-1">
            Manage your professional career history, company logos, responsibilities, and technologies.
          </p>
        </div>

        <button
          onClick={() => openModal()}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-medium bg-zinc-100 text-zinc-950 hover:bg-white transition-all shadow-md shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Experience</span>
        </button>
      </div>

      {/* Main Table */}
      <DataTable
        data={filteredExperiences}
        columns={columns}
        isLoading={isLoading}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setIsModalOpen(false)} className="fixed inset-0 bg-black/70 backdrop-blur-xs" />

          <div className="relative z-10 w-full max-w-xl bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-4 font-sans max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h2 className="text-base font-bold font-mono text-white">
                {editingId ? 'Edit Experience' : 'Add New Experience'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-500 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 font-mono text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-zinc-400 block">Company Name *</label>
                  <input
                    type="text"
                    required
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="TechCorp Inc."
                    className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-zinc-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-400 block">Role / Title *</label>
                  <input
                    type="text"
                    required
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="Senior Full Stack Engineer"
                    className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-zinc-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-zinc-400 block">Employment Type</label>
                  <select
                    value={employmentType}
                    onChange={(e) => setEmploymentType(e.target.value as EmploymentType)}
                    className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-zinc-500 font-mono text-xs"
                  >
                    <option value={EmploymentType.FULL_TIME}>Full-Time</option>
                    <option value={EmploymentType.PART_TIME}>Part-Time</option>
                    <option value={EmploymentType.CONTRACT}>Contract</option>
                    <option value={EmploymentType.FREELANCE}>Freelance</option>
                    <option value={EmploymentType.INTERNSHIP}>Internship</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-400 block">Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Remote / San Francisco"
                    className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-zinc-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-400 block">Start Date</label>
                  <input
                    type="text"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    placeholder="2024 / Jan 2024"
                    className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-zinc-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-400 block">End Date</label>
                  <input
                    type="text"
                    disabled={currentJob}
                    value={currentJob ? 'Present' : endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    placeholder="Present / 2025"
                    className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-zinc-500 disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="currentJob"
                  checked={currentJob}
                  onChange={(e) => setCurrentJob(e.target.checked)}
                  className="rounded border-zinc-700 bg-zinc-950 text-emerald-400 focus:ring-0 cursor-pointer"
                />
                <label htmlFor="currentJob" className="text-zinc-300 cursor-pointer">
                  I currently work in this role
                </label>
              </div>

              <div className="space-y-1">
                <label className="text-zinc-400 block">Role Overview Description *</label>
                <textarea
                  rows={2}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Summary of scope, team structure, and primary objectives..."
                  className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white font-sans focus:outline-none focus:border-zinc-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-400 block">Key Responsibilities (1 per line)</label>
                <textarea
                  rows={3}
                  value={responsibilitiesInput}
                  onChange={(e) => setResponsibilitiesInput(e.target.value)}
                  placeholder="Architected Next.js micro-frontends serving 2M+ users...&#10;Reduced latency by 45%..."
                  className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white font-sans focus:outline-none focus:border-zinc-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-zinc-400 block">Technologies Used (Comma separated)</label>
                <input
                  type="text"
                  value={technologiesInput}
                  onChange={(e) => setTechnologiesInput(e.target.value)}
                  placeholder="Next.js, React, TypeScript, Redis, PostgreSQL"
                  className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-zinc-500"
                />

                {/* Preset Tech Quick Toggle Badges */}
                <div className="space-y-1 pt-1">
                  <span className="text-[10px] text-zinc-500 font-mono block">Click preset skill to toggle:</span>
                  <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-2 rounded-xl border border-zinc-800 bg-zinc-950/80">
                    {PRESET_TECH.map((tech) => {
                      const isSelected = technologiesInput
                        .split(',')
                        .map((t) => t.trim().toLowerCase())
                        .includes(tech.toLowerCase())

                      return (
                        <button
                          key={tech}
                          type="button"
                          onClick={() => {
                            const current = technologiesInput
                              .split(',')
                              .map((t) => t.trim())
                              .filter(Boolean)

                            if (isSelected) {
                              setTechnologiesInput(current.filter((t) => t.toLowerCase() !== tech.toLowerCase()).join(', '))
                            } else {
                              setTechnologiesInput(current.length > 0 ? `${current.join(', ')}, ${tech}` : tech)
                            }
                          }}
                          className={`px-2 py-0.5 rounded-lg text-[10px] font-mono border transition-all select-none ${
                            isSelected
                              ? 'border-emerald-500 bg-emerald-950/50 text-emerald-300 font-bold'
                              : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                          }`}
                        >
                          {isSelected ? `✓ ${tech}` : `+ ${tech}`}
                        </button>
                      )
                    })}
                  </div>
                </div>
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
                  <span>Save Experience</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete */}
      <ConfirmDialog
        isOpen={!!deleteTargetId}
        title="Delete Experience Entry?"
        description="Are you sure you want to remove this experience record from your portfolio?"
        confirmText="Delete Entry"
        isDestructive
        isLoading={isPending}
        onConfirm={() => deleteTargetId && handleSoftDelete(deleteTargetId)}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  )
}
