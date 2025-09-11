import React from 'react'
import { Header } from './Header'
import { Footer } from './Footer'
import { BottomNav } from './BottomNav'

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-grow pb-20 md:pb-0">{children}</main>
      <BottomNav />
      <Footer />
    </div>
  )
}
