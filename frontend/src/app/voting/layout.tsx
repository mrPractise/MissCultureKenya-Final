import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Vote for Contestants',
  description: 'Your voice shapes the stage. Vote for contestants and talent categories — transparent results and verified participation.',
  alternates: { canonical: '/voting' },
  openGraph: {
    title: 'Voting | Miss Culture Global Kenya',
    description: 'Vote for contestants and talent categories — verified participation and transparent results.',
    url: 'https://misscultureglobalkenya.com/voting',
    images: ['/opengraph-image'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Voting | Miss Culture Global Kenya',
    description: 'Vote for contestants and talent categories — verified participation and transparent results.',
    images: ['/twitter-image'],
  },
}

export default function VotingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
