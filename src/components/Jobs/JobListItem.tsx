import React from 'react'
import { Link } from 'react-router-dom'
import { JobWithDetails } from '../../hooks/useJobs'
import { MapPinIcon, ClockIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline'
import { formatTimeAgo } from '../../utils/formatters'

interface JobListItemProps {
  job: JobWithDetails
}

export function JobListItem({ job }: JobListItemProps) {
  const getLocationDisplay = () => {
    if (job.work_location_type === 'remote') return 'Télétravail'
    if (job.city) return `${job.city.name}, ${job.city.region?.country?.name || ''}`
    return 'Lieu non précisé'
  }

  return (
    <Link to={`/jobs/${job.id}`} className="block hover:bg-gray-50">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3">
              <h3 className="text-base font-semibold text-blue-600 hover:underline">{job.title}</h3>
              {job.featured && (
                <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded">
                  Mis en avant
                </span>
              )}
            </div>
            <div className="flex items-center text-sm text-gray-600 mt-1">
              <BuildingOfficeIcon className="h-4 w-4 mr-1.5" />
              <span>{job.company?.name}</span>
            </div>
          </div>
          <div className="text-right text-xs text-gray-500">
            {formatTimeAgo(job.created_at)}
          </div>
        </div>
        <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
          <div className="flex items-center">
            <MapPinIcon className="h-4 w-4 mr-1.5" />
            <span>{getLocationDisplay()}</span>
          </div>
          <div className="flex items-center">
            <ClockIcon className="h-4 w-4 mr-1.5" />
            <span>{job.employment_type}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
