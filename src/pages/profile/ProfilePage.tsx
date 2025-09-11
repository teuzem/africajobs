import React, { useState, useEffect, Fragment } from 'react'
import { useAuth } from '../../context/AuthContext'
import { supabase, Profile, JobSeekerProfile, WorkExperience, Education, Skill, Language } from '../../lib/supabase'
import { Spinner } from '../../components/ui/Spinner'
import { Tab } from '@headlessui/react'
import { UserCircleIcon, BriefcaseIcon, AcademicCapIcon, SparklesIcon, LanguageIcon, PencilIcon, DocumentArrowUpIcon } from '@heroicons/react/24/outline'
import { PersonalInfoSection } from './components/PersonalInfoSection'
import { ProfessionalInfoSection } from './components/ProfessionalInfoSection'
import { ExperienceSection } from './components/ExperienceSection'
import { EducationSection } from './components/EducationSection'
import { SkillsSection } from './components/SkillsSection'
import { LanguagesSection } from './components/LanguagesSection'
import { ResumeSection } from './components/ResumeSection'
import { ProfileCompletion } from './components/ProfileCompletion'

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export type FullJobSeekerProfile = JobSeekerProfile & {
  work_experiences: WorkExperience[]
  educations: Education[]
  job_seeker_skills: { skills: Skill }[]
  job_seeker_languages: { languages: Language }[]
}

export function ProfilePage() {
  const { user, profile, loading: authLoading, updateProfile } = useAuth()
  const [fullProfile, setFullProfile] = useState<FullJobSeekerProfile | null>(null)
  const [loading, setLoading] = useState(true)
  
  const [avatarUrl, setAvatarUrl] = useState<string | null>(profile?.avatar_url || null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (user) {
      fetchFullProfile()
    } else if (!authLoading) {
      setLoading(false)
    }
  }, [user, authLoading])

  const fetchFullProfile = async () => {
    if (!user) return
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('job_seeker_profiles')
        .select(`
          *,
          work_experiences (*),
          educations (*),
          job_seeker_skills (
            skills (*)
          ),
          job_seeker_languages (
            languages (*)
          )
        `)
        .eq('profile_id', user.id)
        .single()
      if (error && error.code !== 'PGRST116') throw error
      setFullProfile(data as FullJobSeekerProfile)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }
  
  const onProfileUpdate = (data: Partial<FullJobSeekerProfile>) => {
    setFullProfile(prev => ({ ...prev, ...data } as FullJobSeekerProfile))
  }

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true)
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('Vous devez sélectionner une image à télécharger.')
      }
      if (!user) return

      const file = event.target.files[0]
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}-${Math.random()}.${fileExt}`
      const filePath = `${fileName}`

      let { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(filePath)
      
      setAvatarUrl(publicUrl)
      await updateProfile({ avatar_url: publicUrl })

    } catch (error: any) {
      alert(error.message)
    } finally {
      setUploading(false)
    }
  }

  const tabs = [
    { name: 'Infos Personnelles', icon: UserCircleIcon, component: PersonalInfoSection },
    { name: 'Infos Pro', icon: BriefcaseIcon, component: ProfessionalInfoSection, props: { jobSeekerProfile: fullProfile, onProfileUpdate } },
    { name: 'CV', icon: DocumentArrowUpIcon, component: ResumeSection, props: { jobSeekerProfile: fullProfile, onProfileUpdate } },
    { name: 'Expériences', icon: BriefcaseIcon, component: ExperienceSection },
    { name: 'Formations', icon: AcademicCapIcon, component: EducationSection },
    { name: 'Compétences', icon: SparklesIcon, component: SkillsSection },
    { name: 'Langues', icon: LanguageIcon, component: LanguagesSection },
  ]

  if (loading || authLoading) {
    return <div className="flex justify-center py-20"><Spinner size="lg" /></div>
  }

  if (!profile) {
    return <div className="text-center py-20">Impossible de charger le profil.</div>
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="md:grid md:grid-cols-3 md:gap-8">
        <div className="md:col-span-1 mb-8 md:mb-0">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-4">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={profile.full_name || ''} className="h-24 w-24 rounded-full object-cover" />
                ) : (
                  <UserCircleIcon className="h-24 w-24 text-gray-300" />
                )}
                <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow cursor-pointer hover:bg-gray-100">
                  <PencilIcon className="h-4 w-4 text-gray-600" />
                  <input id="avatar-upload" type="file" className="hidden" onChange={handleAvatarUpload} disabled={uploading} accept="image/*" />
                </label>
              </div>
              <h1 className="text-xl font-bold text-gray-900">{profile.full_name}</h1>
              <p className="text-md text-gray-600">{fullProfile?.headline || 'Aucun titre de profil'}</p>
              <p className="text-sm text-gray-500 capitalize">{profile.user_type.replace('_', ' ')}</p>
            </div>
            <div className="mt-6">
              <ProfileCompletion profile={profile} jobSeekerProfile={fullProfile} />
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <Tab.Group>
            <Tab.List className="flex space-x-1 overflow-x-auto rounded-xl bg-blue-900/20 p-1">
              {tabs.map((tab) => (
                <Tab
                  key={tab.name}
                  className={({ selected }) =>
                    classNames(
                      'w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700 whitespace-nowrap px-4',
                      'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                      selected
                        ? 'bg-white shadow'
                        : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
                    )
                  }
                >
                  <div className="flex items-center justify-center">
                    <tab.icon className="h-5 w-5 mr-2" />
                    {tab.name}
                  </div>
                </Tab>
              ))}
            </Tab.List>
            <Tab.Panels as={Fragment}>
              {tabs.map((tab, idx) => (
                <Tab.Panel
                  key={idx}
                  className={classNames(
                    'rounded-xl bg-white p-4 mt-2 shadow-sm border border-gray-200',
                    'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2'
                  )}
                >
                  <tab.component {...(tab.props || {})} />
                </Tab.Panel>
              ))}
            </Tab.Panels>
          </Tab.Group>
        </div>
      </div>
    </div>
  )
}
