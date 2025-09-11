import React from 'react'
import { useJobRecommendations } from '../hooks/useJobRecommendations'
import { JobCard } from '../components/Jobs/JobCard'
import { useAuth } from '../context/AuthContext'
import { 
  SparklesIcon,
  ExclamationTriangleIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline'
import { Link } from 'react-router-dom'

export function RecommendationsPage() {
  const { profile } = useAuth()
  const { recommendations, loading, error, markAsClicked } = useJobRecommendations()

  if (profile?.user_type !== 'job_seeker') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-yellow-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Accès réservé aux chercheurs d'emploi
          </h3>
          <p className="text-gray-600">
            Cette page est réservée aux chercheurs d'emploi. Veuillez vous connecter avec un compte chercheur d'emploi.
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          Une erreur s'est produite lors du chargement des recommandations: {error}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <SparklesIcon className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">
            Recommandations personnalisées
          </h1>
        </div>
        <p className="text-gray-600 max-w-3xl">
          Notre algorithme d'intelligence artificielle analyse votre profil, vos compétences et votre expérience 
          pour vous proposer les offres d'emploi les plus adaptées en temps réel.
        </p>
      </div>

      {/* Stats */}
      {!loading && recommendations.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-2">
                <ChartBarIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{recommendations.length}</div>
              <div className="text-sm text-gray-600">Recommandations actives</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {Math.round(recommendations.filter(r => r.recommendation_score >= 0.8).length / recommendations.length * 100)}%
              </div>
              <div className="text-sm text-gray-600">Compatibilité élevée (80%+)</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {recommendations.filter(r => !r.viewed).length}
              </div>
              <div className="text-sm text-gray-600">Nouvelles recommandations</div>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="space-y-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                </div>
                <div className="h-6 w-20 bg-gray-200 rounded"></div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded"></div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      ) : recommendations.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
          <SparklesIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Aucune recommandation disponible
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Complétez votre profil avec vos compétences, votre expérience et vos préférences 
            pour recevoir des recommandations personnalisées.
          </p>
          <Link
            to="/profile"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Compléter mon profil
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {recommendations.map((recommendation) => (
            <div key={recommendation.id} className="relative">
              {!recommendation.viewed && (
                <div className="absolute -left-2 top-0 bottom-0 w-1 bg-blue-500 rounded-full"></div>
              )}
              <JobCard
                job={recommendation.job_posting}
                showRecommendationScore={true}
                recommendationScore={recommendation.recommendation_score}
                onSave={(jobId) => {
                  markAsClicked(recommendation.id)
                  // Handle save logic
                }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Empty state with profile completion */}
      {!loading && recommendations.length === 0 && (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <div className="max-w-md mx-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Améliorer vos recommandations
            </h3>
            <p className="text-gray-600 mb-6">
              Plus votre profil est complet, plus nos recommandations seront précises et adaptées à vos besoins.
            </p>
            <div className="space-y-2 text-sm text-gray-600 mb-6">
              <div className="flex items-center justify-between">
                <span>Informations personnelles</span>
                <span className="text-green-600">✓</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Expérience professionnelle</span>
                <span className="text-yellow-600">⚠</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Compétences</span>
                <span className="text-red-600">✗</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Formation</span>
                <span className="text-yellow-600">⚠</span>
              </div>
            </div>
            <Link
              to="/profile"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Compléter mon profil
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
