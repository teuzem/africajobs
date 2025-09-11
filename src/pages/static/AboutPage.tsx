import React, { useState, useEffect, useMemo } from 'react'
import { BuildingOffice2Icon, GlobeAltIcon, LightBulbIcon, UserCircleIcon } from '@heroicons/react/24/outline'
import { supabase } from '../../lib/supabase'
import { Spinner } from '../../components/ui/Spinner'
import { StaticPageLayout } from '../../components/Layout/StaticPageLayout'
import { Linkedin, Twitter } from 'lucide-react'

interface TeamMember {
  id: string
  name: string
  role: string
  image_url: string
  linkedin_url?: string
  twitter_url?: string
}

export function AboutPage() {
  const [team, setTeam] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)

  const breadcrumbs = useMemo(() => [{ name: 'À propos', href: '/about' }], [])

  useEffect(() => {
    const fetchTeam = async () => {
      setLoading(true)
      const { data } = await supabase
        .from('team_members')
        .select('*')
        .order('created_at', { ascending: true })
      
      if (data) setTeam(data)
      setLoading(false)
    }
    fetchTeam()
  }, [])

  return (
    <StaticPageLayout
      title="Notre Mission"
      subtitle="Connecter les talents et les opportunités pour construire l'avenir de l'Afrique."
      breadcrumbs={breadcrumbs}
    >
      <div className="bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Qui sommes-nous ?</h2>
          <div className="prose prose-lg text-gray-600 max-w-none">
            <p>
              AfricaJobs est né d'une vision simple mais puissante : libérer le potentiel du capital humain africain. Nous croyons que le talent est uniformément réparti, mais que les opportunités ne le sont pas. Notre plateforme a été conçue pour combler ce fossé.
            </p>
            <p>
              En utilisant une technologie d'intelligence artificielle de pointe, nous créons des ponts entre les chercheurs d'emploi qualifiés et les entreprises innovantes à travers le continent, en commençant par un focus particulier sur le marché dynamique du Cameroun. Nous ne sommes pas seulement un portail d'emploi ; nous sommes un catalyseur de carrières et un partenaire de croissance pour les entreprises.
            </p>
          </div>
        </div>

        <div className="bg-gray-50 p-8 lg:p-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white mx-auto">
                <BuildingOffice2Icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-lg font-medium text-gray-900">Notre Vision</h3>
              <p className="mt-2 text-base text-gray-500">
                Devenir la plateforme de référence pour l'emploi en Afrique, favorisant le développement économique et la réalisation professionnelle de millions de personnes.
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white mx-auto">
                <GlobeAltIcon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-lg font-medium text-gray-900">Notre Mission</h3>
              <p className="mt-2 text-base text-gray-500">
                Utiliser l'IA pour créer des recommandations d'emploi pertinentes, en commençant par le Cameroun et en s'étendant à tout le continent.
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white mx-auto">
                <LightBulbIcon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-lg font-medium text-gray-900">Nos Valeurs</h3>
              <p className="mt-2 text-base text-gray-500">
                Innovation, intégrité, accessibilité et impact. Nous nous engageons à créer une plateforme équitable et efficace pour tous.
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-8 lg:p-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Notre Équipe</h2>
            <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
              Une équipe passionnée et dédiée à la transformation du marché de l'emploi en Afrique.
            </p>
          </div>
          {loading ? (
            <div className="flex justify-center mt-12"><Spinner size="lg" /></div>
          ) : (
            <div className="mt-12 grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
              {team.map((person) => (
                <div key={person.id} className="text-center">
                  <div className="relative inline-block">
                    {person.image_url ? (
                      <img className="mx-auto h-32 w-32 rounded-full object-cover" src={person.image_url} alt={person.name} />
                    ) : (
                      <UserCircleIcon className="mx-auto h-32 w-32 text-gray-300" />
                    )}
                  </div>
                  <div className="mt-4">
                    <h3 className="text-lg font-medium text-gray-900">{person.name}</h3>
                    <p className="text-base text-blue-600">{person.role}</p>
                    <div className="mt-2 flex justify-center space-x-3">
                      {person.linkedin_url && <a href={person.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-500"><Linkedin size={20} /></a>}
                      {person.twitter_url && <a href={person.twitter_url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-500"><Twitter size={20} /></a>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </StaticPageLayout>
  )
}
