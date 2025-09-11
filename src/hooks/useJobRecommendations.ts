import { useEffect, useState } from 'react'
import { supabase, JobRecommendation, JobPosting, Company, City, Region, Country, Industry } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export interface JobRecommendationWithDetails extends JobRecommendation {
  job_posting: JobPosting & {
    company?: Company
    city?: City & {
      region?: Region & {
        country?: Country
      }
    }
    industry?: Industry
  }
}

export function useJobRecommendations() {
  const { user, profile } = useAuth()
  const [recommendations, setRecommendations] = useState<JobRecommendationWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (profile?.user_type === 'job_seeker') {
      fetchRecommendations()
    } else {
      setLoading(false)
    }
  }, [profile])

  const fetchRecommendations = async () => {
    if (!user) return

    try {
      setLoading(true)
      setError(null)

      // First get the job seeker profile
      const { data: jobSeekerProfile, error: profileError } = await supabase
        .from('job_seeker_profiles')
        .select('id')
        .eq('profile_id', user.id)
        .single()

      if (profileError) throw profileError

      // Then get recommendations with job details
      const { data, error: recsError } = await supabase
        .from('job_recommendations')
        .select(`
          *,
          job_posting:job_postings (
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
          )
        `)
        .eq('job_seeker_id', jobSeekerProfile.id)
        .order('recommendation_score', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(20)

      if (recsError) throw recsError

      setRecommendations(data || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const markAsViewed = async (recommendationId: string) => {
    const { error } = await supabase
      .from('job_recommendations')
      .update({ viewed: true })
      .eq('id', recommendationId)

    if (!error) {
      setRecommendations(prev => 
        prev.map(rec => 
          rec.id === recommendationId ? { ...rec, viewed: true } : rec
        )
      )
    }
  }

  const markAsClicked = async (recommendationId: string) => {
    const { error } = await supabase
      .from('job_recommendations')
      .update({ clicked: true, viewed: true })
      .eq('id', recommendationId)

    if (!error) {
      setRecommendations(prev => 
        prev.map(rec => 
          rec.id === recommendationId ? { ...rec, clicked: true, viewed: true } : rec
        )
      )
    }
  }

  return {
    recommendations,
    loading,
    error,
    refetch: fetchRecommendations,
    markAsViewed,
    markAsClicked
  }
}
