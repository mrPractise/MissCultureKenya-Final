'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import apiClient from '@/lib/api'

interface MpesaLogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

const MpesaLogo = ({ className = '', size = 'md' }: MpesaLogoProps) => {
  const [logoUrl, setLogoUrl] = useState<string | null>(null)

  useEffect(() => {
    async function loadMpesaLogo() {
      try {
        const data = await apiClient.getSiteSettings()
        // Use mpesa_logo from backend, fallback to local file
        const logo = data?.mpesa_logo_url || '/mpesa-logo.png'
        if (logo) setLogoUrl(logo)
      } catch {
        // Fallback to local file
        setLogoUrl('/mpesa-logo.png')
      }
    }
    loadMpesaLogo()
  }, [])

  const sizeClasses = {
    sm: 'w-16 h-10',
    md: 'w-20 h-12',
    lg: 'w-24 h-14',
    xl: 'w-32 h-20'
  }

  if (!logoUrl) {
    return <div className={`${sizeClasses[size]} ${className} bg-gray-200 rounded animate-pulse`} />
  }

  return (
    <div className={`${sizeClasses[size]} ${className} relative`}>
      <Image
        src={logoUrl}
        alt="M-Pesa"
        fill
        className="object-contain"
        sizes="(max-width: 768px) 100px, 150px"
      />
    </div>
  )
}

export default MpesaLogo
