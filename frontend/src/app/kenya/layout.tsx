import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kenya',
  description: 'Discover Kenya’s regions, communities, and cultural heritage — stories, traditions, and achievements that shape our identity on the global stage.',
  alternates: { canonical: '/kenya' },
  openGraph: {
    title: 'Kenya | Miss Culture Global Kenya',
    description: 'Regions, communities, heritage, and achievements — explore the depth and beauty of Kenya’s story.',
    url: 'https://misscultureglobalkenya.com/kenya',
    images: ['/opengraph-image'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kenya | Miss Culture Global Kenya',
    description: 'Regions, communities, heritage, and achievements — explore the depth and beauty of Kenya’s story.',
    images: ['/twitter-image'],
  },
}

export default function KenyaLayout({ children }: { children: React.ReactNode }) {
  return children
}

