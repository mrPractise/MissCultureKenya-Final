'use client'

interface MpesaLogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'square' | 'rounded'
}

const MpesaLogo = ({ className = '', size = 'md', variant = 'rounded' }: MpesaLogoProps) => {
  const sizeClasses = {
    sm: 'w-16 h-10',
    md: 'w-20 h-12',
    lg: 'w-24 h-14',
    xl: 'w-32 h-20'
  }

  const borderRadius = variant === 'square' ? '0' : '12'

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <svg viewBox="0 0 160 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Green rounded rectangle background */}
        <rect x="0" y="0" width="160" height="100" rx={borderRadius} fill="#00A650" />
        
        {/* White "m" text */}
        <text x="25" y="68" fontFamily="Arial, sans-serif" fontSize="42" fontWeight="bold" fill="white">m</text>
        
        {/* Phone icon (rectangle with M shape inside) */}
        <rect x="58" y="28" width="22" height="44" rx="3" fill="white" stroke="white" strokeWidth="2"/>
        <path d="M64 40 L69 50 L74 40" stroke="#00A650" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        
        {/* White "pesa" text */}
        <text x="88" y="68" fontFamily="Arial, sans-serif" fontSize="42" fontWeight="bold" fill="white">pesa</text>
      </svg>
    </div>
  )
}

export default MpesaLogo
