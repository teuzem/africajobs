import React from 'react'

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  color?: string
}

export function Spinner({ size = 'md', color = 'border-blue-600' }: SpinnerProps) {
  const sizeClasses = {
    sm: 'h-5 w-5',
    md: 'h-8 w-8',
    lg: 'h-16 w-16',
  }

  return (
    <div className={`animate-spin rounded-full border-b-2 ${sizeClasses[size]} ${color}`}></div>
  )
}
