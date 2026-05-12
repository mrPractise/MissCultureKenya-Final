'use client'

import PageHeader from '@/components/PageHeader'
import KenyaUnified from '@/components/KenyaUnified'
import { useKenyaPageSettings } from '@/lib/usePageSettings'

export default function KenyaPage() {
  const { settings, loading } = useKenyaPageSettings()
  
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
        title={settings.page_title || "Kenya"}
        subtitle={settings.page_subtitle || "Our homeland, our culture, our global stage — one story told through photos."}
        backgroundImage={settings.hero_image_url || undefined}
      />
      <KenyaUnified
        showCulturalFacts={settings.show_cultural_facts}
        showRegions={settings.show_regions}
        showCommunities={settings.show_communities}
        showHeritage={settings.show_heritage}
        showAchievements={settings.show_achievements}
      />
    </div>
  )
}
