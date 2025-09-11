import React from 'react'
import { useAuth } from '../../context/AuthContext'
import { Link } from 'react-router-dom'
import { Spinner } from '../../components/ui/Spinner'
import { StatCard } from '../../components/dashboard/StatCard'
import {
  DocumentTextIcon,
  BookmarkIcon,
  SparklesIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline'
import { useJobSeekerDashboardStats } from '../../hooks/useJobSeekerDashboardStats'
import { ProfileCompletion } from '../profile/components/ProfileCompletion'
import { ApplicationStatusChart } from '../../components/dashboard/ApplicationStatusChart'
import { JobCard } from '../../components/Jobs/JobCard'

export function JobSeekerDashboardPage() {
  const { profile, user } = useAuth()
  const { stats, chartData, recentRecommendations, loading, error, fullProfile } = useJobSeekerDashboardStats()

  if (loading) {
    return <div className="flex justify-center py-20"><Spinner size="lg" /></div>
  }

  if (error) {
    return <div className="text-center py-20 text-red-500">{error}</div>
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
        <p className="text-lg text-gray-600">Bienvenue, {profile?.full_name} !</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard icon={DocumentTextIcon} label="Candidatures" value={stats.totalApplications} />
        <StatCard icon={BookmarkIcon} label="Emplois sauvegardés" value={stats.savedJobs} />
        <StatCard icon={SparklesIcon} label="Nouvelles recommandations" value={stats.newRecommendations} />
      </div>

      {/* Profile Completion & Application Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Complétion du Profil</h2>
          <ProfileCompletion profile={profile} jobSeekerProfile={fullProfile} />
          <Link to="/profile" className="mt-4 inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800">
            Modifier mon profil <ArrowRightIcon className="ml-1 h-4 w-4" />
          </Link>
        </div>
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Statut de vos candidatures</h2>
          <ApplicationStatusChart data={chartData} />
        </div>
      </div>

      {/* Recent Recommendations */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-900">Recommandations Récentes</h2>
          <Link to="/recommendations" className="text-sm font-medium text-blue-600 hover:text-blue-800">
            Voir tout
          </Link>
        </div>
        {recentRecommendations.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-dashed">
            <p className="text-gray-500">Aucune recommandation pour le moment.</p>
            <p className="text-sm text-gray-400 mt-2">Complétez votre profil pour en recevoir.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recentRecommendations.map(rec => (
              <JobCard 
                key={rec.id} 
                job={rec.job_posting} 
                showRecommendationScore 
                recommendationScore={rec.recommendation_score} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
