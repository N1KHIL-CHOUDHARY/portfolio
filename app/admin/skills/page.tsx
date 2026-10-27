'use client'

import React, { useState, useEffect, useTransition } from 'react'
import { Plus, Edit2, Trash2, Cpu, CheckCircle2, Loader2, X, Star, Sparkles, Check } from 'lucide-react'
import ConfirmDialog from '@/components/admin/ui/ConfirmDialog'
import { toast } from 'sonner'
import { fetchSkillsAction, createSkillAction, updateSkillAction, softDeleteSkillAction } from '@/actions/skills'
import { Skill, SkillCategory } from '@prisma/client'
import {
  Nextjs,
  React as ReactIcon,
  TypeScript,
  Nodejs,
  Python,
  TailwindCSS,
  AmazonWebServices,
  Expressjs,
  Git,
  GitHub,
  MongoDB,
  PostgreSQL,
  Docker,
  Redis,
  Upstash,
  Motion,
  Prisma,
} from '@/components/icons'

const CATEGORIES: SkillCategory[] = [
  SkillCategory.FRONTEND,
  SkillCategory.BACKEND,
  SkillCategory.LANGUAGES,
  SkillCategory.DATABASES,
  SkillCategory.DEVOPS,
  SkillCategory.CLOUD,
  SkillCategory.TOOLS,
  SkillCategory.AI,
]

interface SkillPreset {
  name: string
  category: SkillCategory
  iconKey: string
  iconComponent: React.ReactNode
}

const SKILL_PRESETS: SkillPreset[] = [
  { name: 'Next.js', category: SkillCategory.FRONTEND, iconKey: 'Nextjs', iconComponent: <Nextjs className="size-4" /> },
  { name: 'React', category: SkillCategory.FRONTEND, iconKey: 'ReactIcon', iconComponent: <ReactIcon className="size-4 text-[#58C4DC]" /> },
  { name: 'TypeScript', category: SkillCategory.LANGUAGES, iconKey: 'TypeScript', iconComponent: <TypeScript className="size-4" /> },
  { name: 'JavaScript', category: SkillCategory.LANGUAGES, iconKey: 'TypeScript', iconComponent: <TypeScript className="size-4 text-[#F7DF1E]" /> },
  { name: 'Tailwind CSS', category: SkillCategory.FRONTEND, iconKey: 'TailwindCSS', iconComponent: <TailwindCSS className="size-4" /> },
  { name: 'Motion', category: SkillCategory.FRONTEND, iconKey: 'Motion', iconComponent: <Motion className="size-4" /> },
  { name: 'Node.js', category: SkillCategory.BACKEND, iconKey: 'Nodejs', iconComponent: <Nodejs className="size-4" /> },
  { name: 'Express.js', category: SkillCategory.BACKEND, iconKey: 'Expressjs', iconComponent: <Expressjs className="size-4 text-amber-500 dark:text-[#F7DF1E]" /> },
  { name: 'Python', category: SkillCategory.LANGUAGES, iconKey: 'Python', iconComponent: <Python className="size-4" /> },
  { name: 'MongoDB', category: SkillCategory.DATABASES, iconKey: 'MongoDB', iconComponent: <MongoDB className="size-4" /> },
  { name: 'PostgreSQL', category: SkillCategory.DATABASES, iconKey: 'PostgreSQL', iconComponent: <PostgreSQL className="size-4" /> },
  { name: 'Prisma', category: SkillCategory.DATABASES, iconKey: 'Prisma', iconComponent: <Prisma className="size-4 text-teal-600 dark:text-teal-400" /> },
  { name: 'Redis', category: SkillCategory.DATABASES, iconKey: 'Redis', iconComponent: <Redis className="size-4" /> },
  { name: 'Upstash', category: SkillCategory.DATABASES, iconKey: 'Upstash', iconComponent: <Upstash className="size-4" /> },
  { name: 'AWS', category: SkillCategory.CLOUD, iconKey: 'AmazonWebServices', iconComponent: <AmazonWebServices className="size-4" /> },
  { name: 'Docker', category: SkillCategory.DEVOPS, iconKey: 'Docker', iconComponent: <Docker className="size-4" /> },
  { name: 'Git', category: SkillCategory.TOOLS, iconKey: 'Git', iconComponent: <Git className="size-4" /> },
  { name: 'GitHub', category: SkillCategory.TOOLS, iconKey: 'GitHub', iconComponent: <GitHub className="size-4 text-[#8957e5] dark:text-[#a371f7]" /> },
]

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isPending, startTransition] = useTransition()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [category, setCategory] = useState<SkillCategory>(SkillCategory.FRONTEND)
  const [icon, setIcon] = useState('')
  const [color, setColor] = useState('')
  const [proficiency, setProficiency] = useState(85)
  const [order, setOrder] = useState(0)
  const [featured, setFeatured] = useState(false)

  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)

  const loadSkills = async () => {
    setIsLoading(true)
    try {
      const res = await fetchSkillsAction()
      if (res.success && res.items) {
        setSkills(res.items as Skill[])
      }
    } catch {
      toast.error('Failed to load skills')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadSkills()
  }, [])

  const handleQuickAddPreset = (preset: SkillPreset) => {
    const existing = skills.find((s) => s.name.toLowerCase() === preset.name.toLowerCase())
    if (existing) {
      toast.info(`${preset.name} is already in your skills matrix`)
      return
    }

    startTransition(async () => {
      try {
        const res = await createSkillAction({
          name: preset.name,
          category: preset.category,
          icon: preset.iconKey,
          featured: true,
          proficiency: 90,
          order: skills.length + 1,
        })

        if (res.success) {
          toast.success(`Added ${preset.name} to ${preset.category}!`)
          loadSkills()
        } else {
          toast.error(res.error || `Failed to add ${preset.name}`)
        }
      } catch (err: any) {
        toast.error(err?.message || 'Failed to add skill')
      }
    })
  }

  const openModal = (skill?: Skill) => {
    if (skill) {
      setEditingId(skill.id)
      setName(skill.name)
      setCategory(skill.category)
      setIcon(skill.icon || '')
      setColor(skill.color || '')
      setProficiency(skill.proficiency)
      setOrder(skill.order)
      setFeatured(skill.featured)
    } else {
      setEditingId(null)
      setName('')
      setCategory(SkillCategory.FRONTEND)
      setIcon('')
      setColor('')
      setProficiency(85)
      setOrder(skills.length + 1)
      setFeatured(false)
    }
    setIsModalOpen(true)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name) {
      toast.error('Skill name is required!')
      return
    }

    startTransition(async () => {
      try {
        if (editingId) {
          const res = await updateSkillAction(editingId, {
            name,
            category,
            icon,
            color,
            proficiency,
            order,
            featured,
          })
          if (res.success) {
            toast.success('Skill updated successfully!')
            setIsModalOpen(false)
            loadSkills()
          } else {
            toast.error(res.error || 'Failed to update skill')
          }
        } else {
          const res = await createSkillAction({
            name,
            category,
            icon,
            color,
            proficiency,
            order,
            featured,
          })
          if (res.success) {
            toast.success('Skill created successfully!')
            setIsModalOpen(false)
            loadSkills()
          } else {
            toast.error(res.error || 'Failed to create skill')
          }
        }
      } catch (err: any) {
        toast.error(err?.message || 'Failed to save skill')
      }
    })
  }

  const handleSoftDelete = (id: string) => {
    startTransition(async () => {
      try {
        const res = await softDeleteSkillAction(id)
        if (res.success) {
          toast.success('Skill deleted successfully')
          setDeleteTargetId(null)
          loadSkills()
        } else {
          toast.error(res.error || 'Failed to delete skill')
        }
      } catch (err: any) {
        toast.error(err?.message || 'Failed to delete skill')
      }
    })
  }

  return (
    <div className="space-y-6 font-mono text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-dashed border-neutral-300 dark:border-neutral-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-neutral-500" />
            <h1 className="text-xl font-bold text-neutral-900 dark:text-neutral-50 tracking-tight">
              Skills Matrix CMS
            </h1>
          </div>
          <p className="text-neutral-500 dark:text-neutral-400 text-xs pt-1">
            Click 1-click presets or configure custom competencies.
          </p>
        </div>

        <button
          type="button"
          onClick={() => openModal()}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md text-xs font-medium bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-950 hover:bg-neutral-800 dark:hover:bg-white transition-colors shadow-xs shrink-0 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Custom Skill</span>
        </button>
      </div>

      {/* 1-Click Preset Skills Bar */}
      <div className="p-5 rounded-lg border border-dashed border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-950 space-y-3">
        <div className="flex items-center justify-between border-b border-dashed border-neutral-200 dark:border-neutral-800 pb-2.5">
          <div>
            <h2 className="text-xs font-bold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> 1-Click Skill Presets
            </h2>
            <p className="text-[11px] text-neutral-500 pt-0.5">
              Click any tech below to instantly add it to your portfolio database with icon & category pre-configured.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          {SKILL_PRESETS.map((preset) => {
            const isAdded = skills.some((s) => s.name.toLowerCase() === preset.name.toLowerCase())

            return (
              <button
                key={preset.name}
                type="button"
                onClick={() => handleQuickAddPreset(preset)}
                disabled={isAdded || isPending}
                className={`group relative inline-flex items-center gap-2 px-2.5 py-1.5 rounded-md border border-dashed text-xs transition-all shadow-xs select-none cursor-pointer ${
                  isAdded
                    ? 'border-neutral-200 dark:border-neutral-800 bg-neutral-100/60 dark:bg-neutral-900/60 text-neutral-400 opacity-60 cursor-not-allowed'
                    : 'border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:border-neutral-500 text-neutral-800 dark:text-neutral-200'
                }`}
              >
                <div className="size-4 shrink-0 flex items-center justify-center">
                  {preset.iconComponent}
                </div>
                <span>{preset.name}</span>
                <span className="text-[10px] px-1 py-0.2 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-500">
                  {preset.category}
                </span>
                {isAdded ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                ) : (
                  <Plus className="w-3.5 h-3.5 text-neutral-400 group-hover:text-emerald-500 transition-colors shrink-0" />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Categorized Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {CATEGORIES.map((cat) => {
          const categorySkills = skills.filter((s) => s.category === cat)

          return (
            <div
              key={cat}
              className="p-5 rounded-lg border border-dashed border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-950 space-y-3"
            >
              <div className="flex items-center justify-between border-b border-dashed border-neutral-200 dark:border-neutral-800 pb-2.5">
                <span className="font-bold text-xs text-neutral-900 dark:text-neutral-100 uppercase tracking-wider">
                  {cat}
                </span>
                <span className="text-[10px] text-neutral-400">
                  {categorySkills.length} skill{categorySkills.length !== 1 ? 's' : ''}
                </span>
              </div>

              {categorySkills.length === 0 ? (
                <div className="py-6 text-center text-neutral-400 text-xs">No skills in this category</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {categorySkills.map((skill) => (
                    <div
                      key={skill.id}
                      className="p-2.5 rounded-md border border-dashed border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40 flex items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="font-semibold text-neutral-800 dark:text-neutral-200 truncate text-xs">
                          {skill.name}
                        </span>
                        {skill.featured && (
                          <Star className="w-3 h-3 text-amber-500 fill-current shrink-0" />
                        )}
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => openModal(skill)}
                          className="p-1 rounded text-neutral-500 hover:text-neutral-900 dark:hover:text-white cursor-pointer"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTargetId(skill.id)}
                          className="p-1 rounded text-rose-500 hover:text-rose-700 cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white dark:bg-neutral-900 border border-dashed border-neutral-300 dark:border-neutral-800 rounded-lg p-5 w-full max-w-md space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-dashed border-neutral-200 dark:border-neutral-800 pb-3">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                {editingId ? 'Edit Skill' : 'Create Custom Skill'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-neutral-500 hover:text-neutral-900 dark:hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="text-neutral-600 dark:text-neutral-400 block mb-1 font-semibold">Skill Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Docker, GraphQL"
                  className="w-full px-3 py-2 bg-transparent border border-dashed border-neutral-300 dark:border-neutral-800 rounded-md text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-neutral-600 dark:text-neutral-400 block mb-1 font-semibold">Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as SkillCategory)}
                  className="w-full px-3 py-2 bg-white dark:bg-neutral-900 border border-dashed border-neutral-300 dark:border-neutral-800 rounded-md text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none cursor-pointer"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="featuredSkill"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="rounded border-neutral-300 dark:border-neutral-700"
                />
                <label htmlFor="featuredSkill" className="text-neutral-700 dark:text-neutral-300 text-xs cursor-pointer">
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
                  Save Skill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={Boolean(deleteTargetId)}
        title="Delete Skill?"
        description="Are you sure you want to delete this skill?"
        confirmText="Delete"
        isDestructive
        isLoading={isPending}
        onConfirm={() => deleteTargetId && handleSoftDelete(deleteTargetId)}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  )
}
