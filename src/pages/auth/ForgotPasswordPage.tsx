import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { CheckCircleIcon } from '@heroicons/react/24/solid'
import { AuthFAQ } from '../../components/Auth/AuthFAQ'

const faqItems = [
  { question: "Je n'ai pas reçu l'e-mail de réinitialisation, que faire ?", answer: "Veuillez patienter quelques minutes et vérifier votre dossier de courrier indésirable (spam). Si vous ne l'avez toujours pas reçu, essayez de renvoyer la demande." },
  { question: "Le lien de réinitialisation est-il sécurisé ?", answer: "Oui, le lien est unique, à usage unique et expire après un certain temps pour garantir la sécurité de votre compte." }
]

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const { sendPasswordResetEmail } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    const { error } = await sendPasswordResetEmail(email)

    if (error) {
      setError("Une erreur s'est produite. Veuillez réessayer.")
    } else {
      setMessage("Si un compte existe pour cette adresse, un e-mail de réinitialisation a été envoyé.")
    }

    setLoading(false)
  }

  return (
    <>
      <div>
        <h2 className="text-3xl font-extrabold text-gray-900">
          Mot de passe oublié ?
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Entrez votre adresse e-mail et nous vous enverrons un lien pour réinitialiser votre mot de passe.
        </p>
      </div>

      {message ? (
        <div className="mt-8 text-center bg-green-50 p-6 rounded-lg">
          <CheckCircleIcon className="h-12 w-12 text-green-500 mx-auto" />
          <p className="mt-4 text-green-800">{message}</p>
          <Link to="/login" className="mt-6 inline-block font-medium text-blue-600 hover:text-blue-500">
            Retour à la connexion
          </Link>
        </div>
      ) : (
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Adresse e-mail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Envoi en cours...' : 'Envoyer le lien de réinitialisation'}
            </button>
          </div>
        </form>
      )}
      <AuthFAQ items={faqItems} />
    </>
  )
}
