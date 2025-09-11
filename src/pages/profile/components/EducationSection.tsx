import React, { useState, useEffect } from 'react'
import { useAuth } from '../../../context/AuthContext'
import { supabase, Education } from '../../../lib/supabase'
import { Spinner } from '../../../components/ui/Spinner'
import { Modal } from '../../../components/ui/Modal'
import { ConfirmationModal } from '../../../components/ui/ConfirmationModal'
import { PlusIcon, PencilIcon, TrashIcon, AcademicCapIcon } from '@heroicons/react/24/outline'

export function EducationSection() {
  const { user } = useAuth()
  const [educations, setEducations] = useState<Education[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [currentEducation, setCurrentEducation] = useState<Partial<Education> | null>(null)
  const [educationToDelete, setEducationToDelete] = useState<string | null>(null)

  useEffect(() => {
    fetchEducations()
  }, [])

  const fetchEducations = async () => {
    if (!user) return
    setLoading(true)
    const { data } = await supabase.from('educations').select('*').eq('job_seeker_id', user.id).order('end_date', { ascending: false })
    setEducations(data || [])
    setLoading(false)
  }

  const handleOpenModal = (edu: Partial<Education> | null = null) => {
    setCurrentEducation(edu || { job_seeker_id: user?.id })
    setIsModalOpen(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentEducation) return

    const { error } = await supabase.from('educations').upsert(currentEducation)
    if (!error) {
      setIsModalOpen(false)
      fetchEducations()
    }
  }

  const handleDelete = async () => {
    if (!educationToDelete) return
    const { error } = await supabase.from('educations').delete().eq('id', educationToDelete)
    if (!error) {
      fetchEducations()
    }
  }

  if (loading) return <Spinner />

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center"><AcademicCapIcon className="h-6 w-6 mr-2" />Formations</h2>
        <button onClick={() => handleOpenModal()} className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700">
          <PlusIcon className="h-5 w-5" />
        </button>
      </div>
      <div className="space-y-4">
        {educations.map(edu => (
          <div key={edu.id} className="p-4 border rounded-md flex justify-between items-start">
            <div>
              <h3 className="font-semibold">{edu.degree} - {edu.field_of_study}</h3>
              <p className="text-sm text-gray-600">{edu.institution_name}</p>
              <p className="text-xs text-gray-500">{edu.start_date} - {edu.end_date}</p>
            </div>
            <div className="flex space-x-2">
              <button onClick={() => handleOpenModal(edu)} className="text-gray-500 hover:text-blue-600"><PencilIcon className="h-5 w-5" /></button>
              <button onClick={() => { setEducationToDelete(edu.id); setIsConfirmOpen(true); }} className="text-gray-500 hover:text-red-600"><TrashIcon className="h-5 w-5" /></button>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={currentEducation?.id ? 'Modifier la formation' : 'Ajouter une formation'}>
        <form onSubmit={handleSave} className="space-y-4">
          <input type="text" placeholder="Établissement" value={currentEducation?.institution_name || ''} onChange={e => setCurrentEducation(p => ({ ...p, institution_name: e.target.value }))} required className="w-full border-gray-300 rounded-md" />
          <input type="text" placeholder="Diplôme (Ex: Licence, Master)" value={currentEducation?.degree || ''} onChange={e => setCurrentEducation(p => ({ ...p, degree: e.target.value }))} required className="w-full border-gray-300 rounded-md" />
          <input type="text" placeholder="Domaine d'étude" value={currentEducation?.field_of_study || ''} onChange={e => setCurrentEducation(p => ({ ...p, field_of_study: e.target.value }))} required className="w-full border-gray-300 rounded-md" />
          <div className="flex space-x-2">
            <input type="date" placeholder="Date de début" value={currentEducation?.start_date || ''} onChange={e => setCurrentEducation(p => ({ ...p, start_date: e.target.value }))} required className="w-full border-gray-300 rounded-md" />
            <input type="date" placeholder="Date de fin" value={currentEducation?.end_date || ''} onChange={e => setCurrentEducation(p => ({ ...p, end_date: e.target.value }))} className="w-full border-gray-300 rounded-md" />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md">Sauvegarder</button>
        </form>
      </Modal>

      <ConfirmationModal isOpen={isConfirmOpen} onClose={() => setIsConfirmOpen(false)} onConfirm={handleDelete} title="Confirmer la suppression" message="Voulez-vous vraiment supprimer cette formation ?" />
    </div>
  )
}
