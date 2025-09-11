import React from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { 
  UserCircleIcon,
  BriefcaseIcon,
  SparklesIcon,
  DocumentTextIcon,
  BookmarkIcon,
  ArrowRightOnRectangleIcon,
  HomeIcon,
  ChartPieIcon,
  PlusCircleIcon,
  BuildingOffice2Icon,
  InformationCircleIcon,
  PhoneIcon
} from '@heroicons/react/24/outline'

interface MobileMenuProps {
  open: boolean
  setOpen: (open: boolean) => void
}

export function MobileMenu({ open, setOpen }: MobileMenuProps) {
  const { user, profile, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    setOpen(false)
    navigate('/')
  }
  
  const handleNavigate = (path: string) => {
    navigate(path)
    setOpen(false)
  }

  const jobSeekerLinks = [
    { name: 'Accueil', href: '/', icon: HomeIcon },
    { name: 'Tableau de bord', href: '/job-seeker/dashboard', icon: ChartPieIcon },
    { name: 'Recommandations', href: '/recommendations', icon: SparklesIcon },
    { name: 'Parcourir les emplois', href: '/jobs', icon: BriefcaseIcon },
    { name: 'Entreprises', href: '/companies', icon: BuildingOffice2Icon },
    { name: 'Mes candidatures', href: '/applications', icon: DocumentTextIcon },
    { name: 'Emplois sauvegardés', href: '/saved-jobs', icon: BookmarkIcon },
    { name: 'À propos', href: '/about', icon: InformationCircleIcon },
    { name: 'Contact', href: '/contact', icon: PhoneIcon },
  ];

  const employerLinks = [
    { name: 'Accueil', href: '/', icon: HomeIcon },
    { name: 'Tableau de bord', href: '/employer/dashboard', icon: ChartPieIcon },
    { name: 'Publier une offre', href: '/employer/jobs/new', icon: PlusCircleIcon },
    { name: 'Parcourir les emplois', href: '/jobs', icon: BriefcaseIcon },
    { name: 'Entreprises', href: '/companies', icon: BuildingOffice2Icon },
    { name: 'À propos', href: '/about', icon: InformationCircleIcon },
    { name: 'Contact', href: '/contact', icon: PhoneIcon },
  ];

  const guestLinks = [
    { name: 'Accueil', href: '/', icon: HomeIcon },
    { name: 'Parcourir les emplois', href: '/jobs', icon: BriefcaseIcon },
    { name: 'Entreprises', href: '/companies', icon: BuildingOffice2Icon },
    { name: 'À propos', href: '/about', icon: InformationCircleIcon },
    { name: 'Contact', href: '/contact', icon: PhoneIcon },
  ];

  const links = user 
    ? (profile?.user_type === 'employer' ? employerLinks : jobSeekerLinks)
    : guestLinks;

  return (
    <Transition.Root show={open} as={React.Fragment}>
      <Dialog as="div" className="relative z-40 md:hidden" onClose={setOpen}>
        <Transition.Child
          as={React.Fragment}
          enter="transition-opacity ease-linear duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-linear duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
        </Transition.Child>

        <div className="fixed inset-0 z-40 flex">
          <Transition.Child
            as={React.Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <Dialog.Panel className="relative flex w-full max-w-xs flex-1 flex-col bg-white pt-5 pb-4">
              <Transition.Child
                as={React.Fragment}
                enter="ease-in-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in-out duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="absolute top-0 right-0 -mr-12 pt-2">
                  <button
                    type="button"
                    className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                    onClick={() => setOpen(false)}
                  >
                    <span className="sr-only">Close sidebar</span>
                    <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                  </button>
                </div>
              </Transition.Child>
              
              <div className="flex flex-shrink-0 items-center px-4">
                 <Link to="/" className="flex items-center space-x-2" onClick={() => setOpen(false)}>
                    <BriefcaseIcon className="h-8 w-8 text-blue-600" />
                    <span className="text-xl font-bold text-gray-900">AfricaJobs</span>
                  </Link>
              </div>

              <div className="mt-5 h-0 flex-1 overflow-y-auto">
                <nav className="space-y-1 px-2">
                  {links.map((item) => (
                    <button
                      key={item.name}
                      onClick={() => handleNavigate(item.href)}
                      className="group flex w-full items-center rounded-md px-2 py-2 text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    >
                      <item.icon
                        className="mr-4 h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                        aria-hidden="true"
                      />
                      {item.name}
                    </button>
                  ))}
                </nav>
              </div>
              
              <div className="flex flex-shrink-0 border-t border-gray-200 p-4">
                {user && profile ? (
                   <div className="w-full">
                     <button onClick={() => handleNavigate('/profile')} className="group block w-full flex-shrink-0">
                      <div className="flex items-center">
                        <div>
                           {profile.avatar_url ? (
                            <img className="inline-block h-10 w-10 rounded-full object-cover" src={profile.avatar_url} alt="" />
                          ) : (
                            <UserCircleIcon className="h-10 w-10 text-gray-400" />
                          )}
                        </div>
                        <div className="ml-3">
                          <p className="text-base font-medium text-gray-700 group-hover:text-gray-900">{profile.full_name}</p>
                          <p className="text-sm font-medium text-gray-500 group-hover:text-gray-700">Voir le profil</p>
                        </div>
                      </div>
                    </button>
                    <button
                      onClick={handleSignOut}
                      className="group mt-4 flex w-full items-center rounded-md px-2 py-2 text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    >
                      <ArrowRightOnRectangleIcon className="mr-4 h-6 w-6 text-gray-400" />
                      Déconnexion
                    </button>
                   </div>
                ) : (
                  <div className="w-full space-y-2">
                    <button onClick={() => handleNavigate('/login')} className="w-full text-center bg-white border border-blue-600 text-blue-600 px-4 py-2 rounded-lg font-medium">
                      Connexion
                    </button>
                    <button onClick={() => handleNavigate('/signup')} className="w-full text-center bg-blue-600 text-white px-4 py-2 rounded-lg font-medium">
                      S'inscrire
                    </button>
                  </div>
                )}
              </div>
            </Dialog.Panel>
          </Transition.Child>
          <div className="w-14 flex-shrink-0" aria-hidden="true"></div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
