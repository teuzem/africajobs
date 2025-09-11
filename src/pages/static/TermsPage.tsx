import React, { useMemo } from 'react'
import { StaticPageLayout } from '../../components/Layout/StaticPageLayout'

export function TermsPage() {
  const breadcrumbs = useMemo(() => [{ name: 'Conditions d\'utilisation', href: '/terms' }], [])

  return (
    <StaticPageLayout
      title="Conditions d'Utilisation"
      subtitle="Veuillez lire attentivement nos conditions d'utilisation avant d'utiliser notre service."
      breadcrumbs={breadcrumbs}
    >
      <div className="bg-white rounded-lg shadow-xl p-8 lg:p-12">
        <div className="prose prose-lg max-w-none prose-h2:font-bold prose-h2:text-gray-800 prose-a:text-blue-600 hover:prose-a:text-blue-800">
          <p className="text-gray-500">Dernière mise à jour : 28 juillet 2025</p>

          <h2>1. Acceptation des conditions</h2>
          <p>
            En accédant et en utilisant le site web AfricaJobs (le "Service"), vous acceptez d'être lié par ces Conditions d'Utilisation ("Conditions"). Si vous n'êtes pas d'accord avec une partie des conditions, vous ne pouvez pas accéder au Service.
          </p>

          <h2>2. Description du Service</h2>
          <p>
            AfricaJobs est une plateforme qui connecte les chercheurs d'emploi avec les employeurs en Afrique. Nous utilisons des algorithmes pour fournir des recommandations d'emploi.
          </p>

          <h2>3. Comptes utilisateurs</h2>
          <p>
            Lorsque vous créez un compte chez nous, vous devez nous fournir des informations exactes, complètes et à jour. Vous êtes responsable de la sauvegarde du mot de passe que vous utilisez pour accéder au Service.
          </p>

          <h2>4. Contenu</h2>
          <p>
            Notre Service vous permet de publier, lier, stocker, partager et rendre disponible certaines informations, textes, graphiques, ou autre matériel ("Contenu"). Vous êtes responsable du Contenu que vous publiez sur le Service, y compris sa légalité, sa fiabilité et sa pertinence.
          </p>

          <h2>5. Utilisation interdite</h2>
          <p>
            Vous acceptez de ne pas utiliser le Service :
          </p>
          <ul>
            <li>D'une manière qui viole toute loi ou réglementation applicable.</li>
            <li>Pour exploiter, nuire ou tenter d'exploiter ou de nuire à des mineurs de quelque manière que ce soit.</li>
            <li>Pour transmettre, ou obtenir l'envoi de, tout matériel publicitaire ou promotionnel, y compris tout "courrier indésirable", "chaîne de lettres", "spam", ou toute autre sollicitation similaire.</li>
          </ul>

          <h2>6. Résiliation</h2>
          <p>
            Nous pouvons résilier ou suspendre votre compte immédiatement, sans préavis ni responsabilité, pour quelque raison que ce soit, y compris, sans s'y limiter, si vous violez les Conditions.
          </p>

          <h2>7. Limitation de responsabilité</h2>
          <p>
            En aucun cas AfricaJobs, ni ses administrateurs, employés, partenaires, agents, fournisseurs ou affiliés, ne seront responsables de tout dommage indirect, accessoire, spécial, consécutif ou punitif.
          </p>
          
          <h2>8. Contactez-nous</h2>
          <p>
            Si vous avez des questions sur ces Conditions, veuillez nous contacter à <a href="mailto:legal@africajobs.com">legal@africajobs.com</a>.
          </p>
        </div>
      </div>
    </StaticPageLayout>
  )
}
