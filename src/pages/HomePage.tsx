import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { 
  MagnifyingGlassIcon,
  BriefcaseIcon,
  UserGroupIcon,
  ChartBarIcon,
  MapPinIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline'

export function HomePage() {
  const { user, profile } = useAuth()

  const stats = [
    {
      icon: BriefcaseIcon,
      label: 'Offres d\'emploi',
      value: '25,000+',
      description: 'Emplois disponibles en Afrique'
    },
    {
      icon: UserGroupIcon,
      label: 'Entreprises',
      value: '5,000+',
      description: 'Entreprises partenaires'
    },
    {
      icon: ChartBarIcon,
      label: 'Taux de réussite',
      value: '85%',
      description: 'Candidats trouvant un emploi'
    },
    {
      icon: MapPinIcon,
      label: 'Pays couverts',
      value: '54',
      description: 'Tous les pays africains'
    }
  ]

  const topIndustries = [
    'Technologie & IT',
    'Banque & Finance',
    'Santé & Médecine',
    'Éducation',
    'Construction & BTP',
    'Agriculture & Agro-industrie',
    'Commerce & Vente',
    'Transport & Logistique'
  ]

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Trouvez votre emploi de rêve
              <span className="block text-yellow-300">en Afrique</span>
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              AfricaJobs utilise l'intelligence artificielle pour vous recommander les meilleures opportunités 
              d'emploi adaptées à votre profil, avec un focus particulier sur le Cameroun et l'Afrique.
            </p>
            
            {user ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/recommendations"
                  className="bg-yellow-400 text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition-colors inline-flex items-center justify-center"
                >
                  Voir mes recommandations
                  <ArrowRightIcon className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  to="/jobs"
                  className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors inline-flex items-center justify-center"
                >
                  Parcourir les emplois
                </Link>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/signup"
                  className="bg-yellow-400 text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition-colors inline-flex items-center justify-center"
                >
                  Commencer maintenant
                  <ArrowRightIcon className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  to="/jobs"
                  className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors inline-flex items-center justify-center"
                >
                  Explorer les emplois
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Poste, entreprise, compétences..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex-1">
                <div className="relative">
                  <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Ville, région, pays..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <Link
                to="/jobs"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                Rechercher
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Leader du recrutement en Afrique
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Des milliers de candidats et d'employeurs nous font confiance pour créer des opportunités d'emploi partout en Afrique.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-lg mb-4">
                  <stat.icon className="h-8 w-8 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-lg font-medium text-gray-700 mb-1">{stat.label}</div>
                <div className="text-sm text-gray-500">{stat.description}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Industries Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Secteurs d'activité populaires
            </h2>
            <p className="text-xl text-gray-600">
              Découvrez les opportunités dans les secteurs les plus dynamiques d'Afrique
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {topIndustries.map((industry, index) => (
              <Link
                key={index}
                to={`/jobs?industry=${encodeURIComponent(industry)}`}
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all duration-200 text-center"
              >
                <div className="font-medium text-gray-900">{industry}</div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-6">
            Prêt à transformer votre carrière ?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Rejoignez des milliers de professionnels qui ont trouvé leur emploi idéal grâce à nos recommandations intelligentes.
          </p>
          {!user && (
            <Link
              to="/signup"
              className="bg-yellow-400 text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition-colors inline-flex items-center"
            >
              S'inscrire gratuitement
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
