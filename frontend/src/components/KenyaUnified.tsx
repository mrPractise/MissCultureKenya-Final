'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  MapPin, Users, Landmark, Music, Palette, ChevronDown,
  Volume2, Camera, BookOpen, Sparkles, ArrowRight, Heart,
  Globe, Calendar, ChevronRight
} from 'lucide-react'
import Link from 'next/link'
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

const getGalleryPhotos = (item: { gallery_photos?: GalleryPhoto[] }) =>
  (item.gallery_photos || []).filter(p => p.image_url)

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

/* ── static data ── */
const CULTURAL_FACTS = [
  { number: '44+', label: 'Ethnic Communities', description: 'Each with distinct languages, customs, and artistic traditions' },
  { number: '68+', label: 'Living Languages', description: 'A linguistic diversity that echoes ancient migrations and trade routes' },
  { number: '7', label: 'UNESCO Sites', description: 'From Lamu Old Town to the Lake Turkana fossil beds' },
  { number: '2M+', label: 'Annual Visitors', description: 'Drawn by wildlife, culture, and the warmth of Kenyan hospitality' },
]

/* ── component ── */
const KenyaUnified = () => {
  const settings = useSiteSettings()
  const [data, setData] = useState<DiscoverPayload | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedRegion, setExpandedRegion] = useState<number | null>(null)
  const [expandedCommunity, setExpandedCommunity] = useState<number | null>(null)

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

  /* Use API data directly — show empty states when no data */
  const regions = (data?.regions || []) as Region[]
  const communities = (data?.communities || []) as Community[]
  const heritage = (data?.heritage || []) as Heritage[]
  const achievements = (data?.achievements || []) as Achievement[]

  /* Build photo grid with captions from gallery photos */
  const galleryPhotos = useMemo(() => {
    const photos: { src: string; alt: string; caption: string }[] = []
    regions.forEach(r => {
      getGalleryPhotos(r).forEach(p => photos.push({
        src: p.image_url!,
        alt: r.name,
        caption: p.caption || `${r.name} — ${r.description.slice(0, 80)}...`
      }))
      const img = getImage(r)
      if (img) photos.push({ src: img, alt: r.name, caption: r.description })
    })
    communities.forEach(c => {
      getGalleryPhotos(c).forEach(p => photos.push({
        src: p.image_url!,
        alt: c.name,
        caption: p.caption || `${c.name} of ${c.region} — ${c.description.slice(0, 80)}...`
      }))
      const img = getImage(c)
      if (img) photos.push({ src: img, alt: c.name, caption: c.description })
    })
    heritage.forEach(h => {
      getGalleryPhotos(h).forEach(p => photos.push({
        src: p.image_url!,
        alt: h.title,
        caption: p.caption || `${h.title} — ${h.description.slice(0, 80)}...`
      }))
      const img = getImage(h)
      if (img) photos.push({ src: img, alt: h.title, caption: h.description })
    })
    achievements.forEach(a => {
      getGalleryPhotos(a).forEach(p => photos.push({
        src: p.image_url!,
        alt: a.title,
        caption: p.caption || `${a.title} — ${a.description.slice(0, 80)}...`
      }))
      const img = getImage(a)
      if (img) photos.push({ src: img, alt: a.title, caption: a.description })
    })
    // No fallback photos — gallery section will be hidden when empty
    return photos.slice(0, 12)
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

      {/* ===================== 1. WHY KENYA ===================== */}
      <div className="py-20 sm:py-28 bg-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div {...fadeInUp}>
            <span className="inline-block px-4 py-1.5 rounded-full border border-green-200 bg-green-50 text-green-700 text-xs sm:text-sm font-bold tracking-widest uppercase mb-6">
              Why Kenya Specifically
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-8 tracking-tight">
              Kenya: Where Heritage <span className="text-red-600">Becomes Legacy</span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 leading-relaxed font-light max-w-3xl mx-auto mb-6">
              This is not just a country. It is the cradle of humankind, the meeting point of 44 distinct ethnic nations, 
              and a living laboratory where ancient tradition and cutting-edge innovation breathe the same air.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed font-light max-w-3xl mx-auto">
              From the Swahili Coast to the Rift Valley, from the Maasai Mara to the Silicon Savannah — 
              Kenya carries a cultural weight that deserves more than admiration. It deserves a <span className="font-semibold text-green-700">global stage</span>.
            </p>
          </motion.div>
        </div>
      </div>

      {/* ===================== 2. CULTURAL FACTS STRIP ===================== */}
      <div className="py-14 sm:py-16 bg-green-900 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/20 rounded-full blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div {...fadeInUp} className="text-center mb-10">
            <span className="inline-flex items-center gap-2 text-green-400 font-semibold tracking-wider uppercase text-sm mb-3">
              <Globe className="w-4 h-4" /> The Numbers Speak
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Heritage on a Global Scale
            </h2>
          </motion.div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {CULTURAL_FACTS.map((fact, idx) => (
              <motion.div
                key={fact.label}
                {...stagger}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl sm:text-5xl font-bold text-yellow-400 mb-2">{fact.number}</div>
                <div className="text-white font-semibold text-base mb-1">{fact.label}</div>
                <div className="text-green-200 text-sm leading-relaxed">{fact.description}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ===================== 3. PHOTO NARRATIVE GRID ===================== */}
      {galleryPhotos.length > 0 && (
        <div className="py-16 sm:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div {...fadeInUp} className="text-center mb-10">
              <span className="inline-flex items-center gap-2 text-green-700 font-semibold tracking-wider uppercase text-sm mb-3">
                <Camera className="w-4 h-4" /> What Kenyan Culture Looks Like
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">A Nation in Colour</h2>
              <p className="text-gray-600 max-w-2xl mx-auto mt-4">
                Every image carries a story. Hover to read what you are seeing, what it means culturally, 
                and why it matters to our mission.
              </p>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {galleryPhotos.map((photo, idx) => (
                <motion.div
                  key={`${photo.src}-${idx}`}
                  {...stagger}
                  transition={{ duration: 0.4, delay: idx * 0.06 }}
                  className={`relative overflow-hidden rounded-2xl group cursor-pointer bg-gray-100 ${
                    idx === 0 ? 'sm:col-span-2 sm:row-span-2' : ''
                  }`}
                >
                  {photo.src ? (
                    <>
                      <img
                        src={photo.src}
                        alt={photo.alt}
                        className={`w-full object-cover group-hover:scale-105 transition-transform duration-700 ${
                          idx === 0 ? 'h-64 sm:h-full min-h-[320px]' : 'h-56 sm:h-64'
                        }`}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-colors duration-500" />
                      <div className="absolute inset-0 p-5 sm:p-6 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <span className="text-yellow-400 text-xs font-bold tracking-widest uppercase mb-2">
                          {photo.alt}
                        </span>
                        <p className="text-white text-sm leading-relaxed">
                          {photo.caption}
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className={`flex items-center justify-center bg-gray-100 ${idx === 0 ? 'h-64 sm:h-full min-h-[320px]' : 'h-56 sm:h-64'}`}>
                      <Camera className="w-10 h-10 text-gray-300" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ===================== 4. WHO CARRIES THIS CULTURE ===================== */}
      <div className="py-16 sm:py-20 bg-green-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeInUp} className="text-center mb-6">
            <span className="inline-flex items-center gap-2 text-green-700 font-semibold tracking-wider uppercase text-sm mb-3">
              <Users className="w-4 h-4" /> Who Carries This Culture
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              The People
            </h2>
          </motion.div>
          <motion.div {...fadeInUp} className="text-center mb-14">
            <p className="text-gray-600 max-w-2xl mx-auto">
              Behind every tradition is a community that has kept it alive. These are the guardians — 
              the weavers, the runners, the farmers, the artists, the elders, and the youth who refuse to let heritage fade.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {communities.length > 0 ? (
              communities.map((community, idx) => {
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
                  <div className="h-48 overflow-hidden relative">
                    {img ? (
                      <img
                        src={img}
                        alt={community.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-green-100 flex items-center justify-center">
                        <Users className="w-10 h-10 text-green-300" />
                      </div>
                    )}
                    <div className="absolute top-3 left-3">
                      <span className="bg-white/90 backdrop-blur-sm text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                        {community.region}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h4 className="font-bold text-gray-900 text-lg">{community.name}</h4>
                    <p className="mt-2 text-sm text-gray-600 leading-relaxed">{community.description}</p>
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
            })
            ) : (
              <div className="col-span-full text-center py-12">
                <Users className="w-10 h-10 text-green-300 mx-auto mb-3" />
                <p className="text-gray-500">No communities added yet. Add them in Django admin.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ===================== 5. REGIONS ===================== */}
      <div className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeInUp} className="text-center mb-6">
            <span className="inline-flex items-center gap-2 text-green-700 font-semibold tracking-wider uppercase text-sm mb-3">
              <MapPin className="w-4 h-4" /> The Heartland
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              From Mount Kenya to the Indian Ocean
            </h2>
          </motion.div>
          <motion.div {...fadeInUp} className="text-center mb-14">
            <p className="text-gray-600 max-w-2xl mx-auto">
              Every landscape shapes the people who live on it. The highlands, the lake, the coast, the savannah — 
              each has forged a distinct way of life.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {regions.length > 0 ? (
              regions.map((region, idx) => {
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
            })
            ) : (
              <div className="col-span-full text-center py-12">
                <MapPin className="w-10 h-10 text-green-300 mx-auto mb-3" />
                <p className="text-gray-500">No regions added yet. Add them in Django admin.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ===================== 6. THE ARC: FROM SOIL TO STAGE ===================== */}
      <div className="py-16 sm:py-20 bg-green-900 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/30 rounded-full blur-3xl" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <span className="inline-flex items-center gap-2 text-green-400 font-semibold tracking-wider uppercase text-sm mb-3">
              <Sparkles className="w-4 h-4" /> The Mission Connection
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              From Soil to Stage
            </h2>
            <p className="text-green-100 max-w-2xl mx-auto mt-4">
              How does a nation&apos;s heritage become a global platform for change? Here is the arc.
            </p>
          </motion.div>

          <div className="space-y-8">
            {[
              {
                step: '01',
                title: 'The Land',
                desc: 'Kenya\'s geography — from Rift Valley to Swahili Coast — has shaped 44 distinct cultures, each with languages, art forms, and wisdom systems evolved over millennia.',
                icon: MapPin,
              },
              {
                step: '02',
                title: 'The People',
                desc: 'These communities are not museums. They are living, adapting, creating. The beadwork, the music, the running, the tech innovation — all emerge from this cultural soil.',
                icon: Users,
              },
              {
                step: '03',
                title: 'The Heritage',
                desc: 'UNESCO sites, oral traditions, ceremonies, and craftsmanship form an intangible wealth that the world barely knows. This is not folklore — it is living intellectual property.',
                icon: Landmark,
              },
              {
                step: '04',
                title: 'The Platform',
                desc: 'Miss Culture Global Kenya exists to carry this heritage onto a world stage. Not as entertainment, but as a serious cultural diplomacy mission — showing the world what Kenya truly is.',
                icon: Globe,
              },
              {
                step: '05',
                title: 'The Ambassador',
                desc: "Susan Abong'o represents more than a pageant title. She represents the bridge between these 44 communities and the global community — a living testament that culture is power.",
                icon: Heart,
              },
            ].map((item, idx) => (
              <motion.div
                key={item.step}
                {...stagger}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="flex gap-5 sm:gap-6 items-start"
              >
                <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
                  <span className="text-yellow-400 font-bold text-sm sm:text-base">{item.step}</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-green-100 leading-relaxed text-sm sm:text-base">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ===================== 7. HERITAGE & CEREMONIES ===================== */}
      <div className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeInUp} className="text-center mb-6">
            <span className="inline-flex items-center gap-2 text-yellow-700 font-semibold tracking-wider uppercase text-sm mb-3">
              <Landmark className="w-4 h-4" /> Living Traditions
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Heritage & Ceremonies
            </h2>
          </motion.div>
          <motion.div {...fadeInUp} className="text-center mb-14">
            <p className="text-gray-600 max-w-2xl mx-auto">
              These are not tourist attractions. They are sacred practices that hold communities together across generations.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {heritage.length > 0 ? (
              heritage.map((item, idx) => {
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
                    <div className="h-48 overflow-hidden">
                      <img src={img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  ) : (
                    <div className="h-48 bg-yellow-100 flex items-center justify-center">
                      <Landmark className="w-10 h-10 text-yellow-400" />
                    </div>
                  )}
                  <div className="p-5">
                    <p className="text-xs uppercase tracking-wide text-yellow-600 font-semibold">{item.heritage_type}</p>
                    <h4 className="mt-1 font-bold text-gray-900 text-lg">{item.title}</h4>
                    <p className="mt-2 text-sm text-gray-600 leading-relaxed">{item.description}</p>
                  </div>
                  {gallery.length > 0 && (
                    <div className="px-5 pb-5">
                      <div className="grid grid-cols-3 gap-1.5">
                        {gallery.slice(0, 3).map((src, gi) => (
                          <div key={gi} className="rounded-md overflow-hidden">
                            <img src={src} alt={`${item.title} ${gi + 1}`} className="w-full h-16 object-cover" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )
            })
            ) : (
              <div className="col-span-full text-center py-12">
                <Landmark className="w-10 h-10 text-yellow-400 mx-auto mb-3" />
                <p className="text-gray-500">No heritage items added yet. Add them in Django admin.</p>
              </div>
            )}
          </div>

          {/* Cultural Expression Cards */}
          <motion.div {...fadeInUp} className="mt-14">
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
        </div>
      </div>

      {/* ===================== 8. SWAHILI PHRASES ===================== */}
      <div className="py-14 sm:py-16 bg-green-50/30">
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
            {[
              { phrase: 'Jambo', meaning: 'Hello' },
              { phrase: 'Asante', meaning: 'Thank you' },
              { phrase: 'Karibu', meaning: 'Welcome' },
              { phrase: 'Hakuna Matata', meaning: 'No worries' },
              { phrase: 'Uhuru', meaning: 'Freedom' },
              { phrase: 'Harambee', meaning: 'Pull together' },
            ].map((item, idx) => (
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

      {/* ===================== 9. BRIDGE CTAS ===================== */}
      <div className="py-16 sm:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeInUp} className="text-center mb-10">
            <span className="inline-block px-4 py-1.5 rounded-full border border-red-200 bg-red-50 text-red-600 text-xs sm:text-sm font-bold tracking-widest uppercase mb-6">
              Where Do I Go Next
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Be Part of the Story
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            <Link href="/ambassador">
              <motion.div
                {...stagger}
                transition={{ duration: 0.5, delay: 0 }}
                className="group bg-green-900 rounded-2xl p-8 sm:p-10 text-white relative overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer h-full"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
                <div className="relative z-10">
                  <div className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center mb-6 border border-white/20 group-hover:bg-white/20 transition-colors">
                    <Heart className="w-7 h-7 text-yellow-400" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold mb-3">Meet Our Ambassador</h3>
                  <p className="text-green-100 leading-relaxed mb-6">
                    Susan Abong&apos;o carries the voice of 44 communities onto the global stage.
                    Discover her story and her mission to put Kenyan heritage at the centre of world culture.
                  </p>
                  <span className="inline-flex items-center gap-2 text-yellow-400 font-semibold group-hover:gap-3 transition-all">
                    Meet Susan <ArrowRight className="w-5 h-5" />
                  </span>
                </div>
              </motion.div>
            </Link>

            <Link href="/events">
              <motion.div
                {...stagger}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="group bg-red-600 rounded-2xl p-8 sm:p-10 text-white relative overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer h-full"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                <div className="relative z-10">
                  <div className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center mb-6 border border-white/20 group-hover:bg-white/20 transition-colors">
                    <Calendar className="w-7 h-7 text-yellow-300" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold mb-3">Join Our Events</h3>
                  <p className="text-red-100 leading-relaxed mb-6">
                    From cultural showcases to community outreach, our events bring Kenyan heritage to life. 
                    Find out where we will be next and how you can participate.
                  </p>
                  <span className="inline-flex items-center gap-2 text-yellow-300 font-semibold group-hover:gap-3 transition-all">
                    See Events <ArrowRight className="w-5 h-5" />
                  </span>
                </div>
              </motion.div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default KenyaUnified
