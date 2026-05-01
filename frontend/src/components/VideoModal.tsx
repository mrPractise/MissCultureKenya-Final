'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Share2, Calendar, Eye, X, ExternalLink, Play } from 'lucide-react'
import { useCallback, useState } from 'react'

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
  caption?: string
}

interface VideoModalProps {
  isOpen: boolean
  onClose: () => void
  video: Video | null
}

const getYouTubeEmbedUrl = (url: string): string | null => {
  if (!url) return null
  const watchMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
  if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}?autoplay=1&rel=0`
  const embedMatch = url.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/)
  if (embedMatch) return `https://www.youtube.com/embed/${embedMatch[1]}?autoplay=1&rel=0`
  const shortsMatch = url.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/)
  if (shortsMatch) return `https://www.youtube.com/embed/${shortsMatch[1]}?autoplay=1&rel=0`
  return null
}

const isYouTubeUrl = (url: string): boolean => {
  return !!getYouTubeEmbedUrl(url)
}

const VideoModal = ({ isOpen, onClose, video }: VideoModalProps) => {
  const [shareMsg, setShareMsg] = useState('')

  const handleShare = useCallback(async () => {
    if (!video) return
    const shareData = {
      title: video.title,
      text: video.caption || video.description || video.title,
      url: video.videoUrl || window.location.href,
    }
    try {
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        await navigator.clipboard.writeText(shareData.url)
        setShareMsg('Link copied!')
        setTimeout(() => setShareMsg(''), 2000)
      }
    } catch {}
  }, [video])

  if (!isOpen || !video) return null

  const youtubeEmbedUrl = getYouTubeEmbedUrl(video.videoUrl)
  const isYT = isYouTubeUrl(video.videoUrl)

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Video Player - centered, 16:9 aspect ratio */}
        <div className="relative bg-black w-full">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-10 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>

          <div className="w-full aspect-video">
            {isYT && youtubeEmbedUrl ? (
              <iframe
                src={youtubeEmbedUrl}
                title={video.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : video.videoUrl ? (
              <video
                src={video.videoUrl}
                title={video.title}
                className="w-full h-full bg-black"
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
        <div className="p-5">
          <h2 className="text-xl font-bold text-gray-900 mb-2">{video.title}</h2>

          {video.description && (
            <p className="text-gray-600 text-sm leading-relaxed mb-3">{video.description}</p>
          )}

          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-4">
            {video.date && (
              <div className="flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>{new Date(video.date).toLocaleDateString('en-US')}</span>
              </div>
            )}
            {video.views && (
              <div className="flex items-center space-x-1">
                <Eye className="w-3.5 h-3.5" />
                <span>{video.views} views</span>
              </div>
            )}
            {video.duration && (
              <div className="flex items-center space-x-1">
                <Play className="w-3.5 h-3.5" />
                <span>{video.duration}</span>
              </div>
            )}
            <span className="bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-full text-xs font-medium">
              {video.category}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold text-sm transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span>Share</span>
              {shareMsg && <span className="text-green-200 text-xs ml-1">{shareMsg}</span>}
            </button>

            {isYT && video.videoUrl && (
              <a
                href={video.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold text-sm transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Watch on YouTube</span>
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default VideoModal
