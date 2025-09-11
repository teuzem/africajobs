import React, { useState, useMemo } from 'react'
import { useCompanies } from '../hooks/useCompanies'
import { useDebounce } from '../hooks/useDebounce'
import { CompanyCard } from '../components/Companies/CompanyCard'
import { Spinner } from '../components/ui/Spinner'
import { BuildingOffice2Icon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { Breadcrumbs } from '../components/ui/Breadcrumbs'

export function CompaniesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearchTerm = useDebounce(searchTerm, 300)
  const { companies, loading, error } = useCompanies(debouncedSearchTerm)

  const breadcrumbs = useMemo(() => [{ name: 'Entreprises', href: '/companies' }], [])

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs items={breadcrumbs} />
        <div className="mt-4 text-center">
          <h1 className="text-4xl font-bold text-gray-900">Découvrez les Entreprises</h1>
          <p className="mt-2 text-lg text-gray-600">Trouvez votre prochain employeur en Afrique.</p>
        </div>

        <div className="mt-8 max-w-2xl mx-auto">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher une entreprise..."
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-full shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="mt-12">
          {loading ? (
            <div className="flex justify-center"><Spinner size="lg" /></div>
          ) : error ? (
            <div className="text-center text-red-500">{error}</div>
          ) : companies.length === 0 ? (
            <div className="text-center py-12">
              <BuildingOffice2Icon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900">Aucune entreprise trouvée</h3>
              <p className="text-gray-600">Essayez un autre terme de recherche.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {companies.map(company => (
                <CompanyCard key={company.id} company={company} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
