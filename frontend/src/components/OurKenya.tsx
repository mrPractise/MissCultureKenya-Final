'use client'

import { motion } from 'framer-motion'
import { MapPin, Users, Mountain } from 'lucide-react'

const OurKenya = () => {
  const regions = [
    {
      name: 'Nairobi',
      description: 'The vibrant capital city, a melting pot of cultures and innovation.',
      image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800&h=600&fit=crop',
      featured: true,
      gallery: [
        'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=400&h=300&fit=crop'
      ]
    },
    {
      name: 'Mombasa',
      description: 'The coastal gem where Swahili culture meets the Indian Ocean.',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
      featured: true,
      gallery: [
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=400&h=300&fit=crop'
      ]
    },
    {
      name: 'Nakuru',
      description: 'Home to the Great Rift Valley and stunning natural beauty.',
      image: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=800&h=600&fit=crop',
      featured: false,
      gallery: [
        'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'
      ]
    },
    {
      name: 'Kisumu',
      description: 'The lakeside city on the shores of Lake Victoria.',
      image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800&h=600&fit=crop',
      featured: false,
      gallery: [
        'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=400&h=300&fit=crop'
      ]
    }
  ]

  const communities = [
    {
      name: 'Kikuyu',
      region: 'Central Kenya',
      description: 'The largest ethnic group, known for their agricultural heritage and entrepreneurship.'
    },
    {
      name: 'Luo',
      region: 'Western Kenya',
      description: 'Famous for their fishing traditions and vibrant cultural practices.'
    },
    {
      name: 'Kalenjin',
      region: 'Rift Valley',
      description: 'World-renowned for their athletic prowess and running traditions.'
    },
    {
      name: 'Kamba',
      region: 'Eastern Kenya',
      description: 'Known for their wood carving skills and musical traditions.'
    }
  ]

  return (
    <section className="py-24 bg-gradient-to-b from-white via-gray-50 to-white relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 decorative-pattern opacity-[0.03]" />
      <div className="absolute top-20 left-10 w-96 h-96 bg-red-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-green-500/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="text-red-600 font-semibold tracking-wider uppercase text-sm mb-2 block">Discover</span>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Our Kenya — <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-green-600 to-black">The Heartland</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-green-500 mx-auto mb-8 rounded-full" />
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-light">
            Discover the diverse regions and communities that make Kenya a truly special place,
            united by the spirit of <span className="font-semibold text-gray-900">Harambee</span> (pulling together).
          </p>
        </motion.div>

        {/* Interactive Map Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="mb-24"
        >
          <h3 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Explore Our Regions
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {regions.map((region, index) => (
              <motion.div
                key={region.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`group relative overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer ${region.featured ? 'md:col-span-2' : ''
                  }`}
              >
                <div className="aspect-w-16 aspect-h-12 h-full">
                  <img
                    src={region.image}
                    alt={region.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <div className="flex items-center mb-3">
                    <MapPin className="w-5 h-5 text-yellow-400 mr-2" />
                    <h4 className="text-2xl font-bold">{region.name}</h4>
                  </div>
                  <p className="text-gray-200 text-lg font-light leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                    {region.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Ethnic Mosaic Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mb-24"
        >
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-6">
              Ethnic Mosaic
            </h3>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto mb-8 leading-relaxed">
              Kenya is a breathtaking tapestry of over 40 ethnic communities, each thread woven with distinct traditions,
              languages, and cultural practices. From the Maasai warriors of the Great Rift Valley to the Swahili poets
              of the coast, from the Kikuyu farmers of the highlands to the Luo fishermen of Lake Victoria - every community
              brings unique richness to our national identity.
            </p>
            <div className="inline-block bg-green-50 px-6 py-3 rounded-full border border-green-100">
              <p className="text-green-800 font-medium italic">
                "We are stronger together, celebrating what makes each community unique while embracing what unites us as one nation."
              </p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {communities.map((community, index) => (
              <motion.div
                key={community.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-3xl shadow-elegant hover:shadow-elegant-lg transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 group"
              >
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center group-hover:bg-green-600 transition-colors duration-300">
                    <Users className="w-6 h-6 text-green-600 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-xl font-bold text-gray-900">{community.name}</h4>
                    <p className="text-sm text-green-600 font-medium uppercase tracking-wide">{community.region}</p>
                  </div>
                </div>
                <p className="text-gray-600 leading-relaxed">{community.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Faith & Unity Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-24 text-center bg-gradient-to-br from-green-700 via-emerald-800 to-green-900 rounded-[2.5rem] p-12 md:p-20 text-white shadow-2xl relative overflow-hidden"
        >
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/20 rounded-full blur-3xl" />
          <div className="absolute inset-0 bg-[url('/patterns/topography.svg')] opacity-10" />

          <div className="relative z-10">
            <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-8 border border-white/20">
              <Mountain className="w-10 h-10 text-yellow-400" />
            </div>
            <h3 className="text-3xl md:text-4xl font-bold mb-6">Faith & Unity</h3>
            <p className="text-xl text-green-50 max-w-3xl mx-auto leading-relaxed font-light">
              Kenya's strength lies in its diversity. We celebrate the harmony between different faiths,
              traditions, and communities that make our nation truly special.
            </p>
          </div>
        </motion.div>

        {/* Image Gallery Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
          className="mt-24"
        >
          <h3 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Kenya Through the Lens
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=400&h=300&fit=crop',
              'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
              'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=400&h=300&fit=crop',
              'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=400&h=300&fit=crop',
              'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
              'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=400&h=300&fit=crop',
              'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=400&h=300&fit=crop',
              'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'
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
                  alt={`Kenya ${index + 1}`}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Video Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          viewport={{ once: true }}
          className="mt-24"
        >
          <h3 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Experience Kenya
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="relative overflow-hidden rounded-3xl shadow-2xl group">
              <div className="aspect-w-16 aspect-h-9">
                <iframe
                  src="https://www.youtube.com/embed/NgqljvNDPA8"
                  title="Kenya Experience Video"
                  className="w-full h-80 rounded-3xl"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
            <div className="relative overflow-hidden rounded-3xl shadow-2xl group">
              <div className="aspect-w-16 aspect-h-9">
                <iframe
                  src="https://www.youtube.com/embed/NgqljvNDPA8"
                  title="Cultural Heritage Video"
                  className="w-full h-80 rounded-3xl"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default OurKenya
