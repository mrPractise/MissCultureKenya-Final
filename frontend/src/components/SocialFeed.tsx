'use client'

import { motion } from 'framer-motion'
import { Instagram, Heart, MessageCircle, Share2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import apiClient from '@/lib/api'

const SocialFeed = () => {
  const [socialPosts, setSocialPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSocialPosts = async () => {
      try {
        const response = await apiClient.get('/api/main/social-media/')
        const postsData = Array.isArray(response) ? response : (response.results || [])
        if (postsData.length > 0) {
          setSocialPosts(postsData.slice(0, 4).map((post: any) => ({
            id: post.id,
            platform: post.platform === 'instagram' ? 'Instagram' : post.platform === 'facebook' ? 'Facebook' : post.platform === 'twitter' ? 'Twitter' : post.platform === 'tiktok' ? 'TikTok' : post.platform,
            content: post.content,
            image: post.image_url || '',
            videoUrl: post.video_url || '',
            postUrl: post.post_url || '#',
            date: new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          })))
        } else {
          setSocialPosts([])
        }
      } catch (err) {
        console.error('Error fetching social posts:', err)
        setSocialPosts([])
      } finally {
        setLoading(false)
      }
    }
    fetchSocialPosts()
  }, [])

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-red-50 rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-50 rounded-full blur-3xl opacity-50" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Live <span className="text-red-600">Updates</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Follow Susan's journey in real-time through her social media updates. 
            Stay connected with the latest cultural events and behind-the-scenes moments.
          </p>
        </motion.div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-600" />
          </div>
        ) : socialPosts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Follow us on social media for the latest updates</p>
          </div>
        ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {socialPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-elegant hover:shadow-elegant-lg transition-all duration-300 overflow-hidden group cursor-pointer transform hover:-translate-y-2"
            >
              <div className="relative">
                {post.image ? (
                  <img
                    src={post.image}
                    alt={`Post ${post.id}`}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : post.videoUrl ? (
                  <div className="w-full h-64 bg-gray-100 flex items-center justify-center">
                    <Instagram className="w-12 h-12 text-gray-300" />
                  </div>
                ) : (
                  <div className="w-full h-64 bg-green-50 flex items-center justify-center">
                    <Instagram className="w-12 h-12 text-green-200" />
                  </div>
                )}
                <div className="absolute top-4 left-4">
                  <div className="flex items-center space-x-2 bg-black/30 backdrop-blur-sm rounded-full px-3 py-1">
                    <Instagram className="w-4 h-4 text-white" />
                    <span className="text-white text-sm font-medium">{post.platform}</span>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <p className="text-gray-700 mb-4 line-clamp-3">
                  {post.content}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{post.date}</span>
                </div>
                
                <div className="flex items-center justify-between mt-3">
                  {post.postUrl && post.postUrl !== '#' && (
                    <a href={post.postUrl} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-green-600 hover:text-green-700 transition-colors duration-200">
                      <Share2 className="w-4 h-4" />
                      <span className="text-sm font-medium">View Post</span>
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <motion.a
            href="https://instagram.com/misscultureglobalkenya"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05, boxShadow: "0 20px 60px rgba(168, 85, 247, 0.4)" }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 shadow-lg"
          >
            <Instagram className="w-6 h-6 mr-2" />
            Follow @misscultureglobalkenya
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}

export default SocialFeed
