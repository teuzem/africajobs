import React, { useState, useEffect } from 'react'
import { useAuth } from '../../../context/AuthContext'
import { supabase, WorkExperience } from '../../../lib/supabase'
import { Spinner } from '../../../components/ui/Spinner'
import { Modal } from '../../../components/ui/Modal'
import { ConfirmationModal } from '../../../components/ui/ConfirmationModal'
import { PlusIcon, PencilIcon, TrashIcon, BriefcaseIcon } from '@heroicons/react/24/outline'

export function ExperienceSection() {
  const { user } = useAuth()
  const [experiences, setExperiences] = useState<WorkExperience[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [currentExperience, setCurrentExperience] = useState<Partial<WorkExperience> | null>(null)
  const [experienceToDelete, setExperienceToDelete] = useState<string | null>(null)

  useEffect(() => {
    fetchExperiences()
  }, [])

  const fetchExperiences = async () => {
    if (!user) return
    setLoading(true)
    const { data } = await supabase.from('work_experiences').select('*').eq('job_seeker_id', user.id).order('end_date', { ascending: false, nullsFirst: false })
    setExperiences(data || [])
    setLoading(false)
  }

  const handleOpenModal = (exp: Partial<WorkExperience> | null = null) => {
    setCurrentExperience(exp || { job_seeker_id: user?.id })
    setIsModalOpen(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentExperience) return

    const { error } = await supabase.from('work_experiences').upsert(currentExperience)
    if (!error) {
      setIsModalOpen(false)
      fetchExperiences()
    }
  }

  const handleDelete = async () => {
    if (!experienceToDelete) return
    const { error } = await supabase.from('work_experiences').delete().eq('id', experienceToDelete)
    if (!error) {
      fetchExperiences()
    }
  }

  if (loading) return <Spinner />

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center"><BriefcaseIcon className="h-6 w-6 mr-2" />Expériences Professionnelles</h2>
        <button onClick={() => handleOpenModal()} className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700">
          <PlusIcon className="h-5 w-5" />
        </button>
      </div>
      <div className="space-y-4">
        {experiences.map(exp => (
          <div key={exp.id} className="p-4 border rounded-md flex justify-between items-start">
            <div>
              <h3 className="font-semibold">{exp.job_title} chez {exp.company_name}</h3>
              <p className="text-sm text-gray-600">{exp.location}</p>
              <p className="text-xs text-gray-500">{exp.start_date} - {exp.end_date || 'Aujourd\'hui'}</p>
              <p className="text-sm mt-2">{exp.description}</p>
            </div>
            <div className="flex space-x-2">
              <button onClick={() => handleOpenModal(exp)} className="text-gray-500 hover:text-blue-600"><PencilIcon className="h-5 w-5" /></button>
              <button onClick={() => { setExperienceToDelete(exp.id); setIsConfirmOpen(true); }} className="text-gray-500 hover:text-red-600"><TrashIcon className="h-5 w-5" /></button>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={currentExperience?.id ? 'Modifier l\'expérience' : 'Ajouter une expérience'}>
        <form onSubmit={handleSave} className="space-y-4">
          <input type="text" placeholder="Titre du poste" value={currentExperience?.job_title || ''} onChange={e => setCurrentExperience(p => ({ ...p, job_title: e.target.value }))} required className="w-full border-gray-300 rounded-md" />
          <input type="text" placeholder="Nom de l'entreprise" value={currentExperience?.company_name || ''} onChange={e => setCurrentExperience(p => ({ ...p, company_name: e.target.value }))} required className="w-full border-gray-300 rounded-md" />
          <input type="text" placeholder="Lieu" value={currentExperience?.location || ''} onChange={e => setCurrentExperience(p => ({ ...p, location: e.target.value }))} className="w-full border-gray-300 rounded-md" />
          <div className="flex space-x-2">
            <input type="date" placeholder="Date de début" value={currentExperience?.start_date || ''} onChange={e => setCurrentExperience(p => ({ ...p, start_date: e.target.value }))} required className="w-full border-gray-300 rounded-md" />
            <input type="date" placeholder="Date de fin (laisser vide si actuel)" value={currentExperience?.end_date || ''} onChange={e => setCurrentExperience(p => ({ ...p, end_date: e.target.value }))} className="w-full border-gray-300 rounded-md" />
          </div>
          <textarea placeholder="Description" value={currentExperience?.description || ''} onChange={e => setCurrentExperience(p => ({ ...p, description: e.target.value }))} className="w-full border-gray-300 rounded-md" />
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md">Sauvegarder</button>
        </form>
      </Modal>

      <ConfirmationModal isOpen={isConfirmOpen} onClose={() => setIsConfirmOpen(false)} onConfirm={handleDelete} title="Confirmer la suppression" message="Voulez-vous vraiment supprimer cette expérience ?" />
    </div>
  )
}
