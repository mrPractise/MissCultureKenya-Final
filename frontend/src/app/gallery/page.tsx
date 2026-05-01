'use client'

import { motion } from 'framer-motion'
import { Camera, Video, Download, Share2, Heart, Filter, MapPin, Calendar, Play, ChevronRight } from 'lucide-react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import PhotoLightboxModal from '@/components/PhotoLightboxModal'
import VideoModal from '@/components/VideoModal'
import apiClient from '@/lib/api'
import { useSiteSettings } from '@/lib/useSiteSettings'

const galleryCategories = [
  {
    id: 'pageant-nights',
    title: 'Pageant Nights',
    description: 'Stage moments, crowning ceremonies, talent performances — the glamour and purpose combined.',
    color: 'bg-red-600',
    lightColor: 'bg-red-50',
    textColor: 'text-red-600'
  },
  {
    id: 'cultural-events',
    title: 'Cultural Events',
    description: 'Traditional showcases, heritage festivals, artisan exhibitions — culture in its authentic form.',
    color: 'bg-green-600',
    lightColor: 'bg-green-50',
    textColor: 'text-green-600'
  },
  {
    id: 'behind-the-scenes',
    title: 'Behind the Scenes',
    description: 'Rehearsals, fittings, prep work, candid moments — humanizes the ambassadors and team.',
    color: 'bg-purple-600',
    lightColor: 'bg-purple-50',
    textColor: 'text-purple-600'
  },
  {
    id: 'community-work',
    title: 'Community Work',
    description: 'Outreach programs, youth mentorship, artisan support — the impact beyond the stage.',
    color: 'bg-yellow-600',
    lightColor: 'bg-yellow-50',
    textColor: 'text-yellow-600'
  },
  {
    id: 'global-diplomacy',
    title: 'Global Diplomacy',
    description: 'International conferences, cross-border events, diplomatic forums — Kenya on the world stage.',
    color: 'bg-blue-600',
    lightColor: 'bg-blue-50',
    textColor: 'text-blue-600'
  },
  {
    id: 'awards-recognition',
    title: 'Awards & Recognition',
    description: 'Trophies, certificates, media features, partner acknowledgements — external validation.',
    color: 'bg-emerald-600',
    lightColor: 'bg-emerald-50',
    textColor: 'text-emerald-600'
  }
]

const GalleryPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0)
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState<any>(null)
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false)
  const [photos, setPhotos] = useState<any[]>([])
  const [videos, setVideos] = useState<any[]>([])
  const [categories, setCategories] = useState<string[]>(['All'])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const settings = useSiteSettings()

  useEffect(() => {
    const fetchGalleryData = async () => {
      try {
        setLoading(true)
        const photosResponse = await apiClient.getPhotos()
        const photosData = Array.isArray(photosResponse) ? photosResponse : (photosResponse.results || [])
        setPhotos(photosData)

        const videosResponse = await apiClient.getVideos()
        const videosData = Array.isArray(videosResponse) ? videosResponse : (videosResponse.results || [])
        setVideos(videosData)

        const allCategories = new Set<string>(['All'])
        photosData.forEach((photo: any) => {
          if (photo.category) allCategories.add(photo.category)
        })
        videosData.forEach((video: any) => {
          if (video.category) allCategories.add(video.category)
        })
        setCategories(Array.from(allCategories))
      } catch (err) {
        console.error('Error fetching gallery data:', err)
        setError('Failed to load gallery. Make sure the backend server is running.')
        setCategories(['All', 'Pageant Nights', 'Cultural Events', 'Behind the Scenes', 'Community Work', 'Global Diplomacy', 'Awards & Recognition'])
      } finally {
        setLoading(false)
      }
    }
    fetchGalleryData()
  }, [])

  const defaultCategories = ['All', 'Pageant Nights', 'Cultural Events', 'Behind the Scenes', 'Community Work', 'Global Diplomacy', 'Awards & Recognition']

  const transformPhoto = (photo: any) => ({
    id: photo.id,
    title: photo.title,
    category: photo.category || 'Uncategorized',
    image: photo.image_url || photo.thumbnail_url || photo.image || '',
    photographer: photo.photographer || 'Unknown',
    date: photo.date_taken || photo.created_at || photo.date,
    location: photo.location || '',
    caption: photo.caption || photo.description || '',
    likes: photo.likes || 0,
    featured: photo.featured || false
  })

  const transformVideo = (video: any) => ({
    id: video.id,
    title: video.title,
    category: video.category || 'Uncategorized',
    thumbnail: video.thumbnail_url || video.thumbnail || '',
    videoUrl: video.video_url || video.videoUrl || video.url || '',
    duration: video.duration || '0:00',
    views: video.views || '0',
    date: video.created_at || video.date,
    description: video.description || '',
    caption: video.caption || ''
  })

  const displayCategories = categories.length > 1 ? categories : defaultCategories
  const displayPhotos = photos.length > 0 ? photos.map(transformPhoto) : []
  const displayVideos = videos.length > 0 ? videos.map(transformVideo) : []

  const handlePhotoClick = (index: number) => {
    setSelectedPhotoIndex(index)
    setIsPhotoModalOpen(true)
  }

  const handleVideoClick = (video: any) => {
    setSelectedVideo(video)
    setIsVideoModalOpen(true)
  }

  const [photoLikes, setPhotoLikes] = useState<{[id: number]: { liked: boolean; count: number }}>({})

  const togglePhotoLike = (e: React.MouseEvent, photoId: number, currentLikes: number) => {
    e.stopPropagation()
    const current = photoLikes[photoId]
    if (current?.liked) {
      setPhotoLikes(prev => ({ ...prev, [photoId]: { liked: false, count: currentLikes } }))
    } else {
      setPhotoLikes(prev => ({ ...prev, [photoId]: { liked: true, count: currentLikes + 1 } }))
    }
  }

  const handlePhotoShare = async (e: React.MouseEvent, photo: any) => {
    e.stopPropagation()
    const photoUrl = photo.image || window.location.href
    try {
      if (navigator.share) {
        await navigator.share({ title: photo.title, url: photoUrl })
      } else {
        await navigator.clipboard.writeText(photoUrl)
        alert('Link copied!')
      }
    } catch {}
  }

  const handlePhotoDownload = async (e: React.MouseEvent, photo: any) => {
    e.stopPropagation()
    try {
      const response = await fetch(photo.image)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${photo.title || 'photo'}.jpg`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch {
      window.open(photo.image, '_blank')
    }
  }

  const finalPhotos = displayPhotos
  const finalVideos = displayVideos

  const filteredPhotos = selectedCategory === 'All'
    ? finalPhotos
    : finalPhotos.filter(photo => photo.category === selectedCategory)

  const filteredVideos = selectedCategory === 'All'
    ? finalVideos
    : finalVideos.filter(video => video.category === selectedCategory)

  const getCategoryInfo = (categoryName: string) => {
    return galleryCategories.find(c => c.id === categoryName.toLowerCase().replace(/\s+/g, '-'))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[55vh] min-h-[450px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <motion.div
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
            className="w-full h-full"
          >
            <div className="absolute inset-0 bg-black/60 z-10" />
            <div
              className="w-full h-full bg-cover bg-center"
              style={settings.gallery_hero_image_url ? { backgroundImage: `url(${settings.gallery_hero_image_url})` } : undefined}
            />
          </motion.div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-red-500/20 rounded-full blur-3xl animate-pulse-glow" />
          <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-green-600/20 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <p className="text-sm sm:text-base uppercase tracking-[0.3em] text-red-400 mb-4 font-semibold">The Mission in Motion</p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight drop-shadow-2xl tracking-tight">
              See Every <span className="text-red-600">Moment</span>
            </h1>
            <div className="w-24 h-1 bg-red-600 mx-auto mb-8 rounded-full" />
            <p className="text-lg sm:text-xl md:text-2xl text-gray-100 max-w-3xl mx-auto px-4 drop-shadow-lg font-light leading-relaxed">
              From pageant stages to community workshops, diplomatic forums to cultural celebrations — this is where words become images.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Gallery Categories — What They Communicate */}
      <section className="py-16 bg-white relative overflow-hidden">
        <div className="absolute inset-0 decorative-pattern opacity-[0.03]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Every Photo Tells a <span className="text-red-600">Story</span></h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Each category captures a different dimension of our mission. Browse by what you want to see — and understand.</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryCategories.map((cat, index) => (
              <motion.button
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                viewport={{ once: true }}
                onClick={() => setSelectedCategory(cat.title)}
                className={`text-left p-6 rounded-2xl border-2 transition-all duration-300 group hover:shadow-lg ${
                  selectedCategory === cat.title
                    ? `${cat.color} text-white border-transparent shadow-lg`
                    : 'bg-white border-gray-100 hover:border-gray-200'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl ${selectedCategory === cat.title ? 'bg-white/20' : cat.lightColor} flex items-center justify-center mb-4`}>
                  <Camera className={`w-5 h-5 ${selectedCategory === cat.title ? 'text-white' : cat.textColor}`} />
                </div>
                <h3 className="text-lg font-bold mb-2">{cat.title}</h3>
                <p className={`text-sm leading-relaxed ${selectedCategory === cat.title ? 'text-white/80' : 'text-gray-600'}`}>{cat.description}</p>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Content */}
      <section className="py-20 bg-gray-50 relative overflow-hidden">
        <div className="absolute inset-0 decorative-pattern opacity-[0.03]" />
        <div className="absolute top-20 left-10 w-96 h-96 bg-red-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-green-500/5 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Empty Gallery State */}
          {!loading && finalPhotos.length === 0 && finalVideos.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center py-20"
            >
              <Camera className="w-20 h-20 text-gray-300 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Gallery Coming Soon</h3>
              <p className="text-gray-600 max-w-lg mx-auto leading-relaxed">Photos and videos from our events, community work, and cultural celebrations will appear here once uploaded. Check back soon!</p>
            </motion.div>
          ) : (
          <>
          {/* Category Filter Pills */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-16"
          >
            {loading ? (
              <div className="text-center w-full py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                <p className="mt-2 text-gray-600 text-sm">Loading categories...</p>
              </div>
            ) : error ? (
              <div className="text-center w-full py-8">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            ) : (
              displayCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 text-sm sm:text-base transform hover:-translate-y-1 ${selectedCategory === category
                    ? 'bg-red-600 text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-100'
                  }`}
                >
                  {category}
                </button>
              ))
            )}
          </motion.div>

          {/* Photo Gallery */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="mb-24"
          >
            <div className="flex flex-col sm:flex-row items-center justify-between mb-10 gap-4">
              <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Camera className="w-8 h-8 text-red-600" />
                <span className="text-red-600">Photos</span>
                <span className="text-lg text-gray-400 font-normal">({filteredPhotos.length})</span>
              </h2>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
                <p className="mt-4 text-gray-600">Loading photos...</p>
              </div>
            ) : filteredPhotos.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600">No photos in this category yet.</p>
              </div>
            ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredPhotos.map((photo, index) => (
                <motion.div
                  key={photo.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  viewport={{ once: true }}
                  className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 group cursor-pointer h-96"
                  onClick={() => handlePhotoClick(index)}
                >
                  <img
                    src={photo.image}
                    alt={photo.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Featured Badge */}
                  {photo.featured && (
                    <div className="absolute top-4 left-4 transform -translate-y-10 group-hover:translate-y-0 transition-transform duration-300 delay-100">
                      <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-sm">
                        Featured
                      </span>
                    </div>
                  )}

                  {/* Category Badge */}
                  <div className="absolute top-4 right-4 transform -translate-y-10 group-hover:translate-y-0 transition-transform duration-300 delay-100">
                    <span className="bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border border-white/20">
                      {photo.category}
                    </span>
                  </div>

                  {/* Hover Actions */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex space-x-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-150">
                      <button onClick={(e) => togglePhotoLike(e, photo.id, photo.likes)} className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-200 border ${photoLikes[photo.id]?.liked ? 'bg-red-500/30 border-red-500/40' : 'bg-white/20 border-white/20 hover:bg-white/40'}`}>
                        <Heart className={`w-6 h-6 text-white ${photoLikes[photo.id]?.liked ? 'fill-current' : ''}`} />
                      </button>
                      <button onClick={(e) => handlePhotoShare(e, photo)} className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/40 transition-colors duration-200 border border-white/20">
                        <Share2 className="w-6 h-6 text-white" />
                      </button>
                      <button onClick={(e) => handlePhotoDownload(e, photo)} className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/40 transition-colors duration-200 border border-white/20">
                        <Download className="w-6 h-6 text-white" />
                      </button>
                    </div>
                  </div>

                  {/* Story Caption & Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 delay-100">
                    <h3 className="font-bold text-lg mb-1.5 line-clamp-2">{photo.title}</h3>
                    {photo.caption && (
                      <p className="text-sm text-gray-200 mb-2 line-clamp-2 font-light leading-relaxed">{photo.caption}</p>
                    )}
                    <div className="flex items-center justify-between text-xs text-gray-300">
                      <div className="flex items-center gap-3">
                        {photo.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {photo.location}
                          </span>
                        )}
                        {photo.date && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(photo.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-1.5 bg-black/30 px-2 py-1 rounded-full backdrop-blur-sm">
                        <Heart className={`w-3.5 h-3.5 ${photoLikes[photo.id]?.liked ? 'text-red-400 fill-red-400' : 'text-red-400 fill-red-400'}`} />
                        <span className="font-medium">{photoLikes[photo.id]?.count ?? photo.likes}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            )}
          </motion.div>

          {/* Video Gallery */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3 mb-10">
              <Video className="w-8 h-8 text-red-600" />
              <span className="text-red-600">Videos</span>
              <span className="text-lg text-gray-400 font-normal">({filteredVideos.length})</span>
            </h2>
            {filteredVideos.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600">No videos in this category yet.</p>
              </div>
            ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredVideos.map((video, index) => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="relative overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 group cursor-pointer transform hover:-translate-y-2 bg-white border border-gray-100"
                  onClick={() => handleVideoClick(video)}
                >
                  <div className="relative h-56">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />

                    {/* Play Button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center group-hover:bg-white/30 transition-all duration-300 border border-white/30 group-hover:scale-110">
                        <div className="w-0 h-0 border-l-[16px] border-l-white border-y-[10px] border-y-transparent ml-1" />
                      </div>
                    </div>

                    {/* Duration */}
                    <div className="absolute bottom-4 right-4">
                      <span className="bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold">
                        {video.duration}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-red-600 transition-colors duration-300">
                      {video.caption || video.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{video.description}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span className="bg-gray-100 px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide">{video.category}</span>
                      <div className="flex items-center space-x-2">
                        <Play className="w-3.5 h-3.5" />
                        <span>{video.views} views</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            )}
          </motion.div>

          </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-green-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 decorative-pattern opacity-5" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-500/10 rounded-full blur-3xl" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Be Part of the <span className="text-red-600">Story</span>?</h2>
            <p className="text-xl text-green-100 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
              These moments happen because people like you show up, contribute, and believe in the power of culture.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/contribute" className="inline-flex items-center justify-center bg-red-600 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 gap-2">
                Support the Mission <ChevronRight className="w-5 h-5" />
              </Link>
              <Link href="/events" className="inline-flex items-center justify-center bg-transparent border-2 border-white/30 text-white hover:bg-white/10 px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 backdrop-blur-sm gap-2">
                Attend an Event <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Modals */}
      <PhotoLightboxModal
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
        photos={filteredPhotos.map(p => ({
          ...p,
          likes: photoLikes[p.id]?.count ?? p.likes,
        }))}
        currentIndex={selectedPhotoIndex}
        onNavigate={setSelectedPhotoIndex}
      />

      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        video={selectedVideo}
      />
    </div>
  )
}

export default GalleryPage
