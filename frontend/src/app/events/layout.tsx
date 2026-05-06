import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Events',
  description: 'Explore upcoming and past events — pageants, cultural showcases, workshops, and diplomatic forums. See dates, venues, and ticket details.',
  alternates: { canonical: '/events' },
  openGraph: {
    title: 'Events | Miss Culture Global Kenya',
    description: 'Explore upcoming and past events — pageants, cultural showcases, workshops, and diplomatic forums.',
    url: 'https://misscultureglobalkenya.com/events',
    images: ['/opengraph-image'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Events | Miss Culture Global Kenya',
    description: 'Explore upcoming and past events — pageants, cultural showcases, workshops, and diplomatic forums.',
    images: ['/twitter-image'],
  },
}

export default function EventsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
