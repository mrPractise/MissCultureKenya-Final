import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Miss Culture Global Kenya - Embodying the Spirit of Kenya',
  description: 'Official website of Susan, Kenya\'s cultural ambassador to the world. Celebrating Kenya\'s heritage, culture, and global presence.',
  keywords: 'Kenya, culture, ambassador, Susan, Miss Culture Global Kenya, heritage, tradition',
  authors: [{ name: 'Miss Culture Global Kenya' }],
  openGraph: {
    title: 'Miss Culture Global Kenya - Embodying the Spirit of Kenya',
    description: 'Official website of Susan, Kenya\'s cultural ambassador to the world.',
    type: 'website',
    locale: 'en_US',
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
        <Navigation />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}