import React, { useEffect, useState, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase, Company, JobPosting } from '../lib/supabase'
import { Spinner } from '../components/ui/Spinner'
import { JobCard } from '../components/Jobs/JobCard'
import { BuildingOffice2Icon, MapPinIcon, GlobeAltIcon, BriefcaseIcon } from '@heroicons/react/24/outline'
import { Breadcrumbs } from '../components/ui/Breadcrumbs'

type CompanyWithJobs = Company & {
  job_postings: JobPosting[]
}

export function CompanyDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [company, setCompany] = useState<CompanyWithJobs | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCompany = async () => {
      if (!id) return
      setLoading(true)
      const { data, error } = await supabase
        .from('companies')
        .select(`
          *,
          job_postings (
            *,
            company:companies(*),
            city:cities(*, region:regions(*, country:countries(*))),
            industry:industries(*)
          )
        `)
        .eq('id', id)
        .eq('job_postings.status', 'published')
        .single()
      
      if (data) {
        setCompany(data as CompanyWithJobs)
      }
      setLoading(false)
    }
    fetchCompany()
  }, [id])

  const breadcrumbs = useMemo(() => [
    { name: 'Entreprises', href: '/companies' },
    { name: company?.name || '...', href: `/companies/${id}` }
  ], [company, id])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Spinner size="lg" /></div>
  }

  if (!company) {
    return <div className="text-center py-12">Entreprise non trouvée.</div>
  }

  return (
    <div className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs items={breadcrumbs} />
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 mt-4">
          <div className="md:flex items-start space-x-6">
            {company.logo_url ? (
              <img src={company.logo_url} alt={`${company.name} logo`} className="h-24 w-24 object-contain rounded-md mb-4 md:mb-0" />
            ) : (
              <div className="h-24 w-24 bg-gray-100 rounded-md flex items-center justify-center mb-4 md:mb-0">
                <BuildingOffice2Icon className="h-12 w-12 text-gray-400" />
              </div>
            )}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">{company.name}</h1>
              <div className="mt-2 flex flex-wrap gap-x-6 gap-y-2 text-gray-600">
                {company.headquarters && (
                  <div className="flex items-center text-sm">
                    <MapPinIcon className="h-4 w-4 mr-1.5" />
                    {company.headquarters}
                  </div>
                )}
                {company.website_url && (
                  <a href={company.website_url} target="_blank" rel="noopener noreferrer" className="flex items-center text-sm text-blue-600 hover:underline">
                    <GlobeAltIcon className="h-4 w-4 mr-1.5" />
                    Visiter le site
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-gray-200 pt-8">
            <h2 className="text-xl font-semibold text-gray-800">À propos de {company.name}</h2>
            <p className="mt-2 text-gray-600 whitespace-pre-wrap">
              {company.description || "Aucune description disponible."}
            </p>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <BriefcaseIcon className="h-6 w-6 mr-2" />
            Offres d'emploi chez {company.name} ({company.job_postings.length})
          </h2>
          {company.job_postings.length > 0 ? (
            <div className="space-y-6">
              {company.job_postings.map(job => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg border border-dashed">
              <p className="text-gray-500">Cette entreprise n'a aucune offre d'emploi active pour le moment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
