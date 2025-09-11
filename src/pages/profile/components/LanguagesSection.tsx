import React, { useState, useEffect } from 'react'
import { useAuth } from '../../../context/AuthContext'
import { supabase, Language, JobSeekerLanguage } from '../../../lib/supabase'
import { Spinner } from '../../../components/ui/Spinner'
import { MultiSelect } from '../../../components/ui/MultiSelect'
import { LanguageIcon } from '@heroicons/react/24/outline'

export function LanguagesSection() {
  const { user } = useAuth()
  const [allLanguages, setAllLanguages] = useState<Language[]>([])
  const [userLanguages, setUserLanguages] = useState<Language[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    if (!user) return
    setLoading(true)
    const [allLangRes, userLangRes] = await Promise.all([
      supabase.from('languages').select('*').order('name'),
      supabase.from('job_seeker_languages').select('languages(*)').eq('job_seeker_id', user.id)
    ])
    setAllLanguages(allLangRes.data || [])
    setUserLanguages(userLangRes.data?.map(ul => ul.languages).filter(Boolean) as Language[] || [])
    setLoading(false)
  }

  const handleLanguageChange = async (selected: Language[]) => {
    if (!user) return
    
    const newLangIds = new Set(selected.map(l => l.id))
    const oldLangIds = new Set(userLanguages.map(l => l.id))

    const toAdd = [...newLangIds].filter(id => !oldLangIds.has(id))
    const toRemove = [...oldLangIds].filter(id => !newLangIds.has(id))

    if (toRemove.length > 0) {
      await supabase.from('job_seeker_languages').delete().eq('job_seeker_id', user.id).in('language_id', toRemove)
    }
    if (toAdd.length > 0) {
      await supabase.from('job_seeker_languages').insert(toAdd.map(id => ({ job_seeker_id: user.id, language_id: id })))
    }

    setUserLanguages(selected)
  }

  if (loading) return <Spinner />

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center"><LanguageIcon className="h-6 w-6 mr-2" />Langues</h2>
      <MultiSelect
        options={allLanguages}
        selectedOptions={userLanguages}
        onChange={handleLanguageChange}
        labelKey="name"
        valueKey="id"
        placeholder="Ajouter des langues"
      />
    </div>
  )
}
