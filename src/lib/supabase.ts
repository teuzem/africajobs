import { createClient } from '@supabase/supabase-js'
import { Database } from './database.types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Re-export generated types for convenience
export type { Database } from './database.types'

// Manually defined types for easier access in components
// You can expand these as needed, but the generated types are the source of truth.
export type Profile = Database['public']['Tables']['profiles']['Row']
export type JobSeekerProfile = Database['public']['Tables']['job_seeker_profiles']['Row']
export type Company = Database['public']['Tables']['companies']['Row']
export type JobPosting = Database['public']['Tables']['job_postings']['Row']
export type JobRecommendation = Database['public']['Tables']['job_recommendations']['Row']
export type Industry = Database['public']['Tables']['industries']['Row']
export type Skill = Database['public']['Tables']['skills']['Row']
export type City = Database['public']['Tables']['cities']['Row']
export type Region = Database['public']['Tables']['regions']['Row']
export type Country = Database['public']['Tables']['countries']['Row']
export type Language = Database['public']['Tables']['languages']['Row']
export type JobSeekerLanguage = Database['public']['Tables']['job_seeker_languages']['Row']
export type JobApplication = Database['public']['Tables']['job_applications']['Row']
export type SavedJob = Database['public']['Tables']['saved_jobs']['Row']
export type WorkExperience = Database['public']['Tables']['work_experiences']['Row']
export type Education = Database['public']['Tables']['educations']['Row']
export type JobSeekerSkill = Database['public']['Tables']['job_seeker_skills']['Row']
export type Notification = Database['public']['Tables']['notifications']['Row']
