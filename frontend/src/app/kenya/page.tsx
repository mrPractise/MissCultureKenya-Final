'use client'

import PageHeader from '@/components/PageHeader'
import KenyaUnified from '@/components/KenyaUnified'
import { useSiteSettings } from '@/lib/useSiteSettings'

export default function KenyaPage() {
  const settings = useSiteSettings()
  return (
    <div className="min-h-screen">
      <PageHeader
        title="Kenya"
        subtitle="Our homeland, our culture, our global stage — one story told through photos."
        backgroundImage={settings.kenya_hero_image_url || undefined}
      />
      <KenyaUnified />
    </div>
  )
}
