import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Gallery',
  description: 'The mission in motion — explore photos and videos from pageant stages, cultural events, community work, and global diplomacy.',
  alternates: { canonical: '/gallery' },
  openGraph: {
    title: 'Gallery | Miss Culture Global Kenya',
    description: 'Photos and videos that show the mission is alive — pageant nights, cultural showcases, community impact, and global reach.',
    url: 'https://misscultureglobalkenya.com/gallery',
    images: ['/opengraph-image'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gallery | Miss Culture Global Kenya',
    description: 'Photos and videos that show the mission is alive — pageant nights, cultural showcases, community impact, and global reach.',
    images: ['/twitter-image'],
  },
}

export default function GalleryLayout({ children }: { children: React.ReactNode }) {
  return children
}

