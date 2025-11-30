'use client'

import { motion } from 'framer-motion'
import { User, BookOpen, Award, Heart, Mail } from 'lucide-react'
import { useState, useEffect } from 'react'
import ContactModal from '@/components/ContactModal'
import apiClient from '@/lib/api'

const Ambassador = () => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)
  const [ambassadorInfo, setAmbassadorInfo] = useState<any>({
    name: 'Susan',
    title: 'Cultural Ambassador',
    bio: 'A passionate advocate for Kenya\'s cultural heritage, Susan represents the beauty and diversity of our nation on the global stage.',
    mission: 'To bridge cultures, promote understanding, and showcase the rich tapestry of Kenyan traditions to the world.',
    image: '/images/SUE8.jpg',
    gallery: [
      '/images/SUE3.jpg',
      '/images/SUE5.jpg',
      '/images/SUE6.jpg',
      '/images/SUE7.jpg'
    ]
  })
  const [partners, setPartners] = useState<any[]>([])

  useEffect(() => {
    const fetchAmbassadorData = async () => {
      try {
        // Fetch ambassador info
        const ambassadorResponse = await apiClient.getAmbassador()
        const ambassadorData = Array.isArray(ambassadorResponse)
          ? ambassadorResponse[0]
          : (ambassadorResponse.results && ambassadorResponse.results[0]) || ambassadorResponse

        if (ambassadorData) {
          setAmbassadorInfo({
            name: ambassadorData.name || 'Susan',
            title: ambassadorData.title || 'Cultural Ambassador',
            bio: ambassadorData.bio || ambassadorData.description || ambassadorInfo.bio,
            mission: ambassadorData.mission || ambassadorInfo.mission,
            image: ambassadorData.image || ambassadorData.featured_image || ambassadorInfo.image,
            gallery: ambassadorData.gallery || ambassadorInfo.gallery
          })
        }

        // Fetch partners
        const partnersResponse = await apiClient.getPartners({ featured: true })
        const partnersData = Array.isArray(partnersResponse)
          ? partnersResponse
          : (partnersResponse.results || [])
        
        if (partnersData.length > 0) {
          setPartners(partnersData.map((partner: any) => ({
            name: partner.name,
            logo: partner.logo || partner.logo_url || '/api/placeholder/150/80'
          })))
        } else {
          // Fallback partners
          setPartners([
            { name: 'UNESCO', logo: '/api/placeholder/150/80' },
            { name: 'Kenya Tourism Board', logo: '/api/placeholder/150/80' },
            { name: 'Cultural Heritage Foundation', logo: '/api/placeholder/150/80' },
            { name: 'Global Peace Initiative', logo: '/api/placeholder/150/80' },
            { name: 'Women\'s Empowerment Network', logo: '/api/placeholder/150/80' },
            { name: 'Youth Development Program', logo: '/api/placeholder/150/80' }
          ])
        }
      } catch (err) {
        console.error('Error fetching ambassador data:', err)
        // Keep default data on error
      }
    }

    fetchAmbassadorData()
  }, [])

  const journeyHighlights = [
    {
      title: 'Her Story',
      description: 'Born in the heart of Kenya, Susan grew up surrounded by the rich tapestry of our nation\'s diverse cultures. From a young age, she witnessed the power of cultural unity and the beauty of our traditions. Her journey began in local community centers, where she volunteered to teach children about Kenyan heritage. Through years of dedicated study in anthropology and cultural studies, coupled with grassroots activism, she emerged as a powerful voice for cultural preservation. Today, Susan stands as a beacon of hope and pride, having transformed from a passionate community volunteer to an internationally recognized cultural ambassador, proving that one person\'s dedication can spark a movement.',
      icon: User
    },
    {
      title: 'Values & Mission',
      description: 'Susan\'s work is deeply rooted in the Ubuntu philosophy - "I am because we are" - a belief that our humanity is intertwined with others\'. She champions community solidarity, mutual respect, and intercultural dialogue as pathways to global harmony. Her mission extends beyond cultural showcase; she envisions a world where diversity is celebrated as humanity\'s greatest asset, where African culture is recognized for its profound contributions to global civilization, and where young Kenyans feel empowered to embrace their heritage with pride. Through authentic storytelling and genuine connection, Susan bridges divides and builds understanding across continents.',
      icon: Heart
    },
    {
      title: 'Engagement Journal',
      description: 'Follow Susan\'s transformative journey through her detailed chronicles documenting cultural exchanges across five continents, community development projects in rural Kenya, high-level diplomatic engagements, and grassroots youth empowerment initiatives. Each journal entry offers intimate reflections on the challenges of cultural representation, the joy of connecting hearts across borders, the responsibility of being a cultural bridge, and the profound impact of preserving heritage in a rapidly globalizing world. Her stories inspire thousands to take pride in their roots while embracing global citizenship.',
      icon: BookOpen
    },
    {
      title: 'Recognition & Impact',
      description: 'Susan\'s tireless dedication has earned prestigious recognition from UNESCO for cultural preservation, the African Union for youth empowerment, Kenya\'s Presidential Award for Cultural Excellence, and numerous international cultural organizations. Yet her greatest achievement transcends awards - she has inspired over 5,000 young Kenyans to become cultural advocates, facilitated partnerships between 50+ international organizations and Kenyan communities, created sustainable income opportunities for 500+ traditional artisans, and reached millions globally through her advocacy work, fundamentally changing how the world perceives African culture and Kenya\'s rich heritage.',
      icon: Award
    }
  ]

  const displayPartners = partners.length > 0 ? partners : [
    { name: 'UNESCO', logo: '/api/placeholder/150/80' },
    { name: 'Kenya Tourism Board', logo: '/api/placeholder/150/80' },
    { name: 'Cultural Heritage Foundation', logo: '/api/placeholder/150/80' },
    { name: 'Global Peace Initiative', logo: '/api/placeholder/150/80' },
    { name: 'Women\'s Empowerment Network', logo: '/api/placeholder/150/80' },
    { name: 'Youth Development Program', logo: '/api/placeholder/150/80' }
  ]

  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 decorative-pattern opacity-[0.03]" />
      <div className="absolute top-20 right-10 w-96 h-96 bg-green-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="text-green-600 font-semibold tracking-wider uppercase text-sm mb-2 block">The Ambassador</span>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600">Susan's Journey</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-emerald-500 mx-auto mb-8 rounded-full" />
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-light">
            Meet the inspiring individual who represents Kenya's cultural heritage
            and values on the global stage.
          </p>
        </motion.div>

        {/* Ambassador Profile */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid lg:grid-cols-2 gap-16 items-center mb-24"
        >
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-green-600 to-yellow-500 rounded-[2.5rem] rotate-3 opacity-20 group-hover:rotate-6 transition-transform duration-500" />
            <div className="relative overflow-hidden rounded-[2.5rem] shadow-2xl transform transition-transform duration-500">
              <img
                src={ambassadorInfo.image}
                alt={ambassadorInfo.name}
                className="w-full h-[600px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            </div>
            <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-2xl animate-pulse-glow z-20">
              <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <Award className="w-12 h-12 text-white" />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-4xl font-bold text-gray-900 mb-4">
              {ambassadorInfo.name}
            </h3>
            <p className="text-2xl text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600 font-bold mb-8">
              {ambassadorInfo.title}
            </p>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              {ambassadorInfo.bio}
            </p>
            <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 relative overflow-hidden group hover:shadow-xl transition-shadow duration-300">
              <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-green-500 to-emerald-500" />
              <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Heart className="w-6 h-6 text-red-500 mr-3 fill-current" />
                Mission Statement
              </h4>
              <p className="text-gray-700 italic text-lg leading-relaxed">
                "{ambassadorInfo.mission}"
              </p>
            </div>
          </div>
        </motion.div>

        {/* Journey Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mb-24"
        >
          <h3 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Her Journey
          </h3>

          <div className="grid md:grid-cols-2 gap-8">
            {journeyHighlights.map((highlight, index) => (
              <motion.div
                key={highlight.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 group cursor-pointer border border-gray-100"
              >
                <div className="flex items-start space-x-6">
                  <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-green-600 transition-colors duration-300">
                    <highlight.icon className="w-8 h-8 text-green-600 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-green-600 transition-colors duration-300">
                      {highlight.title}
                    </h4>
                    <p className="text-gray-600 leading-relaxed">
                      {highlight.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Portfolio Preview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="mb-24"
        >
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div>
              <span className="text-green-600 font-semibold tracking-wider uppercase text-sm mb-2 block">Portfolio</span>
              <h3 className="text-3xl font-bold text-gray-900">
                Featured Works
              </h3>
            </div>
            <motion.a
              href="https://gallery.misscultureglobalkenya.com"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="hidden md:inline-flex items-center bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-green-500/30"
            >
              View Full Gallery
            </motion.a>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Cultural Event 1',
                subtitle: 'Official Photoshoot',
                image: '/images/SUE3.jpg'
              },
              {
                title: 'International Conference',
                subtitle: 'Global Stage Appearance',
                image: '/images/SUE5.jpg'
              },
              {
                title: 'Community Engagement',
                subtitle: 'Local Impact Work',
                image: '/images/SUE6.jpg'
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 group cursor-pointer h-80"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90" />
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <h4 className="text-2xl font-bold mb-2">{item.title}</h4>
                  <p className="text-green-200 font-medium">{item.subtitle}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-8 md:hidden">
            <motion.a
              href="https://gallery.misscultureglobalkenya.com"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 shadow-lg"
            >
              View Full Gallery
            </motion.a>
          </div>
        </motion.div>

        {/* Ambassador Photo Gallery */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
          className="mb-24"
        >
          <h3 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Susan's Journey in Photos
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              '/images/SUE3.jpg',
              '/images/SUE5.jpg',
              '/images/SUE6.jpg',
              '/images/SUE7.jpg',
              '/images/SUE8.jpg',
              '/images/The ambassodor.jpg',
              '/images/SUE3.jpg',
              '/images/SUE5.jpg',
              '/images/SUE6.jpg',
              '/images/SUE7.jpg',
              '/images/SUE8.jpg',
              '/images/The ambassodor.jpg'
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
                  alt={`Susan ${index + 1}`}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Ambassador Videos */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          viewport={{ once: true }}
          className="mb-24"
        >
          <h3 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Susan's Story
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="relative overflow-hidden rounded-3xl shadow-2xl group">
              <iframe
                src="https://www.youtube.com/embed/NgqljvNDPA8"
                title="Susan's Journey"
                className="w-full h-80 rounded-3xl"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="relative overflow-hidden rounded-3xl shadow-2xl group">
              <iframe
                src="https://www.youtube.com/embed/NgqljvNDPA8"
                title="Cultural Ambassador Work"
                className="w-full h-80 rounded-3xl"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </motion.div>

        {/* Partners & Sponsors */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
          className="mb-24"
        >
          <h3 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Partners & Sponsors
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
            {displayPartners.map((partner, index) => (
              <motion.div
                key={partner.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-center justify-center p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 group cursor-pointer border border-gray-50"
              >
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="h-12 w-auto object-contain group-hover:scale-110 transition-transform duration-300 filter grayscale group-hover:grayscale-0"
                />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Contact Susan CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900 rounded-[2.5rem] p-12 md:p-20 text-white text-center shadow-2xl relative overflow-hidden"
        >
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/20 rounded-full blur-3xl" />

          <div className="relative z-10">
            <h3 className="text-3xl md:text-4xl font-bold mb-6">
              Connect with Susan
            </h3>
            <p className="text-xl text-green-100 mb-10 max-w-2xl mx-auto leading-relaxed font-light">
              Interested in collaborating with Susan or having her speak at your event?
              Get in touch to discuss opportunities and partnerships.
            </p>
            <motion.button
              onClick={() => setIsContactModalOpen(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-green-900 hover:bg-green-50 px-10 py-4 rounded-full font-bold text-lg transition-all duration-300 flex items-center space-x-3 mx-auto shadow-lg"
            >
              <Mail className="w-5 h-5" />
              <span>Contact Susan</span>
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Contact Modal */}
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        type="general"
      />
    </section>
  )
}

export default Ambassador
