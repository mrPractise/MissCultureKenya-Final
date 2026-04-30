'use client'

import { motion } from 'framer-motion'
import { Play, Share2, Download, Calendar, Eye, X } from 'lucide-react'

interface Video {
  id: number
  title: string
  thumbnail: string
  videoUrl: string
  duration: string
  views: string
  date: string
  category: string
  description?: string
}

interface VideoModalProps {
  isOpen: boolean
  onClose: () => void
  video: Video | null
}

const VideoModal = ({ isOpen, onClose, video }: VideoModalProps) => {
  if (!isOpen || !video) return null

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.2 }}
        className="bg-white w-full h-full overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Video Player */}
        <div className="relative bg-black flex-shrink-0">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-colors duration-200"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
          <div className="aspect-video">
            {video.videoUrl && video.videoUrl.includes('youtube') ? (
              <iframe
                src={video.videoUrl}
                title={video.title}
                className="w-full h-full rounded-t-2xl"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : video.videoUrl ? (
              <video
                src={video.videoUrl}
                title={video.title}
                className="w-full h-full rounded-t-2xl bg-black"
                controls
                autoPlay
                poster={video.thumbnail || undefined}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-black text-white">
                No video available
              </div>
            )}
          </div>
        </div>

        {/* Video Info */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Main Info */}
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{video.title}</h2>
              
              {video.description && (
                <p className="text-gray-600 mb-6 leading-relaxed">{video.description}</p>
              )}

              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-6">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(video.date).toLocaleDateString('en-US')}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Eye className="w-4 h-4" />
                  <span>{video.views} views</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Play className="w-4 h-4" />
                  <span>{video.duration}</span>
                </div>
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                  {video.category}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors duration-200">
                  <Share2 className="w-5 h-5" />
                  <span>Share</span>
                </button>
                
                <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition-colors duration-200">
                  <Download className="w-5 h-5" />
                  <span>Download</span>
                </button>
              </div>
            </div>

            {/* Related Videos Placeholder */}
            <div className="w-full lg:w-80">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Videos</h3>
              <div className="space-y-4">
                <div className="flex space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors duration-200">
                  <div className="w-20 h-12 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
                    <Play className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 line-clamp-2">
                      Cultural Heritage Documentary
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">2.5K views • 2 days ago</p>
                  </div>
                </div>
                
                <div className="flex space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors duration-200">
                  <div className="w-20 h-12 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
                    <Play className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 line-clamp-2">
                      Traditional Dance Performance
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">1.8K views • 1 week ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default VideoModal
