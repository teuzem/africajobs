import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { 
  UserCircleIcon, 
  ChevronDownIcon,
  MagnifyingGlassIcon,
  BriefcaseIcon,
  Bars3Icon,
  BuildingOffice2Icon
} from '@heroicons/react/24/outline'
import { Menu, Transition } from '@headlessui/react'
import { MobileMenu } from './MobileMenu'
import { Notifications } from './Notifications'

export function Header() {
  const { user, profile, signOut } = useAuth()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/jobs?search=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left side: Hamburger (mobile) & Logo */}
            <div className="flex items-center space-x-4">
              <button
                type="button"
                className="md:hidden p-2 text-gray-500 hover:text-gray-700"
                onClick={() => setMobileMenuOpen(true)}
              >
                <Bars3Icon className="h-6 w-6" />
              </button>
              <Link to="/" className="flex items-center space-x-2">
                <BriefcaseIcon className="h-8 w-8 text-blue-600" />
                <span className="text-xl font-bold text-gray-900">AfricaJobs</span>
              </Link>
            </div>

            {/* Middle nav */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/jobs" className="text-gray-700 hover:text-blue-600 font-medium">Emplois</Link>
              <Link to="/companies" className="text-gray-700 hover:text-blue-600 font-medium">Entreprises</Link>
              {profile?.user_type === 'job_seeker' && (
                <Link to="/recommendations" className="text-gray-700 hover:text-blue-600 font-medium">Recommandations</Link>
              )}
              <Link to="/about" className="text-gray-700 hover:text-blue-600 font-medium">À propos</Link>
              <Link to="/contact" className="text-gray-700 hover:text-blue-600 font-medium">Contact</Link>
            </nav>

            {/* Right side: User Menu */}
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <Notifications />
                  <Menu as="div" className="relative">
                    <Menu.Button className="flex items-center space-x-2 text-gray-700 hover:text-gray-900">
                      <div className="flex items-center space-x-2">
                        {profile?.avatar_url ? (
                          <img
                            src={profile.avatar_url}
                            alt={profile.full_name || ''}
                            className="h-8 w-8 rounded-full object-cover"
                          />
                        ) : (
                          <UserCircleIcon className="h-8 w-8 text-gray-400" />
                        )}
                        <span className="hidden lg:block font-medium">
                          {profile?.full_name?.split(' ')[0]}
                        </span>
                        <ChevronDownIcon className="h-4 w-4" />
                      </div>
                    </Menu.Button>

                    <Transition
                      as={React.Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="px-4 py-3">
                          <p className="text-sm font-medium text-gray-900 truncate">{profile?.full_name}</p>
                          <p className="text-sm text-gray-500 truncate">{profile?.email}</p>
                        </div>
                        <div className="border-t border-gray-100"></div>
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to="/dashboard"
                              className={`${active ? 'bg-gray-100' : ''} block px-4 py-2 text-sm text-gray-700`}
                            >
                              Tableau de bord
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to="/profile"
                              className={`${active ? 'bg-gray-100' : ''} block px-4 py-2 text-sm text-gray-700`}
                            >
                              Mon Profil
                            </Link>
                          )}
                        </Menu.Item>
                        {profile?.user_type === 'job_seeker' && (
                          <>
                            <Menu.Item>
                              {({ active }) => (
                                <Link
                                  to="/applications"
                                  className={`${active ? 'bg-gray-100' : ''} block px-4 py-2 text-sm text-gray-700`}
                                >
                                  Mes Candidatures
                                </Link>
                              )}
                            </Menu.Item>
                            <Menu.Item>
                              {({ active }) => (
                                <Link
                                  to="/saved-jobs"
                                  className={`${active ? 'bg-gray-100' : ''} block px-4 py-2 text-sm text-gray-700`}
                                >
                                  Emplois Sauvegardés
                                </Link>
                              )}
                            </Menu.Item>
                          </>
                        )}
                         {profile?.user_type === 'employer' && (
                          <Menu.Item>
                            {({ active }) => (
                              <Link
                                to="/employer/jobs/new"
                                className={`${active ? 'bg-gray-100' : ''} block px-4 py-2 text-sm text-gray-700`}
                              >
                                Publier une offre
                              </Link>
                            )}
                          </Menu.Item>
                        )}
                        <div className="border-t border-gray-100"></div>
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={handleSignOut}
                              className={`${active ? 'bg-gray-100' : ''} block w-full text-left px-4 py-2 text-sm text-gray-700`}
                            >
                              Déconnexion
                            </button>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-blue-600 font-medium"
                  >
                    Connexion
                  </Link>
                  <Link
                    to="/signup"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium"
                  >
                    S'inscrire
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      <MobileMenu open={mobileMenuOpen} setOpen={setMobileMenuOpen} />
    </>
  )
}
