'use client'

import Ambassador from '@/components/Ambassador'
import PageHeader from '@/components/PageHeader'
import { useSiteSettings } from '@/lib/useSiteSettings'

export default function AmbassadorPage() {
  const settings = useSiteSettings()
  return (
    <div className="min-h-screen">
      <PageHeader
        title="Susan — Kenya's Voice on the World Stage"
        subtitle="Miss Culture Global Kenya Ambassador · Cultural diplomat · Youth champion — She does not just wear the crown, she carries an entire nation's story."
        backgroundImage={settings.ambassador_hero_image_url || undefined}
      />
      <Ambassador />
    </div>
  )
}
