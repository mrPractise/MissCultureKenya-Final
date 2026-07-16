import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn the story of Miss Culture Global Kenya — our mission, vision, leadership, and impact across communities in Kenya and beyond.',
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'About | Miss Culture Global Kenya',
    description: 'Mission, vision, leadership, and impact — the full story behind the cultural diplomacy movement.',
    url: 'https://misscultureglobalkenya.com/about',
    images: ['/opengraph-image'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About | Miss Culture Global Kenya',
    description: 'Mission, vision, leadership, and impact — the full story behind the cultural diplomacy movement.',
    images: ['/twitter-image'],
  },
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children
}

