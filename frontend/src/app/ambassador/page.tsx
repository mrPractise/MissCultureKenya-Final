'use client'

import Ambassador from '@/components/Ambassador'
import PageHeader from '@/components/PageHeader'
import { useAmbassadorPageSettings } from '@/lib/usePageSettings'

export default function AmbassadorPage() {
  const { settings, loading } = useAmbassadorPageSettings()
  
  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="h-96 bg-gray-200 animate-pulse" />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen">
      <PageHeader
        title={settings.page_title || "Susan — Kenya's Voice on the World Stage"}
        subtitle={settings.page_subtitle || "Miss Culture Global Kenya Ambassador · Cultural diplomat · Youth champion"}
        backgroundImage={settings.hero_image_url || undefined}
      />
      <Ambassador />
    </div>
  )
}
