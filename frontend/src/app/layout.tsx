import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import CookieConsent from '@/components/CookieConsent'
import { Providers } from '@/components/Providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://misscultureglobalkenya.com'),
  title: {
    default: 'Miss Culture Global Kenya',
    template: '%s | Miss Culture Global Kenya'
  },
  description: 'Miss Culture Global Kenya is a cultural preservation and youth empowerment movement — showcasing Kenya’s heritage through pageants, community programs, and global partnerships.',
  keywords: [
    'Miss Culture Global Kenya',
    'Kenya Heritage',
    'Cultural Ambassador Kenya',
    'Miss Culture Kenya',
    'Kenyan Traditions',
    'Beauty with a Purpose Kenya',
    'Cultural Tourism Kenya',
    'Kenyan Fashion',
    'Miss Culture Global',
    'Kenya Tourism'
  ],
  authors: [{ name: 'Miss Culture Global Kenya' }],
  creator: 'Miss Culture Global Kenya',
  publisher: 'Miss Culture Global Kenya',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'Miss Culture Global Kenya',
    description: 'A cultural preservation and youth empowerment movement — pageants, community programs, cultural diplomacy, and global partnerships.',
    url: 'https://misscultureglobalkenya.com',
    siteName: 'Miss Culture Global Kenya',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Miss Culture Global Kenya',
      },
    ],
    locale: 'en_KE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Miss Culture Global Kenya',
    description: 'Kenya culture, heritage, and events brought to a global audience.',
    images: ['/twitter-image'],
  },
  alternates: {
    canonical: 'https://misscultureglobalkenya.com',
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'Organization',
                '@id': 'https://misscultureglobalkenya.com/#organization',
                'name': 'Miss Culture Global Kenya',
                'url': 'https://misscultureglobalkenya.com',
                'logo': {
                  '@type': 'ImageObject',
                  'url': 'https://misscultureglobalkenya.com/official-logo.png'
                },
                'description': 'Miss Culture Global Kenya is a cultural preservation and youth empowerment movement — showcasing Kenya’s heritage through pageants, community programs, and global partnerships.',
                'address': {
                  '@type': 'PostalAddress',
                  'addressLocality': 'Nairobi',
                  'addressCountry': 'KE'
                }
              },
              {
                '@type': 'WebSite',
                '@id': 'https://misscultureglobalkenya.com/#website',
                'url': 'https://misscultureglobalkenya.com',
                'name': 'Miss Culture Global Kenya',
                'publisher': { '@id': 'https://misscultureglobalkenya.com/#organization' },
                'inLanguage': 'en-KE'
              }
            ]
          }) }}
        />
        <Providers>
          <Navigation />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
          <CookieConsent />
        </Providers>
      </body>
    </html>
  )
}
