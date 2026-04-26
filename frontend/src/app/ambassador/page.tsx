'use client'

import Ambassador from '@/components/Ambassador'
import PageHeader from '@/components/PageHeader'
import { useSiteSettings } from '@/lib/useSiteSettings'

export default function AmbassadorPage() {
  const settings = useSiteSettings()
  return (
    <div className="min-h-screen">
      <PageHeader
        title="The Ambassador — Susan's Journey"
        subtitle="Meet the inspiring individual who represents Kenya's cultural heritage and values on the global stage — blending the Beauty of Purpose with the Power of Heritage."
        backgroundImage={settings.ambassador_hero_image_url || undefined}
      />
      <Ambassador />
    </div>
  )
}
