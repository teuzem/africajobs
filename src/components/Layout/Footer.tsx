import React from 'react'
import { Link } from 'react-router-dom'
import { BriefcaseIcon } from '@heroicons/react/24/outline'
import { Linkedin, Twitter, Facebook } from 'lucide-react'

export function Footer() {
  const jobSeekerLinks = [
    { name: 'Trouver un emploi', href: '/jobs' },
    { name: 'Recommandations IA', href: '/recommendations' },
    { name: 'Annuaire des entreprises', href: '/companies' },
    { name: 'Mon profil', href: '/profile' },
    { name: 'Mes candidatures', href: '/applications' },
  ]

  const employerLinks = [
    { name: 'Publier une offre', href: '/employer/jobs/new' },
    { name: 'Tableau de bord', href: '/employer/dashboard' },
    { name: 'S\'inscrire comme employeur', href: '/signup' },
  ]

  const companyLinks = [
    { name: 'À propos de nous', href: '/about' },
    { name: 'Contact', href: '/contact' },
    { name: 'Presse', href: '#' },
  ]

  const legalLinks = [
    { name: 'Conditions d\'utilisation', href: '/terms' },
    { name: 'Politique de confidentialité', href: '/privacy' },
  ]

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Logo & Socials */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <BriefcaseIcon className="h-8 w-8 text-blue-500" />
              <span className="text-xl font-bold text-white">AfricaJobs</span>
            </Link>
            <p className="text-gray-400 text-sm mb-4">
              Votre carrière en Afrique commence ici.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white"><Linkedin size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-white"><Twitter size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-white"><Facebook size={20} /></a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase">Candidats</h3>
            <ul className="mt-4 space-y-2">
              {jobSeekerLinks.map(link => (
                <li key={link.name}><Link to={link.href} className="text-base text-gray-400 hover:text-white">{link.name}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase">Employeurs</h3>
            <ul className="mt-4 space-y-2">
              {employerLinks.map(link => (
                <li key={link.name}><Link to={link.href} className="text-base text-gray-400 hover:text-white">{link.name}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase">Entreprise</h3>
            <ul className="mt-4 space-y-2">
              {companyLinks.map(link => (
                <li key={link.name}><Link to={link.href} className="text-base text-gray-400 hover:text-white">{link.name}</Link></li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase">Légal</h3>
            <ul className="mt-4 space-y-2">
              {legalLinks.map(link => (
                <li key={link.name}><Link to={link.href} className="text-base text-gray-400 hover:text-white">{link.name}</Link></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-800 pt-8 text-center">
          <p className="text-base text-gray-400">&copy; 2025 AfricaJobs. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  )
}
