import React from 'react'
import { Breadcrumbs, BreadcrumbItem } from '../ui/Breadcrumbs'
import { useLocation } from 'react-router-dom'

interface AuthLayoutProps {
  children: React.ReactNode
}

const breadcrumbPaths: Record<string, BreadcrumbItem[]> = {
  '/login': [{ name: 'Connexion', href: '/login' }],
  '/signup': [{ name: 'Inscription', href: '/signup' }],
  '/forgot-password': [{ name: 'Mot de passe oublié', href: '/forgot-password' }],
  '/update-password': [{ name: 'Nouveau mot de passe', href: '/update-password' }],
  '/check-email': [{ name: 'Vérification Email', href: '/check-email' }],
}

export function AuthLayout({ children }: AuthLayoutProps) {
  const location = useLocation()
  const currentBreadcrumbs = breadcrumbPaths[location.pathname] || []

  return (
    <div className="flex-grow w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs items={currentBreadcrumbs} />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left Side */}
            <div className="hidden lg:block relative">
              <img 
                src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=2574&auto=format&fit=crop" 
                alt="AfricaJobs team working" 
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="relative z-10 p-12 bg-blue-800 bg-opacity-70 h-full flex flex-col justify-end">
                <h2 className="text-3xl font-bold text-white">
                  Votre prochaine opportunité de carrière vous attend.
                </h2>
                <p className="mt-4 text-blue-200">
                  Rejoignez des milliers de professionnels et d'entreprises qui façonnent l'avenir de l'Afrique.
                </p>
              </div>
            </div>
            {/* Right Side (Form) */}
            <div className="p-8 sm:p-12">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
