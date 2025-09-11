import React from 'react'
import { useAuth } from '../../context/AuthContext'
import { Link } from 'react-router-dom'
import { Spinner } from '../../components/ui/Spinner'
import { StatCard } from '../../components/dashboard/StatCard'
import { 
  PlusIcon, 
  BriefcaseIcon, 
  UsersIcon, 
  EyeIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline'
import { supabase } from '../../lib/supabase'
import { useEmployerDashboardStats } from '../../hooks/useEmployerDashboardStats'
import { ApplicationsOverTimeChart } from '../../components/dashboard/ApplicationsOverTimeChart'
import { RecentApplicants } from '../../components/dashboard/RecentApplicants'

export function EmployerDashboardPage() {
  const { user } = useAuth()
  const { jobs, stats, chartData, recentApplicants, loading, error, refetch } = useEmployerDashboardStats()

  const handleDelete = async (jobId: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette offre d'emploi ? Cette action est irréversible.")) {
      await supabase.from('job_postings').delete().eq('id', jobId)
      refetch()
    }
  }

  if (loading) {
    return <div className="flex justify-center py-20"><Spinner size="lg" /></div>
  }

  if (error) {
    return <div className="text-center py-20 text-red-500">{error}</div>
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Tableau de bord Employeur</h1>
        <Link
          to="/employer/jobs/new"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
        >
          <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
          Publier une offre
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard icon={BriefcaseIcon} label="Offres publiées" value={stats.totalJobs} />
        <StatCard icon={UsersIcon} label="Candidatures reçues" value={stats.totalApplications} />
        <StatCard icon={EyeIcon} label="Vues totales" value={stats.totalViews} />
      </div>

      {/* Charts & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Candidatures des 30 derniers jours</h2>
          <ApplicationsOverTimeChart data={chartData} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Candidats Récents</h2>
          <RecentApplicants applicants={recentApplicants} />
        </div>
      </div>

      {/* Job List */}
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">Mes offres d'emploi</h2>
        {jobs.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-dashed">
            <p className="text-gray-500">Vous n'avez publié aucune offre.</p>
            <Link
              to="/employer/jobs/new"
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              Publier votre première offre
            </Link>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul role="list" className="divide-y divide-gray-200">
              {jobs.map(job => (
                <li key={job.id}>
                  <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <Link to={`/jobs/${job.id}`} className="text-base font-medium text-blue-600 truncate hover:underline">{job.title}</Link>
                      <div className="ml-2 flex-shrink-0 flex items-center space-x-4">
                        <Link to={`/employer/jobs/${job.id}/applicants`} className="text-sm font-medium text-gray-600 hover:text-blue-600">
                          Candidats ({job.applications_count})
                        </Link>
                        <Link to={`/employer/jobs/${job.id}/edit`} className="text-gray-400 hover:text-gray-600" title="Modifier">
                          <PencilIcon className="h-5 w-5" />
                        </Link>
                        <button onClick={() => handleDelete(job.id)} className="text-gray-400 hover:text-red-600" title="Supprimer">
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          Statut: <span className={`ml-1 font-semibold px-2 py-0.5 rounded-full text-xs ${job.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{job.status}</span>
                        </p>
                      </div>
                      <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        Vues: {job.views_count}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
