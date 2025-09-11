import React, { useState } from 'react'
import { BuildingOfficeIcon, EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'
import { Spinner } from '../../components/ui/Spinner'

export function ContactPage() {
  const [formData, setFormData] = useState({ fullName: '', email: '', message: '' })
  const [loading, setLoading] = useState(false)

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
    <div className="bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg mx-auto">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Contactez-nous</h2>
          <p className="mt-4 text-lg text-gray-500">
            Nous sommes là pour vous aider. N'hésitez pas à nous contacter pour toute question ou suggestion.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2">
          <div className="rounded-lg bg-gray-50 p-6">
            <div className="flex items-center">
              <PhoneIcon className="h-6 w-6 text-blue-600" />
              <h3 className="ml-3 text-lg font-medium text-gray-900">Téléphone</h3>
            </div>
            <p className="mt-4 text-gray-500">+237 6XX XXX XXX</p>
          </div>
          <div className="rounded-lg bg-gray-50 p-6">
            <div className="flex items-center">
              <EnvelopeIcon className="h-6 w-6 text-blue-600" />
              <h3 className="ml-3 text-lg font-medium text-gray-900">Email</h3>
            </div>
            <p className="mt-4 text-gray-500">contact@africajobs.com</p>
          </div>
        </div>

        <div className="mt-8 rounded-lg bg-gray-50 p-6">
          <div className="flex items-center">
            <BuildingOfficeIcon className="h-6 w-6 text-blue-600" />
            <h3 className="ml-3 text-lg font-medium text-gray-900">Adresse</h3>
          </div>
          <p className="mt-4 text-gray-500">
            123 Rue de l'Innovation, Douala, Cameroun
          </p>
        </div>

        <div className="mt-12">
          <h3 className="text-2xl font-bold text-center text-gray-900">Envoyez-nous un message</h3>
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
              <textarea id="message" name="message" rows={4} required value={formData.message} onChange={handleChange} className="block w-full shadow-sm py-3 px-4 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500 border border-gray-300 rounded-md" placeholder="Message"></textarea>
            </div>
            <div>
              <button type="submit" disabled={loading} className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50">
                {loading ? <Spinner size="sm" /> : 'Envoyer'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
