import React from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { 
  HomeIcon, 
  SparklesIcon, 
  BriefcaseIcon, 
  UserIcon,
  ChartPieIcon,
  PlusCircleIcon,
  BuildingOffice2Icon
} from '@heroicons/react/24/outline'

export function BottomNav() {
  const { user, profile } = useAuth()

  const baseNavStyle = "flex flex-col items-center justify-center text-gray-500 hover:text-blue-600 transition-colors w-full"
  const activeNavStyle = "text-blue-600"

  const jobSeekerLinks = [
    { href: '/', icon: HomeIcon, label: 'Accueil' },
    { href: '/recommendations', icon: SparklesIcon, label: 'Pour vous' },
    { href: '/jobs', icon: BriefcaseIcon, label: 'Emplois' },
    { href: '/profile', icon: UserIcon, label: 'Profil' },
  ]
  
  const employerLinks = [
    { href: '/', icon: HomeIcon, label: 'Accueil' },
    { href: '/employer/dashboard', icon: ChartPieIcon, label: 'Dashboard' },
    { href: '/employer/jobs/new', icon: PlusCircleIcon, label: 'Publier' },
    { href: '/profile', icon: UserIcon, label: 'Profil' },
  ]

  const guestLinks = [
    { href: '/', icon: HomeIcon, label: 'Accueil' },
    { href: '/jobs', icon: BriefcaseIcon, label: 'Emplois' },
    { href: '/companies', icon: BuildingOffice2Icon, label: 'Entreprises' },
    { href: '/login', icon: UserIcon, label: 'Connexion' },
  ]

  const links = user 
    ? (profile?.user_type === 'employer' ? employerLinks : jobSeekerLinks)
    : guestLinks;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-t-lg z-30">
      <div className="flex justify-around h-16">
        {links.map(({ href, icon: Icon, label }) => (
          <NavLink
            key={href}
            to={href}
            className={({ isActive }) => `${baseNavStyle} ${isActive ? activeNavStyle : ''}`}
            end={href === '/'}
          >
            <Icon className="h-6 w-6 mb-1" />
            <span className="text-xs">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
