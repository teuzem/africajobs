import React, { useState } from 'react'
import { useAuth } from '../../../context/AuthContext'
import { supabase, JobSeekerProfile } from '../../../lib/supabase'
import { Spinner } from '../../../components/ui/Spinner'
import toast from 'react-hot-toast'
import { DocumentArrowUpIcon, DocumentCheckIcon, TrashIcon } from '@heroicons/react/24/outline'

interface Props {
  jobSeekerProfile: JobSeekerProfile | null
  onProfileUpdate: (data: Partial<JobSeekerProfile>) => void
}

export function ResumeSection({ jobSeekerProfile, onProfileUpdate }: Props) {
  const { user } = useAuth()
  const [uploading, setUploading] = useState(false)

  const handleResumeUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!user || !jobSeekerProfile) return
    try {
      setUploading(true)
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('Vous devez sélectionner un fichier.')
      }

      const file = event.target.files[0]
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        throw new Error('Le fichier est trop volumineux (max 5MB).')
      }

      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}-resume.${fileExt}`
      const filePath = `${user.id}/${fileName}`

      // Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(filePath, file, { upsert: true })

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = supabase.storage.from('resumes').getPublicUrl(filePath)

      // Update profile
      const updates = { resume_url: publicUrl, resume_filename: file.name }
      const { data, error: dbError } = await supabase
        .from('job_seeker_profiles')
        .update(updates)
        .eq('id', jobSeekerProfile.id)
        .select()
        .single()
      
      if (dbError) throw dbError
      
      onProfileUpdate(data)
      toast.success('CV téléchargé avec succès !')
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setUploading(false)
    }
  }

  const handleDeleteResume = async () => {
    if (!user || !jobSeekerProfile?.resume_url) return
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer votre CV ?')) return

    try {
      // Delete from storage (optional, depends on policy)
      // const filePath = jobSeekerProfile.resume_url.split('/').slice(-2).join('/')
      // await supabase.storage.from('resumes').remove([filePath])

      // Remove from DB
      const updates = { resume_url: null, resume_filename: null }
      const { data, error } = await supabase
        .from('job_seeker_profiles')
        .update(updates)
        .eq('id', jobSeekerProfile.id)
        .select()
        .single()
      
      if (error) throw error
      
      onProfileUpdate(data)
      toast.success('CV supprimé.')
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <DocumentArrowUpIcon className="h-6 w-6 mr-2" />
        Mon CV
      </h2>
      {jobSeekerProfile?.resume_url ? (
        <div className="p-4 border rounded-md flex justify-between items-center bg-gray-50">
          <div className="flex items-center">
            <DocumentCheckIcon className="h-6 w-6 mr-3 text-green-500" />
            <div>
              <a href={jobSeekerProfile.resume_url} target="_blank" rel="noopener noreferrer" className="font-medium text-blue-600 hover:underline">
                {jobSeekerProfile.resume_filename || 'Voir le CV'}
              </a>
              <p className="text-xs text-gray-500">Téléchargé</p>
            </div>
          </div>
          <button onClick={handleDeleteResume} className="text-gray-500 hover:text-red-600">
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      ) : (
        <div>
          <p className="text-sm text-gray-600 mb-4">Téléchargez votre CV pour postuler plus rapidement et permettre aux recruteurs de vous trouver. (PDF, DOCX, max 5MB)</p>
          <label
            htmlFor="resume-upload"
            className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            {uploading ? <Spinner size="sm" /> : <DocumentArrowUpIcon className="h-5 w-5 mr-2" />}
            Télécharger mon CV
          </label>
          <input id="resume-upload" type="file" className="hidden" onChange={handleResumeUpload} disabled={uploading} accept=".pdf,.doc,.docx" />
        </div>
      )}
    </div>
  )
}
