'use client'

interface MpesaLogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const MpesaLogo = ({ className = '', size = 'md' }: MpesaLogoProps) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  }

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Green circle background */}
        <circle cx="50" cy="50" r="48" fill="#00A650" />
        {/* White M shape stylized */}
        <path 
          d="M25 70 L25 35 L35 35 L50 55 L65 35 L75 35 L75 70 L65 70 L65 50 L52 68 L48 68 L35 50 L35 70 Z" 
          fill="white"
        />
        {/* Decorative elements */}
        <circle cx="50" cy="50" r="44" stroke="white" strokeWidth="2" fill="none" opacity="0.3" />
      </svg>
    </div>
  )
}

export default MpesaLogo
