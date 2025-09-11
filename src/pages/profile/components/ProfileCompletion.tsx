import React from 'react'
import { Profile } from '../../../lib/supabase'
import { FullJobSeekerProfile } from '../ProfilePage'

interface ProfileCompletionProps {
  profile: Profile | null
  jobSeekerProfile: FullJobSeekerProfile | null
}

export function ProfileCompletion({ profile, jobSeekerProfile }: ProfileCompletionProps) {
  const calculateCompletion = () => {
    let score = 0
    const totalPoints = 100
    const pointsPerSection = {
      avatar: 10,
      headline: 10,
      summary: 15,
      resume: 15,
      experience: 20,
      education: 15,
      skills: 10,
      languages: 5,
    }

    if (profile?.avatar_url) score += pointsPerSection.avatar
    if (jobSeekerProfile?.headline) score += pointsPerSection.headline
    if (jobSeekerProfile?.summary) score += pointsPerSection.summary
    if (jobSeekerProfile?.resume_url) score += pointsPerSection.resume
    if (jobSeekerProfile?.work_experiences && jobSeekerProfile.work_experiences.length > 0) score += pointsPerSection.experience
    if (jobSeekerProfile?.educations && jobSeekerProfile.educations.length > 0) score += pointsPerSection.education
    if (jobSeekerProfile?.job_seeker_skills && jobSeekerProfile.job_seeker_skills.length > 0) score += pointsPerSection.skills
    if (jobSeekerProfile?.job_seeker_languages && jobSeekerProfile.job_seeker_languages.length > 0) score += pointsPerSection.languages

    return Math.min(score, totalPoints)
  }

  const completionPercentage = calculateCompletion()
  const progressColor = completionPercentage < 50 ? 'bg-red-500' : completionPercentage < 80 ? 'bg-yellow-500' : 'bg-green-500'

  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-base font-medium text-gray-700">Profil complété</span>
        <span className="text-sm font-medium text-gray-700">{completionPercentage}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div className={`h-2.5 rounded-full ${progressColor}`} style={{ width: `${completionPercentage}%` }}></div>
      </div>
      <p className="text-xs text-gray-500 mt-2 text-center">
        Un profil complet augmente vos chances d'être contacté par les recruteurs.
      </p>
    </div>
  )
}
