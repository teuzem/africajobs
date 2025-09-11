import React, { useState, useEffect } from 'react'
import { useAuth } from '../../../context/AuthContext'
import { supabase, JobSeekerProfile } from '../../../lib/supabase'
import { Spinner } from '../../../components/ui/Spinner'
import { Alert } from '../../../components/ui/Alert'
import { BriefcaseIcon } from '@heroicons/react/24/outline'

interface Props {
  jobSeekerProfile: JobSeekerProfile | null
  onProfileUpdate: (data: JobSeekerProfile) => void
}

export function ProfessionalInfoSection({ jobSeekerProfile, onProfileUpdate }: Props) {
  const { user } = useAuth()
  const [formData, setFormData] = useState<Partial<JobSeekerProfile>>({})
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null)

  useEffect(() => {
    if (jobSeekerProfile) {
      setFormData(jobSeekerProfile)
    } else {
      setFormData({ profile_id: user?.id })
    }
  }, [jobSeekerProfile, user])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setStatus(null)
    const { data, error } = await supabase.from('job_seeker_profiles').upsert(formData).select().single()
    if (error) {
      setStatus({ type: 'error', message: 'Erreur lors de la mise à jour.' })
    } else {
      setStatus({ type: 'success', message: 'Profil mis à jour avec succès !' })
      if (data) onProfileUpdate(data)
    }
    setSaving(false)
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center"><BriefcaseIcon className="h-6 w-6 mr-2" />Informations Professionnelles</h2>
      <form onSubmit={handleSave} className="space-y-4">
        {status && <Alert type={status.type} message={status.message} onClose={() => setStatus(null)} />}
        <div>
          <label htmlFor="headline" className="block text-sm font-medium text-gray-700">Titre du profil (Ex: Développeur Full-Stack)</label>
          <input id="headline" name="headline" type="text" value={formData.headline || ''} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md" />
        </div>
        <div>
          <label htmlFor="summary" className="block text-sm font-medium text-gray-700">Résumé professionnel</label>
          <textarea id="summary" name="summary" rows={4} value={formData.summary || ''} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md" />
        </div>
        <div>
          <label htmlFor="availability" className="block text-sm font-medium text-gray-700">Disponibilité</label>
          <select id="availability" name="availability" value={formData.availability || 'not_available'} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md">
            <option value="not_available">Non disponible</option>
            <option value="available_immediately">Immédiatement</option>
            <option value="available_in_1_month">Dans 1 mois</option>
            <option value="open_to_opportunities">Ouvert aux opportunités</option>
          </select>
        </div>
        <div className="text-right">
          <button type="submit" disabled={saving} className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50">
            {saving ? <Spinner size="sm" /> : 'Sauvegarder'}
          </button>
        </div>
      </form>
    </div>
  )
}
