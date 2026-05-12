'use client'

import { motion } from 'framer-motion'
import { Share2, Download, ArrowLeft, ArrowRight, X } from 'lucide-react'
import { useState } from 'react'

interface Photo {
  id: number
  title: string
  image: string
  photographer: string
  date: string
  category: string
  description?: string
  event?: string
  about?: string
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
  const [shareMessage, setShareMessage] = useState<string>('')
  const currentPhoto = photos[currentIndex]

  const handlePrevious = () => {
    const newIndex = currentIndex > 0 ? currentIndex - 1 : photos.length - 1
    onNavigate(newIndex)
  }

  const handleNext = () => {
    const newIndex = currentIndex < photos.length - 1 ? currentIndex + 1 : 0
    onNavigate(newIndex)
  }

  const handleShare = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    const shareUrl = `${window.location.origin}/gallery`
    try {
      if (navigator.share) {
        await navigator.share({
          title: currentPhoto.title || 'MissCulture Kenya Photo',
          text: currentPhoto.caption || 'Check out this photo from MissCulture Kenya.',
          url: shareUrl,
        })
        setShareMessage('Photo shared successfully.')
      } else {
        await navigator.clipboard.writeText(shareUrl)
        setShareMessage('Link copied to clipboard.')
      }
    } catch (error) {
      console.error('Share failed', error)
      setShareMessage('Unable to share this photo right now.')
    }
  }

  const handleDownload = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    const safeBaseName = (currentPhoto.title || 'missculture-photo')
      .trim()
      .replace(/[\\/:*?"<>|]+/g, '-')
      .slice(0, 80)

    const extMatch = (() => {
      try {
        return new URL(currentPhoto.image).pathname.match(/\.[a-zA-Z0-9]+$/)?.[0]
      } catch {
        return null
      }
    })()

    const filename = `${safeBaseName}${extMatch || '.jpg'}`

    try {
      const res = await fetch(currentPhoto.image, { mode: 'cors' })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const blob = await res.blob()
      const blobUrl = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = blobUrl
      link.download = filename
      document.body.appendChild(link)
      link.click()
      link.remove()
      setTimeout(() => URL.revokeObjectURL(blobUrl), 1000)
    } catch {
      window.open(currentPhoto.image, '_blank', 'noopener,noreferrer')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onClose()
    if (e.key === 'ArrowLeft') handlePrevious()
    if (e.key === 'ArrowRight') handleNext()
  }

  if (!isOpen || !currentPhoto) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative flex flex-col lg:flex-row w-full max-w-7xl mx-auto bg-transparent" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors duration-200"
        >
          <X className="w-6 h-6 text-white" />
        </button>

        {/* Navigation Arrows */}
        {photos.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); handlePrevious() }}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 p-3 bg-black/50 hover:bg-black/70 rounded-full transition-colors duration-200"
            >
              <ArrowLeft className="w-6 h-6 text-white" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); handleNext() }}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 p-3 bg-black/50 hover:bg-black/70 rounded-full transition-colors duration-200"
            >
              <ArrowRight className="w-6 h-6 text-white" />
            </button>
          </>
        )}

        {/* Image */}
        <div className="flex-1 flex items-center justify-center p-4">
          <motion.img
            key={currentPhoto.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            src={currentPhoto.image}
            alt={currentPhoto.title}
            className="max-h-[80vh] max-w-full object-contain rounded-lg"
          />
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-80 bg-white/10 backdrop-blur-sm p-6 overflow-y-auto rounded-3xl border border-white/10 shadow-2xl">
          <div className="text-white">
            <h2 className="text-2xl font-bold mb-4">{currentPhoto.title}</h2>

            {currentPhoto.description && (
              <p className="text-gray-200 mb-6">{currentPhoto.description}</p>
            )}

            <div className="space-y-4 mb-6">
              {currentPhoto.event && (
                <div>
                  <span className="text-gray-300 text-sm">Event</span>
                  <p className="text-white font-medium">{currentPhoto.event}</p>
                </div>
              )}
              {currentPhoto.about && (
                <div>
                  <span className="text-gray-300 text-sm">About</span>
                  <p className="text-white font-medium leading-relaxed">{currentPhoto.about}</p>
                </div>
              )}
              <div>
                <span className="text-gray-300 text-sm">Date</span>
                <p className="text-white font-medium">{new Date(currentPhoto.date).toLocaleDateString('en-US')}</p>
              </div>
              <div>
                <span className="text-gray-300 text-sm">Category</span>
                <p className="text-white font-medium">{currentPhoto.category}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleShare}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-white/20 text-white hover:bg-white/30 rounded-lg transition-colors duration-200"
                  title="Share this photo"
                >
                  <Share2 className="w-5 h-5" />
                  <span>Share</span>
                </button>

                <button
                  onClick={handleDownload}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-white/20 text-white hover:bg-white/30 rounded-lg transition-colors duration-200"
                  title="Download this photo"
                >
                  <Download className="w-5 h-5" />
                  <span>Download</span>
                </button>
              </div>

              {shareMessage && (
                <p className="text-xs text-gray-300">{shareMessage}</p>
              )}
            </div>

            {/* Photo Counter */}
            {photos.length > 1 && (
              <div className="mt-6 text-center text-gray-300">
                {currentIndex + 1} of {photos.length}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default PhotoLightboxModal
