import React, { useState, useEffect } from 'react'
import { BuildingOffice2Icon, GlobeAltIcon, LightBulbIcon } from '@heroicons/react/24/outline'
import { supabase } from '../../lib/supabase'
import { Spinner } from '../../components/ui/Spinner'

interface TeamMember {
  id: string
  name: string
  role: string
  image_url: string
}

export function AboutPage() {
  const [team, setTeam] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTeam = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('created_at', { ascending: true })
      
      if (data) {
        setTeam(data)
      }
      setLoading(false)
    }
    fetchTeam()
  }, [])

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base font-semibold text-blue-600 tracking-wide uppercase">À propos de nous</h2>
          <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Connecter les talents et les opportunités en Afrique.
          </p>
          <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
            Notre mission est de réduire le chômage en Afrique en utilisant la technologie pour rendre le marché du travail plus transparent et accessible.
          </p>
        </div>
      </div>

      <div className="relative bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mx-auto">
                <BuildingOffice2Icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-lg font-medium text-gray-900">Notre Vision</h3>
              <p className="mt-2 text-base text-gray-500">
                Devenir la plateforme de référence pour l'emploi en Afrique, favorisant le développement économique et la réalisation professionnelle de millions de personnes.
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mx-auto">
                <GlobeAltIcon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-lg font-medium text-gray-900">Notre Mission</h3>
              <p className="mt-2 text-base text-gray-500">
                Utiliser l'intelligence artificielle pour créer des recommandations d'emploi pertinentes et personnalisées, en commençant par le Cameroun et en s'étendant à tout le continent.
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mx-auto">
                <LightBulbIcon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-lg font-medium text-gray-900">Nos Valeurs</h3>
              <p className="mt-2 text-base text-gray-500">
                Innovation, intégrité, accessibilité et impact. Nous nous engageons à créer une plateforme équitable et efficace pour tous.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">Notre Équipe</h2>
            <p className="mt-4 text-lg text-gray-500">
              Une équipe passionnée et dédiée à la transformation du marché de l'emploi en Afrique.
            </p>
          </div>
          {loading ? (
            <div className="flex justify-center mt-12"><Spinner size="lg" /></div>
          ) : (
            <div className="mt-12 grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
              {team.map((person) => (
                <div key={person.id} className="text-center">
                  <img className="mx-auto h-24 w-24 rounded-full object-cover" src={person.image_url} alt={person.name} />
                  <div className="mt-4">
                    <h3 className="text-lg font-medium text-gray-900">{person.name}</h3>
                    <p className="text-blue-600">{person.role}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
