'use client'

import React, { useState, useEffect, useTransition } from 'react'
import { Plus, Edit2, Trash2, Cpu, CheckCircle2, Loader2, X, Star, Sparkles, Check, Database, Cloud, Terminal } from 'lucide-react'
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
  { name: 'Express.js', category: SkillCategory.BACKEND, iconKey: 'Expressjs', iconComponent: <Expressjs className="size-4" /> },
  { name: 'Python', category: SkillCategory.LANGUAGES, iconKey: 'Python', iconComponent: <Python className="size-4" /> },
  { name: 'MongoDB', category: SkillCategory.DATABASES, iconKey: 'MongoDB', iconComponent: <MongoDB className="size-4" /> },
  { name: 'PostgreSQL', category: SkillCategory.DATABASES, iconKey: 'PostgreSQL', iconComponent: <PostgreSQL className="size-4" /> },
  { name: 'Redis', category: SkillCategory.DATABASES, iconKey: 'Redis', iconComponent: <Redis className="size-4" /> },
  { name: 'Upstash', category: SkillCategory.DATABASES, iconKey: 'Upstash', iconComponent: <Upstash className="size-4" /> },
  { name: 'AWS', category: SkillCategory.CLOUD, iconKey: 'AmazonWebServices', iconComponent: <AmazonWebServices className="size-4" /> },
  { name: 'Docker', category: SkillCategory.DEVOPS, iconKey: 'Docker', iconComponent: <Docker className="size-4" /> },
  { name: 'Git', category: SkillCategory.TOOLS, iconKey: 'Git', iconComponent: <Git className="size-4" /> },
  { name: 'GitHub', category: SkillCategory.TOOLS, iconKey: 'GitHub', iconComponent: <GitHub className="size-4" /> },
  { name: 'AI & Groq LLMs', category: SkillCategory.AI, iconKey: 'Sparkles', iconComponent: <Sparkles className="size-4 text-emerald-400" /> },
]

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  // Form State
  const [name, setName] = useState('')
  const [category, setCategory] = useState<SkillCategory>(SkillCategory.FRONTEND)
  const [icon, setIcon] = useState('')
  const [color, setColor] = useState('')
  const [proficiency, setProficiency] = useState(85)
  const [order, setOrder] = useState(0)
  const [featured, setFeatured] = useState(false)

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
        toast.error(err?.message || 'Failed to add skill (Session may have expired)')
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
        const payload = {
          name,
          category,
          icon,
          color,
          proficiency,
          order,
          featured,
        }

        let res
        if (editingId) {
          res = await updateSkillAction(editingId, payload)
        } else {
          res = await createSkillAction(payload)
        }

        if (res.success) {
          toast.success(editingId ? 'Skill updated' : 'Skill added')
          setIsModalOpen(false)
          loadSkills()
        } else {
          toast.error(res.error || 'Failed to save skill')
        }
      } catch (err: any) {
        toast.error(err?.message || 'Failed to save skill (Session may have expired)')
      }
    })
  }

  const handleSoftDelete = (id: string) => {
    startTransition(async () => {
      try {
        const res = await softDeleteSkillAction(id)
        if (res.success) {
          toast.success('Skill deleted')
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
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-emerald-400" />
            <h1 className="text-xl sm:text-2xl font-bold font-mono text-white tracking-tight">
              Skills Matrix CMS
            </h1>
          </div>
          <p className="text-xs text-zinc-400 font-mono pt-1">
            Click 1-click presets or add custom skills with SVG icons.
          </p>
        </div>

        <button
          onClick={() => openModal()}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-medium bg-zinc-100 text-zinc-950 hover:bg-white transition-all shadow-md shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Skill</span>
        </button>
      </div>

      {/* 1-Click Preset Skills Bar */}
      <div className="p-5 rounded-2xl border border-zinc-800/80 bg-zinc-900/60 backdrop-blur-md space-y-3">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
          <div>
            <h2 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> 1-Click Skill Presets
            </h2>
            <p className="text-[11px] font-mono text-zinc-400 pt-0.5">
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
                className={`group relative inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-mono transition-all duration-200 shadow-xs select-none ${
                  isAdded
                    ? 'border-zinc-800/60 bg-zinc-950/40 text-zinc-500 opacity-60 cursor-not-allowed'
                    : 'border-zinc-800 bg-zinc-950 hover:border-zinc-600 hover:bg-zinc-800/80 text-zinc-200 cursor-pointer hover:scale-[1.02]'
                }`}
              >
                <div className="size-4 shrink-0 flex items-center justify-center">
                  {preset.iconComponent}
                </div>
                <span>{preset.name}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-800/80 text-zinc-400 font-sans">
                  {preset.category}
                </span>
                {isAdded ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                ) : (
                  <Plus className="w-3.5 h-3.5 text-zinc-400 group-hover:text-emerald-400 transition-colors shrink-0" />
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
              className="p-5 rounded-2xl border border-zinc-800/80 bg-zinc-900/60 backdrop-blur-md space-y-3"
            >
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  {cat} ({categorySkills.length})
                </h3>
                <button
                  onClick={() => {
                    setCategory(cat)
                    openModal()
                  }}
                  className="text-[11px] font-mono text-emerald-400 hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Add
                </button>
              </div>

              {categorySkills.length === 0 ? (
                <div className="text-[11px] font-mono text-zinc-600 py-3">No skills in {cat}</div>
              ) : (
                <div className="space-y-2">
                  {categorySkills.map((skill) => (
                    <div
                      key={skill.id}
                      className="p-3 rounded-xl border border-zinc-800/80 bg-zinc-950/60 flex items-center justify-between gap-3 hover:border-zinc-700 transition-colors"
                    >
                      <div className="space-y-1 flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-white truncate">
                            {skill.name}
                          </span>
                          {skill.featured && (
                            <span className="p-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                              <Star className="w-3 h-3 fill-current" />
                            </span>
                          )}
                        </div>

                          {/* Skill Card Header */}
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => openModal(skill)}
                          className="p-1.5 rounded-lg bg-zinc-800 text-zinc-300 hover:text-white"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteTargetId(skill.id)}
                          className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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

      {/* Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setIsModalOpen(false)} className="fixed inset-0 bg-black/70 backdrop-blur-xs" />

          <div className="relative z-10 w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-4 font-sans">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h2 className="text-base font-bold font-mono text-white">
                {editingId ? 'Edit Skill' : 'Add New Skill'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-500 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 font-mono text-xs">
              <div className="space-y-1.5 pb-1">
                <label className="text-zinc-400 block text-[11px]">Quick Select Icon Preset</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-32 overflow-y-auto p-2 rounded-xl border border-zinc-800 bg-zinc-950">
                  {SKILL_PRESETS.map((p) => (
                    <button
                      key={p.name}
                      type="button"
                      onClick={() => {
                        setName(p.name)
                        setCategory(p.category)
                        setIcon(p.iconKey)
                      }}
                      className={`flex items-center gap-1.5 p-1.5 rounded-lg border text-[10px] font-mono transition-all text-left truncate ${
                        name.toLowerCase() === p.name.toLowerCase()
                          ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300'
                          : 'border-zinc-800/80 hover:border-zinc-700 bg-zinc-900/60 text-zinc-300'
                      }`}
                    >
                      <span className="shrink-0 size-3.5 flex items-center justify-center">{p.iconComponent}</span>
                      <span className="truncate">{p.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-zinc-400 block">Skill Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Next.js 16"
                  className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-zinc-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-400 block">Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as SkillCategory)}
                  className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-zinc-500"
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
                  className="rounded border-zinc-700 bg-zinc-950 text-emerald-400 cursor-pointer"
                />
                <label htmlFor="featuredSkill" className="text-zinc-300 cursor-pointer">
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
                  <span>Save Skill</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteTargetId}
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
