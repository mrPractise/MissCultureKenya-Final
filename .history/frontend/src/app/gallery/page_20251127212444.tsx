'use client'

import { motion } from 'framer-motion'
import { Camera, Video, Download, Share2, Heart, Filter } from 'lucide-react'
import { useState, useEffect } from 'react'
import PhotoLightboxModal from '@/components/PhotoLightboxModal'
import VideoModal from '@/components/VideoModal'
import apiClient from '@/lib/api'

const GalleryPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0)
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState(null)
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false)
  const [photos, setPhotos] = useState<any[]>([])
  const [videos, setVideos] = useState<any[]>([])
  const [categories, setCategories] = useState<string[]>(['All'])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchGalleryData = async () => {
      try {
        setLoading(true)
        
        // Fetch photos
        const photosResponse = await apiClient.getPhotos()
        const photosData = Array.isArray(photosResponse) 
          ? photosResponse 
          : (photosResponse.results || [])
        setPhotos(photosData)

        // Fetch videos
        const videosResponse = await apiClient.getVideos()
        const videosData = Array.isArray(videosResponse)
          ? videosResponse
          : (videosResponse.results || [])
        setVideos(videosData)

        // Extract unique categories from photos and videos
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
        // Keep default categories
        setCategories(['All', 'Official Photoshoots', 'Cultural Events', 'Behind the Scenes', 'Community Work', 'Travel', 'Awards'])
      } finally {
        setLoading(false)
      }
    }

    fetchGalleryData()
  }, [])

  // Default categories fallback
  const defaultCategories = ['All', 'Official Photoshoots', 'Cultural Events', 'Behind the Scenes', 'Community Work', 'Travel', 'Awards']

  // Helper function to transform API photo data
  const transformPhoto = (photo: any) => {
    if (photo.image && photo.title) {
      return photo // Already in correct format
    }
    return {
      id: photo.id,
      title: photo.title,
      category: photo.category || 'Uncategorized',
      image: photo.image_url || photo.image || photo.featured_image || 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=600&h=800&fit=crop',
      photographer: photo.photographer || 'Unknown',
      date: photo.date_taken || photo.created_at || photo.date,
      likes: photo.likes || 0,
      featured: photo.featured || false
    }
  }

  // Helper function to transform API video data
  const transformVideo = (video: any) => {
    if (video.thumbnail && video.videoUrl) {
      return video // Already in correct format
    }
    return {
      id: video.id,
      title: video.title,
      category: video.category || 'Uncategorized',
      thumbnail: video.thumbnail_url || video.thumbnail || video.featured_image || 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=600&h=400&fit=crop',
      videoUrl: video.video_url || video.videoUrl || video.url || 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      duration: video.duration || '0:00',
      views: video.views || '0',
      date: video.created_at || video.date,
      description: video.description || ''
    }
  }

  const displayCategories = categories.length > 1 ? categories : defaultCategories
  const displayPhotos = photos.length > 0 ? photos.map(transformPhoto) : []
  const displayVideos = videos.length > 0 ? videos.map(transformVideo) : []

  // Default photos for fallback
  const defaultPhotos = [
    {
      id: 1,
      title: 'Traditional Attire Photoshoot',
      category: 'Official Photoshoots',
      image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=600&h=800&fit=crop',
      photographer: 'John Doe',
      date: '2024-01-15',
      likes: 245,
      featured: true
    },
    {
      id: 2,
      title: 'Cultural Festival Performance',
      category: 'Cultural Events',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop',
      photographer: 'Jane Smith',
      date: '2024-01-10',
      likes: 189,
      featured: false
    },
    {
      id: 3,
      title: 'Behind the Scenes - Preparation',
      category: 'Behind the Scenes',
      image: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=600&h=600&fit=crop',
      photographer: 'Mike Johnson',
      date: '2024-01-08',
      likes: 156,
      featured: true
    },
    {
      id: 4,
      title: 'Community Outreach Program',
      category: 'Community Work',
      image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=600&h=400&fit=crop',
      photographer: 'Sarah Wilson',
      date: '2024-01-05',
      likes: 203,
      featured: false
    },
    {
      id: 5,
      title: 'International Conference',
      category: 'Travel',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=800&fit=crop',
      photographer: 'David Brown',
      date: '2024-01-01',
      likes: 178,
      featured: true
    },
    {
      id: 6,
      title: 'Award Ceremony',
      category: 'Awards',
      image: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=600&h=600&fit=crop',
      photographer: 'Lisa Davis',
      date: '2023-12-28',
      likes: 312,
      featured: false
    },
    {
      id: 7,
      title: 'Traditional Dance Performance',
      category: 'Cultural Events',
      image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=600&h=400&fit=crop',
      photographer: 'Tom Wilson',
      date: '2023-12-25',
      likes: 167,
      featured: false
    },
    {
      id: 8,
      title: 'UNESCO Event',
      category: 'Official Photoshoots',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=800&fit=crop',
      photographer: 'Emma Taylor',
      date: '2023-12-20',
      likes: 234,
      featured: true
    },
    {
      id: 9,
      title: 'Community Workshop',
      category: 'Community Work',
      image: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=600&h=600&fit=crop',
      photographer: 'Alex Johnson',
      date: '2023-12-15',
      likes: 145,
      featured: false
    },
    {
      id: 10,
      title: 'Fashion Show',
      category: 'Official Photoshoots',
      image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=600&h=400&fit=crop',
      photographer: 'Chris Lee',
      date: '2023-12-10',
      likes: 198,
      featured: false
    },
    {
      id: 11,
      title: 'Cultural Exchange Program',
      category: 'Travel',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=800&fit=crop',
      photographer: 'Maria Garcia',
      date: '2023-12-05',
      likes: 221,
      featured: true
    },
    {
      id: 12,
      title: 'Youth Empowerment Event',
      category: 'Community Work',
      image: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=600&h=600&fit=crop',
      photographer: 'James Miller',
      date: '2023-11-30',
      likes: 176,
      featured: false
    }
  ]

  const videos = [
    {
      id: 1,
      title: 'Susan\'s Cultural Journey',
      category: 'Behind the Scenes',
      thumbnail: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=600&h=400&fit=crop',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      duration: '5:32',
      views: '12.5K',
      date: '2024-01-15',
      description: 'A behind-the-scenes look at Susan\'s journey as a cultural ambassador.'
    },
    {
      id: 2,
      title: 'Traditional Dance Performance',
      category: 'Cultural Events',
      thumbnail: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      duration: '3:45',
      views: '8.7K',
      date: '2024-01-10',
      description: 'Experience the beauty of traditional Kenyan dance performances.'
    },
    {
      id: 3,
      title: 'Community Impact Story',
      category: 'Community Work',
      thumbnail: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=600&h=400&fit=crop',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      duration: '7:18',
      views: '15.2K',
      date: '2024-01-05',
      description: 'See how Susan\'s work impacts local communities across Kenya.'
    }
  ]

  const handlePhotoClick = (index: number) => {
    setSelectedPhotoIndex(index)
    setIsPhotoModalOpen(true)
  }

  const handleVideoClick = (video: any) => {
    setSelectedVideo(video)
    setIsVideoModalOpen(true)
  }

  const finalPhotos = displayPhotos.length > 0 ? displayPhotos : defaultPhotos
  const finalVideos = displayVideos.length > 0 ? displayVideos : [
    {
      id: 1,
      title: 'Susan\'s Cultural Journey',
      category: 'Behind the Scenes',
      thumbnail: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=600&h=400&fit=crop',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      duration: '5:32',
      views: '12.5K',
      date: '2024-01-15',
      description: 'A behind-the-scenes look at Susan\'s journey as a cultural ambassador.'
    }
  ]

  const filteredPhotos = selectedCategory === 'All'
    ? finalPhotos
    : finalPhotos.filter(photo => photo.category === selectedCategory)

  const filteredVideos = selectedCategory === 'All'
    ? finalVideos
    : finalVideos.filter(video => video.category === selectedCategory)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <motion.div
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
            className="w-full h-full"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60 z-10" />
            <div
              className="w-full h-full bg-cover bg-center"
              style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=1920&h=600&fit=crop)' }}
            />
          </motion.div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse-glow" />
          <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight drop-shadow-2xl tracking-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400">Gallery</span>
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-pink-500 to-purple-500 mx-auto mb-8 rounded-full" />
            <p className="text-lg sm:text-xl md:text-2xl text-gray-100 max-w-3xl mx-auto px-4 drop-shadow-lg font-light leading-relaxed">
              Explore Susan's journey through stunning photographs and videos capturing cultural moments,
              official events, and behind-the-scenes glimpses.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Gallery Content */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute inset-0 decorative-pattern opacity-[0.03]" />
        <div className="absolute top-20 left-10 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-16"
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 text-sm sm:text-base transform hover:-translate-y-1 ${selectedCategory === category
                    ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-pink-50 hover:text-pink-600 shadow-md hover:shadow-lg border border-gray-100'
                  }`}
              >
                {category}
              </button>
            ))}
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
              <h2 className="text-3xl font-bold text-gray-900">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">Photos</span>
              </h2>
              <div className="flex items-center space-x-4">
                <button className="flex items-center space-x-2 text-gray-600 hover:text-pink-600 transition-colors duration-200 font-medium">
                  <Filter className="w-5 h-5" />
                  <span>Filter</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredPhotos.map((photo, index) => (
                <motion.div
                  key={photo.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  viewport={{ once: true }}
                  className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 group cursor-pointer h-80"
                  onClick={() => handlePhotoClick(index)}
                >
                  <img
                    src={photo.image}
                    alt={photo.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

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

                  {/* Hover Content */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex space-x-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-150">
                      <button className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/40 transition-colors duration-200 border border-white/20">
                        <Heart className="w-6 h-6 text-white" />
                      </button>
                      <button className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/40 transition-colors duration-200 border border-white/20">
                        <Share2 className="w-6 h-6 text-white" />
                      </button>
                      <button className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/40 transition-colors duration-200 border border-white/20">
                        <Download className="w-6 h-6 text-white" />
                      </button>
                    </div>
                  </div>

                  {/* Bottom Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-100">
                    <h3 className="font-bold text-lg mb-2 line-clamp-1">{photo.title}</h3>
                    <div className="flex items-center justify-between text-sm text-gray-200">
                      <span className="font-light">{photo.photographer}</span>
                      <div className="flex items-center space-x-1.5 bg-black/30 px-2 py-1 rounded-full backdrop-blur-sm">
                        <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500" />
                        <span className="font-medium">{photo.likes}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Video Gallery */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-10">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">Videos</span>
            </h2>
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
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-pink-600 transition-colors duration-300">
                      {video.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{video.description}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span className="bg-gray-100 px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide">{video.category}</span>
                      <div className="flex items-center space-x-2">
                        <span>{video.views} views</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
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
