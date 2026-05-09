'use client'

import Image from 'next/image'

interface MpesaLogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

const MpesaLogo = ({ className = '', size = 'md' }: MpesaLogoProps) => {
  const sizeClasses = {
    sm: 'w-16 h-10',
    md: 'w-20 h-12',
    lg: 'w-24 h-14',
    xl: 'w-32 h-20'
  }

  return (
    <div className={`${sizeClasses[size]} ${className} relative`}>
      <Image
        src="/mpesa-logo.png"
        alt="M-Pesa"
        fill
        className="object-contain"
        sizes="(max-width: 768px) 100px, 150px"
      />
    </div>
  )
}

export default MpesaLogo
