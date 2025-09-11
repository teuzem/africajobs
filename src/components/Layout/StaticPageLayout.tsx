import React from 'react'
import { Breadcrumbs, BreadcrumbItem } from '../ui/Breadcrumbs'

interface StaticPageLayoutProps {
  title: string
  subtitle: string
  breadcrumbs: BreadcrumbItem[]
  children: React.ReactNode
}

export function StaticPageLayout({ title, subtitle, breadcrumbs, children }: StaticPageLayoutProps) {
  return (
    <div className="bg-gray-50">
      {/* Header Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="pb-8 border-b border-gray-200">
            <Breadcrumbs items={breadcrumbs} />
          </div>
          <div className="pt-10">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
              {title}
            </h1>
            <p className="mt-6 text-xl text-gray-500 max-w-3xl">
              {subtitle}
            </p>
          </div>
        </div>
      </div>
      
      {/* Content Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </div>
    </div>
  )
}
