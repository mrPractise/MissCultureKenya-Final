import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Ambassador',
  description: 'Meet the ambassador and explore the journey — cultural diplomacy, community programs, and storytelling that represents Kenya on the global stage.',
  alternates: { canonical: '/ambassador' },
  openGraph: {
    title: 'Ambassador | Miss Culture Global Kenya',
    description: 'Meet the ambassador and explore the journey — cultural diplomacy, community programs, and storytelling.',
    url: 'https://misscultureglobalkenya.com/ambassador',
    images: ['/opengraph-image'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ambassador | Miss Culture Global Kenya',
    description: 'Meet the ambassador and explore the journey — cultural diplomacy, community programs, and storytelling.',
    images: ['/twitter-image'],
  },
}

export default function AmbassadorLayout({ children }: { children: React.ReactNode }) {
  return children
}

