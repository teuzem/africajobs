import React from 'react'
import { EnvelopeIcon } from '@heroicons/react/24/outline'
import { Link } from 'react-router-dom'

export function CheckEmailPage() {
  return (
    <div className="text-center">
      <EnvelopeIcon className="mx-auto h-16 w-16 text-blue-500" />
      <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
        Vérifiez votre boîte de réception !
      </h2>
      <p className="mt-4 text-lg text-gray-600">
        Nous avons envoyé un lien de confirmation à votre adresse e-mail.
      </p>
      <p className="mt-2 text-gray-500">
        Veuillez cliquer sur ce lien pour activer votre compte AfricaJobs.
      </p>
      <div className="mt-8">
        <p className="text-sm text-gray-500">
          Vous n'avez pas reçu l'e-mail ? Vérifiez votre dossier de spam ou 
          <button className="font-medium text-blue-600 hover:text-blue-500 ml-1">
            renvoyer le lien
          </button>.
        </p>
        <Link to="/login" className="mt-6 inline-block font-medium text-blue-600 hover:text-blue-500">
            Retour à la page de connexion
        </Link>
      </div>
    </div>
  )
}
