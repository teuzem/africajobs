import React from 'react'
import { Link } from 'react-router-dom'
import { 
  MapPinIcon, 
  ClockIcon, 
  CurrencyDollarIcon,
  BookmarkIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline'
import { BookmarkIcon as BookmarkSolidIcon } from '@heroicons/react/24/solid'
import { JobWithDetails } from '../../hooks/useJobs'
import { formatCurrency, formatTimeAgo } from '../../utils/formatters'

interface JobCardProps {
  job: JobWithDetails
  onSave?: (jobId: string) => void
  onUnsave?: (jobId: string) => void
  showRecommendationScore?: boolean
  recommendationScore?: number
}

export function JobCard({ 
  job, 
  onSave, 
  onUnsave, 
  showRecommendationScore,
  recommendationScore 
}: JobCardProps) {
  const handleSaveToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (job.isSaved) {
      onUnsave?.(job.id)
    } else {
      onSave?.(job.id)
    }
  }

  const getSalaryDisplay = () => {
    if (job.salary_range_min && job.salary_range_max) {
      return `${formatCurrency(job.salary_range_min)} - ${formatCurrency(job.salary_range_max)} ${job.salary_currency}`
    } else if (job.salary_range_min) {
      return `À partir de ${formatCurrency(job.salary_range_min)} ${job.salary_currency}`
    }
    return 'Salaire non précisé'
  }

  const getLocationDisplay = () => {
    if (job.work_location_type === 'remote') {
      return 'Télétravail'
    }
    if (job.city) {
      return `${job.city.name}, ${job.city.region?.country?.name || ''}`
    }
    return 'Lieu non précisé'
  }

  const getEmploymentTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'full_time': 'Temps plein',
      'part_time': 'Temps partiel', 
      'contract': 'Contrat',
      'temporary': 'Temporaire',
      'internship': 'Stage',
      'freelance': 'Freelance'
    }
    return labels[type] || type
  }

  const getExperienceLevelLabel = (level: string) => {
    const labels: Record<string, string> = {
      'entry': 'Débutant',
      'mid': 'Intermédiaire',
      'senior': 'Senior',
      'executive': 'Dirigeant'
    }
    return labels[level] || level
  }

  return (
    <Link to={`/jobs/${job.id}`} className="block">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              {job.featured && (
                <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded">
                  Mis en avant
                </span>
              )}
              {showRecommendationScore && recommendationScore && (
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                  {Math.round(recommendationScore * 100)}% compatibilité
                </span>
              )}
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {job.title}
            </h3>
            
            {job.company && (
              <div className="flex items-center text-gray-600 mb-2">
                <BuildingOfficeIcon className="h-4 w-4 mr-1" />
                <span className="text-sm">{job.company.name}</span>
              </div>
            )}
          </div>
          
          {(onSave || onUnsave) && (
            <button
              onClick={handleSaveToggle}
              className="text-gray-400 hover:text-blue-600 transition-colors"
            >
              {job.isSaved ? (
                <BookmarkSolidIcon className="h-6 w-6 text-blue-600" />
              ) : (
                <BookmarkIcon className="h-6 w-6" />
              )}
            </button>
          )}
        </div>

        {/* Job Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="flex items-center text-gray-600 text-sm">
            <MapPinIcon className="h-4 w-4 mr-2" />
            <span>{getLocationDisplay()}</span>
          </div>
          
          <div className="flex items-center text-gray-600 text-sm">
            <ClockIcon className="h-4 w-4 mr-2" />
            <span>{getEmploymentTypeLabel(job.employment_type || '')}</span>
          </div>
          
          {job.experience_level && (
            <div className="text-gray-600 text-sm">
              <span className="font-medium">Expérience:</span> {getExperienceLevelLabel(job.experience_level)}
            </div>
          )}
          
          <div className="flex items-center text-gray-600 text-sm">
            <CurrencyDollarIcon className="h-4 w-4 mr-2" />
            <span>{getSalaryDisplay()}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-700 text-sm line-clamp-2 mb-4">
          {job.description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-4">
            {job.industry && (
              <span>{job.industry.name}</span>
            )}
            <span>{formatTimeAgo(job.created_at)}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <span>{job.applications_count} candidature(s)</span>
            <span>•</span>
            <span>{job.views_count} vue(s)</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
