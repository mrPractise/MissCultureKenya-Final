'use client'

import { motion } from 'framer-motion'
import { Volume2, Palette, Music, BookOpen } from 'lucide-react'

const OurCulture = () => {
  const languages = [
    { phrase: 'Jambo', meaning: 'Hello', audio: '/audio/jambo.mp3' },
    { phrase: 'Asante', meaning: 'Thank you', audio: '/audio/asante.mp3' },
    { phrase: 'Karibu', meaning: 'Welcome', audio: '/audio/karibu.mp3' },
    { phrase: 'Pole', meaning: 'Sorry', audio: '/audio/pole.mp3' }
  ]

  const culturalElements = [
    {
      title: 'Traditional Attire',
      description: 'From the colorful Maasai shukas to the elegant Kikuyu dresses, each piece tells a story.',
      image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=400&h=500&fit=crop',
      icon: Palette,
      gallery: [
        'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=300&h=400&fit=crop',
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=400&fit=crop',
        'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=300&h=400&fit=crop'
      ]
    },
    {
      title: 'Music & Dance',
      description: 'Rhythmic beats and graceful movements that celebrate life and community.',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=500&fit=crop',
      icon: Music,
      gallery: [
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=400&fit=crop',
        'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=300&h=400&fit=crop',
        'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=300&h=400&fit=crop'
      ]
    },
    {
      title: 'Ceremonies',
      description: 'Sacred rituals that mark important life moments and strengthen community bonds.',
      image: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=400&h=500&fit=crop',
      icon: BookOpen,
      gallery: [
        'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=300&h=400&fit=crop',
        'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=300&h=400&fit=crop',
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=400&fit=crop'
      ]
    }
  ]

  const heritageSites = [
    {
      name: 'Lamu Old Town',
      type: 'UNESCO World Heritage',
      description: 'A living example of Swahili culture and architecture.'
    },
    {
      name: 'Fort Jesus',
      type: 'Historical Monument',
      description: 'A testament to Kenya\'s rich colonial history.'
    },
    {
      name: 'Thimlich Ohinga',
      type: 'Archaeological Site',
      description: 'Ancient stone structures showcasing early engineering.'
    }
  ]

  return (
    <section className="py-24 bg-gradient-to-b from-white via-gray-50 to-white relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 decorative-pattern opacity-[0.03]" />
      <div className="absolute top-40 right-0 w-[500px] h-[500px] bg-yellow-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-40 left-0 w-[500px] h-[500px] bg-red-500/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="text-yellow-600 font-semibold tracking-wider uppercase text-sm mb-2 block">Heritage</span>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Our Culture — <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 via-red-600 to-black">The Soul</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-yellow-500 to-red-500 mx-auto mb-8 rounded-full" />
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-light">
            Immerse yourself in the vibrant traditions, languages, and artistic expressions
            that define Kenya's cultural identity.
          </p>
        </motion.div>

        {/* Languages of Unity Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="mb-24"
        >
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-6">
              Languages of Unity
            </h3>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto mb-8 leading-relaxed">
              Language is the heartbeat of culture, the vessel of our stories, and the bridge between generations.
              Kenya celebrates incredible linguistic diversity with over 60 indigenous languages, each carrying centuries
              of wisdom, folklore, and cultural identity.
            </p>
            <div className="inline-block bg-yellow-50 px-6 py-3 rounded-full border border-yellow-100 mb-8">
              <p className="text-yellow-800 font-medium italic">
                "In our many languages, we find our shared humanity. Through Swahili, English, and our mother tongues,
                we speak as one Kenya."
              </p>
            </div>
            <p className="text-md text-gray-500 max-w-2xl mx-auto">
              Learn common Swahili phrases with Susan as your guide - click the audio icons to hear authentic pronunciations!
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {languages.map((language, index) => (
              <motion.div
                key={language.phrase}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-3xl shadow-elegant hover:shadow-elegant-lg transition-all duration-300 text-center group cursor-pointer border border-gray-100"
              >
                <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600 mb-4">
                  {language.phrase}
                </div>
                <div className="text-gray-600 mb-6 font-medium">
                  {language.meaning}
                </div>
                <button className="inline-flex items-center justify-center w-14 h-14 bg-green-50 rounded-full hover:bg-green-600 transition-all duration-300 group-hover:scale-110 shadow-sm hover:shadow-md">
                  <Volume2 className="w-6 h-6 text-green-600 group-hover:text-white transition-colors duration-300" />
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Cultural Elements Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mb-24"
        >
          <h3 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Adornment & Heritage
          </h3>

          <div className="grid md:grid-cols-3 gap-8">
            {culturalElements.map((element, index) => (
              <motion.div
                key={element.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="relative overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 h-[500px]">
                  <img
                    src={element.image}
                    alt={element.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-90" />
                  <div className="absolute top-6 right-6">
                    <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 group-hover:bg-white/20 transition-colors duration-300">
                      <element.icon className="w-7 h-7 text-white" />
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-8 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <h4 className="text-2xl font-bold mb-3">{element.title}</h4>
                    <p className="text-gray-200 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                      {element.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* UNESCO Heritage Sites */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="mb-24"
        >
          <h3 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Ceremonies & Heritage
          </h3>

          <div className="grid md:grid-cols-3 gap-8">
            {heritageSites.map((site, index) => (
              <motion.div
                key={site.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-3xl shadow-elegant hover:shadow-elegant-lg transition-all duration-300 border border-gray-100 group hover:-translate-y-2"
              >
                <div className="text-sm font-bold text-green-600 mb-3 uppercase tracking-wide">
                  {site.type}
                </div>
                <h4 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-green-700 transition-colors duration-300">
                  {site.name}
                </h4>
                <p className="text-gray-600 leading-relaxed">
                  {site.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Cultural Photo Gallery */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
          className="mt-24"
        >
          <h3 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Cultural Moments
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=300&h=400&fit=crop',
              'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=400&fit=crop',
              'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=300&h=400&fit=crop',
              'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=300&h=400&fit=crop',
              'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=400&fit=crop',
              'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=300&h=400&fit=crop',
              'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=300&h=400&fit=crop',
              'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=400&fit=crop',
              'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=300&h=400&fit=crop',
              'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=300&h=400&fit=crop',
              'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=400&fit=crop',
              'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=300&h=400&fit=crop'
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
                  alt={`Cultural moment ${index + 1}`}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Traditional Dance Videos */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          viewport={{ once: true }}
          className="mt-24"
        >
          <h3 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Traditional Performances
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="relative overflow-hidden rounded-3xl shadow-2xl group">
              <iframe
                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                title="Traditional Dance Performance"
                className="w-full h-64 rounded-3xl"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="relative overflow-hidden rounded-3xl shadow-2xl group">
              <iframe
                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                title="Cultural Music Performance"
                className="w-full h-64 rounded-3xl"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="relative overflow-hidden rounded-3xl shadow-2xl group">
              <iframe
                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                title="Traditional Ceremony"
                className="w-full h-64 rounded-3xl"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </motion.div>

        {/* Artisan Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          viewport={{ once: true }}
          className="mt-24"
        >
          <h3 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Artisan Showcase
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Wood Carving',
                image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=400&h=300&fit=crop',
                description: 'Intricate wooden sculptures and carvings'
              },
              {
                title: 'Beadwork',
                image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
                description: 'Colorful bead jewelry and decorations'
              },
              {
                title: 'Pottery',
                image: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=400&h=300&fit=crop',
                description: 'Traditional clay pots and vessels'
              },
              {
                title: 'Textiles',
                image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=400&h=300&fit=crop',
                description: 'Handwoven fabrics and clothing'
              }
            ].map((artisan, index) => (
              <motion.div
                key={artisan.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group cursor-pointer border border-gray-100"
              >
                <div className="overflow-hidden h-56">
                  <img
                    src={artisan.image}
                    alt={artisan.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-8">
                  <h4 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-yellow-600 transition-colors duration-300">{artisan.title}</h4>
                  <p className="text-gray-600">{artisan.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default OurCulture
