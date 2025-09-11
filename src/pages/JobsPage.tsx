import React, { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useJobs } from '../hooks/useJobs'
import { useDebounce } from '../hooks/useDebounce'
import { JobCard } from '../components/Jobs/JobCard'
import { JobListItem } from '../components/Jobs/JobListItem'
import { JobFilters } from '../components/Jobs/JobFilters'
import { Breadcrumbs } from '../components/ui/Breadcrumbs'
import { AdjustmentsHorizontalIcon, MagnifyingGlassIcon, ViewColumnsIcon, Bars3Icon } from '@heroicons/react/24/outline'

export function JobsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [filters, setFilters] = useState(() => {
    const params: { [key: string]: any } = {}
    searchParams.forEach((value, key) => {
      params[key] = value
    })
    return params
  })

  const debouncedFilters = useDebounce(filters, 300)
  const { jobs, loading, error, totalCount } = useJobs(debouncedFilters)

  useEffect(() => {
    setSearchParams(
      Object.fromEntries(Object.entries(filters).filter(([_, v]) => v)), 
      { replace: true }
    )
  }, [filters, setSearchParams])

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, search: e.target.value }))
  }

  const breadcrumbs = useMemo(() => [{ name: 'Emplois', href: '/jobs' }], [])

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs items={breadcrumbs} />
        {/* Header */}
        <div className="mt-4 text-center">
          <h1 className="text-4xl font-bold text-gray-900">Trouvez Votre Prochain Défi</h1>
          <p className="mt-2 text-lg text-gray-600">
            {loading ? 'Chargement des offres...' : `${totalCount} opportunité${totalCount > 1 ? 's' : ''} vous attendent en Afrique.`}
          </p>
        </div>

        {/* Search Bar */}
        <div className="mt-8 max-w-2xl mx-auto">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={filters.search || ''}
              onChange={handleSearchChange}
              placeholder="Poste, compétence, entreprise..."
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-full shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="mt-8 lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1 mb-8 lg:mb-0">
            <JobFilters 
              onFiltersChange={handleFilterChange}
              initialFilters={filters}
            />
          </div>

          {/* Jobs List */}
          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-gray-600">
                {loading ? 'Recherche...' : `${totalCount} résultat${totalCount > 1 ? 's' : ''}`}
              </p>
              <div className="flex items-center space-x-2">
                <button onClick={() => setViewMode('grid')} className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}>
                  <ViewColumnsIcon className="h-5 w-5" />
                </button>
                <button onClick={() => setViewMode('list')} className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}>
                  <Bars3Icon className="h-5 w-5" />
                </button>
              </div>
            </div>

            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                  </div>
                ))}
              </div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg border border-dashed">
                <AdjustmentsHorizontalIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900">Aucun emploi trouvé</h3>
                <p className="text-gray-600">Essayez d'ajuster vos critères de recherche.</p>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {jobs.map((job) => <JobCard key={job.id} job={job} />)}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 divide-y divide-gray-200">
                {jobs.map((job) => <JobListItem key={job.id} job={job} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
