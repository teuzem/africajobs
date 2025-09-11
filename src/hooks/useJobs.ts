import { useEffect, useState } from 'react'
import { supabase, JobPosting, Company, City, Region, Country, Industry } from '../lib/supabase'

export interface JobWithDetails extends JobPosting {
  company?: Company
  city?: City & {
    region?: Region & {
      country?: Country
    }
  }
  industry?: Industry
  isSaved?: boolean
}

interface JobFilters {
  search?: string
  location?: string
  industry?: string
  employment_type?: string
  experience_level?: string
  work_location_type?: string
  salary_min?: number
  salary_max?: number
}

export function useJobs(filters?: JobFilters) {
  const [jobs, setJobs] = useState<JobWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalCount, setTotalCount] = useState(0)

  useEffect(() => {
    fetchJobs()
  }, [filters])

  const fetchJobs = async () => {
    try {
      setLoading(true)
      setError(null)

      let query = supabase
        .from('job_postings')
        .select(`
          *,
          company:companies (*),
          city:cities (
            *,
            region:regions (
              *,
              country:countries (*)
            )
          ),
          industry:industries (*)
        `, { count: 'exact' })
        .eq('status', 'published')
        .order('featured', { ascending: false })
        .order('created_at', { ascending: false })

      // Apply filters
      if (filters?.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
      }

      if (filters?.employment_type) {
        query = query.eq('employment_type', filters.employment_type)
      }

      if (filters?.experience_level) {
        query = query.eq('experience_level', filters.experience_level)
      }

      if (filters?.work_location_type) {
        query = query.eq('work_location_type', filters.work_location_type)
      }

      if (filters?.salary_min) {
        query = query.gte('salary_range_min', filters.salary_min)
      }

      if (filters?.salary_max) {
        query = query.lte('salary_range_max', filters.salary_max)
      }

      if (filters?.industry) {
        query = query.eq('industry_id', filters.industry)
      }

      const { data, error: jobsError, count } = await query.limit(50)

      if (jobsError) throw jobsError

      setJobs(data || [])
      setTotalCount(count || 0)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return {
    jobs,
    loading,
    error,
    totalCount,
    refetch: fetchJobs
  }
}
