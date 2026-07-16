import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch for partnerships, media requests, event inquiries, and general questions. We respond to every message.',
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'Contact | Miss Culture Global Kenya',
    description: 'Partnerships, media requests, event inquiries, and general questions — reach out and we will respond.',
    url: 'https://misscultureglobalkenya.com/contact',
    images: ['/opengraph-image'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact | Miss Culture Global Kenya',
    description: 'Partnerships, media requests, event inquiries, and general questions — reach out and we will respond.',
    images: ['/twitter-image'],
  },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}

