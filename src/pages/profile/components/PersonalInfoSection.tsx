import React, { useState } from 'react'
import { useAuth } from '../../../context/AuthContext'
import { Spinner } from '../../../components/ui/Spinner'
import { Alert } from '../../../components/ui/Alert'
import { UserCircleIcon } from '@heroicons/react/24/outline'

export function PersonalInfoSection() {
  const { user, profile, updateProfile, loading: authLoading } = useAuth()
  const [fullName, setFullName] = useState(profile?.full_name || '')
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null)

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setStatus(null)
    const { error } = await updateProfile({ full_name: fullName })
    if (error) {
      setStatus({ type: 'error', message: 'Erreur lors de la mise à jour.' })
    } else {
      setStatus({ type: 'success', message: 'Profil mis à jour avec succès !' })
    }
    setSaving(false)
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center"><UserCircleIcon className="h-6 w-6 mr-2" />Informations Personnelles</h2>
      <form onSubmit={handleSave} className="space-y-4">
        {status && <Alert type={status.type} message={status.message} onClose={() => setStatus(null)} />}
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Nom complet</label>
          <input id="fullName" type="text" value={fullName} onChange={e => setFullName(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md" />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input id="email" type="email" value={user?.email || ''} disabled className="mt-1 block w-full border-gray-300 rounded-md bg-gray-100" />
        </div>
        <div className="text-right">
          <button type="submit" disabled={saving || authLoading} className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50">
            {saving ? <Spinner size="sm" /> : 'Sauvegarder'}
          </button>
        </div>
      </form>
    </div>
  )
}
