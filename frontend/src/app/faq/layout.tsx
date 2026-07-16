import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Frequently Asked Questions',
  description: 'Frequently asked questions about Miss Culture Global Kenya — participation, events, voting, partnerships, and support.',
  alternates: { canonical: '/faq' },
  openGraph: {
    title: 'FAQ | Miss Culture Global Kenya',
    description: 'Quick answers about participation, events, voting, partnerships, and support.',
    url: 'https://misscultureglobalkenya.com/faq',
    images: ['/opengraph-image'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FAQ | Miss Culture Global Kenya',
    description: 'Quick answers about participation, events, voting, partnerships, and support.',
    images: ['/twitter-image'],
  },
}

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return children
}

