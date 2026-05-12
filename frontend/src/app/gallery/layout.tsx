import type { Metadata } from 'next'

// Server-side metadata generator — fetches the gallery hero image from the
// backend so that when someone shares /gallery on WhatsApp, Facebook,
// Twitter, or iMessage, the preview shows a real photo from the gallery
// instead of the generic site banner.

const SITE_URL = 'https://misscultureglobalkenya.com'

function getApiBase(): string {
  const raw = process.env.NEXT_PUBLIC_API_BASE_URL || ''
  const trimmed = raw.replace(/\/+$/, '')
  return trimmed.endsWith('/admin') ? trimmed.slice(0, -'/admin'.length) : trimmed
}

async function fetchGallerySettings() {
  const base = getApiBase()
  if (!base) return null
  try {
    const res = await fetch(`${base}/api/main/settings/gallery/`, {
      next: { revalidate: 600 },
    })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await fetchGallerySettings()

  const title: string = settings?.page_title || 'Gallery'
  const description: string =
    settings?.page_subtitle ||
    'The mission in motion — explore photos and videos from pageant stages, cultural events, community work, and global diplomacy.'

  const heroImage: string | undefined =
    settings?.hero_image_url || settings?.hero_image || undefined

  const images = heroImage
    ? [{ url: heroImage, width: 1200, height: 630, alt: 'Miss Culture Global Kenya Gallery' }]
    : [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Miss Culture Global Kenya Gallery' }]

  return {
    title,
    description,
    alternates: { canonical: '/gallery' },
    openGraph: {
      title: `${title} | Miss Culture Global Kenya`,
      description,
      url: `${SITE_URL}/gallery`,
      siteName: 'Miss Culture Global Kenya',
      images,
      locale: 'en_KE',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | Miss Culture Global Kenya`,
      description,
      images: heroImage ? [heroImage] : ['/twitter-image'],
    },
  }
}

export default function GalleryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
