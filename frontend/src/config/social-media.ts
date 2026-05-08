/**
 * Social Media Configuration for Miss Culture Global Kenya
 * Active Platforms: Instagram, TikTok, Facebook
 * Ambassador: Susan Abong'o
 */

export const SOCIAL_MEDIA_CONFIG = {
  // ═══════════════════════════════════════════════════════════
  // INSTAGRAM
  // ═══════════════════════════════════════════════════════════
  instagram: {
    handle: '@misscultureglobalkenya',
    url: 'https://www.instagram.com/misscultureglobalkenya',
    name: 'Instagram',
    active: true,
    followers: 'Growing Community',
    content: [
      'Behind-the-scenes from pageants',
      'Cultural heritage showcases',
      'Ambassador Susan Abong\'o updates',
      'Community outreach programs',
      'Event announcements',
      'Cultural tips and stories'
    ],
    postFrequency: '4-5 times per week'
  },

  // ═══════════════════════════════════════════════════════════
  // TIKTOK
  // ═══════════════════════════════════════════════════════════
  tiktok: {
    handle: '@misscultureglobalkenya',
    url: 'https://www.tiktok.com/@misscultureglobalkenya',
    name: 'TikTok',
    active: true,
    followers: 'Growing Community',
    content: [
      'Quick cultural education videos',
      'Pageant highlights and performances',
      'Ambassador Susan Abong\'o features',
      'Dance and music from Kenya',
      'Community event snippets',
      'Trending content with cultural twist'
    ],
    postFrequency: '3-5 times per week',
    videoLength: '15-60 seconds typical'
  },

  // ═══════════════════════════════════════════════════════════
  // FACEBOOK
  // ═══════════════════════════════════════════════════════════
  facebook: {
    handle: 'misscultureglobalkenya',
    url: 'https://www.facebook.com/misscultureglobalkenya',
    name: 'Facebook',
    active: true,
    followers: 'Growing Community',
    content: [
      'Event announcements and details',
      'Long-form stories and updates',
      'Photo galleries from events',
      'Ambassador Susan Abong\'o interviews',
      'Community stories and testimonials',
      'Ticket information and registrations'
    ],
    postFrequency: '3-4 times per week'
  },

  // ═══════════════════════════════════════════════════════════
  // AMBASSADOR SOCIAL PRESENCE
  // ═══════════════════════════════════════════════════════════
  ambassador: {
    name: 'Susan Abong\'o',
    title: 'Brand Ambassador',
    role: 'Cultural Ambassador',
    bio: 'Official Brand Ambassador of Miss Culture Global Kenya. Passionate about preserving Kenya\'s cultural heritage and empowering youth.',
    profileImage: '/ambassador-susan-abongo.jpg',
    socialHandle: 'susan_abongo', // Optional - if she has personal social media
  },

  // ═══════════════════════════════════════════════════════════
  // SOCIAL MEDIA STRATEGY HASHTAGS
  // ═══════════════════════════════════════════════════════════
  hashtags: {
    primary: [
      '#MissCultureGlobalKenya',
      '#SusanAbongo',
      '#KenyaCulture',
      '#CulturalHeritage',
    ],
    secondary: [
      '#KenyanTraditions',
      '#CulturalPreservation',
      '#YouthEmpowerment',
      '#KeepingKenyaAlive',
      '#AfricanCulture',
      '#GlobalDiplomacy',
      '#CommunityOutreach',
      '#PageantLife',
    ],
    trending: [
      '#Kenya',
      '#Nairobi',
      '#AfricanBeauty',
      '#CulturalPride',
      '#MissCulture',
    ]
  },

  // ═══════════════════════════════════════════════════════════
  // SOCIAL MEDIA LINKS FOR FOOTER & NAVIGATION
  // ═══════════════════════════════════════════════════════════
  socialLinks: [
    {
      name: 'Instagram',
      url: 'https://www.instagram.com/misscultureglobalkenya',
      icon: 'instagram',
      handle: '@misscultureglobalkenya'
    },
    {
      name: 'TikTok',
      url: 'https://www.tiktok.com/@misscultureglobalkenya',
      icon: 'tiktok',
      handle: '@misscultureglobalkenya'
    },
    {
      name: 'Facebook',
      url: 'https://www.facebook.com/misscultureglobalkenya',
      icon: 'facebook',
      handle: 'misscultureglobalkenya'
    }
  ],

  // ═══════════════════════════════════════════════════════════
  // SOCIAL MEDIA ICONS (SVG Component Names)
  // ═══════════════════════════════════════════════════════════
  icons: {
    instagram: 'InstagramIcon',
    tiktok: 'TikTokIcon',
    facebook: 'FacebookIcon',
  },

  // ═══════════════════════════════════════════════════════════
  // SOCIAL SHARE TEMPLATES
  // ═══════════════════════════════════════════════════════════
  shareTemplates: {
    gallery: 'Check out the amazing photos from Miss Culture Global Kenya! Meet our Brand Ambassador Susan Abong\'o 🇰🇪 #MissCultureGlobalKenya #SusanAbongo #KenyaCulture',
    event: 'Join us for an unforgettable event showcasing Kenya\'s vibrant culture! Hosted by Miss Culture Global Kenya with Brand Ambassador Susan Abong\'o 🎉 #MissCultureGlobalKenya #Events #Kenya',
    community: 'Be part of our mission to preserve Kenya\'s heritage and empower our youth. Miss Culture Global Kenya - with Brand Ambassador Susan Abong\'o 💚 #CommunityOutreach #YouthEmpowerment',
  },

  // ═══════════════════════════════════════════════════════════
  // PLATFORM-SPECIFIC METRICS TO TRACK
  // ═══════════════════════════════════════════════════════════
  analytics: {
    instagram: [
      'Engagement rate',
      'Reach',
      'Impressions',
      'Profile visits',
      'Website clicks',
      'Hashtag performance'
    ],
    tiktok: [
      'Video views',
      'Engagement rate',
      'Shares',
      'Comments sentiment',
      'Follower growth',
      'Sound usage'
    ],
    facebook: [
      'Engagement rate',
      'Reach',
      'Post clicks',
      'Event signups',
      'Link clicks',
      'Share count'
    ]
  }
}

export default SOCIAL_MEDIA_CONFIG
