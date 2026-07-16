import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Read the terms of service for Miss Culture Global Kenya — participation guidelines, event rules, and user agreements.',
  alternates: { canonical: '/terms' },
  openGraph: {
    title: 'Terms of Service | Miss Culture Global Kenya',
    description: 'Participation guidelines, event rules, and user agreements.',
    url: 'https://misscultureglobalkenya.com/terms',
    images: ['/opengraph-image'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Terms of Service | Miss Culture Global Kenya',
    description: 'Participation guidelines, event rules, and user agreements.',
    images: ['/twitter-image'],
  },
}

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return children
}
