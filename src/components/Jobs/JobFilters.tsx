import React, { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { FunnelIcon } from '@heroicons/react/24/outline'

interface JobFiltersProps {
  onFiltersChange: (filters: any) => void
  initialFilters?: any
}

export function JobFilters({ onFiltersChange, initialFilters = {} }: JobFiltersProps) {
  const [filters, setFilters] = useState(initialFilters)
  const [industries, setIndustries] = useState<any[]>([])
  const [cities, setCities] = useState<any[]>([])
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    fetchIndustries()
    fetchCities()
  }, [])

  const fetchIndustries = async () => {
    const { data } = await supabase
      .from('industries')
      .select('*')
      .order('name')
    setIndustries(data || [])
  }

  const fetchCities = async () => {
    const { data } = await supabase
      .from('cities')
      .select(`
        *,
        region:regions(
          *,
          country:countries(*)
        )
      `)
      .order('name')
    setCities(data || [])
  }

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const clearFilters = () => {
    setFilters({})
    onFiltersChange({})
  }

  const activeFiltersCount = Object.values(filters).filter(Boolean).length

  return (
    <div className="bg-white border border-gray-200 rounded-lg">
      {/* Filter Toggle */}
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
      >
        <div className="flex items-center space-x-2">
          <FunnelIcon className="h-5 w-5 text-gray-400" />
          <span className="font-medium text-gray-900">Filtres</span>
          {activeFiltersCount > 0 && (
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
              {activeFiltersCount}
            </span>
          )}
        </div>
        <span className="text-gray-400">
          {showFilters ? '−' : '+'}
        </span>
      </button>

      {/* Filter Content */}
      {showFilters && (
        <div className="p-4 border-t border-gray-200 space-y-4">
          {/* Employment Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type d'emploi
            </label>
            <select
              value={filters.employment_type || ''}
              onChange={(e) => handleFilterChange('employment_type', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Tous les types</option>
              <option value="full_time">Temps plein</option>
              <option value="part_time">Temps partiel</option>
              <option value="contract">Contrat</option>
              <option value="internship">Stage</option>
              <option value="freelance">Freelance</option>
            </select>
          </div>

          {/* Work Location Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mode de travail
            </label>
            <select
              value={filters.work_location_type || ''}
              onChange={(e) => handleFilterChange('work_location_type', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Tous les modes</option>
              <option value="remote">Télétravail</option>
              <option value="on_site">Sur site</option>
              <option value="hybrid">Hybride</option>
            </select>
          </div>

          {/* Experience Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Niveau d'expérience
            </label>
            <select
              value={filters.experience_level || ''}
              onChange={(e) => handleFilterChange('experience_level', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Tous les niveaux</option>
              <option value="entry">Débutant</option>
              <option value="mid">Intermédiaire</option>
              <option value="senior">Senior</option>
              <option value="executive">Dirigeant</option>
            </select>
          </div>

          {/* Industry */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Secteur d'activité
            </label>
            <select
              value={filters.industry || ''}
              onChange={(e) => handleFilterChange('industry', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Tous les secteurs</option>
              {industries.map((industry) => (
                <option key={industry.id} value={industry.id}>
                  {industry.name}
                </option>
              ))}
            </select>
          </div>

          {/* Salary Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Salaire (FCFA)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Minimum"
                value={filters.salary_min || ''}
                onChange={(e) => handleFilterChange('salary_min', e.target.value ? parseInt(e.target.value) : '')}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="number"
                placeholder="Maximum"
                value={filters.salary_max || ''}
                onChange={(e) => handleFilterChange('salary_max', e.target.value ? parseInt(e.target.value) : '')}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Clear Filters */}
          {activeFiltersCount > 0 && (
            <button
              onClick={clearFilters}
              className="w-full px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Effacer tous les filtres
            </button>
          )}
        </div>
      )}
    </div>
  )
}
