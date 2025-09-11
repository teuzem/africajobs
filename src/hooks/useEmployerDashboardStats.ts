import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase, JobPosting } from '../lib/supabase'
import { subDays, format } from 'date-fns'

type RecentApplicant = {
  id: string
  created_at: string
  job_posting_id: string
  job_title: string
  applicant_name: string
  applicant_avatar: string | null
}

export function useEmployerDashboardStats() {
  const { user } = useAuth()
  const [jobs, setJobs] = useState<JobPosting[]>([])
  const [stats, setStats] = useState({ totalJobs: 0, totalApplications: 0, totalViews: 0 })
  const [chartData, setChartData] = useState<{ date: string; candidatures: number }[]>([])
  const [recentApplicants, setRecentApplicants] = useState<RecentApplicant[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    if (!user) return
    
    setLoading(true)
    setError(null)

    try {
      // Fetch all jobs for the employer
      const { data: jobsData, error: jobsError } = await supabase
        .from('job_postings')
        .select('*')
        .eq('employer_id', user.id)
        .order('created_at', { ascending: false })

      if (jobsError) throw jobsError
      setJobs(jobsData || [])

      // Calculate aggregate stats
      const totalJobs = jobsData?.length || 0
      const totalApplications = jobsData?.reduce((sum, job) => sum + job.applications_count, 0) || 0
      const totalViews = jobsData?.reduce((sum, job) => sum + job.views_count, 0) || 0
      setStats({ totalJobs, totalApplications, totalViews })

      // Fetch applications for the last 30 days for the chart
      const thirtyDaysAgo = subDays(new Date(), 30).toISOString()
      const jobIds = jobsData?.map(j => j.id) || []
      
      if (jobIds.length > 0) {
        const { data: applicationsData, error: applicationsError } = await supabase
          .from('job_applications')
          .select('created_at')
          .in('job_posting_id', jobIds)
          .gte('created_at', thirtyDaysAgo)

        if (applicationsError) throw applicationsError

        // Process data for the chart
        const applicationsByDay: { [key: string]: number } = {}
        for (let i = 0; i < 30; i++) {
          const date = format(subDays(new Date(), i), 'MMM dd')
          applicationsByDay[date] = 0
        }
        applicationsData?.forEach(app => {
          const date = format(new Date(app.created_at), 'MMM dd')
          if (applicationsByDay[date] !== undefined) {
            applicationsByDay[date]++
          }
        })
        setChartData(Object.entries(applicationsByDay).map(([date, count]) => ({ date, candidatures: count })).reverse())

        // Fetch recent applicants
        const { data: recentApplicantsData, error: recentApplicantsError } = await supabase
          .rpc('get_recent_applicants_for_employer', { employer_id_param: user.id, limit_param: 5 })
        
        if (recentApplicantsError) throw recentApplicantsError
        setRecentApplicants(recentApplicantsData || [])
      }

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
      const jobIds = jobs.map(j => j.id)
      if (jobIds.length === 0) return

      const channel = supabase
        .channel('public:job_applications')
        .on(
          'postgres_changes',
          { 
            event: 'INSERT', 
            schema: 'public', 
            table: 'job_applications',
            filter: `job_posting_id=in.(${jobIds.join(',')})`
          },
          (payload) => {
            console.log('New application received, refetching dashboard data...', payload)
            fetchData()
          }
        )
        .subscribe()

      return () => {
        supabase.removeChannel(channel)
      }
    }
  }, [user, jobs.map(j => j.id).join(',')]) // Re-subscribe if jobs change

  return { jobs, stats, chartData, recentApplicants, loading, error, refetch: fetchData }
}
