'use client'

import { motion } from 'framer-motion'
import { Camera, Video, Download, Share2, MapPin, Calendar, Play, ChevronRight } from 'lucide-react'
import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import PhotoLightboxModal from '@/components/PhotoLightboxModal'
import VideoModal from '@/components/VideoModal'
import apiClient from '@/lib/api'
import { useGalleryPageSettings } from '@/lib/usePageSettings'

const getItemDate = (item: any) => item.date_taken || item.created_at || item.date || null

const getItemYear = (item: any) => {
  const date = getItemDate(item)
  if (!date) return null
  const year = new Date(date).getFullYear()
  return Number.isFinite(year) ? year.toString() : null
}

const getCollectionId = (item: any) => item.collection ? String(item.collection) : 'uncategorized'

const GalleryPage = () => {
  const [selectedCollection, setSelectedCollection] = useState('All')
  const [selectedYear, setSelectedYear] = useState('All')
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0)
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState<any>(null)
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false)
  const [photos, setPhotos] = useState<any[]>([])
  const [videos, setVideos] = useState<any[]>([])
  const [collections, setCollections] = useState<string[]>(['All'])
  const [collectionNames, setCollectionNames] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [shareStatus, setShareStatus] = useState<string>('')
  const { settings: pageSettings } = useGalleryPageSettings()

  useEffect(() => {
    const fetchGalleryData = async () => {
      try {
        setLoading(true)
        const [photosResponse, videosResponse, collectionsResponse] = await Promise.all([
          apiClient.getPhotos(),
          apiClient.getVideos(),
          apiClient.getPhotoCollections(),
        ])

        const photosData = Array.isArray(photosResponse) ? photosResponse : (photosResponse.results || [])
        setPhotos(photosData)

        const videosData = Array.isArray(videosResponse) ? videosResponse : (videosResponse.results || [])
        setVideos(videosData)

        const collectionsData = Array.isArray(collectionsResponse) ? collectionsResponse : (collectionsResponse.results || [])
        const namesById = collectionsData.reduce((acc: Record<string, string>, collection: any) => {
          acc[String(collection.id)] = collection.name
          return acc
        }, { uncategorized: 'Uncategorized' })
        setCollectionNames(namesById)

        const uniqueCollections = [...new Set([
          ...photosData.map(getCollectionId),
          ...videosData.map(getCollectionId),
        ])]
        const allCollections: string[] = ['All', ...uniqueCollections]
        setCollections(allCollections)
      } catch (err) {
        console.error('Error fetching gallery data:', err)
        setError('Failed to load gallery. Make sure the backend server is running.')
        setCollections(['All'])
      } finally {
        setLoading(false)
      }
    }
    fetchGalleryData()
  }, [])

  const transformPhoto = (photo: any) => ({
    id: photo.id,
    title: photo.title,
    category: collectionNames[getCollectionId(photo)] || `Collection ${getCollectionId(photo)}`,
    collectionId: getCollectionId(photo),
    image: photo.image_url || photo.thumbnail_url || photo.image || '',
    photographer: photo.photographer || 'Unknown',
    date: getItemDate(photo),
    location: photo.location || '',
    caption: photo.caption || photo.description || '',
    likes: photo.likes || 0,
    featured: photo.featured || false
  })

  const transformVideo = (video: any) => ({
    id: video.id,
    title: video.title,
    category: collectionNames[getCollectionId(video)] || `Collection ${getCollectionId(video)}`,
    collectionId: getCollectionId(video),
    thumbnail: video.thumbnail_url || video.thumbnail || '',
    videoUrl: video.video_url || video.videoUrl || video.url || '',
    duration: video.duration || '0:00',
    views: video.views || '0',
    date: getItemDate(video),
    description: video.description || '',
    caption: video.caption || ''
  })

  const displayPhotos = useMemo(
    () => photos.length > 0 ? photos.map(transformPhoto) : [],
    [photos, collectionNames]
  )
  const displayVideos = useMemo(
    () => videos.length > 0 ? videos.map(transformVideo) : [],
    [videos, collectionNames]
  )

  const handlePhotoClick = (index: number) => {
    setSelectedPhotoIndex(index)
    setIsPhotoModalOpen(true)
  }

  const handleVideoClick = (video: any) => {
    setSelectedVideo(video)
    setIsVideoModalOpen(true)
  }

  const finalPhotos = displayPhotos
  const finalVideos = displayVideos

  const getCollectionLabel = (collection: string) => (
    collection === 'All' ? 'All' : collectionNames[collection] || `Collection ${collection}`
  )

  const filteredPhotos = finalPhotos.filter(photo => {
    const matchesCollection = selectedCollection === 'All' || photo.collectionId === selectedCollection
    const matchesYear = selectedYear === 'All' || (photo.date && new Date(photo.date).getFullYear().toString() === selectedYear)
    return matchesCollection && matchesYear
  })

  const filteredVideos = finalVideos.filter(video => {
    const matchesCollection = selectedCollection === 'All' || video.collectionId === selectedCollection
    const matchesYear = selectedYear === 'All' || (video.date && new Date(video.date).getFullYear().toString() === selectedYear)
    return matchesCollection && matchesYear
  })

  const years = useMemo(() => (
    ['All', ...new Set([
      ...finalPhotos
        .filter(photo => selectedCollection === 'All' || photo.collectionId === selectedCollection)
        .map(getItemYear)
        .filter((year): year is string => year !== null),
      ...finalVideos
        .filter(video => selectedCollection === 'All' || video.collectionId === selectedCollection)
        .map(getItemYear)
        .filter((year): year is string => year !== null),
    ])].sort((a, b) => {
      if (a === 'All') return -1
      if (b === 'All') return 1
      return Number(b) - Number(a)
    })
  ), [finalPhotos, finalVideos, selectedCollection])

  useEffect(() => {
    if (!years.includes(selectedYear)) {
      setSelectedYear('All')
    }
  }, [selectedYear, years])

  const handlePhotoShare = async (e: React.MouseEvent<HTMLButtonElement>, photo: any) => {
    e.stopPropagation()
    const shareUrl = `${window.location.origin}/gallery`

    try {
      if (navigator.share) {
        await navigator.share({
          title: photo.title || 'MissCulture Kenya Photo',
          text: photo.caption || 'Check out this photo from MissCulture Kenya.',
          url: shareUrl,
        })
        setShareStatus('Photo shared successfully.')
      } else {
        await navigator.clipboard.writeText(shareUrl)
        setShareStatus('Photo link copied to clipboard.')
      }
    } catch (err) {
      console.error('Share failed', err)
      setShareStatus('Unable to share this photo right now.')
    }
  }

  const handlePhotoDownload = (e: React.MouseEvent<HTMLButtonElement>, photo: any) => {
    e.stopPropagation()
    const link = document.createElement('a')
    link.href = photo.image
    link.download = `${photo.title || 'missculture-photo'}.jpg`
    document.body.appendChild(link)
    link.click()
    link.remove()
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
              style={pageSettings.hero_image_url ? { backgroundImage: `url(${pageSettings.hero_image_url})` } : undefined}
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
              {/* Collection Filter */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex flex-wrap justify-center gap-3 mb-6 px-4"
              >
                {loading ? (
                  <div className="text-center w-full py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                    <p className="mt-2 text-gray-600 text-sm">Loading collections...</p>
                  </div>
                ) : error ? (
                  <div className="text-center w-full py-8">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                ) : (
                  collections.map((collection) => (
                    <button
                      key={collection}
                      onClick={() => {
                        setSelectedCollection(collection)
                        setSelectedYear('All')
                      }}
                      className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 text-sm sm:text-base transform hover:-translate-y-1 ${
                        selectedCollection === collection
                          ? 'bg-red-600 text-white shadow-lg'
                          : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-100'
                      }`}
                    >
                      {getCollectionLabel(collection)}
                    </button>
                  ))
                )}
              </motion.div>

              {/* Year Filter */}
              {years.length > 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="flex flex-wrap justify-center gap-2 mb-8 px-4"
                >
                  <span className="text-sm text-gray-500 self-center mr-2">Year:</span>
                  {years.map((year) => (
                    <button
                      key={year}
                      onClick={() => setSelectedYear(year)}
                      className={`px-4 py-2 rounded-full font-medium transition-all duration-300 text-sm ${
                        selectedYear === year
                          ? 'bg-green-600 text-white shadow-md'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {year}
                    </button>
                  ))}
                </motion.div>
              )}

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
                <p className="text-gray-600">No photos in this collection yet.</p>
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
                  className="relative aspect-[4/5] overflow-hidden rounded-xl bg-gray-100 shadow-lg hover:shadow-2xl transition-all duration-500 group cursor-pointer"
                  onClick={() => handlePhotoClick(index)}
                >
                  {photo.image ? (
                    <img
                      src={photo.image}
                      alt={photo.title}
                      className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <Camera className="h-10 w-10 text-gray-300" />
                    </div>
                  )}

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

                  {/* Collection Badge */}
                  <div className="absolute top-4 right-4 transform -translate-y-10 group-hover:translate-y-0 transition-transform duration-300 delay-100">
                    <span className="bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border border-white/20">
                      {photo.category}
                    </span>
                  </div>

                  {/* Hover Actions */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex space-x-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-150">
                      <button
                        onClick={(e) => handlePhotoShare(e, photo)}
                        title="Share photo"
                        className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/40 transition-colors duration-200 border border-white/20"
                      >
                        <Share2 className="w-6 h-6 text-white" />
                      </button>
                      <button
                        onClick={(e) => handlePhotoDownload(e, photo)}
                        title="Download photo"
                        className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/40 transition-colors duration-200 border border-white/20"
                      >
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
                <p className="text-gray-600">No videos in this collection yet.</p>
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

                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-red-600 transition-colors duration-300">
                      {video.caption || video.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{video.description}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      {video.category && (
                        <span className="bg-gray-100 px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide">{video.category}</span>
                      )}
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
        photos={filteredPhotos}
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
