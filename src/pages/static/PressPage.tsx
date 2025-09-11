import React, { useMemo } from 'react'
import { StaticPageLayout } from '../../components/Layout/StaticPageLayout'
import { RssIcon, PhotoIcon, ChatBubbleBottomCenterTextIcon } from '@heroicons/react/24/outline'

const pressReleases = [
  {
    date: '15 Août 2025',
    title: 'AfricaJobs lève 5 millions de dollars pour étendre sa plateforme de recrutement IA en Afrique de l\'Ouest.',
    link: '#',
  },
  {
    date: '10 Juin 2025',
    title: 'Lancement officiel d\'AfricaJobs au Cameroun avec plus de 10,000 offres d\'emploi.',
    link: '#',
  },
  {
    date: '01 Mai 2025',
    title: 'Partenariat stratégique entre AfricaJobs et les principales universités camerounaises pour l\'emploi des jeunes diplômés.',
    link: '#',
  },
]

export function PressPage() {
  const breadcrumbs = useMemo(() => [{ name: 'Presse', href: '/press' }], [])

  return (
    <StaticPageLayout
      title="Espace Presse"
      subtitle="Retrouvez nos dernières actualités, communiqués de presse et ressources pour les médias."
      breadcrumbs={breadcrumbs}
    >
      <div className="bg-white rounded-lg shadow-xl overflow-hidden lg:grid lg:grid-cols-3 lg:gap-8">
        <div className="lg:col-span-2 p-8 lg:p-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <RssIcon className="h-6 w-6 mr-3 text-blue-600" />
            Communiqués de presse
          </h3>
          <div className="space-y-6">
            {pressReleases.map((release, index) => (
              <a key={index} href={release.link} className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <p className="text-sm text-gray-500">{release.date}</p>
                <h4 className="mt-1 font-semibold text-gray-800 hover:text-blue-600">{release.title}</h4>
              </a>
            ))}
          </div>
        </div>
        <div className="lg:col-span-1 p-8 lg:p-12 bg-gray-50">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Ressources Média</h3>
          <div className="space-y-4">
            <a href="#" className="flex items-center p-4 bg-white rounded-lg border hover:shadow-md transition-shadow">
              <PhotoIcon className="h-6 w-6 mr-4 text-blue-600" />
              <div>
                <h4 className="font-semibold text-gray-800">Kit Média</h4>
                <p className="text-sm text-gray-500">Logos et images</p>
              </div>
            </a>
            <div className="p-4 bg-white rounded-lg border">
              <div className="flex items-center">
                <ChatBubbleBottomCenterTextIcon className="h-6 w-6 mr-4 text-blue-600" />
                <div>
                  <h4 className="font-semibold text-gray-800">Contact Presse</h4>
                  <p className="text-sm text-gray-500">presse@africajobs.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StaticPageLayout>
  )
}
