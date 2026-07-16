import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Partner With Us',
  description: 'Partner with Miss Culture Global Kenya to support cultural heritage, youth empowerment, and global cultural diplomacy — with clear sponsorship tiers and brand value.',
  alternates: { canonical: '/partnership' },
  openGraph: {
    title: 'Partnership | Miss Culture Global Kenya',
    description: 'Align your brand with heritage, purpose, and global reach through sponsorship and program partnerships.',
    url: 'https://misscultureglobalkenya.com/partnership',
    images: ['/opengraph-image'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Partnership | Miss Culture Global Kenya',
    description: 'Align your brand with heritage, purpose, and global reach through sponsorship and program partnerships.',
    images: ['/twitter-image'],
  },
}

export default function PartnershipLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
