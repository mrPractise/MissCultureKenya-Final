'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Share2, Download, ChevronLeft, ChevronRight, X, MapPin, Calendar, Camera } from 'lucide-react'
import { useState, useEffect, useCallback } from 'react'

interface Photo {
  id: number
  title: string
  image: string
  photographer: string
  date: string
  likes: number
  category: string
  description?: string
  event?: string
  about?: string
  location?: string
  caption?: string
}

interface PhotoLightboxModalProps {
  isOpen: boolean
  onClose: () => void
  photos: Photo[]
  currentIndex: number
  onNavigate: (index: number) => void
}

const PhotoLightboxModal = ({ 
  isOpen, 
  onClose, 
  photos, 
  currentIndex, 
  onNavigate 
}: PhotoLightboxModalProps) => {
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [shareMsg, setShareMsg] = useState('')
  const currentPhoto = photos[currentIndex]

  useEffect(() => {
    if (currentPhoto) {
      setIsLiked(false)
      setLikeCount(currentPhoto.likes || 0)
    }
  }, [currentPhoto?.id])

  const handlePrevious = useCallback(() => {
    if (photos.length <= 1) return
    const newIndex = currentIndex > 0 ? currentIndex - 1 : photos.length - 1
    onNavigate(newIndex)
  }, [currentIndex, photos.length, onNavigate])

  const handleNext = useCallback(() => {
    if (photos.length <= 1) return
    const newIndex = currentIndex < photos.length - 1 ? currentIndex + 1 : 0
    onNavigate(newIndex)
  }, [currentIndex, photos.length, onNavigate])

  // Global keyboard listener
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') handlePrevious()
      if (e.key === 'ArrowRight') handleNext()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose, handlePrevious, handleNext])

  const handleLike = () => {
    if (isLiked) {
      setLikeCount(prev => prev - 1)
    } else {
      setLikeCount(prev => prev + 1)
    }
    setIsLiked(!isLiked)
  }

  const handleShare = async () => {
    const photoUrl = currentPhoto?.image || window.location.href
    const shareData = {
      title: currentPhoto?.title || 'Miss Culture Global Kenya Gallery',
      text: currentPhoto?.caption || currentPhoto?.description || `Photo: ${currentPhoto?.title}`,
      url: photoUrl,
    }
    try {
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        await navigator.clipboard.writeText(photoUrl)
        setShareMsg('Link copied!')
        setTimeout(() => setShareMsg(''), 2000)
      }
    } catch {
      // user cancelled share
    }
  }

  const handleDownload = async () => {
    if (!currentPhoto?.image) return
    try {
      const response = await fetch(currentPhoto.image)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${currentPhoto.title || 'photo'}.jpg`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch {
      // Fallback: open in new tab
      window.open(currentPhoto.image, '_blank')
    }
  }

  if (!isOpen || !currentPhoto) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex flex-col"
      onClick={onClose}
    >
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-black/50 relative z-20" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 text-white">
          <Camera className="w-5 h-5 text-red-400" />
          <span className="font-semibold text-sm">{currentPhoto.title}</span>
          {currentPhoto.category && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-gray-300">{currentPhoto.category}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {photos.length > 1 && (
            <span className="text-sm text-gray-400 mr-3">{currentIndex + 1} / {photos.length}</span>
          )}
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors duration-200"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Main Area */}
      <div className="flex-1 flex items-center justify-center relative min-h-0" onClick={(e) => e.stopPropagation()}>
        {/* Navigation Arrows */}
        {photos.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute left-3 z-20 p-2 bg-black/40 hover:bg-black/60 rounded-full transition-colors duration-200 group"
            >
              <ChevronLeft className="w-7 h-7 text-white group-hover:scale-110 transition-transform" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-3 z-20 p-2 bg-black/40 hover:bg-black/60 rounded-full transition-colors duration-200 group"
            >
              <ChevronRight className="w-7 h-7 text-white group-hover:scale-110 transition-transform" />
            </button>
          </>
        )}

        {/* Image */}
        <AnimatePresence mode="wait">
          <motion.img
            key={currentPhoto.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            src={currentPhoto.image}
            alt={currentPhoto.title}
            className="max-h-[75vh] max-w-[calc(100%-6rem)] object-contain rounded-lg select-none"
            onClick={(e) => e.stopPropagation()}
          />
        </AnimatePresence>
      </div>

      {/* Bottom Info Bar */}
      <div className="bg-black/60 backdrop-blur-sm border-t border-white/10 relative z-20" onClick={(e) => e.stopPropagation()}>
        <div className="max-w-5xl mx-auto px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* Photo Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-bold text-base truncate">{currentPhoto.title}</h3>
            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 mt-1">
              {currentPhoto.photographer && currentPhoto.photographer !== 'Unknown' && (
                <span>By {currentPhoto.photographer}</span>
              )}
              {currentPhoto.location && (
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{currentPhoto.location}</span>
              )}
              {currentPhoto.date && (
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(currentPhoto.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isLiked
                  ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                  : 'bg-white/10 text-gray-300 hover:bg-white/15 border border-transparent'
              }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
              <span>{likeCount}</span>
            </button>
            
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/15 text-gray-300 rounded-lg text-sm font-medium transition-all duration-200 border border-transparent"
            >
              <Share2 className="w-4 h-4" />
              <span>Share</span>
              {shareMsg && <span className="text-green-400 text-xs ml-1">{shareMsg}</span>}
            </button>
            
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/15 text-gray-300 rounded-lg text-sm font-medium transition-all duration-200 border border-transparent"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default PhotoLightboxModal
