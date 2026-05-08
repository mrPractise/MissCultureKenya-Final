/**
 * SEO Configuration & Utilities for Miss Culture Global Kenya
 * Domain: misscultureglobalkenya.com
 * Ambassador: Susan Abong'o
 */

export const SITE_CONFIG = {
  name: 'Miss Culture Global Kenya',
  domain: 'misscultureglobalkenya.com',
  url: 'https://misscultureglobalkenya.com',
  description: 'Miss Culture Global Kenya is a cultural preservation and youth empowerment movement — showcasing Kenya\'s heritage through pageants, community programs, and global partnerships.',
  tagline: 'Kenya\'s Culture. The World\'s Stage.',
  language: 'en-KE',
  locale: 'en_KE',
  country: 'KE',
  city: 'Nairobi',
  
  // Social Media - Only active accounts
  social: {
    instagram: 'https://www.instagram.com/misscultureglobalkenya',
    tiktok: 'https://www.tiktok.com/@misscultureglobalkenya',
    facebook: 'https://www.facebook.com/misscultureglobalkenya',
    // Twitter account not active yet - removed
  },
  
  // Contact Information
  contact: {
    email: 'info@misscultureglobalkenya.com',
    phone: '+254 721 706983',
    address: {
      streetAddress: 'Nairobi',
      addressLocality: 'Nairobi',
      addressRegion: 'Nairobi County',
      postalCode: '00100',
      addressCountry: 'KE',
    },
  },
  
  // Brand Ambassador
  ambassador: {
    name: 'Susan Abong\'o',
    title: 'Brand Ambassador',
    role: 'Cultural Ambassador',
    description: 'Susan Abong\'o is the official Brand Ambassador of Miss Culture Global Kenya, representing our mission of cultural preservation and youth empowerment on the global stage.',
  },
  
  // Keywords (focused & relevant)
  keywords: [
    'Miss Culture Global Kenya',
    'Susan Abong\'o',
    'Kenya cultural ambassador',
    'Miss Kenya',
    'Kenya heritage',
    'Kenyan traditions',
    'Cultural pageant Kenya',
    'Kenya youth empowerment',
    'African cultural preservation',
    'Nairobi pageant',
    'Kenya beauty with purpose',
    'Kenya tourism',
    'Kenyan fashion',
    'Kenya global diplomacy',
    'Community outreach Kenya',
  ],
  
  // Google Verification
  googleSiteVerification: process.env.GOOGLE_SITE_VERIFICATION || '',
  googleAnalyticsId: process.env.NEXT_PUBLIC_GA_ID || '',
}

// ═══════════════════════════════════════════════════════════
// PAGE-SPECIFIC METADATA
// ═══════════════════════════════════════════════════════════

export const PAGE_METADATA = {
  home: {
    title: 'Miss Culture Global Kenya - Heritage. Empowerment. Global Impact.',
    description: 'Discover Miss Culture Global Kenya - a movement showcasing Kenya\'s rich cultural heritage through pageants, community programs, cultural diplomacy, and global partnerships. Meet our Brand Ambassador Susan Abong\'o.',
    keywords: [
      'Miss Culture Global Kenya',
      'Susan Abong\'o',
      'Kenya cultural ambassador',
      'Kenyan heritage pageant',
      'Cultural preservation',
      'Youth empowerment Kenya',
    ],
  },
  
  gallery: {
    title: 'Gallery - Miss Culture Global Kenya',
    description: 'Explore stunning photos and videos from Miss Culture Global Kenya\'s pageants, cultural events, community programs, and global diplomatic initiatives. See the moments that showcase Kenya\'s vibrant heritage.',
    keywords: [
      'Miss Culture Kenya gallery',
      'Pageant photos Kenya',
      'Cultural events Kenya',
      'Kenya heritage photos',
      'Community outreach Kenya',
      'Global diplomacy events',
    ],
  },
  
  events: {
    title: 'Events - Miss Culture Global Kenya',
    description: 'Discover upcoming Miss Culture Global Kenya events, pageants, and community programs. Register for tickets, vote for contestants, and be part of our cultural movement.',
    keywords: [
      'Miss Culture events Kenya',
      'Cultural pageant Kenya',
      'Community programs Kenya',
      'Kenya events 2024 2025',
      'Nairobi cultural events',
    ],
  },
  
  about: {
    title: 'About Miss Culture Global Kenya',
    description: 'Learn about Miss Culture Global Kenya\'s mission, vision, and impact. Meet our Brand Ambassador Susan Abong\'o and discover how we\'re preserving Kenya\'s heritage while empowering youth.',
    keywords: [
      'About Miss Culture Kenya',
      'Susan Abong\'o',
      'Mission and vision Kenya',
      'Cultural preservation movement',
      'Youth empowerment initiative',
    ],
  },
  
  ambassador: {
    title: 'Susan Abong\'o - Brand Ambassador | Miss Culture Global Kenya',
    description: 'Meet Susan Abong\'o, the official Brand Ambassador of Miss Culture Global Kenya. Discover her journey, achievements, and commitment to cultural preservation and youth empowerment.',
    keywords: [
      'Susan Abong\'o',
      'Miss Culture Kenya ambassador',
      'Kenya cultural ambassador',
      'Miss Kenya',
      'Ambassador profile',
    ],
  },
  
  contact: {
    title: 'Contact Us - Miss Culture Global Kenya',
    description: 'Get in touch with Miss Culture Global Kenya. Contact us for partnerships, sponsorships, or inquiries about our cultural programs and events.',
    keywords: [
      'Contact Miss Culture Kenya',
      'Get in touch',
      'Partnerships Kenya',
      'Sponsorship opportunities',
    ],
  },
}

// ═══════════════════════════════════════════════════════════
// STRUCTURED DATA GENERATORS
// ═══════════════════════════════════════════════════════════

export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_CONFIG.url}/#organization`,
    name: SITE_CONFIG.name,
    alternateName: 'Miss Culture Kenya',
    url: SITE_CONFIG.url,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_CONFIG.url}/official-logo.png`,
      width: 300,
      height: 300,
    },
    image: [
      `${SITE_CONFIG.url}/og-image.jpg`,
      `${SITE_CONFIG.url}/og-image-square.jpg`,
    ],
    description: SITE_CONFIG.description,
    sameAs: Object.values(SITE_CONFIG.social),
    contact: {
      '@type': 'ContactPoint',
      contactType: 'Customer Support',
      email: SITE_CONFIG.contact.email,
      telephone: SITE_CONFIG.contact.phone,
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE_CONFIG.contact.address.streetAddress,
      addressLocality: SITE_CONFIG.contact.address.addressLocality,
      addressRegion: SITE_CONFIG.contact.address.addressRegion,
      postalCode: SITE_CONFIG.contact.address.postalCode,
      addressCountry: SITE_CONFIG.contact.address.addressCountry,
    },
    founder: {
      '@type': 'Person',
      name: SITE_CONFIG.ambassador.name,
      title: SITE_CONFIG.ambassador.title,
    },
  }
}

export function generateWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_CONFIG.url}/#website`,
    url: SITE_CONFIG.url,
    name: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    publisher: {
      '@id': `${SITE_CONFIG.url}/#organization`,
    },
    inLanguage: SITE_CONFIG.locale,
    isPartOf: {
      '@id': `${SITE_CONFIG.url}/#organization`,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_CONFIG.url}/search?q={search_term_string}`,
      },
      query: 'required name=search_term_string',
    },
  }
}

export function generateAmbassadorSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${SITE_CONFIG.url}/#ambassador`,
    name: SITE_CONFIG.ambassador.name,
    jobTitle: SITE_CONFIG.ambassador.role,
    description: SITE_CONFIG.ambassador.description,
    image: `${SITE_CONFIG.url}/ambassador-susan-abongo.jpg`,
    url: `${SITE_CONFIG.url}/ambassador`,
    affiliation: {
      '@id': `${SITE_CONFIG.url}/#organization`,
    },
    sameAs: Object.values(SITE_CONFIG.social),
  }
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: SITE_CONFIG.url,
      },
      ...items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 2,
        name: item.name,
        item: item.url,
      })),
    ],
  }
}

export function generateEventSchema(event: {
  name: string
  description: string
  startDate: string
  endDate?: string
  location: string
  image: string
  url: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.name,
    description: event.description,
    image: event.image,
    startDate: event.startDate,
    endDate: event.endDate,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: event.location,
      address: {
        '@type': 'PostalAddress',
        addressLocality: SITE_CONFIG.contact.address.addressLocality,
        addressCountry: SITE_CONFIG.contact.address.addressCountry,
      },
    },
    organizer: {
      '@id': `${SITE_CONFIG.url}/#organization`,
    },
    url: event.url,
  }
}

export function generateGallerySchema(gallery: {
  title: string
  description: string
  images: { url: string; caption: string }[]
  uploadDate: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ImageGallery',
    name: gallery.title,
    description: gallery.description,
    associatedMedia: gallery.images.map(img => ({
      '@type': 'ImageObject',
      url: img.url,
      caption: img.caption,
      uploadDate: gallery.uploadDate,
    })),
    creator: {
      '@id': `${SITE_CONFIG.url}/#organization`,
    },
  }
}

export function generateFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

// ═══════════════════════════════════════════════════════════
// SOCIAL MEDIA CONFIGURATION (Instagram, TikTok, Facebook only)
// ═══════════════════════════════════════════════════════════

export const SOCIAL_HANDLES = {
  instagram: {
    handle: '@misscultureglobalkenya',
    url: SITE_CONFIG.social.instagram,
    name: 'Instagram',
  },
  tiktok: {
    handle: '@misscultureglobalkenya',
    url: SITE_CONFIG.social.tiktok,
    name: 'TikTok',
  },
  facebook: {
    handle: 'misscultureglobalkenya',
    url: SITE_CONFIG.social.facebook,
    name: 'Facebook',
  },
}

// ═══════════════════════════════════════════════════════════
// OPEN GRAPH CONFIGURATION
// ═══════════════════════════════════════════════════════════

export const OPEN_GRAPH_DEFAULTS = {
  type: 'website',
  locale: SITE_CONFIG.locale,
  siteName: SITE_CONFIG.name,
  images: [
    {
      url: `${SITE_CONFIG.url}/og-image.jpg`,
      width: 1200,
      height: 630,
      alt: `${SITE_CONFIG.name} - ${SITE_CONFIG.tagline}`,
      type: 'image/jpeg',
    },
    {
      url: `${SITE_CONFIG.url}/og-image-square.jpg`,
      width: 800,
      height: 800,
      alt: `${SITE_CONFIG.name} Logo`,
      type: 'image/jpeg',
    },
  ],
}

// ═══════════════════════════════════════════════════════════
// PERFORMANCE OPTIMIZATION HINTS
// ═══════════════════════════════════════════════════════════

export const PRECONNECT_DOMAINS = [
  'https://res.cloudinary.com', // Cloudinary CDN
  'https://www.instagram.com',
  'https://www.tiktok.com',
  'https://www.facebook.com',
]

export const PREFETCH_ROUTES = [
  '/gallery',
  '/events',
  '/ambassador',
]
