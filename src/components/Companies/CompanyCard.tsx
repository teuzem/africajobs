import React from 'react'
import { Link } from 'react-router-dom'
import { Company } from '../../lib/supabase'
import { BuildingOffice2Icon, MapPinIcon, BriefcaseIcon } from '@heroicons/react/24/outline'

interface CompanyCardProps {
  company: Company & { job_postings_count?: number }
}

export function CompanyCard({ company }: CompanyCardProps) {
  return (
    <Link to={`/companies/${company.id}`} className="block">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 h-full flex flex-col">
        <div className="flex-grow">
          <div className="flex items-start space-x-4 mb-4">
            {company.logo_url ? (
              <img src={company.logo_url} alt={`${company.name} logo`} className="h-16 w-16 object-contain rounded-md" />
            ) : (
              <div className="h-16 w-16 bg-gray-100 rounded-md flex items-center justify-center">
                <BuildingOffice2Icon className="h-8 w-8 text-gray-400" />
              </div>
            )}
            <div>
              <h3 className="text-lg font-bold text-gray-900">{company.name}</h3>
              {company.industry_id && <p className="text-sm text-gray-500">{/* Placeholder for industry name */}</p>}
            </div>
          </div>
          <p className="text-sm text-gray-600 line-clamp-3 mb-4">
            {company.description}
          </p>
        </div>
        <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center text-sm text-gray-500">
          <div className="flex items-center">
            <MapPinIcon className="h-4 w-4 mr-1" />
            <span>{company.headquarters || 'Non spécifié'}</span>
          </div>
          <div className="flex items-center">
            <BriefcaseIcon className="h-4 w-4 mr-1" />
            <span>{company.job_postings_count || 0} offre(s)</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
