'use client'

import { motion } from 'framer-motion'
import { Heart, Share2, Download, ArrowLeft, ArrowRight, X } from 'lucide-react'
import { useState } from 'react'

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
  const currentPhoto = photos[currentIndex]

  const handlePrevious = () => {
    const newIndex = currentIndex > 0 ? currentIndex - 1 : photos.length - 1
    onNavigate(newIndex)
  }

  const handleNext = () => {
    const newIndex = currentIndex < photos.length - 1 ? currentIndex + 1 : 0
    onNavigate(newIndex)
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
      className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex flex-col"
      onClick={onClose}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
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
            onClick={handlePrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 p-3 bg-black/50 hover:bg-black/70 rounded-full transition-colors duration-200"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 p-3 bg-black/50 hover:bg-black/70 rounded-full transition-colors duration-200"
          >
            <ArrowRight className="w-6 h-6 text-white" />
          </button>
        </>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row w-full max-w-7xl mx-auto">
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
        <div className="w-full lg:w-80 bg-white/10 backdrop-blur-sm p-6 overflow-y-auto">
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
            <div className="flex space-x-4">
              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
                  isLiked ? 'bg-red-500 text-white' : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                <span>{currentPhoto.likes + (isLiked ? 1 : 0)}</span>
              </button>
              
              <button className="flex items-center space-x-2 px-4 py-2 bg-white/20 text-white hover:bg-white/30 rounded-lg transition-colors duration-200">
                <Share2 className="w-5 h-5" />
                <span>Share</span>
              </button>
              
              <button className="flex items-center space-x-2 px-4 py-2 bg-white/20 text-white hover:bg-white/30 rounded-lg transition-colors duration-200">
                <Download className="w-5 h-5" />
                <span>Download</span>
              </button>
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
