import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { supabase, JobPosting, Industry, City, Skill } from '../../lib/supabase'
import { Spinner } from '../../components/ui/Spinner'
import { Alert } from '../../components/ui/Alert'
import { MultiSelect } from '../../components/ui/MultiSelect'
import toast from 'react-hot-toast'

export function JobEditorPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user, profile } = useAuth()
  
  const [job, setJob] = useState<Partial<JobPosting>>({
    title: '',
    description: '',
    requirements: '',
    responsibilities: '',
    employment_type: 'full_time',
    work_location_type: 'on_site',
    experience_level: 'entry',
    salary_currency: 'XAF',
    status: 'draft',
    featured: false,
    min_years_experience: 0,
  })
  
  const [selectedSkills, setSelectedSkills] = useState<Skill[]>([])
  
  const [industries, setIndustries] = useState<Industry[]>([])
  const [cities, setCities] = useState<City[]>([])
  const [allSkills, setAllSkills] = useState<Skill[]>([])

  const [loading, setLoading] = useState(!!id)
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null)

  useEffect(() => {
    fetchDropdownData()
    if (id) {
      fetchJobData()
    }
  }, [id])

  const fetchDropdownData = async () => {
    const [industriesRes, citiesRes, skillsRes] = await Promise.all([
      supabase.from('industries').select('*').order('name'),
      supabase.from('cities').select('*').order('name'),
      supabase.from('skills').select('*').order('name')
    ])
    setIndustries(industriesRes.data || [])
    setCities(citiesRes.data || [])
    setAllSkills(skillsRes.data || [])
  }

  const fetchJobData = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('job_postings')
      .select(`*, job_posting_skills(skills(*))`)
      .eq('id', id!)
      .single()
    
    if (data) {
      setJob(data)
      const skills = data.job_posting_skills.map(jps => jps.skills).filter(Boolean) as Skill[]
      setSelectedSkills(skills)
    }
    setLoading(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    setJob(prev => ({ ...prev, [name]: val }))
  }

  const handleSave = async (publish: boolean = false) => {
    if (!user || !profile?.company_id) {
      setStatus({ type: 'error', message: 'Vous devez être associé à une entreprise pour poster une offre.' })
      return
    }
    
    setSaving(true)
    setStatus(null)

    const { ...jobData } = job
    const upsertData = {
      ...jobData,
      employer_id: user.id,
      company_id: profile.company_id,
      status: publish ? 'published' : job.status,
    }

    const { data: savedJob, error: saveError } = id 
      ? await supabase.from('job_postings').update(upsertData).eq('id', id).select().single()
      : await supabase.from('job_postings').insert(upsertData).select().single()

    if (saveError) {
      setStatus({ type: 'error', message: saveError.message })
      setSaving(false)
      return
    }

    // Handle skills
    const newSkillIds = new Set(selectedSkills.map(s => s.id))
    const existingSkillIds = new Set(
      (job.job_posting_skills as any[])?.map(jps => jps.skills.id) || []
    )

    const skillsToAdd = [...newSkillIds].filter(skillId => !existingSkillIds.has(skillId))
    const skillsToRemove = [...existingSkillIds].filter(skillId => !newSkillIds.has(skillId))

    if (skillsToRemove.length > 0) {
      await supabase.from('job_posting_skills')
        .delete()
        .eq('job_posting_id', savedJob.id)
        .in('skill_id', skillsToRemove)
    }

    if (skillsToAdd.length > 0) {
      await supabase.from('job_posting_skills')
        .insert(skillsToAdd.map(skillId => ({ job_posting_id: savedJob.id, skill_id: skillId })))
    }
    
    toast.success(`Offre ${publish ? 'publiée' : 'sauvegardée'} avec succès !`)
    if (!id) {
      navigate(`/employer/jobs/${savedJob.id}/edit`)
    } else {
      await fetchJobData()
    }
    setSaving(false)
  }

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        {id ? 'Modifier l\'offre d\'emploi' : 'Créer une nouvelle offre'}
      </h1>

      <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-8 bg-white p-8 rounded-lg shadow-sm border border-gray-200">
        {status && <Alert type={status.type} message={status.message} onClose={() => setStatus(null)} />}

        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Titre du poste</label>
          <input type="text" name="title" id="title" value={job.title} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea name="description" id="description" value={job.description || ''} onChange={handleChange} rows={5} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="employment_type" className="block text-sm font-medium text-gray-700">Type de contrat</label>
            <select name="employment_type" id="employment_type" value={job.employment_type} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
              <option value="full_time">Temps plein</option>
              <option value="part_time">Temps partiel</option>
              <option value="contract">Contrat</option>
              <option value="internship">Stage</option>
              <option value="freelance">Freelance</option>
            </select>
          </div>
          <div>
            <label htmlFor="work_location_type" className="block text-sm font-medium text-gray-700">Mode de travail</label>
            <select name="work_location_type" id="work_location_type" value={job.work_location_type} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
              <option value="on_site">Sur site</option>
              <option value="remote">Télétravail</option>
              <option value="hybrid">Hybride</option>
            </select>
          </div>
          <div>
            <label htmlFor="experience_level" className="block text-sm font-medium text-gray-700">Niveau d'expérience</label>
            <select name="experience_level" id="experience_level" value={job.experience_level} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
              <option value="entry">Débutant</option>
              <option value="mid">Intermédiaire</option>
              <option value="senior">Senior</option>
              <option value="executive">Dirigeant</option>
            </select>
          </div>
          <div>
            <label htmlFor="industry_id" className="block text-sm font-medium text-gray-700">Secteur d'activité</label>
            <select name="industry_id" id="industry_id" value={job.industry_id || ''} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
              <option value="">Sélectionner un secteur</option>
              {industries.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="city_id" className="block text-sm font-medium text-gray-700">Ville</label>
            <select name="city_id" id="city_id" value={job.city_id || ''} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
              <option value="">Sélectionner une ville</option>
              {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">Statut de l'offre</label>
            <select name="status" id="status" value={job.status} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
              <option value="draft">Brouillon</option>
              <option value="published">Publiée</option>
              <option value="paused">En pause</option>
              <option value="closed">Fermée</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Compétences requises</label>
          <MultiSelect
            options={allSkills}
            selectedOptions={selectedSkills}
            onChange={setSelectedSkills}
            labelKey="name"
            valueKey="id"
            placeholder="Rechercher et ajouter des compétences"
          />
        </div>

        <div className="pt-5">
          <div className="flex justify-end space-x-3">
            <button type="button" onClick={() => navigate('/employer/dashboard')} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">
              Annuler
            </button>
            <button type="submit" disabled={saving} className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50">
              {saving ? <Spinner size="sm" /> : 'Sauvegarder Brouillon'}
            </button>
            <button type="button" onClick={() => handleSave(true)} disabled={saving} className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50">
              {saving ? <Spinner size="sm" color="border-white" /> : 'Sauvegarder et Publier'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
