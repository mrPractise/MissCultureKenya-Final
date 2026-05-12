import type { Metadata } from 'next'

// Server-side metadata generator — runs when a crawler (WhatsApp, Facebook,
// Twitter, LinkedIn, iMessage, etc.) fetches a specific event URL. This is
// what puts the event's featured image on top of the shared link preview.

const SITE_URL = 'https://misscultureglobalkenya.com'

function getApiBase(): string {
  const raw = process.env.NEXT_PUBLIC_API_BASE_URL || ''
  const trimmed = raw.replace(/\/+$/, '')
  return trimmed.endsWith('/admin') ? trimmed.slice(0, -'/admin'.length) : trimmed
}

async function fetchEvent(id: string) {
  const base = getApiBase()
  if (!base) return null
  try {
    const res = await fetch(`${base}/api/events/events/${id}/`, {
      // Revalidate every 5 minutes so shared previews stay fresh but
      // aren't refetched for every crawler hit.
      next: { revalidate: 300 },
    })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params
  const event = await fetchEvent(id)

  const url = `${SITE_URL}/events/${id}`

  if (!event) {
    return {
      title: 'Event',
      description: 'Discover upcoming and past Miss Culture Global Kenya events — pageants, cultural showcases, and more.',
      alternates: { canonical: `/events/${id}` },
      openGraph: {
        title: 'Event | Miss Culture Global Kenya',
        description: 'Discover upcoming and past Miss Culture Global Kenya events.',
        url,
        images: ['/opengraph-image'],
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        images: ['/twitter-image'],
      },
    }
  }

  const title: string = event.title || 'Event'
  const rawDescription: string =
    event.description || event.short_description || 'Join us for this Miss Culture Global Kenya event.'
  const description =
    rawDescription.length > 200 ? `${rawDescription.slice(0, 197)}...` : rawDescription

  const featuredImage: string | undefined =
    event.featured_image_url || event.featured_image || event.image || undefined

  const images = featuredImage
    ? [{ url: featuredImage, width: 1200, height: 630, alt: title }]
    : [{ url: '/opengraph-image', width: 1200, height: 630, alt: title }]

  return {
    title,
    description,
    alternates: { canonical: `/events/${id}` },
    openGraph: {
      title: `${title} | Miss Culture Global Kenya`,
      description,
      url,
      siteName: 'Miss Culture Global Kenya',
      images,
      locale: 'en_KE',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | Miss Culture Global Kenya`,
      description,
      images: featuredImage ? [featuredImage] : ['/twitter-image'],
    },
  }
}

export default function EventDetailLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
