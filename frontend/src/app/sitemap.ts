import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://misscultureglobalkenya.com'
  const apiBase =
    process.env.API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    'https://api.misscultureglobalkenya.com'

  const pages = [
    '',
    '/about',
    '/kenya',
    '/gallery',
    '/events',
    '/voting',
    '/ambassador',
    '/partnership',
    '/contribute',
    '/faq',
    '/contact',
    '/privacy',
  ]

  const staticEntries: MetadataRoute.Sitemap = pages.map((page) => ({
    url: `${baseUrl}${page}`,
    lastModified: new Date(),
    changeFrequency: page === '' ? 'daily' : 'weekly',
    priority: page === '' ? 1 : 0.8,
  }))

  if (!apiBase) return staticEntries

  const normalize = (value: any): any[] => Array.isArray(value) ? value : (value?.results || [])

  try {
    const [eventsRes, contestantsRes] = await Promise.all([
      fetch(`${apiBase.replace(/\/$/, '')}/api/events/events/?published=true`, { next: { revalidate: 3600 } }),
      fetch(`${apiBase.replace(/\/$/, '')}/api/events/contestants/?is_active=true`, { next: { revalidate: 3600 } }),
    ])

    const eventsJson = eventsRes.ok ? await eventsRes.json() : null
    const contestantsJson = contestantsRes.ok ? await contestantsRes.json() : null

    const events = normalize(eventsJson)
    const contestants = normalize(contestantsJson)

    const dynamicEntries: MetadataRoute.Sitemap = []

    for (const evt of events) {
      if (evt?.id) {
        dynamicEntries.push({
          url: `${baseUrl}/events/${evt.id}`,
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.7,
        })
      }
    }

    for (const c of contestants) {
      const eventSlug = c?.event_slug
      const contestantSlug = c?.slug
      if (eventSlug && contestantSlug) {
        dynamicEntries.push({
          url: `${baseUrl}/voting/${eventSlug}/${contestantSlug}`,
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.6,
        })
      }
    }

    return [...staticEntries, ...dynamicEntries]
  } catch {
    return staticEntries
  }
}
