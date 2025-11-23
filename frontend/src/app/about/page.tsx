'use client'

import { motion } from 'framer-motion'
import { Heart, Users, Globe, Award, Target, User, BookOpen, Mail } from 'lucide-react'

const AboutPage = () => {
  const historyMilestones = [
    {
      year: '2015',
      title: 'Foundation',
      description: 'Miss Culture Global Kenya was established with a vision to celebrate and preserve Kenya\'s rich cultural heritage.'
    },
    {
      year: '2017',
      title: 'First International Representation',
      description: 'Our first representative participated in the Miss Culture Global competition, placing in the top 10.'
    },
    {
      year: '2019',
      title: 'Community Outreach Program',
      description: 'Launched our community outreach program supporting local artisans and cultural preservation initiatives.'
    },
    {
      year: '2021',
      title: 'Digital Transformation',
      description: 'Expanded our reach through digital platforms, connecting with global audiences.'
    },
    {
      year: '2023',
      title: 'Youth Empowerment Initiative',
      description: 'Introduced programs focused on youth leadership and cultural education.'
    },
    {
      year: '2024',
      title: 'Global Recognition',
      description: 'Received international recognition for our contribution to cultural preservation and promotion.'
    }
  ]

  const values = [
    {
      title: 'Cultural Preservation',
      description: 'Dedicated to safeguarding Kenya\'s diverse cultural heritage for future generations.',
      icon: Heart
    },
    {
      title: 'Unity in Diversity',
      description: 'Celebrating the rich tapestry of Kenya\'s ethnic groups and fostering national unity.',
      icon: Users
    },
    {
      title: 'Global Representation',
      description: 'Showcasing Kenya\'s cultural excellence on the international stage with pride.',
      icon: Globe
    },
    {
      title: 'Youth Empowerment',
      description: 'Inspiring and equipping young people to become cultural ambassadors.',
      icon: Award
    },
    {
      title: 'Authenticity',
      description: 'Remaining true to our roots while embracing innovation and positive change.',
      icon: Target
    }
  ]

  const currentLeadership = [
    {
      name: 'Susan Wanjiru',
      title: 'Miss Culture Global Kenya',
      bio: 'A passionate cultural ambassador with over 5 years of experience promoting Kenyan heritage. Susan holds a degree in Cultural Studies and has represented Kenya in international cultural forums.',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop',
      social: {
        instagram: '#',
        twitter: '#',
        linkedin: '#'
      }
    },
    {
      name: 'James Mwangi',
      title: 'Director of Operations',
      bio: 'Oversees all operational aspects of the organization with a focus on community engagement and event management. James has a background in event planning and cultural tourism.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
      social: {
        instagram: '#',
        twitter: '#',
        linkedin: '#'
      }
    },
    {
      name: 'Grace Njeri',
      title: 'Community Outreach Coordinator',
      bio: 'Leads community engagement initiatives and works directly with local artisans and cultural groups. Grace has a Master\'s degree in Anthropology and extensive experience in grassroots organizing.',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop',
      social: {
        instagram: '#',
        twitter: '#',
        linkedin: '#'
      }
    }
  ]

  const organizingCommittee = [
    {
      name: 'Robert Ochieng',
      role: 'Event Coordinator',
      bio: 'Specializes in organizing cultural events and festivals across Kenya.'
    },
    {
      name: 'Mary Atieno',
      role: 'Marketing Director',
      bio: 'Leads digital marketing and brand awareness campaigns.'
    },
    {
      name: 'David Kimani',
      role: 'Finance Manager',
      bio: 'Manages budgeting and financial reporting for all programs.'
    },
    {
      name: 'Sarah Akinyi',
      role: 'Volunteer Coordinator',
      bio: 'Recruits and manages volunteers for all initiatives.'
    },
    {
      name: 'Peter Kamau',
      role: 'International Relations',
      bio: 'Handles partnerships with international cultural organizations.'
    },
    {
      name: 'Esther Muthoni',
      role: 'Youth Programs Lead',
      bio: 'Develops and implements youth engagement programs.'
    }
  ]

  const advisors = [
    {
      name: 'Prof. John Mbiti',
      role: 'Cultural Advisor',
      bio: 'Renowned scholar in African philosophy and cultural studies.'
    },
    {
      name: 'Dr. Wangari Maathai (Posthumous)',
      role: 'Environmental Heritage Advisor',
      bio: 'Legacy advisor for environmental and cultural conservation initiatives.'
    },
    {
      name: 'Amb. Martha Karua',
      role: 'Diplomatic Advisor',
      bio: 'Former Minister providing guidance on international cultural diplomacy.'
    }
  ]

  const impactHighlights = [
    {
      number: '500+',
      label: 'Artisans Supported',
      description: 'Providing sustainable income through cultural crafts'
    },
    {
      number: '1,000+',
      label: 'Youth Engaged',
      description: 'Empowering the next generation of cultural ambassadors'
    },
    {
      number: '50+',
      label: 'Countries Reached',
      description: 'Promoting Kenyan culture on the global stage'
    },
    {
      number: '100+',
      label: 'Communities Impacted',
      description: 'Strengthening local cultural preservation efforts'
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Page Header */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full bg-gradient-to-br from-green-900/90 via-black/80 to-yellow-900/90">
            <div
              className="w-full h-full bg-cover bg-center bg-no-repeat opacity-40 mix-blend-overlay"
              style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1532375810709-75b1da00537c?w=1920&h=1080&fit=crop)' }}
            />
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-1/4 left-10 w-32 h-32 bg-yellow-500/20 rounded-full blur-3xl animate-pulse-glow z-10" />
        <div className="absolute bottom-1/4 right-10 w-40 h-40 bg-green-500/20 rounded-full blur-3xl animate-pulse-glow delay-1000 z-10" />

        <div className="relative z-20 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white tracking-tight">
              About <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-200">Us</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto font-light leading-relaxed">
              Celebrating Kenya's rich cultural heritage and empowering communities through preservation, education, and global representation.
            </p>
            <div className="mt-8 flex justify-center">
              <div className="h-1 w-24 bg-gradient-to-r from-transparent via-yellow-500 to-transparent rounded-full" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                To preserve, promote, and celebrate Kenya's diverse cultural heritage while empowering communities and youth to become global ambassadors of our traditions. We strive to create a platform where culture meets innovation, fostering unity and sustainable development.
              </p>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                  <Target className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Strategic Focus</h3>
                  <p className="text-sm text-gray-500">Preservation, Education, Empowerment</p>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-green-600 to-yellow-500 rounded-2xl transform rotate-3 opacity-20" />
              <img
                src="https://images.unsplash.com/photo-1489980557514-251d61e3eeb6?w=800&h=600&fit=crop"
                alt="Kenyan Culture"
                className="relative rounded-2xl shadow-2xl transform -rotate-3 hover:rotate-0 transition-transform duration-500"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* History Timeline */}
      <section className="py-24 bg-gray-50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-64 h-64 bg-green-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
          <div className="absolute bottom-20 right-10 w-64 h-64 bg-yellow-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Journey</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light">
              A timeline of our milestones and achievements in promoting Kenyan culture globally.
            </p>
          </motion.div>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-green-100 via-green-200 to-green-100 hidden md:block"></div>

            {/* Timeline items */}
            <div className="space-y-16">
              {historyMilestones.map((milestone, index) => (
                <motion.div
                  key={milestone.year}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`flex flex-col md:flex-row ${index % 2 === 0 ? 'md:flex-row-reverse' : ''} items-center group`}
                >
                  <div className="md:w-1/2 mb-8 md:mb-0 md:px-12 w-full">
                    <div className="bg-white rounded-2xl shadow-elegant p-8 border border-gray-100 group-hover:border-green-200 transition-colors duration-300 relative">
                      <div className={`absolute top-1/2 ${index % 2 === 0 ? '-left-3' : '-right-3'} w-6 h-6 bg-white transform -translate-y-1/2 rotate-45 border-b border-l border-gray-100 hidden md:block group-hover:border-green-200 transition-colors duration-300 ${index % 2 === 0 ? 'border-r-0 border-t-0' : 'border-l-0 border-b-0 border-r border-t'}`} />
                      <span className="inline-block px-4 py-1 bg-green-100 text-green-700 rounded-full font-bold text-sm mb-4">{milestone.year}</span>
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">{milestone.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{milestone.description}</p>
                    </div>
                  </div>

                  {/* Circle */}
                  <div className="hidden md:flex md:w-16 h-16 rounded-full bg-white border-4 border-green-500 items-center justify-center text-green-600 font-bold text-lg z-10 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    {milestone.year.slice(2)}
                  </div>

                  <div className="md:w-1/2 md:px-12"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 bg-gradient-to-br from-green-50 to-yellow-50 relative overflow-hidden">
        <div className="absolute inset-0 decorative-dots opacity-30" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Core Values</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light">
              The principles that guide our mission and shape our approach to cultural representation.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl shadow-elegant p-8 text-center hover:shadow-elegant-lg transition-all duration-300 group"
              >
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-green-100 transition-colors duration-300">
                  <value.icon className="w-10 h-10 text-green-600 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Leadership Team</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light">
              The visionary leaders guiding our mission to promote Kenyan culture globally.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {currentLeadership.map((leader, index) => (
              <motion.div
                key={leader.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl shadow-elegant overflow-hidden hover:shadow-elegant-lg transition-all duration-300 group"
              >
                <div className="h-80 overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
                  <img
                    src={leader.image}
                    alt={leader.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{leader.name}</h3>
                  <p className="text-green-600 font-medium mb-4">{leader.title}</p>
                  <p className="text-gray-600 mb-6 leading-relaxed text-sm">{leader.bio}</p>
                  <div className="flex space-x-4">
                    {Object.entries(leader.social).map(([platform, link]) => (
                      <a key={platform} href={link} className="text-gray-400 hover:text-green-600 transition-colors">
                        <span className="sr-only">{platform}</span>
                        <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center hover:bg-green-50 transition-colors">
                          <div className="w-4 h-4 bg-current rounded-sm" />
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Organizing Committee */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Organizing Committee</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light">
              The dedicated professionals who make our programs and events possible.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {organizingCommittee.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl p-6 hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-green-100"
              >
                <h3 className="text-lg font-bold text-gray-900">{member.name}</h3>
                <p className="text-green-600 font-medium text-sm mb-2">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Advisory Board */}
      <section className="py-24 bg-gradient-to-br from-green-50 to-yellow-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Advisory Board</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light">
              Esteemed experts guiding our strategic direction and cultural initiatives.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {advisors.map((advisor, index) => (
              <motion.div
                key={advisor.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl p-8 hover:shadow-lg transition-all duration-300 border-t-4 border-green-500"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-2">{advisor.name}</h3>
                <p className="text-green-600 font-medium mb-3">{advisor.role}</p>
                <p className="text-gray-600 text-sm leading-relaxed">{advisor.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Highlights */}
      <section className="py-24 bg-green-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {impactHighlights.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-6"
              >
                <div className="text-4xl md:text-5xl font-bold text-yellow-400 mb-2">{item.number}</div>
                <div className="text-xl font-bold mb-2">{item.label}</div>
                <div className="text-green-200 text-sm">{item.description}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default AboutPage