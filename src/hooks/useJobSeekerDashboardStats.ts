import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { FullJobSeekerProfile } from '../pages/profile/ProfilePage'
import { JobRecommendationWithDetails } from './useJobRecommendations'

type Stats = {
  totalApplications: number
  savedJobs: number
  newRecommendations: number
}

type ChartData = {
  name: string
  value: number
}

export function useJobSeekerDashboardStats() {
  const { user } = useAuth()
  const [stats, setStats] = useState<Stats>({ totalApplications: 0, savedJobs: 0, newRecommendations: 0 })
  const [chartData, setChartData] = useState<ChartData[]>([])
  const [recentRecommendations, setRecentRecommendations] = useState<JobRecommendationWithDetails[]>([])
  const [fullProfile, setFullProfile] = useState<FullJobSeekerProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    if (!user) return
    
    setLoading(true)
    setError(null)

    try {
      const { data: seekerProfile, error: seekerProfileError } = await supabase
        .from('job_seeker_profiles')
        .select(`
          *,
          work_experiences (*),
          educations (*),
          job_seeker_skills (skills (*)),
          job_seeker_languages (languages (*))
        `)
        .eq('profile_id', user.id)
        .single()

      if (seekerProfileError && seekerProfileError.code !== 'PGRST116') throw seekerProfileError
      setFullProfile(seekerProfile as FullJobSeekerProfile)

      const [applicationsRes, savedJobsRes, recommendationsRes] = await Promise.all([
        supabase.from('job_applications').select('id, status', { count: 'exact' }).eq('job_seeker_id', user.id),
        supabase.from('saved_jobs').select('id', { count: 'exact' }).eq('job_seeker_id', user.id),
        supabase.from('job_recommendations').select(`
          *,
          job_posting:job_postings (
            *,
            company:companies (*),
            city:cities (*),
            industry:industries (*)
          )
        `).eq('job_seeker_id', seekerProfile?.id || '').order('created_at', { ascending: false }).limit(4)
      ])

      if (applicationsRes.error || savedJobsRes.error || recommendationsRes.error) {
        throw new Error("Erreur lors de la récupération des données.")
      }
      
      // Process Stats
      setStats({
        totalApplications: applicationsRes.count || 0,
        savedJobs: savedJobsRes.count || 0,
        newRecommendations: recommendationsRes.data?.filter(r => !r.is_read).length || 0,
      })

      // Process Chart Data
      const statusCounts: { [key: string]: number } = { submitted: 0, viewed: 0, in_progress: 0, accepted: 0, rejected: 0 }
      applicationsRes.data?.forEach(app => {
        if (statusCounts[app.status] !== undefined) {
          statusCounts[app.status]++
        }
      })
      const statusLabels: Record<string, string> = { submitted: 'Envoyée', viewed: 'Vue', in_progress: 'En cours', accepted: 'Acceptée', rejected: 'Rejetée' }
      setChartData(Object.entries(statusCounts).map(([status, count]) => ({ name: statusLabels[status], value: count })))

      // Process Recent Recommendations
      setRecentRecommendations(recommendationsRes.data as JobRecommendationWithDetails[] || [])

    } catch (err: any) {
      setError("Impossible de charger les données du tableau de bord.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchData()

    if (user) {
      const channel = supabase
        .channel('public:job_applications:job_seeker_dashboard')
        .on(
          'postgres_changes',
          { 
            event: '*', 
            schema: 'public', 
            table: 'job_applications',
            filter: `job_seeker_id=eq.${user.id}`
          },
          (payload) => {
            console.log('Application status changed, refetching dashboard data...', payload)
            fetchData()
          }
        )
        .subscribe()

      return () => {
        supabase.removeChannel(channel)
      }
    }
  }, [user, fetchData])

  return { stats, chartData, recentRecommendations, fullProfile, loading, error }
}
