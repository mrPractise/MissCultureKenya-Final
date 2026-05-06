import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Read how Miss Culture Global Kenya collects, uses, and protects your information.',
  alternates: { canonical: '/privacy' },
  openGraph: {
    title: 'Privacy Policy | Miss Culture Global Kenya',
    description: 'How we collect, use, and protect your information.',
    url: 'https://misscultureglobalkenya.com/privacy',
    images: ['/opengraph-image'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Privacy Policy | Miss Culture Global Kenya',
    description: 'How we collect, use, and protect your information.',
    images: ['/twitter-image'],
  },
}

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return children
}

