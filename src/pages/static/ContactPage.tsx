import React, { useState, useMemo } from 'react'
import { BuildingOffice2Icon, EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'
import { Spinner } from '../../components/ui/Spinner'
import { StaticPageLayout } from '../../components/Layout/StaticPageLayout'

export function ContactPage() {
  const [formData, setFormData] = useState({ fullName: '', email: '', message: '' })
  const [loading, setLoading] = useState(false)

  const breadcrumbs = useMemo(() => [{ name: 'Contact', href: '/contact' }], [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.from('contact_submissions').insert({
      full_name: formData.fullName,
      email: formData.email,
      message: formData.message,
    })

    if (error) {
      toast.error("Une erreur s'est produite. Veuillez réessayer.")
    } else {
      toast.success('Votre message a été envoyé avec succès !')
      setFormData({ fullName: '', email: '', message: '' })
    }
    setLoading(false)
  }

  return (
    <StaticPageLayout
      title="Contactez-nous"
      subtitle="Une question ? Une suggestion ? Nous sommes à votre écoute. Contactez-nous via le formulaire ou les informations ci-dessous."
      breadcrumbs={breadcrumbs}
    >
      <div className="bg-white rounded-lg shadow-xl overflow-hidden lg:grid lg:grid-cols-2 lg:gap-8">
        <div className="p-8 lg:p-12">
          <h3 className="text-2xl font-bold text-gray-900">Envoyez-nous un message</h3>
          <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 gap-y-6">
            <div>
              <label htmlFor="fullName" className="sr-only">Nom complet</label>
              <input type="text" name="fullName" id="fullName" autoComplete="name" required value={formData.fullName} onChange={handleChange} className="block w-full shadow-sm py-3 px-4 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md" placeholder="Nom complet" />
            </div>
            <div>
              <label htmlFor="email" className="sr-only">Email</label>
              <input id="email" name="email" type="email" autoComplete="email" required value={formData.email} onChange={handleChange} className="block w-full shadow-sm py-3 px-4 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md" placeholder="Email" />
            </div>
            <div>
              <label htmlFor="message" className="sr-only">Message</label>
              <textarea id="message" name="message" rows={4} required value={formData.message} onChange={handleChange} className="block w-full shadow-sm py-3 px-4 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500 border border-gray-300 rounded-md" placeholder="Votre message"></textarea>
            </div>
            <div>
              <button type="submit" disabled={loading} className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50">
                {loading ? <Spinner size="sm" /> : 'Envoyer le message'}
              </button>
            </div>
          </form>
        </div>
        <div className="p-8 lg:p-12 bg-gray-50">
          <h3 className="text-2xl font-bold text-gray-900">Nos coordonnées</h3>
          <div className="mt-6 space-y-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white">
                  <PhoneIcon className="h-6 w-6" />
                </div>
              </div>
              <div className="ml-4">
                <h4 className="text-lg font-medium text-gray-900">Téléphone</h4>
                <p className="mt-1 text-gray-600">+237 6XX XXX XXX</p>
              </div>
            </div>
            <div className="flex">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white">
                  <EnvelopeIcon className="h-6 w-6" />
                </div>
              </div>
              <div className="ml-4">
                <h4 className="text-lg font-medium text-gray-900">Email</h4>
                <p className="mt-1 text-gray-600">contact@africajobs.com</p>
              </div>
            </div>
            <div className="flex">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white">
                  <BuildingOffice2Icon className="h-6 w-6" />
                </div>
              </div>
              <div className="ml-4">
                <h4 className="text-lg font-medium text-gray-900">Adresse</h4>
                <p className="mt-1 text-gray-600">123 Rue de l'Innovation, Douala, Cameroun</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StaticPageLayout>
  )
}
