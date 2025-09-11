import React, { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { supabase, JobPosting, Company, City, Region, Country, Industry } from '../../lib/supabase'
import { Link } from 'react-router-dom'
import { Spinner } from '../../components/ui/Spinner'
import { JobCard } from '../../components/Jobs/JobCard'
import { BookmarkSlashIcon } from '@heroicons/react/24/outline'

type SavedJobWithDetails = {
  id: string
  job_posting: JobPosting & {
    company?: Company
    city?: City & { region?: Region & { country?: Country } }
    industry?: Industry
  }
}

export function SavedJobsPage() {
  const { user } = useAuth()
  const [savedJobs, setSavedJobs] = useState<SavedJobWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      fetchSavedJobs()
    }
  }, [user])

  const fetchSavedJobs = async () => {
    if (!user) return
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('saved_jobs')
        .select(`
          id,
          job_posting:job_postings (
            *,
            company:companies (*),
            city:cities (
              *,
              region:regions (
                *,
                country:countries (*)
              )
            ),
            industry:industries (*)
          )
        `)
        .eq('job_seeker_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setSavedJobs(data as any)
    } catch (err: any) {
      setError('Impossible de charger vos emplois sauvegardés.')
    } finally {
      setLoading(false)
    }
  }

  const handleUnsave = async (jobId: string) => {
    if (!user) return
    const { error } = await supabase
      .from('saved_jobs')
      .delete()
      .eq('job_seeker_id', user.id)
      .eq('job_posting_id', jobId)

    if (!error) {
      setSavedJobs(prev => prev.filter(sj => sj.job_posting.id !== jobId))
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Emplois Sauvegardés</h1>

      {loading && <div className="flex justify-center py-12"><Spinner size="lg" /></div>}
      {error && <div className="text-red-500 text-center py-12">{error}</div>}

      {!loading && !error && (
        savedJobs.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-200">
            <BookmarkSlashIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">Aucun emploi sauvegardé</h3>
            <p className="mt-1 text-sm text-gray-500">Vous n'avez pas encore sauvegardé d'offre.</p>
            <div className="mt-6">
              <Link
                to="/jobs"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                Découvrir des emplois
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {savedJobs.map((savedJob) => (
              <JobCard
                key={savedJob.id}
                job={{ ...savedJob.job_posting, isSaved: true }}
                onUnsave={handleUnsave}
              />
            ))}
          </div>
        )
      )}
    </div>
  )
}
