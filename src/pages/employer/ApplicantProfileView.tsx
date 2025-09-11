import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase, Profile, JobSeekerProfile, WorkExperience, Education, Skill, Language } from '../../lib/supabase'
import { Spinner } from '../../components/ui/Spinner'
import { UserCircleIcon, BriefcaseIcon, AcademicCapIcon, SparklesIcon, LanguageIcon, EnvelopeIcon, PhoneIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline'
import { createNotification } from '../../utils/notifications'
import toast from 'react-hot-toast'

type FullApplicantProfile = Profile & {
  job_seeker_profiles: (JobSeekerProfile & {
    work_experiences: WorkExperience[]
    educations: Education[]
    job_seeker_skills: { skills: Skill }[]
    job_seeker_languages: { languages: Language }[]
  }) | null
}

export function ApplicantProfileView() {
  const { applicantId } = useParams<{ applicantId: string }>()
  const [profile, setProfile] = useState<FullApplicantProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (applicantId) {
      fetchApplicantProfile()
    }
  }, [applicantId])

  const fetchApplicantProfile = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        *,
        job_seeker_profiles (
          *,
          work_experiences (*),
          educations (*),
          job_seeker_skills (
            skills (*)
          ),
          job_seeker_languages (
            languages (*)
          )
        )
      `)
      .eq('id', applicantId!)
      .single()

    if (data) {
      setProfile(data as any)
    }
    setLoading(false)
  }

  const handleStatusChange = async (applicationId: string, newStatus: string) => {
    const { error } = await supabase
      .from('job_applications')
      .update({ status: newStatus })
      .eq('id', applicationId)

    if (error) {
      toast.error('Erreur lors de la mise à jour du statut.')
    } else {
      toast.success(`Statut de la candidature mis à jour.`)
      // Notify the user
      if (profile) {
        await createNotification(
          profile.id,
          'application_status_change',
          `Le statut de votre candidature a été mis à jour : ${newStatus}`,
          '/applications'
        )
      }
    }
  }

  if (loading) {
    return <div className="flex justify-center py-20"><Spinner size="lg" /></div>
  }

  if (!profile) {
    return <div className="text-center py-20">Profil du candidat non trouvé.</div>
  }

  const jsProfile = profile.job_seeker_profiles

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
        {/* Header */}
        <div className="md:flex items-center justify-between space-x-6 mb-8">
          <div className="flex items-center space-x-6">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt={profile.full_name || ''} className="h-24 w-24 rounded-full object-cover" />
            ) : (
              <UserCircleIcon className="h-24 w-24 text-gray-300" />
            )}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{profile.full_name}</h1>
              <p className="text-lg text-gray-600">{jsProfile?.headline}</p>
              <div className="flex space-x-4 mt-2 text-sm text-gray-500">
                <span className="flex items-center"><EnvelopeIcon className="h-4 w-4 mr-1" />{profile.email}</span>
                {jsProfile?.phone && <span className="flex items-center"><PhoneIcon className="h-4 w-4 mr-1" />{jsProfile.phone}</span>}
              </div>
            </div>
          </div>
          {jsProfile?.resume_url && (
            <a 
              href={jsProfile.resume_url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
              Télécharger le CV
            </a>
          )}
        </div>

        {/* Summary */}
        {jsProfile?.summary && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Résumé</h2>
            <p className="text-gray-600 whitespace-pre-wrap">{jsProfile.summary}</p>
          </div>
        )}

        {/* Experience */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center"><BriefcaseIcon className="h-6 w-6 mr-2" />Expérience Professionnelle</h2>
          <div className="space-y-6 border-l-2 border-gray-200 pl-6">
            {jsProfile?.work_experiences.map(exp => (
              <div key={exp.id}>
                <h3 className="font-semibold text-gray-900">{exp.job_title} chez {exp.company_name}</h3>
                <p className="text-sm text-gray-500">{exp.start_date} - {exp.end_date || 'Aujourd\'hui'}</p>
                <p className="mt-2 text-gray-600 whitespace-pre-wrap">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Education */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center"><AcademicCapIcon className="h-6 w-6 mr-2" />Formation</h2>
          <div className="space-y-6 border-l-2 border-gray-200 pl-6">
            {jsProfile?.educations.map(edu => (
              <div key={edu.id}>
                <h3 className="font-semibold text-gray-900">{edu.degree} en {edu.field_of_study}</h3>
                <p className="text-sm text-gray-500">{edu.institution_name} | {edu.start_date} - {edu.end_date}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center"><SparklesIcon className="h-6 w-6 mr-2" />Compétences</h2>
          <div className="flex flex-wrap gap-2">
            {jsProfile?.job_seeker_skills.map(s => (
              <span key={s.skills.id} className="bg-gray-100 text-gray-800 text-sm font-medium px-3 py-1 rounded-full">{s.skills.name}</span>
            ))}
          </div>
        </div>
        
        {/* Languages */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center"><LanguageIcon className="h-6 w-6 mr-2" />Langues</h2>
          <div className="flex flex-wrap gap-2">
            {jsProfile?.job_seeker_languages.map(l => (
              <span key={l.languages.id} className="bg-gray-100 text-gray-800 text-sm font-medium px-3 py-1 rounded-full">{l.languages.name}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
