import React, { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { supabase, JobApplication, JobPosting, Company } from '../../lib/supabase'
import { Link } from 'react-router-dom'
import { Spinner } from '../../components/ui/Spinner'
import { formatDate } from '../../utils/formatters'
import { DocumentMagnifyingGlassIcon } from '@heroicons/react/24/outline'

type ApplicationWithJob = JobApplication & {
  job_postings: (JobPosting & { companies: Company | null }) | null
}

export function ApplicationsPage() {
  const { user } = useAuth()
  const [applications, setApplications] = useState<ApplicationWithJob[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      fetchApplications()
    }
  }, [user])

  const fetchApplications = async () => {
    if (!user) return
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('job_applications')
        .select(`
          *,
          job_postings (
            *,
            companies (*)
          )
        `)
        .eq('job_seeker_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setApplications(data as any)
    } catch (err: any) {
      setError('Impossible de charger vos candidatures.')
    } finally {
      setLoading(false)
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Mes Candidatures</h1>

      {loading && <div className="flex justify-center py-12"><Spinner size="lg" /></div>}
      {error && <div className="text-red-500 text-center py-12">{error}</div>}

      {!loading && !error && (
        applications.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-200">
            <DocumentMagnifyingGlassIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">Aucune candidature</h3>
            <p className="mt-1 text-sm text-gray-500">Vous n'avez postulé à aucune offre pour le moment.</p>
            <div className="mt-6">
              <Link
                to="/jobs"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                Parcourir les emplois
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul role="list" className="divide-y divide-gray-200">
              {applications.map((app) => {
                const statusInfo = getStatusBadge(app.status)
                return (
                  <li key={app.id}>
                    <Link to={`/jobs/${app.job_posting_id}`} className="block hover:bg-gray-50">
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <p className="text-base font-medium text-blue-600 truncate">{app.job_postings?.title}</p>
                          <div className="ml-2 flex-shrink-0 flex">
                            <p className={statusInfo.style}>{statusInfo.label}</p>
                          </div>
                        </div>
                        <div className="mt-2 sm:flex sm:justify-between">
                          <div className="sm:flex">
                            <p className="flex items-center text-sm text-gray-500">
                              {app.job_postings?.companies?.name}
                            </p>
                          </div>
                          <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                            <p>Candidature envoyée le {formatDate(app.created_at)}</p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        )
      )}
    </div>
  )
}
