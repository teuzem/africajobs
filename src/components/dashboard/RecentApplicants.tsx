import React from 'react'
import { Link } from 'react-router-dom'
import { UserCircleIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import { formatTimeAgo } from '../../utils/formatters'

type RecentApplicant = {
  id: string
  created_at: string
  job_posting_id: string
  job_title: string
  applicant_name: string
  applicant_avatar: string | null
}

interface RecentApplicantsProps {
  applicants: RecentApplicant[]
}

export function RecentApplicants({ applicants }: RecentApplicantsProps) {
  if (applicants.length === 0) {
    return <div className="text-center text-gray-500 py-8">Aucune candidature récente.</div>
  }

  return (
    <div className="space-y-4">
      {applicants.map(applicant => (
        <div key={applicant.id} className="flex items-center space-x-4">
          {applicant.applicant_avatar ? (
            <img src={applicant.applicant_avatar} alt={applicant.applicant_name} className="h-10 w-10 rounded-full object-cover" />
          ) : (
            <UserCircleIcon className="h-10 w-10 text-gray-300" />
          )}
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">{applicant.applicant_name}</p>
            <p className="text-xs text-gray-500">
              A postulé à <span className="font-semibold">{applicant.job_title}</span>
            </p>
            <p className="text-xs text-gray-400">{formatTimeAgo(applicant.created_at)}</p>
          </div>
          <Link to={`/employer/jobs/${applicant.job_posting_id}/applicants`} className="text-gray-400 hover:text-blue-600">
            <ArrowRightIcon className="h-5 w-5" />
          </Link>
        </div>
      ))}
    </div>
  )
}
