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

  const beneficiaryTestimonials = [
    {
      name: 'Esther Mwangi',
      role: 'Artisan',
      location: 'Nairobi, Kenya',
      quote: 'Thanks to the support from Miss Culture Global Kenya, I\'ve been able to pass on my pottery skills to young women in my community. This has not only preserved our tradition but also provided income for many families.',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop'
    },
    {
      name: 'David Kimani',
      role: 'Youth Participant',
      location: 'Mombasa, Kenya',
      quote: 'The cultural education program opened my eyes to the richness of our heritage. I now actively participate in preserving and sharing our traditions with others.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop'
    },
    {
      name: 'Sarah Akinyi',
      role: 'Community Leader',
      location: 'Kisumu, Kenya',
      quote: 'Our partnership with Miss Culture Global Kenya has brought international recognition to our traditional dances. This has boosted tourism and provided economic opportunities for our community.',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <section className="relative h-96 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full bg-gradient-to-br from-green-900/80 via-green-800/70 to-yellow-600/80">
            <div 
              className="w-full h-full bg-cover bg-center bg-no-repeat" 
              style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=1920&h=600&fit=crop)' }} 
            />
          </div>
        </div>
        <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              About Us
            </h1>
            <p className="text-xl sm:text-2xl text-gray-100 max-w-3xl mx-auto">
              Celebrating Kenya's rich cultural heritage and promoting global understanding through authentic representation.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-6">
                To preserve, promote, and celebrate Kenya's diverse cultural heritage while fostering unity, 
                empowering youth, and representing our nation with pride on the global stage.
              </p>
              <p className="text-lg text-gray-600">
                We are committed to showcasing authentic Kenyan culture through our ambassadors, 
                community programs, and international collaborations.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-elegant p-8"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Vision</h2>
              <p className="text-lg text-gray-600 mb-6">
                A world where Kenya's cultural richness is recognized, respected, and celebrated globally, 
                where our youth are empowered as cultural ambassadors, and where cultural diversity strengthens 
                our national identity.
              </p>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <p className="text-gray-700 font-medium">Cultural Excellence</p>
              </div>
              <div className="flex items-center space-x-3 mt-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <p className="text-gray-700 font-medium">Global Recognition</p>
              </div>
              <div className="flex items-center space-x-3 mt-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <p className="text-gray-700 font-medium">Community Empowerment</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Impact Highlights */}
      <section className="py-16 bg-gradient-to-br from-green-50 to-yellow-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Impact</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real stories of impact from communities and individuals whose lives have been transformed through our work.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {impactHighlights.map((highlight, index) => (
              <motion.div
                key={highlight.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl shadow-elegant p-6 text-center"
              >
                <div className="text-4xl font-bold text-green-600 mb-2">{highlight.number}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{highlight.label}</h3>
                <p className="text-gray-600 text-sm">{highlight.description}</p>
              </motion.div>
            ))}
          </div>
          
          {/* Beneficiary Testimonials */}
          <div className="mt-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h3 className="text-3xl font-bold text-gray-900 mb-4">Beneficiary Testimonials</h3>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Hear directly from those who have been impacted by our programs.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {beneficiaryTestimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-2xl shadow-elegant p-8 relative"
                >
                  <div className="flex items-center mb-6">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name} 
                      className="w-16 h-16 rounded-full object-cover mr-4"
                    />
                    <div>
                      <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                      <p className="text-green-600">{testimonial.role}</p>
                      <p className="text-gray-500 text-sm">{testimonial.location}</p>
                    </div>
                  </div>
                  <p className="text-gray-600 italic">"{testimonial.quote}"</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* History Timeline */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Journey</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A timeline of our milestones and achievements in promoting Kenyan culture globally.
            </p>
          </motion.div>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-green-100 hidden md:block"></div>
            
            {/* Timeline items */}
            <div className="space-y-12">
              {historyMilestones.map((milestone, index) => (
                <motion.div
                  key={milestone.year}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`flex flex-col md:flex-row ${index % 2 === 0 ? 'md:flex-row-reverse' : ''} items-center`}
                >
                  <div className="md:w-1/2 mb-4 md:mb-0 md:px-8">
                    <div className="bg-white rounded-2xl shadow-elegant p-6">
                      <span className="text-green-600 font-bold text-lg">{milestone.year}</span>
                      <h3 className="text-xl font-bold text-gray-900 mt-2 mb-3">{milestone.title}</h3>
                      <p className="text-gray-600">{milestone.description}</p>
                    </div>
                  </div>
                  
                  {/* Circle */}
                  <div className="hidden md:flex md:w-16 h-16 rounded-full bg-green-500 items-center justify-center text-white font-bold text-lg z-10">
                    {milestone.year}
                  </div>
                  
                  <div className="md:w-1/2 md:px-8"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-gradient-to-br from-green-50 to-yellow-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
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
                className="bg-white rounded-2xl shadow-elegant p-8 text-center hover:shadow-elegant-lg transition-all duration-300"
              >
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <value.icon className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Leadership Team</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The visionary leaders guiding our mission to promote Kenyan culture globally.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentLeadership.map((leader, index) => (
              <motion.div
                key={leader.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl shadow-elegant overflow-hidden hover:shadow-elegant-lg transition-all duration-300"
              >
                <div className="h-64 overflow-hidden">
                  <img 
                    src={leader.image} 
                    alt={leader.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900">{leader.name}</h3>
                  <p className="text-green-600 font-medium mb-3">{leader.title}</p>
                  <p className="text-gray-600 mb-4">{leader.bio}</p>
                  <div className="flex space-x-4">
                    <a href={leader.social.instagram} className="text-gray-400 hover:text-green-600 transition-colors">
                      <span className="sr-only">Instagram</span>
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987c6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.297-3.323C5.801 8.198 6.952 7.708 8.249 7.708s2.448.49 3.323 1.297c.875.875 1.365 2.026 1.365 3.323s-.49 2.448-1.297 3.323c-.875.875-2.026 1.365-3.323 1.365zm7.711-2.831c-.635 0-1.141-.506-1.141-1.141s.506-1.141 1.141-1.141s1.141.506 1.141 1.141s-.506 1.141-1.141 1.141zm-2.565-6.446c-.635 0-1.141-.506-1.141-1.141s.506-1.141 1.141-1.141s1.141.506 1.141 1.141s-.506 1.141-1.141 1.141z"/>
                      </svg>
                    </a>
                    <a href={leader.social.twitter} className="text-gray-400 hover:text-green-600 transition-colors">
                      <span className="sr-only">Twitter</span>
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/>
                      </svg>
                    </a>
                    <a href={leader.social.linkedin} className="text-gray-400 hover:text-green-600 transition-colors">
                      <span className="sr-only">LinkedIn</span>
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Organizing Committee */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Organizing Committee</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The dedicated professionals who make our programs and events possible.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {organizingCommittee.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-50 rounded-2xl p-6 hover:shadow-elegant transition-all duration-300"
              >
                <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                <p className="text-green-600 font-medium mb-3">{member.role}</p>
                <p className="text-gray-600">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Advisory Board */}
      <section className="py-20 bg-gradient-to-br from-green-50 to-yellow-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Advisory Board</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
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
                className="bg-white rounded-2xl shadow-elegant p-6"
              >
                <h3 className="text-xl font-bold text-gray-900">{advisor.name}</h3>
                <p className="text-green-600 font-medium mb-3">{advisor.role}</p>
                <p className="text-gray-600">{advisor.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default AboutPage