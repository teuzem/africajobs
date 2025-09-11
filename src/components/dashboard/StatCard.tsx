import React from 'react'

interface StatCardProps {
  icon: React.ElementType
  label: string
  value: string | number
  change?: string
  changeType?: 'increase' | 'decrease'
}

export function StatCard({ icon: Icon, label, value, change, changeType }: StatCardProps) {
  const changeColor = changeType === 'increase' ? 'text-green-600' : 'text-red-600'

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <div className="bg-blue-100 rounded-md p-3">
          <Icon className="h-6 w-6 text-blue-600" />
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
      {change && (
        <div className="mt-4 flex space-x-1 text-sm">
          <span className={changeColor}>{change}</span>
          <span className="text-gray-500">depuis le mois dernier</span>
        </div>
      )}
    </div>
  )
}
