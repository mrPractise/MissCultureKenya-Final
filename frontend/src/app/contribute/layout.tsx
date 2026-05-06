import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contribute',
  description: 'Give to culture and empower a generation. Support heritage preservation, youth programs, and community development in Kenya.',
  alternates: { canonical: '/contribute' },
  openGraph: {
    title: 'Contribute | Miss Culture Global Kenya',
    description: 'Support heritage preservation, youth programs, and community development. Every contribution counts.',
    url: 'https://misscultureglobalkenya.com/contribute',
    images: ['/opengraph-image'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contribute | Miss Culture Global Kenya',
    description: 'Support heritage preservation, youth programs, and community development. Every contribution counts.',
    images: ['/twitter-image'],
  },
}

export default function ContributeLayout({ children }: { children: React.ReactNode }) {
  return children
}

