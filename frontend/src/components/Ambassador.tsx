'use client'

import { motion } from 'framer-motion'
import { User, BookOpen, Award, Heart, Mail, ArrowRight, Globe, Sparkles, MapPin, ChevronRight, Camera, Calendar } from 'lucide-react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import ContactModal from '@/components/ContactModal'
import apiClient from '@/lib/api'
import { useAmbassadorPageSettings } from '@/lib/usePageSettings'

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

const Ambassador = () => {
  const { settings, loading } = useAmbassadorPageSettings()
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)
  const [ambassadorInfo, setAmbassadorInfo] = useState<any>({
    name: "Susan Abong'o",
    title: 'Cultural Ambassador',
    bio: "A passionate advocate for Kenya's cultural heritage, Susan represents the beauty and diversity of our nation on the global stage.",
    mission: 'To bridge cultures, promote understanding, and showcase the rich tapestry of Kenyan traditions to the world.',
    image: settings.profile_image_url || '',
    gallery: [] as string[]
  })

  useEffect(() => {
    const fetchAmbassadorData = async () => {
      try {
        const ambassadorResponse = await apiClient.getAmbassador()
        const ambassadorData = Array.isArray(ambassadorResponse)
          ? ambassadorResponse[0]
          : (ambassadorResponse.results && ambassadorResponse.results[0]) || ambassadorResponse

        if (ambassadorData) {
          setAmbassadorInfo((prev: any) => ({
            ...prev,
            name: ambassadorData.name || "Susan Abong'o",
            title: ambassadorData.title || 'Cultural Ambassador',
            bio: ambassadorData.bio || ambassadorData.description || prev.bio,
            mission: ambassadorData.mission_statement || ambassadorData.mission || prev.mission,
            image: settings.profile_image_url || ambassadorData.profile_image_url || ambassadorData.profile_image || ambassadorData.image || ambassadorData.featured_image || prev.image,
          }))
        }

        try {
          const photosResponse = await apiClient.getPhotos({ limit: 12 })
          const photosData = Array.isArray(photosResponse)
            ? photosResponse
            : (photosResponse.results || [])
          const galleryUrls = photosData
            .map((p: any) => p.image_url || p.thumbnail_url || p.image)
            .filter(Boolean)
          if (galleryUrls.length > 0) {
            setAmbassadorInfo((prev: any) => ({ ...prev, gallery: galleryUrls }))
          }
        } catch {}

        try {
          const videosResponse = await apiClient.getVideos({ limit: 4 })
          const videosData = Array.isArray(videosResponse)
            ? videosResponse
            : (videosResponse.results || [])

          let allVideos = [...videosData]
          if (settings.video_url) {
            allVideos = [
              {
                id: 'featured-video',
                title: 'Featured Ambassador Video',
                video_url: settings.video_url,
                is_featured: true
              },
              ...allVideos
            ]
          }

          if (allVideos.length > 0) {
            setAmbassadorInfo((prev: any) => ({ ...prev, videos: allVideos }))
          }
        } catch {}
      } catch (err) {
        console.error('Error fetching ambassador data:', err)
      }
    }

    fetchAmbassadorData()
  }, [])

  const impactStats = [
    { number: '50+', label: 'Countries Represented', icon: Globe },
    { number: '20+', label: 'Events Attended', icon: Calendar },
    { number: '10K+', label: 'Lives Touched', icon: Heart },
    { number: '5+', label: 'Causes Championed', icon: Sparkles },
  ]

  const storyArc = [
    {
      step: '01',
      title: 'Where She Comes From',
      desc: "Born in the heart of Kenya, Susan Abong'o grew up surrounded by the rich tapestry of our nation's diverse cultures. From a young age, she witnessed the power of cultural unity and the beauty of our traditions. Her roots run deep in community centres where she first volunteered to teach children about Kenyan heritage — a calling that would shape her life's direction.",
      icon: MapPin,
    },
    {
      step: '02',
      title: 'Why She Stepped Forward',
      desc: "Susan stepped forward to bridge tradition and modern life. She believes young Kenyans can embrace both their heritage and their ambitions.",
      icon: User,
    },
    {
      step: '03',
      title: 'What She Stands For',
      desc: "Susan promotes youth programs, preserves cultural heritage, and creates opportunities for artisans. She believes in the power of community and cultural pride.",
      icon: Heart,
    },
    {
      step: '04',
      title: 'Where She Has Gone',
      desc: "Susan has represented Kenya at international events and community gatherings across multiple countries. She shares Kenya's story wherever she goes.",
      icon: Globe,
    },
    {
      step: '05',
      title: 'What Happens Next',
      desc: "Susan continues her work in youth empowerment and cultural partnerships. She invites everyone to join this journey of cultural pride and community growth.",
      icon: ArrowRight,
    },
  ]

  const coreMessages = [
    {
      title: 'Her Identity',
      quote: "I am not just an ambassador. I am a mirror held up to Kenya — showing the world what we truly are.",
      desc: "Susan represents Kenya with pride and dedication. Her work connects communities and shares our culture with the world.",
      icon: User,
      color: 'green',
    },
    {
      title: 'Her Mission',
      quote: "Every appearance, every speech, every cultural showcase is an act of diplomacy — building bridges between Kenya and the world through shared humanity.",
      desc: "This is not about looking good. This is about building understanding across continents. Through authentic storytelling and genuine connection, Susan bridges divides and creates pathways for cultural exchange.",
      icon: Globe,
      color: 'red',
    },
    {
      title: 'Her Call to Youth',
      quote: "To every young Kenyan woman watching — your culture is your power. You do not have to leave who you are at the door to succeed globally.",
      desc: "Susan encourages young women to embrace their cultural identity as a strength in pursuing their goals.",
      icon: Sparkles,
      color: 'yellow',
    },
    {
      title: 'Her Invitation',
      quote: "Follow her journey, attend her events, and vote for the next generation of ambassadors who will carry this torch forward.",
      desc: "Susan welcomes everyone to follow her journey, attend events, and support the cultural movement.",
      icon: Heart,
      color: 'green',
    },
  ]

  return (
    <section className="bg-white">

      {/* ===================== 1. WHO IS SUSAN ===================== */}
      <div className="py-20 sm:py-28 bg-white relative overflow-hidden">
        <div className="absolute top-20 right-10 w-96 h-96 bg-green-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-red-500/5 rounded-full blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Image */}
            <motion.div
              {...fadeInUp}
              className="relative group"
            >
              <div className="absolute inset-0 bg-green-600/10 rounded-[2rem] rotate-2 group-hover:rotate-3 transition-transform duration-500" />
              <div className="relative overflow-hidden rounded-[2rem] shadow-2xl">
                {ambassadorInfo.image ? (
                  <img
                    src={ambassadorInfo.image}
                    alt="Susan Abong'o - Miss Culture Global Kenya Ambassador"
                    className="w-full h-[500px] sm:h-[600px] object-cover"
                  />
                ) : (
                  <div className="w-full h-[500px] sm:h-[600px] bg-green-100 flex items-center justify-center">
                    <User className="w-20 h-20 text-green-300" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                  <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full mb-3">
                    <Award className="w-4 h-4 text-yellow-400" />
                    <span className="text-white text-sm font-semibold">Miss Culture Global Kenya</span>
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-bold text-white">{ambassadorInfo.name}</h2>
                  <p className="text-green-200 mt-1">Cultural Diplomat &middot; Youth Champion</p>
                </div>
              </div>
            </motion.div>

            {/* Text */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="inline-block px-4 py-1.5 rounded-full border border-green-200 bg-green-50 text-green-700 text-xs sm:text-sm font-bold tracking-widest uppercase mb-6">
                Who Is Susan
              </span>
              <h2 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
                Kenya&apos;s Voice on the <span className="text-red-600">World Stage</span>
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                She does not just wear the crown — she carries an entire nation&apos;s story in everything she does. 
                Meet the woman behind the mission.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                {ambassadorInfo.bio}
              </p>
              <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-100 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-red-600" />
                <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-500 fill-current" />
                  Mission Statement
                </h4>
                <p className="text-gray-700 italic text-lg leading-relaxed">
                  &ldquo;{ambassadorInfo.mission}&rdquo;
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ===================== 2. STORY ARC ===================== */}
      {settings.show_story_arc && (
      <div className="py-16 sm:py-20 bg-green-900 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/30 rounded-full blur-3xl" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <span className="inline-flex items-center gap-2 text-green-400 font-semibold tracking-wider uppercase text-sm mb-3">
              <BookOpen className="w-4 h-4" /> Susan&apos;s Story
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              From Community to Continent
            </h2>
            <p className="text-green-100 max-w-2xl mx-auto mt-4">
              A journey told in five chapters — from the soil of Kenya to the stages of the world.
            </p>
          </motion.div>

          <div className="space-y-6 sm:space-y-8">
            {storyArc.map((item, idx) => (
              <motion.div
                key={item.step}
                {...stagger}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="flex gap-4 sm:gap-6 items-start"
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
      )}

      {/* ===================== 3. IMPACT SNAPSHOT ===================== */}
      {settings.show_impact_stats && (
      <div className="py-14 sm:py-16 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeInUp} className="text-center mb-10">
            <span className="inline-flex items-center gap-2 text-green-700 font-semibold tracking-wider uppercase text-sm mb-3">
              <Award className="w-4 h-4" /> Has She Actually Done Anything?
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Impact, Not Just Words
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {impactStats.map((stat, idx) => (
              <motion.div
                key={stat.label}
                {...stagger}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="text-center bg-white p-6 sm:p-8 rounded-2xl shadow-md border border-gray-100"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl mb-4">
                  <stat.icon className="w-6 h-6 text-green-700" />
                </div>
                <div className="text-3xl sm:text-4xl font-bold text-green-700 mb-1">{stat.number}</div>
                <div className="text-gray-600 font-medium text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      )}

      {/* ===================== 4. CORE MESSAGING CARDS ===================== */}
      {settings.show_core_messages && (
      <div className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <span className="inline-flex items-center gap-2 text-green-700 font-semibold tracking-wider uppercase text-sm mb-3">
              <Heart className="w-4 h-4" /> What She Stands For
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Core Messaging
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {coreMessages.map((card, idx) => (
              <motion.div
                key={card.title}
                {...stagger}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white p-8 sm:p-10 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100"
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-5 ${
                  card.color === 'green' ? 'bg-green-100' : card.color === 'red' ? 'bg-red-100' : 'bg-yellow-100'
                }`}>
                  <card.icon className={`w-6 h-6 ${
                    card.color === 'green' ? 'text-green-700' : card.color === 'red' ? 'text-red-700' : 'text-yellow-700'
                  }`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{card.title}</h3>
                <blockquote className="text-lg font-medium text-gray-800 leading-relaxed mb-4 border-l-4 border-green-600 pl-4 italic">
                  &ldquo;{card.quote}&rdquo;
                </blockquote>
                <p className="text-gray-600 leading-relaxed text-sm">{card.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      )}

      {/* ===================== 5. GALLERY PREVIEW ===================== */}
      {settings.show_gallery && ambassadorInfo.gallery.length > 0 && (
        <div className="py-16 sm:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div {...fadeInUp} className="text-center mb-10">
              <span className="inline-flex items-center gap-2 text-green-700 font-semibold tracking-wider uppercase text-sm mb-3">
                <Camera className="w-4 h-4" /> Susan&apos;s Journey in Photos
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">From the Stage to the Community</h2>
            </motion.div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {ambassadorInfo.gallery.slice(0, 8).map((img: string, index: number) => (
                <motion.div
                  key={index}
                  {...stagger}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300 group cursor-pointer"
                >
                  <img
                    src={img}
                    alt={`Susan Abong'o ${index + 1}`}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                </motion.div>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link
                href="/gallery"
                className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 shadow-md"
              >
                <Camera className="w-4 h-4" />
                View Full Gallery
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ===================== 6. VIDEOS ===================== */}
      {settings.show_videos && ambassadorInfo.videos && ambassadorInfo.videos.length > 0 && (
        <div className="py-16 sm:py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div {...fadeInUp} className="text-center mb-10">
              <span className="inline-flex items-center gap-2 text-green-700 font-semibold tracking-wider uppercase text-sm mb-3">
                <BookOpen className="w-4 h-4" /> Susan&apos;s Story in Motion
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Watch & Listen</h2>
            </motion.div>
            <div className="grid md:grid-cols-2 gap-8">
              {ambassadorInfo.videos.map((video: any, index: number) => (
                <div key={index} className="relative overflow-hidden rounded-2xl shadow-2xl group">
                  {video.video_url && video.video_url.includes('youtube') ? (
                    <iframe
                      src={video.video_url}
                      title={video.title || `Video ${index + 1}`}
                      className="w-full h-80 rounded-2xl"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : video.video_url ? (
                    <video
                      src={video.video_url}
                      title={video.title || `Video ${index + 1}`}
                      className="w-full h-80 rounded-2xl object-cover"
                      controls
                      poster={video.thumbnail_url || undefined}
                    />
                  ) : (
                    <div className="w-full h-80 bg-gray-200 rounded-2xl flex items-center justify-center">
                      <span className="text-gray-400">No video</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ===================== 7. BRIDGE CTAs ===================== */}
      {settings.show_contact_cta && (
      <div className="py-16 sm:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeInUp} className="text-center mb-10">
            <span className="inline-block px-4 py-1.5 rounded-full border border-red-200 bg-red-50 text-red-600 text-xs sm:text-sm font-bold tracking-widest uppercase mb-6">
              Where Do I Go Next
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Be Part of the Story</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            <Link href="/gallery">
              <motion.div
                {...stagger}
                transition={{ duration: 0.5, delay: 0 }}
                className="group bg-green-900 rounded-2xl p-8 sm:p-10 text-white relative overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer h-full"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
                <div className="relative z-10">
                  <div className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center mb-6 border border-white/20 group-hover:bg-white/20 transition-colors">
                    <Camera className="w-7 h-7 text-yellow-400" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold mb-3">Follow Her Journey</h3>
                  <p className="text-green-100 leading-relaxed mb-6">
                    Behind-the-scenes moments, event appearances, and cultural milestones — all in the gallery.
                  </p>
                  <span className="inline-flex items-center gap-2 text-yellow-400 font-semibold group-hover:gap-3 transition-all">
                    View gallery <ArrowRight className="w-5 h-5" />
                  </span>
                </div>
              </motion.div>
            </Link>

            <motion.div
              {...stagger}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="group bg-red-600 rounded-2xl p-8 sm:p-10 text-white relative overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer h-full"
              onClick={() => setIsContactModalOpen(true)}
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
              <div className="relative z-10">
                <div className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center mb-6 border border-white/20 group-hover:bg-white/20 transition-colors">
                  <Mail className="w-7 h-7 text-yellow-300" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold mb-3">Book Susan</h3>
                <p className="text-red-100 leading-relaxed mb-6">
                  Interested in having Susan speak at your event? Get in touch to discuss opportunities and partnerships.
                </p>
                <span className="inline-flex items-center gap-2 text-yellow-300 font-semibold group-hover:gap-3 transition-all">
                  Get in touch <ArrowRight className="w-5 h-5" />
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      )}

      {/* Contact Modal */}
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        type="event"
      />
    </section>
  )
}

export default Ambassador
