import React, { useState, useEffect } from 'react'
import { useAuth } from '../../../context/AuthContext'
import { supabase, Skill } from '../../../lib/supabase'
import { Spinner } from '../../../components/ui/Spinner'
import { MultiSelect } from '../../../components/ui/MultiSelect'
import { SparklesIcon } from '@heroicons/react/24/outline'

export function SkillsSection() {
  const { user } = useAuth()
  const [allSkills, setAllSkills] = useState<Skill[]>([])
  const [userSkills, setUserSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    if (!user) return
    setLoading(true)
    const [allSkillsRes, userSkillsRes] = await Promise.all([
      supabase.from('skills').select('*').order('name'),
      supabase.from('job_seeker_skills').select('skills(*)').eq('job_seeker_id', user.id)
    ])
    setAllSkills(allSkillsRes.data || [])
    setUserSkills(userSkillsRes.data?.map(us => us.skills).filter(Boolean) as Skill[] || [])
    setLoading(false)
  }

  const handleSkillChange = async (selected: Skill[]) => {
    if (!user) return
    
    const newSkillIds = new Set(selected.map(s => s.id))
    const oldSkillIds = new Set(userSkills.map(s => s.id))

    const toAdd = [...newSkillIds].filter(id => !oldSkillIds.has(id))
    const toRemove = [...oldSkillIds].filter(id => !newSkillIds.has(id))

    if (toRemove.length > 0) {
      await supabase.from('job_seeker_skills').delete().eq('job_seeker_id', user.id).in('skill_id', toRemove)
    }
    if (toAdd.length > 0) {
      await supabase.from('job_seeker_skills').insert(toAdd.map(id => ({ job_seeker_id: user.id, skill_id: id })))
    }

    setUserSkills(selected)
  }

  if (loading) return <Spinner />

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center"><SparklesIcon className="h-6 w-6 mr-2" />Compétences</h2>
      <MultiSelect
        options={allSkills}
        selectedOptions={userSkills}
        onChange={handleSkillChange}
        labelKey="name"
        valueKey="id"
        placeholder="Rechercher et ajouter des compétences"
      />
    </div>
  )
}
