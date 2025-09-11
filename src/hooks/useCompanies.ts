import { useState, useEffect } from 'react'
import { supabase, Company } from '../lib/supabase'

export function useCompanies(searchTerm: string) {
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true)
      setError(null)
      try {
        let query
        if (searchTerm) {
          query = supabase.rpc('search_companies', { keyword: searchTerm })
        } else {
          query = supabase.from('companies').select('*')
        }
        
        const { data, error: companiesError } = await query.order('name')
        
        if (companiesError) throw companiesError
        setCompanies(data || [])
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchCompanies()
  }, [searchTerm])

  return { companies, loading, error }
}
