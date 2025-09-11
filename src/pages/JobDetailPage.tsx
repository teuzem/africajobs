import React, { useEffect, useState, useMemo } from 'react'
import { useParams, Link, useLocation } from 'react-router-dom'
import { supabase, JobPosting, Company, City, Region, Country, Industry, Skill } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { formatCurrency, formatTimeAgo } from '../utils/formatters'
import { Spinner } from '../components/ui/Spinner'
import toast from 'react-hot-toast'
import { 
  MapPinIcon, 
  ClockIcon, 
  CurrencyDollarIcon,
  BriefcaseIcon,
  BuildingOfficeIcon,
  BookmarkIcon,
  ArrowUpRightIcon,
  CheckCircleIcon,
  SparklesIcon,
  EyeIcon
} from '@heroicons/react/24/outline'
import { BookmarkIcon as BookmarkSolidIcon } from '@heroicons/react/24/solid'
import { createNotification } from '../utils/notifications'
import { Breadcrumbs } from '../components/ui/Breadcrumbs'
import { useRecentlyViewed } from '../hooks/useRecentlyViewed'
import { JobCard } from '../components/Jobs/JobCard'
import { useJobRecommendations, JobRecommendationWithDetails } from '../hooks/useJobRecommendations'

type JobDetails = JobPosting & {
  company: Company | null
  city: (City & { region: (Region & { country: Country | null }) | null }) | null
  industry: Industry | null
  job_posting_skills: { skills: Skill | null }[]
}

export function JobDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { user, profile } = useAuth()
  const location = useLocation()
  const [job, setJob] = useState<JobDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSaved, setIsSaved] = useState(false)
  const [hasApplied, setHasApplied] = useState(false)
  const [applying, setApplying] = useState(false)
  const [similarJobs, setSimilarJobs] = useState<JobPosting[]>([])
  const [recentlyViewedJobs, setRecentlyViewedJobs] = useState<JobPosting[]>([])

  const [recentlyViewedIds, addRecentlyViewed] = useRecentlyViewed('recently_viewed_jobs')
  const { recommendations } = useJobRecommendations()

  useEffect(() => {
    if (id) {
      fetchJobDetails()
      addRecentlyViewed(id)
    }
  }, [id])

  useEffect(() => {
    if (user && job) {
      checkSavedStatus()
      checkApplicationStatus()
    }
    if (job) {
      fetchSimilarJobs()
    }
  }, [user, job])

  useEffect(() => {
    if (recentlyViewedIds.length > 0) {
      fetchRecentlyViewedJobs()
    }
  }, [recentlyViewedIds])

  const fetchJobDetails = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('job_postings')
        .select(`
          *,
          company:companies (*),
          city:cities (
            *,
            region:regions (
              *,
              country:countries (*)
            )
          ),
          industry:industries (*),
          job_posting_skills (
            skills (*)
          )
        `)
        .eq('id', id!)
        .single()

      if (error) throw error
      setJob(data)
    } catch (err: any) {
      setError('Impossible de charger les détails de l\'offre.')
    } finally {
      setLoading(false)
    }
  }

  const fetchSimilarJobs = async () => {
    if (!job) return
    const { data } = await supabase.rpc('get_similar_jobs', { job_id_param: job.id, limit_count: 3 })
    setSimilarJobs(data || [])
  }

  const fetchRecentlyViewedJobs = async () => {
    const { data } = await supabase
      .from('job_postings')
      .select('*, company:companies(*), city:cities(*, region:regions(*, country:countries(*)))')
      .in('id', recentlyViewedIds.filter(viewedId => viewedId !== id))
    setRecentlyViewedJobs(data || [])
  }

  const checkSavedStatus = async () => {
    if (!user || !job) return
    const { data } = await supabase
      .from('saved_jobs')
      .select('id')
      .eq('job_seeker_id', user.id)
      .eq('job_posting_id', job.id)
      .single()
    setIsSaved(!!data)
  }

  const checkApplicationStatus = async () => {
    if (!user || !job) return
    const { data } = await supabase
      .from('job_applications')
      .select('id')
      .eq('job_seeker_id', user.id)
      .eq('job_posting_id', job.id)
      .single()
    setHasApplied(!!data)
  }

  const handleSaveToggle = async () => {
    if (!user || !job) return
    if (isSaved) {
      await supabase
        .from('saved_jobs')
        .delete()
        .eq('job_seeker_id', user.id)
        .eq('job_posting_id', job.id)
      setIsSaved(false)
      toast.success('Emploi retiré des favoris.')
    } else {
      await supabase
        .from('saved_jobs')
        .insert({ job_seeker_id: user.id, job_posting_id: job.id })
      setIsSaved(true)
      toast.success('Emploi sauvegardé !')
    }
  }

  const handleApply = async () => {
    if (!user || !job || hasApplied || profile?.user_type !== 'job_seeker') return
    
    setApplying(true)
    
    try {
      if (job.external_apply_url) {
        window.open(job.external_apply_url, '_blank')
      }
      
      const { error } = await supabase
        .from('job_applications')
        .insert({
          job_seeker_id: user.id,
          job_posting_id: job.id,
          status: 'submitted'
        })
      
      if (error) throw error
      
      setHasApplied(true)
      toast.success('Votre candidature a été envoyée avec succès !')
      
      if (job.employer_id) {
        await createNotification(
          job.employer_id,
          'new_applicant',
          `${profile?.full_name} a postulé à votre offre "${job.title}"`,
          `/employer/jobs/${job.id}/applicants`
        )
      }
    } catch (err: any) {
      toast.error('Erreur lors de l\'envoi de la candidature.')
    } finally {
      setApplying(false)
    }
  }

  const breadcrumbs = useMemo(() => [
    { name: 'Emplois', href: '/jobs' },
    { name: job?.title || '...', href: `/jobs/${id}` }
  ], [job, id])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Spinner size="lg" /></div>
  }

  if (error || !job) {
    return <div className="text-center py-12 text-red-500">{error || 'Offre d\'emploi non trouvée.'}</div>
  }

  const skills = job.job_posting_skills.map(s => s.skills?.name).filter(Boolean) as string[]

  const JobSection: React.FC<{ title: string; jobs: any[]; icon: React.ElementType; emptyText: string; showScore?: boolean }> = ({ title, jobs, icon: Icon, emptyText, showScore }) => (
    jobs.length > 0 ? (
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center"><Icon className="h-6 w-6 mr-2" />{title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map(j => <JobCard key={j.id} job={showScore ? j.job_posting : j} showRecommendationScore={showScore} recommendationScore={j.recommendation_score} />)}
        </div>
      </div>
    ) : null
  );

  return (
    <div className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs items={breadcrumbs} />
        <div className="mt-4 lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 bg-white p-8 rounded-lg shadow-sm border border-gray-200">
            {/* Header */}
            <div className="mb-6">
              <p className="text-sm text-gray-500">Publié {formatTimeAgo(job.created_at)}</p>
              <h1 className="text-3xl font-bold text-gray-900 mt-2">{job.title}</h1>
              {job.company && (
                <Link to={`/companies/${job.company.id}`} className="text-lg text-blue-600 hover:underline">{job.company.name}</Link>
              )}
            </div>

            {/* Quick Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-y border-gray-200 py-4 mb-8">
              <div>
                <p className="text-sm text-gray-500">Lieu</p>
                <p className="font-medium text-gray-800">{job.city?.name || 'Non spécifié'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Type de contrat</p>
                <p className="font-medium text-gray-800">{job.employment_type}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Expérience</p>
                <p className="font-medium text-gray-800">{job.experience_level}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Salaire</p>
                <p className="font-medium text-gray-800">{formatCurrency(job.salary_range_min || 0)} - {formatCurrency(job.salary_range_max || 0)}</p>
              </div>
            </div>

            {/* Description */}
            <div className="prose prose-blue max-w-none">
              <h2 className="font-semibold">Description du poste</h2>
              <p className="whitespace-pre-wrap">{job.description}</p>
              
              {job.responsibilities && <>
                <h2 className="font-semibold">Responsabilités</h2>
                <p className="whitespace-pre-wrap">{job.responsibilities}</p>
              </>}

              {job.requirements && <>
                <h2 className="font-semibold">Exigences</h2>
                <p className="whitespace-pre-wrap">{job.requirements}</p>
              </>}
            </div>

            {/* Skills */}
            {skills.length > 0 && (
              <div className="mt-8">
                <h2 className="font-semibold text-gray-900 mb-4">Compétences requises</h2>
                <div className="flex flex-wrap gap-2">
                  {skills.map(skill => (
                    <span key={skill} className="bg-gray-100 text-gray-800 text-sm font-medium px-3 py-1 rounded-full">{skill}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 mt-8 lg:mt-0 space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              {profile?.user_type === 'job_seeker' ? (
                hasApplied ? (
                  <div className="flex items-center justify-center p-3 border-2 border-dashed border-green-300 bg-green-50 rounded-lg">
                    <CheckCircleIcon className="h-6 w-6 text-green-600 mr-2" />
                    <span className="font-medium text-green-700">Candidature envoyée</span>
                  </div>
                ) : (
                  <button 
                    onClick={handleApply}
                    disabled={applying}
                    className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center disabled:opacity-50"
                  >
                    {applying ? <Spinner size="sm" color="border-white" /> : 'Postuler maintenant'}
                    {job.external_apply_url && <ArrowUpRightIcon className="h-5 w-5 ml-2" />}
                  </button>
                )
              ) : !user && (
                 <Link 
                    to={`/login?redirect=${location.pathname}`}
                    className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center"
                  >
                    Connectez-vous pour postuler
                  </Link>
              )}

              {user && profile?.user_type === 'job_seeker' && (
                <button 
                  onClick={handleSaveToggle}
                  className="w-full mt-4 bg-white text-blue-600 border border-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center justify-center"
                >
                  {isSaved ? <BookmarkSolidIcon className="h-5 w-5 mr-2" /> : <BookmarkIcon className="h-5 w-5 mr-2" />}
                  {isSaved ? 'Emploi sauvegardé' : 'Sauvegarder l\'emploi'}
                </button>
              )}
            </div>

            {job.company && (
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center mb-4">
                  {job.company.logo_url ? (
                    <img src={job.company.logo_url} alt={job.company.name || ''} className="h-16 w-16 object-contain rounded-md mr-4" />
                  ) : (
                    <div className="h-16 w-16 bg-gray-100 rounded-md flex items-center justify-center mr-4">
                      <BuildingOfficeIcon className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-bold text-lg">{job.company.name}</h3>
                    {job.company.website_url && (
                       <a href={job.company.website_url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline flex items-center">
                         Visiter le site web <ArrowUpRightIcon className="h-4 w-4 ml-1" />
                       </a>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-600 line-clamp-4">{job.company.description}</p>
                <Link to={`/companies/${job.company.id}`} className="mt-4 inline-block text-sm font-medium text-blue-600 hover:text-blue-800">
                  Voir toutes les offres de cette entreprise &rarr;
                </Link>
              </div>
            )}
          </div>
        </div>
        
        <JobSection title="Offres Recommandées pour vous" jobs={recommendations.slice(0,3)} icon={SparklesIcon} emptyText="" showScore />
        <JobSection title="Offres Similaires" jobs={similarJobs} icon={BriefcaseIcon} emptyText="" />
        <JobSection title="Récemment Consultées" jobs={recentlyViewedJobs} icon={EyeIcon} emptyText="" />
      </div>
    </div>
  )
}
