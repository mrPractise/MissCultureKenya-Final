'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  MapPin, Users, Landmark, Trophy, Music, Palette, ChevronDown,
  Volume2, Mountain, Plane, Lightbulb, Camera, BookOpen, Sparkles,
  Utensils, ShieldCheck, Heart, Waves
} from 'lucide-react'
import apiClient from '@/lib/api'
import { useSiteSettings } from '@/lib/useSiteSettings'

type GalleryPhoto = {
  id: number
  image_url: string | null
  caption: string
  order: number
}

type Region = {
  id: number
  name: string
  description: string
  image?: string
  image_url?: string
  gallery_photos?: GalleryPhoto[]
}

type Community = {
  id: number
  name: string
  region: string
  description: string
  image?: string
  image_url?: string
  gallery_photos?: GalleryPhoto[]
}

type Heritage = {
  id: number
  title: string
  heritage_type: string
  description: string
  image?: string | null
  image_url?: string | null
  gallery_photos?: GalleryPhoto[]
}

type Achievement = {
  id: number
  title: string
  achievement_type: string
  description: string
  year: number
  image?: string
  image_url?: string
  gallery_photos?: GalleryPhoto[]
}

type DiscoverPayload = {
  regions: Region[]
  communities: Community[]
  heritage: Heritage[]
  achievements: Achievement[]
}

/* ── helpers ── */
const getImage = (item: { image?: string | null; image_url?: string | null }) =>
  item.image_url || item.image || ''

const getGalleryImages = (item: { gallery_photos?: GalleryPhoto[] }) =>
  (item.gallery_photos || []).filter(p => p.image_url).map(p => p.image_url!)

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7 },
}
const stagger = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
}

/* ── static fallback data ── */
const FALLBACK_REGIONS = [
  { id: 0, name: 'Nairobi', description: 'The vibrant capital city — a melting pot of cultures, innovation, and the beating heart of modern Kenya. From the bustling Maasai Market to the serene Karura Forest, Nairobi bridges tradition and tomorrow.', image_url: '', gallery_photos: [] },
  { id: 1, name: 'Mombasa', description: 'The coastal gem where Swahili culture meets the Indian Ocean. Centuries of trade have woven Arab, Portuguese, and indigenous influences into a tapestry of spice-scented streets and coral-stone architecture.', image_url: '', gallery_photos: [] },
  { id: 2, name: 'Nakuru', description: 'Home to the Great Rift Valley and stunning natural beauty. Lake Nakuru paints the shoreline pink with millions of flamingos, while the surrounding highlands produce some of the world\'s finest tea.', image_url: '', gallery_photos: [] },
  { id: 3, name: 'Kisumu', description: 'The lakeside city on the shores of Lake Victoria — the source of the Nile. Fishing communities, vibrant markets, and sunsets over Africa\'s largest lake define this western Kenyan gem.', image_url: '', gallery_photos: [] },
]

const FALLBACK_COMMUNITIES = [
  { id: 0, name: 'Kikuyu', region: 'Central Kenya', description: 'The largest ethnic group, known for their agricultural heritage, entrepreneurial spirit, and deep connection to the slopes of Mount Kenya.', image_url: '', gallery_photos: [] },
  { id: 1, name: 'Luo', region: 'Western Kenya', description: 'Famous for their fishing traditions along Lake Victoria, vibrant musical heritage, and significant contributions to Kenya\'s intellectual and political life.', image_url: '', gallery_photos: [] },
  { id: 2, name: 'Kalenjin', region: 'Rift Valley', description: 'World-renowned for their athletic prowess and running traditions. The Rift Valley highlands have produced more Olympic champions per capita than anywhere on Earth.', image_url: '', gallery_photos: [] },
  { id: 3, name: 'Kamba', region: 'Eastern Kenya', description: 'Known for their exquisite wood carving skills, vibrant musical traditions, and resilience in the semi-arid beauty of Ukambani.', image_url: '', gallery_photos: [] },
]

const FALLBACK_HERITAGE = [
  { id: 0, title: 'Lamu Old Town', heritage_type: 'Ceremony', description: 'A living example of Swahili culture and architecture — one of East Africa\'s oldest continuously inhabited towns and a UNESCO World Heritage Site.', image_url: '', gallery_photos: [] },
  { id: 1, title: 'Fort Jesus', heritage_type: 'Art', description: 'A 16th-century Portuguese fort standing guard over Mombasa\'s Old Town — a testament to Kenya\'s layered colonial history and cultural resilience.', image_url: '', gallery_photos: [] },
  { id: 2, title: 'Thimlich Ohinga', heritage_type: 'Craft', description: 'Ancient dry-stone wall enclosures in Migori County, showcasing early engineering genius and the communal living traditions of early Kenyan communities.', image_url: '', gallery_photos: [] },
]

const FALLBACK_ACHIEVEMENTS = [
  { id: 0, title: 'Athletics Excellence', achievement_type: 'Sports', description: 'Kenya\'s dominance in long-distance running has brought home countless Olympic and World Championship medals, making the Rift Valley the running capital of the world.', year: 2024, image_url: '', gallery_photos: [] },
  { id: 1, title: 'Magical Kenya', achievement_type: 'Tourism', description: 'From the Maasai Mara\'s Great Migration to Mount Kenya\'s snow-capped peaks, our natural beauty attracts over two million visitors annually.', year: 2024, image_url: '', gallery_photos: [] },
  { id: 2, title: 'Silicon Savannah', achievement_type: 'Innovation', description: 'M-Pesa revolutionised mobile payments worldwide, and Nairobi\'s tech scene continues to innovate — earning the title "Silicon Savannah" with over 40 million active users.', year: 2024, image_url: '', gallery_photos: [] },
  { id: 3, title: 'Creative Expression', achievement_type: 'Arts', description: 'From Ngũgĩ wa Thiong\'o\'s literary genius to award-winning films and the vibrant contemporary art scene, Kenyan artists are making their mark on the global cultural landscape.', year: 2024, image_url: '', gallery_photos: [] },
]

const SWAHILI_PHRASES = [
  { phrase: 'Jambo', meaning: 'Hello' },
  { phrase: 'Asante', meaning: 'Thank you' },
  { phrase: 'Karibu', meaning: 'Welcome' },
  { phrase: 'Hakuna Matata', meaning: 'No worries' },
  { phrase: 'Uhuru', meaning: 'Freedom' },
  { phrase: 'Harambee', meaning: 'Pull together' },
]

/* ── component ── */
const KenyaUnified = () => {
  const settings = useSiteSettings()
  const [data, setData] = useState<DiscoverPayload | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedRegion, setExpandedRegion] = useState<number | null>(null)
  const [expandedCommunity, setExpandedCommunity] = useState<number | null>(null)

  const ARTISAN_SHOWCASE = [
    { title: 'Wood Carving', image: settings.kenya_artisan_1_image_url || '', description: 'Intricate wooden sculptures and carvings that tell stories of ancestry and spirit' },
    { title: 'Beadwork', image: settings.kenya_artisan_2_image_url || '', description: 'Colourful bead jewellery and decorations — each pattern carries meaning passed through generations' },
    { title: 'Pottery', image: settings.kenya_artisan_3_image_url || '', description: 'Traditional clay pots and vessels shaped by hands that remember techniques older than written history' },
    { title: 'Textiles', image: settings.kenya_artisan_4_image_url || '', description: 'Handwoven fabrics and kangas — wearable art that carries proverbs and cultural identity' },
  ]

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const payload = await apiClient.getDiscoverKenya({
          regions_limit: 8,
          communities_limit: 8,
          heritage_limit: 8,
          achievements_limit: 8,
        })
        setData(payload)
      } catch (err) {
        console.error('Error loading Kenya unified page:', err)
        setError('Could not load content right now.')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  /* Merge API data with fallbacks so the page always has content */
  const regions = (data?.regions.length ? data.regions : FALLBACK_REGIONS) as Region[]
  const communities = (data?.communities.length ? data.communities : FALLBACK_COMMUNITIES) as Community[]
  const heritage = (data?.heritage.length ? data.heritage : FALLBACK_HERITAGE) as Heritage[]
  const achievements = (data?.achievements.length ? data.achievements : FALLBACK_ACHIEVEMENTS) as Achievement[]

  const allPhotos = useMemo(() => {
    const photos: { src: string; alt: string }[] = []
    regions.forEach(r => {
      const img = getImage(r)
      if (img) photos.push({ src: img, alt: r.name })
      getGalleryImages(r).forEach(g => photos.push({ src: g, alt: r.name }))
    })
    communities.forEach(c => {
      const img = getImage(c)
      if (img) photos.push({ src: img, alt: c.name })
      getGalleryImages(c).forEach(g => photos.push({ src: g, alt: c.name }))
    })
    heritage.forEach(h => {
      const img = getImage(h)
      if (img) photos.push({ src: img, alt: h.title })
      getGalleryImages(h).forEach(g => photos.push({ src: g, alt: h.title }))
    })
    achievements.forEach(a => {
      const img = getImage(a)
      if (img) photos.push({ src: img, alt: a.title })
      getGalleryImages(a).forEach(g => photos.push({ src: g, alt: a.title }))
    })
    return photos.slice(0, 16)
  }, [regions, communities, heritage, achievements])

  if (loading) {
    return (
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block h-10 w-10 animate-spin rounded-full border-b-2 border-green-600" />
          <p className="mt-4 text-gray-600">Loading Kenya stories...</p>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-white">

      {/* ===================== INTRO ===================== */}
      <div className="py-20 sm:py-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div {...fadeInUp}>
            <span className="text-green-600 font-bold tracking-widest uppercase text-xs mb-4 block">The Spirit of a Nation</span>
            <h2 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-8 tracking-tight">
              One People, <span className="text-red-600">Many Stories</span>
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed font-light max-w-2xl mx-auto">
              Kenya is a tapestry of forty-four ethnic communities, united by the sacred spirit of{' '}
              <span className="font-semibold text-green-700 border-b-2 border-green-200">Harambee</span>. 
              From the cradle of mankind to the silicon savannah, we are a nation that pulls together to shape the future.
            </p>
          </motion.div>
        </div>
      </div>

      {/* ===================== OUR KENYA ===================== */}
      <div className="py-16 sm:py-20 bg-green-50/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeInUp} className="text-center mb-6">
            <span className="inline-flex items-center gap-2 text-green-700 font-semibold tracking-wider uppercase text-sm mb-3">
              <MapPin className="w-4 h-4" /> Our Kenya
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              The Heartland
            </h2>
          </motion.div>
          <motion.div {...fadeInUp} className="text-center mb-14">
            <p className="text-gray-600 max-w-2xl mx-auto">
              From Mount Kenya to the Indian Ocean — each landscape holds a people and a way of life.
            </p>
          </motion.div>

          {/* Regions as large photo cards */}
          <div className="grid md:grid-cols-2 gap-6">
            {regions.map((region, idx) => {
              const img = getImage(region)
              const gallery = getGalleryImages(region)
              const isExpanded = expandedRegion === region.id
              return (
                <motion.div
                  key={region.id}
                  {...stagger}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                  className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer"
                  onClick={() => setExpandedRegion(isExpanded ? null : region.id)}
                >
                  <div className="h-72 sm:h-80">
                    {img && (
                      <img
                        src={img}
                        alt={region.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    )}
                    <div className="absolute inset-0 bg-black/40" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4 text-yellow-400" />
                      <h3 className="text-2xl font-bold">{region.name}</h3>
                    </div>
                    <p className="text-gray-200 text-sm leading-relaxed line-clamp-2">{region.description}</p>
                    {gallery.length > 0 && (
                      <button className="mt-2 inline-flex items-center gap-1 text-xs text-white/70 hover:text-white transition-colors">
                        <ChevronDown className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                        {gallery.length} more photo{gallery.length > 1 ? 's' : ''}
                      </button>
                    )}
                  </div>
                  {isExpanded && gallery.length > 0 && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      className="bg-white p-4"
                    >
                      <div className="grid grid-cols-3 gap-2">
                        {gallery.map((src, gi) => (
                          <div key={gi} className="rounded-lg overflow-hidden">
                            <img src={src} alt={`${region.name} ${gi + 1}`} className="w-full h-24 object-cover" />
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )
            })}
          </div>

          {/* Ethnic Mosaic */}
          <motion.div {...fadeInUp} className="mt-14 text-center">
            <p className="text-gray-500 italic text-sm">
              A tapestry of over 40 ethnic communities, each bringing unique richness to one nation.
            </p>
          </motion.div>
        </div>
      </div>

      {/* ===================== SWAHILI PHRASES ===================== */}
      <div className="py-14 sm:py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeInUp} className="text-center mb-10">
            <span className="inline-flex items-center gap-2 text-green-700 font-semibold tracking-wider uppercase text-sm mb-3">
              <Volume2 className="w-4 h-4" /> Languages of Unity
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Speak Kenyan
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Over 60 indigenous languages, one unifying tongue — Kiswahili.
            </p>
          </motion.div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {SWAHILI_PHRASES.map((item, idx) => (
              <motion.div
                key={item.phrase}
                {...stagger}
                transition={{ duration: 0.4, delay: idx * 0.06 }}
                className="bg-white p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 text-center border border-gray-100 group cursor-pointer"
              >
                <div className="text-2xl sm:text-3xl font-bold text-green-700 mb-2">
                  {item.phrase}
                </div>
                <div className="text-gray-600 text-sm font-medium">{item.meaning}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ===================== OUR CULTURE ===================== */}
      <div className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeInUp} className="text-center mb-6">
            <span className="inline-flex items-center gap-2 text-yellow-700 font-semibold tracking-wider uppercase text-sm mb-3">
              <Landmark className="w-4 h-4" /> Our Culture
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              The Soul
            </h2>
          </motion.div>
          <motion.div {...fadeInUp} className="text-center mb-14">
            <p className="text-gray-600 max-w-2xl mx-auto">
              Vibrant traditions, artistic expressions, and sacred ceremonies — this is the soul of Kenya.
            </p>
          </motion.div>

          {/* Communities — photo + info cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
            {communities.map((community, idx) => {
              const img = getImage(community)
              const gallery = getGalleryImages(community)
              const isExpanded = expandedCommunity === community.id
              return (
                <motion.div
                  key={community.id}
                  {...stagger}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group"
                >
                  <div className="h-44 overflow-hidden relative">
                    {img && (
                      <img
                        src={img}
                        alt={community.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    )}
                    <div className="absolute top-3 left-3">
                      <span className="bg-white/90 backdrop-blur-sm text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                        {community.region}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h4 className="font-bold text-gray-900 text-lg">{community.name}</h4>
                    <p className="mt-2 text-sm text-gray-600 line-clamp-3">{community.description}</p>
                    {gallery.length > 0 && (
                      <button
                        onClick={(e) => { e.stopPropagation(); setExpandedCommunity(isExpanded ? null : community.id) }}
                        className="mt-3 inline-flex items-center gap-1 text-xs text-green-600 hover:text-green-800 transition-colors font-medium"
                      >
                        <ChevronDown className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                        {gallery.length} photo{gallery.length > 1 ? 's' : ''}
                      </button>
                    )}
                  </div>
                  {isExpanded && gallery.length > 0 && (
                    <div className="px-5 pb-5">
                      <div className="grid grid-cols-3 gap-2">
                        {gallery.map((src, gi) => (
                          <div key={gi} className="rounded-lg overflow-hidden">
                            <img src={src} alt={`${community.name} ${gi + 1}`} className="w-full h-20 object-cover" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>

          {/* Cultural adornment feature cards */}
          <motion.div {...fadeInUp} className="mb-14">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center flex items-center justify-center gap-2">
              <Palette className="w-5 h-5 text-yellow-600" /> Adornment & Expression
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { title: 'Traditional Attire', desc: 'From the colourful Maasai shukas to the elegant Kikoy wraps — each piece tells a story of identity and belonging.', icon: Palette, color: 'rose' },
                { title: 'Music & Dance', desc: 'Rhythmic beats and graceful movements that celebrate life, community, and the spirits of ancestors who dance before us.', icon: Music, color: 'amber' },
                { title: 'Ceremonies', desc: 'Sacred rituals marking important life moments — birth, initiation, marriage, and passage — that strengthen community bonds across generations.', icon: BookOpen, color: 'emerald' },
              ].map((el, idx) => (
                <motion.div
                  key={el.title}
                  {...stagger}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100 text-center group"
                >
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-full mb-5 ${el.color === 'rose' ? 'bg-rose-50 group-hover:bg-rose-600' : el.color === 'amber' ? 'bg-amber-50 group-hover:bg-amber-600' : 'bg-emerald-50 group-hover:bg-emerald-600'} transition-colors duration-300`}>
                    <el.icon className={`w-7 h-7 ${el.color === 'rose' ? 'text-rose-600 group-hover:text-white' : el.color === 'amber' ? 'text-amber-600 group-hover:text-white' : 'text-emerald-600 group-hover:text-white'} transition-colors duration-300`} />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-3">{el.title}</h4>
                  <p className="text-gray-600 leading-relaxed text-sm">{el.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Heritage items — compact photo cards */}
          {heritage.length > 0 && (
            <motion.div {...fadeInUp}>
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Landmark className="w-5 h-5 text-yellow-600" /> Heritage & Ceremonies
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {heritage.map((item, idx) => {
                  const img = getImage(item)
                  const gallery = getGalleryImages(item)
                  return (
                    <motion.div
                      key={item.id}
                      {...stagger}
                      transition={{ duration: 0.4, delay: idx * 0.06 }}
                      className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden group hover:shadow-md transition-shadow duration-300"
                    >
                      {img ? (
                        <div className="h-36 overflow-hidden">
                          <img src={img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                      ) : (
                        <div className="h-36 bg-yellow-100 flex items-center justify-center">
                          <Music className="w-8 h-8 text-yellow-400" />
                        </div>
                      )}
                      <div className="p-4">
                        <p className="text-xs uppercase tracking-wide text-yellow-600 font-semibold">{item.heritage_type}</p>
                        <h4 className="mt-1 font-semibold text-gray-900">{item.title}</h4>
                        <p className="mt-1 text-sm text-gray-500 line-clamp-2">{item.description}</p>
                      </div>
                      {gallery.length > 0 && (
                        <div className="px-4 pb-4">
                          <div className="grid grid-cols-3 gap-1.5">
                            {gallery.slice(0, 3).map((src, gi) => (
                              <div key={gi} className="rounded-md overflow-hidden">
                                <img src={src} alt={`${item.title} ${gi + 1}`} className="w-full h-14 object-cover" />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          )}

          {/* Artisan Showcase */}
          <motion.div {...fadeInUp} className="mt-14">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-600" /> Artisan Showcase
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {ARTISAN_SHOWCASE.map((artisan, idx) => (
                <motion.div
                  key={artisan.title}
                  {...stagger}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group cursor-pointer"
                >
                  <div className="overflow-hidden h-48">
                    <img
                      src={artisan.image}
                      alt={artisan.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5">
                    <h4 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-yellow-600 transition-colors duration-300">{artisan.title}</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">{artisan.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ===================== GUARDIANS OF THE WILD ===================== */}
      <div className="py-16 sm:py-20 bg-green-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeInUp} className="text-center mb-6">
            <span className="inline-flex items-center gap-2 text-green-700 font-semibold tracking-wider uppercase text-sm mb-3">
              <Camera className="w-4 h-4" /> Nature's Sanctuary
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Guardians of the Wild
            </h2>
          </motion.div>
          <motion.div {...fadeInUp} className="text-center mb-14">
            <p className="text-gray-600 max-w-2xl mx-auto">
              From the pioneering rhino sanctuaries to the world-renowned elephant orphanages — we are the stewards of Africa's greatest treasures.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Rhino Conservation',
                desc: 'Leading the way in protecting the critically endangered Black and White Rhinos through community-led sanctuaries.',
                icon: ShieldCheck,
                stat: '80% of world population'
              },
              {
                title: 'Elephant Guardians',
                desc: 'Home to some of the world\'s most successful rehabilitation programs, ensuring a future for these gentle giants.',
                icon: Heart,
                stat: 'Growing populations'
              },
              {
                title: 'Marine Protection',
                desc: 'Pristine coral reefs and marine parks along the Swahili coast, protected for generations to come.',
                icon: Waves,
                stat: '6 Marine Parks'
              }
            ].map((item, idx) => (
              <motion.div
                key={item.title}
                {...stagger}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-green-100 flex flex-col items-center text-center group"
              >
                <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-green-600 transition-colors duration-300">
                  <item.icon className="w-7 h-7 text-green-700 group-hover:text-white transition-colors duration-300" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h4>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">{item.desc}</p>
                <span className="text-xs font-bold text-green-700 uppercase tracking-widest">{item.stat}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

          {/* Natural & Culinary Heritage Section - Replaced Global Impact with evocative Kenyan experiences */}
          <motion.div
            {...fadeInUp}
            className="mt-14 bg-green-900 rounded-3xl p-10 sm:p-14 text-white relative overflow-hidden shadow-2xl"
          >
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/30 rounded-full blur-3xl" />
            
            <div className="relative z-10 text-center mb-12">
              <span className="inline-flex items-center gap-2 text-green-400 font-semibold tracking-wider uppercase text-sm mb-3">
                <Sparkles className="w-4 h-4" /> The Kenyan Experience
              </span>
              <h3 className="text-3xl sm:text-4xl font-bold">Beyond the Horizon</h3>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 relative z-10">
              {[
                { 
                  title: 'The Great Migration', 
                  desc: 'The Eighth Wonder of the World — a rhythmic journey of millions across the golden savannah.',
                  icon: Plane 
                },
                { 
                  title: 'Culinary Soul', 
                  desc: 'From the spice-scented Coast to the hearty Nyama Choma — a journey of flavors and hospitality.',
                  icon: Utensils 
                },
                { 
                  title: 'Majestic Peaks', 
                  desc: 'Snow-capped Mount Kenya, the "Seat of God," standing tall over the Great Rift Valley.',
                  icon: Mountain 
                },
                { 
                  title: 'Silicon Savannah', 
                  desc: 'A global hub of innovation where mobile banking was born and tech dreams take flight.',
                  icon: Lightbulb 
                },
              ].map((item, idx) => (
                <motion.div
                  key={item.title}
                  {...stagger}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="flex flex-col items-center text-center group"
                >
                  <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 border border-white/20 group-hover:bg-white/20 transition-all duration-300 transform group-hover:-translate-y-1">
                    <item.icon className="w-8 h-8 text-yellow-400" />
                  </div>
                  <h4 className="text-xl font-bold mb-3">{item.title}</h4>
                  <p className="text-green-100 text-sm leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

      {/* ===================== PHOTO MOSAIC ===================== */}
      {allPhotos.length > 0 && (
        <div className="py-16 sm:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div {...fadeInUp} className="text-center mb-10">
              <span className="inline-flex items-center gap-2 text-gray-500 font-semibold tracking-wider uppercase text-sm mb-3">
                <Camera className="w-4 h-4" /> Kenya in Frames
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Photo Highlights</h2>
            </motion.div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {allPhotos.map((photo, idx) => (
                <motion.div
                  key={`${photo.src}-${idx}`}
                  {...stagger}
                  transition={{ duration: 0.4, delay: idx * 0.04 }}
                  className={`relative overflow-hidden rounded-xl group cursor-pointer ${
                    idx === 0 ? 'sm:col-span-2 sm:row-span-2' : ''
                  }`}
                >
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    className={`w-full object-cover group-hover:scale-110 transition-transform duration-500 ${
                      idx === 0 ? 'h-64 sm:h-full' : 'h-40 sm:h-44'
                    }`}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-white text-sm font-medium drop-shadow-lg">{photo.alt}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ===================== CALL TO ACTION ===================== */}
      <div className="py-16 sm:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            {...fadeInUp}
            className="bg-green-800 rounded-3xl p-10 sm:p-16 text-white text-center relative overflow-hidden shadow-2xl"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/20 rounded-full blur-3xl" />
            <div className="relative z-10">
              <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6 border border-white/20">
                <Mountain className="w-8 h-8 text-yellow-400" />
              </div>
              <h3 className="text-3xl sm:text-4xl font-bold mb-4">Faith &amp; Unity</h3>
              <p className="text-green-50 max-w-xl mx-auto leading-relaxed font-light">
                Strength in diversity — harmony between faiths, traditions, and communities.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default KenyaUnified
