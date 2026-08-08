'use client'

import React, { useState, useEffect, useTransition } from 'react'
import { Plus, Edit2, Trash2, Briefcase, GraduationCap, Building, MapPin, CheckCircle2, Loader2, X, Globe } from 'lucide-react'
import DataTable, { Column } from '@/components/admin/ui/DataTable'
import ConfirmDialog from '@/components/admin/ui/ConfirmDialog'
import { toast } from 'sonner'
import { 
  fetchExperiencesAction, 
  createExperienceAction, 
  updateExperienceAction, 
  softDeleteExperienceAction,
  fetchEducationsAction,
  createEducationAction,
  updateEducationAction,
  softDeleteEducationAction,
} from '@/actions/experience'
import { Experience, EmploymentType } from '@prisma/client'

const PRESET_TECH = [
  'Java',
  'Spring Boot',
  'Activiti',
  'Python',
  'MariaDB',
  'SQL',
  'React',
  'Next.js',
  'TypeScript',
  'JavaScript',
  'Tailwind CSS',
  'Angular',
  'Spring Security',
  'React Native',
  'Meshroom',
  'Docker',
  'Redis',
  'PostgreSQL',
]

export default function AdminExperiencePage() {
  const [activeTab, setActiveTab] = useState<'work' | 'education'>('work')

  // Work experiences state
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [isLoadingWork, setIsLoadingWork] = useState(true)

  // Education experiences state
  const [educations, setEducations] = useState<any[]>([])
  const [isLoadingEdu, setIsLoadingEdu] = useState(true)

  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)
  const [deleteType, setDeleteType] = useState<'work' | 'education'>('work')
  const [isPending, startTransition] = useTransition()

  // --- Work Form inputs ---
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
  const [subRolesInput, setSubRolesInput] = useState('')
  const [projectsInput, setProjectsInput] = useState('')
  const [logoType, setLogoType] = useState('custom')
  const [companyLogo, setCompanyLogo] = useState('')
  const [order, setOrder] = useState(0)

  // --- Education Form inputs ---
  const [institution, setInstitution] = useState('')
  const [degree, setDegree] = useState('')
  const [eduLocation, setEduLocation] = useState('')
  const [eduStartDate, setEduStartDate] = useState('')
  const [eduEndDate, setEduEndDate] = useState('')
  const [currentStudy, setCurrentStudy] = useState(false)
  const [eduDescription, setEduDescription] = useState('')
  const [eduBulletsInput, setEduBulletsInput] = useState('')
  const [eduProjectsInput, setEduProjectsInput] = useState('')
  const [eduLogoType, setEduLogoType] = useState('custom')
  const [eduLogoUrl, setEduLogoUrl] = useState('')
  const [eduOrder, setEduOrder] = useState(0)

  const loadData = async () => {
    setIsLoadingWork(true)
    setIsLoadingEdu(true)
    try {
      const [workRes, eduRes] = await Promise.all([
        fetchExperiencesAction(),
        fetchEducationsAction(),
      ])

      if (workRes.success && workRes.items) {
        setExperiences(workRes.items as Experience[])
      }
      if (eduRes.success && eduRes.items) {
        setEducations(eduRes.items)
      }
    } catch {
      toast.error('Failed to load career & education records')
    } finally {
      setIsLoadingWork(false)
      setIsLoadingEdu(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // Open modal for Work or Education
  const openWorkModal = (exp?: any) => {
    if (exp) {
      setEditingId(exp.id)
      setCompany(exp.company || '')
      setRole(exp.role || '')
      setLocation(exp.location || '')
      setEmploymentType(exp.employmentType || EmploymentType.FULL_TIME)
      setStartDate(exp.startDate || '')
      setEndDate(exp.endDate || '')
      setCurrentJob(Boolean(exp.currentJob))
      setDescription(exp.description || '')
      setResponsibilitiesInput(
        Array.isArray(exp.responsibilities)
          ? exp.responsibilities.join('\n')
          : typeof exp.responsibilities === 'string'
          ? (() => {
              try { return (JSON.parse(exp.responsibilities) as string[]).join('\n') } catch { return exp.responsibilities }
            })()
          : ''
      )
      setTechnologiesInput(
        Array.isArray(exp.technologies)
          ? exp.technologies.join(', ')
          : typeof exp.technologies === 'string'
          ? (() => {
              try { return (JSON.parse(exp.technologies) as string[]).join(', ') } catch { return exp.technologies }
            })()
          : ''
      )
      setSubRolesInput(
        exp.subRoles
          ? typeof exp.subRoles === 'string'
            ? exp.subRoles
            : JSON.stringify(exp.subRoles, null, 2)
          : ''
      )
      setProjectsInput(
        Array.isArray(exp.projects)
          ? exp.projects.map((p: any) => p.name || p).join(', ')
          : typeof exp.projects === 'string'
          ? (() => {
              try { return (JSON.parse(exp.projects) as any[]).map((p: any) => p.name || p).join(', ') } catch { return exp.projects }
            })()
          : ''
      )
      setLogoType(exp.logoType || 'custom')
      setCompanyLogo(exp.logoUrl || exp.companyLogo || '')
      setOrder(exp.order || 0)
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
      setSubRolesInput('')
      setProjectsInput('')
      setLogoType('custom')
      setCompanyLogo('')
      setOrder(experiences.length + 1)
    }
    setIsModalOpen(true)
  }

  const openEducationModal = (edu?: any) => {
    if (edu) {
      setEditingId(edu.id)
      setInstitution(edu.institution || '')
      setDegree(edu.degree || '')
      setEduLocation(edu.location || '')
      setEduStartDate(edu.startDate || '')
      setEduEndDate(edu.endDate || '')
      setCurrentStudy(Boolean(edu.currentStudy))
      setEduDescription(edu.description || '')
      setEduBulletsInput(
        Array.isArray(edu.bullets)
          ? edu.bullets.join('\n')
          : typeof edu.bullets === 'string'
          ? (() => {
              try { return (JSON.parse(edu.bullets) as string[]).join('\n') } catch { return edu.bullets }
            })()
          : ''
      )
      setEduProjectsInput(
        Array.isArray(edu.projects)
          ? edu.projects.map((p: any) => p.name || p).join(', ')
          : typeof edu.projects === 'string'
          ? (() => {
              try { return (JSON.parse(edu.projects) as any[]).map((p: any) => p.name || p).join(', ') } catch { return edu.projects }
            })()
          : ''
      )
      setEduLogoType(edu.logoType || 'custom')
      setEduLogoUrl(edu.logoUrl || edu.companyLogo || '')
      setEduOrder(edu.order || 0)
    } else {
      setEditingId(null)
      setInstitution('')
      setDegree('')
      setEduLocation('')
      setEduStartDate('')
      setEduEndDate('')
      setCurrentStudy(false)
      setEduDescription('')
      setEduBulletsInput('')
      setEduProjectsInput('')
      setEduLogoType('custom')
      setEduLogoUrl('')
      setEduOrder(educations.length + 1)
    }
    setIsModalOpen(true)
  }

  const handleSaveWork = (e: React.FormEvent) => {
    e.preventDefault()
    if (!company || !role) {
      toast.error('Company and Role are required!')
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

      const projects = projectsInput
        .split(',')
        .map((p) => p.trim())
        .filter(Boolean)
        .map((name) => ({ name }))

      let subRoles: any[] = []
      if (subRolesInput.trim()) {
        try {
          subRoles = JSON.parse(subRolesInput)
        } catch {
          subRoles = []
        }
      }

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
        subRoles,
        projects,
        logoType,
        companyLogo,
        logoUrl: companyLogo,
        order,
      }

      let res
      if (editingId) {
        res = await updateExperienceAction(editingId, payload)
      } else {
        res = await createExperienceAction(payload)
      }

      if (res.success) {
        toast.success(editingId ? 'Work experience updated' : 'Work experience added')
        setIsModalOpen(false)
        loadData()
      } else {
        toast.error(res.error || 'Failed to save work experience')
      }
    })
  }

  const handleSaveEducation = (e: React.FormEvent) => {
    e.preventDefault()
    if (!institution || !degree) {
      toast.error('Institution and Degree are required!')
      return
    }

    startTransition(async () => {
      const bullets = eduBulletsInput
        .split('\n')
        .map((b) => b.trim())
        .filter(Boolean)

      const projects = eduProjectsInput
        .split(',')
        .map((p) => p.trim())
        .filter(Boolean)
        .map((name) => ({ name }))

      const payload = {
        institution,
        degree,
        location: eduLocation,
        startDate: eduStartDate,
        endDate: currentStudy ? 'Present' : eduEndDate,
        currentStudy,
        description: eduDescription,
        bullets,
        projects,
        logoType: eduLogoType,
        logoUrl: eduLogoUrl,
        order: eduOrder,
      }

      let res
      if (editingId) {
        res = await updateEducationAction(editingId, payload)
      } else {
        res = await createEducationAction(payload)
      }

      if (res.success) {
        toast.success(editingId ? 'Education record updated' : 'Education record added')
        setIsModalOpen(false)
        loadData()
      } else {
        toast.error(res.error || 'Failed to save education record')
      }
    })
  }

  const handleDelete = (id: string, type: 'work' | 'education') => {
    startTransition(async () => {
      let res
      if (type === 'work') {
        res = await softDeleteExperienceAction(id)
      } else {
        res = await softDeleteEducationAction(id)
      }

      if (res.success) {
        toast.success(`${type === 'work' ? 'Work experience' : 'Education record'} deleted`)
        setDeleteTargetId(null)
        loadData()
      } else {
        toast.error(res.error || 'Failed to delete record')
      }
    })
  }

  // Work Columns
  const workColumns: Column<any>[] = [
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
            <span>{exp.location || 'Singapore'}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'logoType',
      header: 'Logo Branding',
      render: (exp) => (
        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-800 text-zinc-300 border border-zinc-700 uppercase">
          {exp.logoType || 'custom'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (exp) => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => openWorkModal(exp)}
            className="p-1.5 rounded-lg bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors"
            title="Edit Work Experience"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              setDeleteTargetId(exp.id)
              setDeleteType('work')
            }}
            className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 transition-colors"
            title="Delete Work Experience"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ]

  // Education Columns
  const educationColumns: Column<any>[] = [
    {
      key: 'degree',
      header: 'Degree & Institution',
      render: (edu) => (
        <div className="space-y-1">
          <div className="font-mono font-bold text-white text-xs flex items-center gap-2">
            <span>{edu.degree}</span>
            {edu.currentStudy && (
              <span className="px-1.5 py-0.2 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Active
              </span>
            )}
          </div>
          <div className="text-xs text-zinc-400 font-mono flex items-center gap-1">
            <GraduationCap className="w-3 h-3 text-zinc-500" />
            <span>{edu.institution}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'timeline',
      header: 'Timeline & Location',
      render: (edu) => (
        <div className="text-xs font-mono text-zinc-400 space-y-0.5">
          <div>{edu.startDate} – {edu.endDate || (edu.currentStudy ? 'Present' : '')}</div>
          <div className="text-[10px] text-zinc-500 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-zinc-600" />
            <span>{edu.location || 'Singapore'}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'logoType',
      header: 'Logo Branding',
      render: (edu) => (
        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-800 text-zinc-300 border border-zinc-700 uppercase">
          {edu.logoType || 'custom'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (edu) => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => openEducationModal(edu)}
            className="p-1.5 rounded-lg bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors"
            title="Edit Education Record"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              setDeleteTargetId(edu.id)
              setDeleteType('education')
            }}
            className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 transition-colors"
            title="Delete Education Record"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ]

  const filteredWork = experiences.filter(
    (exp) =>
      exp.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.role?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredEdu = educations.filter(
    (edu) =>
      edu.institution?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      edu.degree?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-emerald-400" />
            <h1 className="text-xl sm:text-2xl font-bold font-mono text-white tracking-tight">
              Work & Education Experience CMS
            </h1>
          </div>
          <p className="text-xs text-zinc-400 font-mono pt-1">
            Manage your full professional career history, universities, degrees, bulleted highlights, and project badges.
          </p>
        </div>

        <button
          onClick={() => (activeTab === 'work' ? openWorkModal() : openEducationModal())}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-medium bg-zinc-100 text-zinc-950 hover:bg-white transition-all shadow-md shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{activeTab === 'work' ? 'Add Work Experience' : 'Add Education Record'}</span>
        </button>
      </div>

      {/* Segmented Tab Switcher */}
      <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
        <button
          onClick={() => setActiveTab('work')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
            activeTab === 'work'
              ? 'bg-zinc-800 text-white border border-zinc-700 shadow-sm'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
          }`}
        >
          <Briefcase className="w-4 h-4 text-emerald-400" />
          <span>Work Experience ({experiences.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('education')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
            activeTab === 'education'
              ? 'bg-zinc-800 text-white border border-zinc-700 shadow-sm'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
          }`}
        >
          <GraduationCap className="w-4 h-4 text-blue-400" />
          <span>Education ({educations.length})</span>
        </button>
      </div>

      {/* Main Content: Work or Education Table */}
      {activeTab === 'work' ? (
        <DataTable
          data={filteredWork}
          columns={workColumns}
          isLoading={isLoadingWork}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      ) : (
        <DataTable
          data={filteredEdu}
          columns={educationColumns}
          isLoading={isLoadingEdu}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      )}

      {/* Work Modal */}
      {isModalOpen && activeTab === 'work' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setIsModalOpen(false)} className="fixed inset-0 bg-black/70 backdrop-blur-xs" />

          <div className="relative z-10 w-full max-w-xl bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-4 font-sans max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h2 className="text-base font-bold font-mono text-white">
                {editingId ? 'Edit Work Experience' : 'Add Work Experience'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-500 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveWork} className="space-y-4 font-mono text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-zinc-400 block">Company Name *</label>
                  <input
                    type="text"
                    required
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="DBS Bank / SIT"
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
                    placeholder="Associate / Software Developer"
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
                    placeholder="Singapore"
                    className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-zinc-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-400 block">Logo Type</label>
                  <select
                    value={logoType}
                    onChange={(e) => setLogoType(e.target.value)}
                    className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-zinc-500 font-mono text-xs"
                  >
                    <option value="dbs">DBS Bank (Red Diamond)</option>
                    <option value="sit">SIT (Singapore Institute of Tech)</option>
                    <option value="activate">Activate Interactive (Tri-Color)</option>
                    <option value="custom">Custom (Image or Monogram)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-zinc-400 block">Company Logo / Image URL (Optional)</label>
                <input
                  type="text"
                  value={companyLogo}
                  onChange={(e) => setCompanyLogo(e.target.value)}
                  placeholder="https://... or /company-logo.webp"
                  className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-zinc-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-zinc-400 block">Start Date</label>
                  <input
                    type="text"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    placeholder="Jul 2025"
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
                    placeholder="Present / Jun 2025"
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
                <label className="text-zinc-400 block">Key Responsibilities / Bullet Points (1 per line)</label>
                <textarea
                  rows={3}
                  value={responsibilitiesInput}
                  onChange={(e) => setResponsibilitiesInput(e.target.value)}
                  placeholder="Building Java, Spring Boot, and Activiti services...&#10;Raised JUnit coverage above 80%..."
                  className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white font-sans focus:outline-none focus:border-zinc-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-400 block">Project Badges (Comma separated, e.g. NFTVue)</label>
                <input
                  type="text"
                  value={projectsInput}
                  onChange={(e) => setProjectsInput(e.target.value)}
                  placeholder="NFTVue, DemoConstruct"
                  className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-zinc-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-zinc-400 block">Technologies Used (Comma separated)</label>
                <input
                  type="text"
                  value={technologiesInput}
                  onChange={(e) => setTechnologiesInput(e.target.value)}
                  placeholder="Java, Spring Boot, Activiti, Python, MariaDB"
                  className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-zinc-500"
                />
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

      {/* Education Modal */}
      {isModalOpen && activeTab === 'education' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setIsModalOpen(false)} className="fixed inset-0 bg-black/70 backdrop-blur-xs" />

          <div className="relative z-10 w-full max-w-xl bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-4 font-sans max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h2 className="text-base font-bold font-mono text-white">
                {editingId ? 'Edit Education Record' : 'Add Education Record'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-500 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEducation} className="space-y-4 font-mono text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-zinc-400 block">Institution / University *</label>
                  <input
                    type="text"
                    required
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    placeholder="Digipen Institute of Technology Singapore"
                    className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-zinc-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-400 block">Degree / Major *</label>
                  <input
                    type="text"
                    required
                    value={degree}
                    onChange={(e) => setDegree(e.target.value)}
                    placeholder="BS in Computer Science in Real-Time Interactive Simulation"
                    className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-zinc-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-zinc-400 block">Location</label>
                  <input
                    type="text"
                    value={eduLocation}
                    onChange={(e) => setEduLocation(e.target.value)}
                    placeholder="Singapore"
                    className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-zinc-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-400 block">Logo Type</label>
                  <select
                    value={eduLogoType}
                    onChange={(e) => setEduLogoType(e.target.value)}
                    className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-zinc-500 font-mono text-xs"
                  >
                    <option value="digipen">Digipen (Red DP Crest)</option>
                    <option value="sp">Singapore Polytechnic (Red SP Badge)</option>
                    <option value="custom">Custom (Image or Monogram)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-zinc-400 block">Institution Logo / Image URL (Optional)</label>
                <input
                  type="text"
                  value={eduLogoUrl}
                  onChange={(e) => setEduLogoUrl(e.target.value)}
                  placeholder="https://... or /institution-logo.webp"
                  className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-zinc-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-zinc-400 block">Start Date</label>
                  <input
                    type="text"
                    value={eduStartDate}
                    onChange={(e) => setEduStartDate(e.target.value)}
                    placeholder="Sep 2019"
                    className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-zinc-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-400 block">End Date</label>
                  <input
                    type="text"
                    disabled={currentStudy}
                    value={currentStudy ? 'Present' : eduEndDate}
                    onChange={(e) => setEduEndDate(e.target.value)}
                    placeholder="Apr 2023"
                    className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-zinc-500 disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="currentStudy"
                  checked={currentStudy}
                  onChange={(e) => setCurrentStudy(e.target.checked)}
                  className="rounded border-zinc-700 bg-zinc-950 text-blue-400 focus:ring-0 cursor-pointer"
                />
                <label htmlFor="currentStudy" className="text-zinc-300 cursor-pointer">
                  I currently study here
                </label>
              </div>

              <div className="space-y-1">
                <label className="text-zinc-400 block">Achievements & Highlights (1 per line)</label>
                <textarea
                  rows={3}
                  value={eduBulletsInput}
                  onChange={(e) => setEduBulletsInput(e.target.value)}
                  placeholder="Graduated with a Minor in Mathematics&#10;President of Digipen Student Management Committee...&#10;3-time recipient of the Dean's Honor List"
                  className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white font-sans focus:outline-none focus:border-zinc-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-400 block">Project Badges (Comma separated, e.g. Final Year Project, 2nd Year Project)</label>
                <input
                  type="text"
                  value={eduProjectsInput}
                  onChange={(e) => setEduProjectsInput(e.target.value)}
                  placeholder="Final Year Project, 2nd Year Project"
                  className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-zinc-500"
                />
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
                  className="px-4 py-2 rounded-xl bg-blue-500 text-white font-bold hover:bg-blue-400 flex items-center gap-1.5"
                >
                  {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                  <span>Save Education</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={!!deleteTargetId}
        title={deleteType === 'work' ? 'Delete Work Experience?' : 'Delete Education Record?'}
        description={`Are you sure you want to remove this ${deleteType === 'work' ? 'experience' : 'education'} record from your portfolio?`}
        confirmText="Delete Record"
        isDestructive
        isLoading={isPending}
        onConfirm={() => deleteTargetId && handleDelete(deleteTargetId, deleteType)}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  )
}
