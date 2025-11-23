'use client'

import { motion } from 'framer-motion'
import { Trophy, Plane, Lightbulb, Camera } from 'lucide-react'

const GlobalStage = () => {
  const achievements = [
    {
      category: 'Sports',
      title: 'Athletics Excellence',
      description: 'Kenya\'s dominance in long-distance running has brought home countless Olympic and World Championship medals.',
      icon: Trophy,
      image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=600&h=400&fit=crop',
      stats: '50+ Olympic Medals',
      gallery: [
        'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=400&h=300&fit=crop'
      ]
    },
    {
      category: 'Tourism',
      title: 'Magical Kenya',
      description: 'From the Maasai Mara to Mount Kenya, our natural beauty attracts millions of visitors annually.',
      icon: Plane,
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop',
      stats: '2M+ Annual Visitors',
      gallery: [
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=400&h=300&fit=crop'
      ]
    },
    {
      category: 'Innovation',
      title: 'Silicon Savannah',
      description: 'M-Pesa revolutionized mobile payments, and Nairobi\'s tech scene continues to innovate globally.',
      icon: Lightbulb,
      image: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=600&h=400&fit=crop',
      stats: '40M+ M-Pesa Users',
      gallery: [
        'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'
      ]
    },
    {
      category: 'Arts',
      title: 'Creative Expression',
      description: 'From literature to film, Kenyan artists are making their mark on the global cultural landscape.',
      icon: Camera,
      image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=600&h=400&fit=crop',
      stats: 'Award-Winning Films',
      gallery: [
        'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=400&h=300&fit=crop'
      ]
    }
  ]

  const globalPresence = [
    {
      title: 'UN Peacekeeping',
      description: 'Kenya is among the top contributors to UN peacekeeping missions worldwide.',
      number: '4,000+'
    },
    {
      title: 'International Trade',
      description: 'Coffee, tea, and flowers from Kenya reach markets across the globe.',
      number: '150+'
    },
    {
      title: 'Diplomatic Relations',
      description: 'Strong partnerships with countries on every continent.',
      number: '100+'
    }
  ]

  return (
    <section className="py-24 bg-gradient-to-b from-white via-gray-50 to-white relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 decorative-pattern opacity-[0.03]" />
      <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-green-500/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="text-blue-600 font-semibold tracking-wider uppercase text-sm mb-2 block">Global Impact</span>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Our Global Stage — <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-green-600 to-black">The Vision</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-green-500 mx-auto mb-8 rounded-full" />
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-light">
            Kenya's presence on the world stage is marked by excellence, innovation,
            and a commitment to making a positive global impact.
          </p>
        </motion.div>

        {/* Achievements Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-24">
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="relative overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 h-[400px]">
                <img
                  src={achievement.image}
                  alt={achievement.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-90" />

                <div className="absolute top-6 left-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 group-hover:bg-white/20 transition-colors duration-300">
                      <achievement.icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-white font-semibold bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-sm border border-white/10">
                      {achievement.category}
                    </span>
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-8 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-3xl font-bold mb-3">{achievement.title}</h3>
                  <p className="text-gray-200 mb-4 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">{achievement.description}</p>
                  <div className="text-yellow-400 font-bold text-xl flex items-center">
                    <Trophy className="w-5 h-5 mr-2" />
                    {achievement.stats}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Global Presence Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-blue-900 via-indigo-900 to-blue-800 rounded-[2.5rem] p-12 md:p-20 text-white shadow-2xl relative overflow-hidden mb-24"
        >
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/20 rounded-full blur-3xl" />
          <div className="absolute inset-0 bg-[url('/patterns/world-map.svg')] opacity-10 bg-center bg-no-repeat bg-contain" />

          <h3 className="text-3xl md:text-4xl font-bold text-center mb-16 relative z-10">
            Kenya's Global Impact
          </h3>

          <div className="grid md:grid-cols-3 gap-12 relative z-10">
            {globalPresence.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center group"
              >
                <div className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400 mb-6 group-hover:scale-110 transition-transform duration-300">
                  {item.number}
                </div>
                <h4 className="text-xl font-bold mb-3">{item.title}</h4>
                <p className="text-blue-100 leading-relaxed font-light">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Global Impact Gallery */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="mb-24"
        >
          <h3 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Kenya on the World Stage
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=400&h=300&fit=crop',
              'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
              'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=400&h=300&fit=crop',
              'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=400&h=300&fit=crop',
              'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
              'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=400&h=300&fit=crop',
              'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=400&h=300&fit=crop',
              'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
              'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=400&h=300&fit=crop',
              'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=400&h=300&fit=crop',
              'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
              'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=400&h=300&fit=crop'
            ].map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300 group cursor-pointer"
              >
                <img
                  src={image}
                  alt={`Global impact ${index + 1}`}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* International Recognition Videos */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
          className="mb-24"
        >
          <h3 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            International Recognition
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="relative overflow-hidden rounded-3xl shadow-2xl group">
              <iframe
                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                title="Kenya at the Olympics"
                className="w-full h-64 rounded-3xl"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="relative overflow-hidden rounded-3xl shadow-2xl group">
              <iframe
                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                title="Tech Innovation in Kenya"
                className="w-full h-64 rounded-3xl"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="relative overflow-hidden rounded-3xl shadow-2xl group">
              <iframe
                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                title="Cultural Exchange Programs"
                className="w-full h-64 rounded-3xl"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h3 className="text-3xl font-bold text-gray-900 mb-6">
            Join Our Global Journey
          </h3>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Be part of Kenya's continued success story and help us showcase our culture to the world.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-10 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Partner With Us
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}

export default GlobalStage
