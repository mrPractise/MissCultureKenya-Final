'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'

// Google Analytics measurement ID (override via NEXT_PUBLIC_GA_ID if needed)
const GA_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-KR0YM42WCL'
const COOKIE_CONSENT_KEY = 'mcgk_cookie_consent'

/**
 * Loads Google Analytics (gtag.js) only after the visitor has accepted cookies.
 * Listens for the `mcgk-consent-changed` event (same tab) and the `storage`
 * event (other tabs) so GA starts immediately on acceptance without a reload.
 */
export default function GoogleAnalytics() {
  const [consented, setConsented] = useState(false)

  useEffect(() => {
    const check = () => setConsented(localStorage.getItem(COOKIE_CONSENT_KEY) === 'accepted')
    check()
    window.addEventListener('mcgk-consent-changed', check)
    window.addEventListener('storage', check)
    return () => {
      window.removeEventListener('mcgk-consent-changed', check)
      window.removeEventListener('storage', check)
    }
  }, [])

  if (!GA_ID || !consented) return null

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}');
        `}
      </Script>
    </>
  )
}
