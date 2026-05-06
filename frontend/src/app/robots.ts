import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api-test/', '/admin/'], // Adjust as needed
    },
    sitemap: 'https://misscultureglobalkenya.com/sitemap.xml',
  }
}
