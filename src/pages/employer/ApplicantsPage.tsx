import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase, JobApplication, Profile, JobSeekerProfile } from '../../lib/supabase'
import { Spinner } from '../../components/ui/Spinner'
import { UserCircleIcon, InboxIcon } from '@heroicons/react/24/outline'
import { formatDate } from '../../utils/formatters'
import { createNotification } from '../../utils/notifications'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'

type Applicant = JobApplication & {
  profiles: Profile & {
    job_seeker_profiles: JobSeekerProfile | null
  }
}

export function ApplicantsPage() {
  const { id: jobId } = useParams<{ id: string }>()
  const { profile: employerProfile } = useAuth()
  const [applicants, setApplicants] = useState<Applicant[]>([])
  const [jobTitle, setJobTitle] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (jobId) {
      fetchJobTitle()
      fetchApplicants()
    }
  }, [jobId])

  const fetchJobTitle = async () => {
    const { data } = await supabase.from('job_postings').select('title').eq('id', jobId!).single()
    if (data) setJobTitle(data.title)
  }

  const fetchApplicants = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('job_applications')
      .select(`
        *,
        profiles (
          *,
          job_seeker_profiles (*)
        )
      `)
      .eq('job_posting_id', jobId!)
      .order('created_at', { ascending: false })
    
    if (data) {
      setApplicants(data as any)
    }
    setLoading(false)
  }

  const handleStatusChange = async (applicationId: string, applicantId: string, newStatus: string) => {
    const { error } = await supabase
      .from('job_applications')
      .update({ status: newStatus })
      .eq('id', applicationId)

    if (error) {
      toast.error('Erreur lors de la mise à jour du statut.')
    } else {
      toast.success(`Statut mis à jour.`)
      setApplicants(prev => prev.map(app => app.id === applicationId ? { ...app, status: newStatus } : app))
      
      // Notify the user
      await createNotification(
        applicantId,
        'application_status_change',
        `Le statut de votre candidature pour "${jobTitle}" est passé à "${getStatusBadge(newStatus).label}".`,
        '/applications'
      )
    }
  }
  
  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      submitted: 'bg-blue-100 text-blue-800',
      viewed: 'bg-yellow-100 text-yellow-800',
      in_progress: 'bg-purple-100 text-purple-800',
      accepted: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    }
    const label: Record<string, string> = {
      submitted: 'Envoyée',
      viewed: 'Vue',
      in_progress: 'En cours',
      accepted: 'Acceptée',
      rejected: 'Rejetée',
    }
    return {
      style: `px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${styles[status] || 'bg-gray-100 text-gray-800'}`,
      label: label[status] || status
    }
  }

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900">Candidats pour "{jobTitle}"</h1>
      <p className="text-gray-600 mt-2">{applicants.length} candidature(s) reçue(s)</p>

      <div className="mt-8">
        {applicants.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-200">
            <InboxIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">Aucun candidat</h3>
            <p className="mt-1 text-sm text-gray-500">Aucun candidat n'a encore postulé à cette offre.</p>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul role="list" className="divide-y divide-gray-200">
              {applicants.map(app => {
                const statusInfo = getStatusBadge(app.status)
                return (
                  <li key={app.id}>
                    <div className="px-4 py-4 sm:px-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                        <div className="flex items-center">
                          {app.profiles.avatar_url ? (
                            <img src={app.profiles.avatar_url} alt={app.profiles.full_name || ''} className="h-10 w-10 rounded-full" />
                          ) : (
                            <UserCircleIcon className="h-10 w-10 text-gray-300" />
                          )}
                          <div className="ml-4">
                            <Link to={`/employer/applicants/${app.job_seeker_id}`} className="text-base font-medium text-blue-600 hover:underline">{app.profiles.full_name}</Link>
                            <p className="text-sm text-gray-500">{app.profiles.job_seeker_profiles?.headline || app.profiles.email}</p>
                          </div>
                        </div>
                        
                        <div className="text-sm text-gray-500">
                          <p>Candidature le {formatDate(app.created_at)}</p>
                          <p className={statusInfo.style}>{statusInfo.label}</p>
                        </div>

                        <div className="flex justify-end items-center space-x-2">
                           <select
                            value={app.status}
                            onChange={(e) => handleStatusChange(app.id, app.job_seeker_id, e.target.value)}
                            className="block w-full max-w-xs pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                          >
                            <option value="submitted">Envoyée</option>
                            <option value="viewed">Vue</option>
                            <option value="in_progress">En cours</option>
                            <option value="accepted">Acceptée</option>
                            <option value="rejected">Rejetée</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
