import React from 'react'

interface PasswordStrengthIndicatorProps {
  password?: string
}

const checkPasswordStrength = (password: string) => {
  let score = 0
  if (!password) return 0

  if (password.length >= 8) score++
  if (password.length >= 12) score++
  if (/\d/.test(password)) score++
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++

  return score
}

export function PasswordStrengthIndicator({ password = '' }: PasswordStrengthIndicatorProps) {
  const score = checkPasswordStrength(password)
  
  const strengthLevels = [
    { text: '', color: 'bg-gray-200' }, // score 0
    { text: 'Très faible', color: 'bg-red-500' }, // score 1
    { text: 'Faible', color: 'bg-orange-500' }, // score 2
    { text: 'Moyen', color: 'bg-yellow-500' }, // score 3
    { text: 'Fort', color: 'bg-green-500' }, // score 4
    { text: 'Très fort', color: 'bg-emerald-500' }, // score 5
  ]

  const currentStrength = strengthLevels[score]

  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs font-medium text-gray-700">Force du mot de passe</span>
        <span className="text-xs font-bold text-gray-800">{currentStrength.text}</span>
      </div>
      <div className="flex w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="w-1/5">
            {score > i && <div className={`h-full ${currentStrength.color} rounded-full`}></div>}
          </div>
        ))}
      </div>
    </div>
  )
}
