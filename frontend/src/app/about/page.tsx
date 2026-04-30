'use client'

import { motion } from 'framer-motion'
import { Heart, Globe, Award, Target, BookOpen, ExternalLink, Sparkles, Handshake, Dumbbell, ChevronRight, Users, Shield, Lightbulb, Landmark } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'
import { useSiteSettings } from '@/lib/useSiteSettings'

const AboutPage = () => {
  const settings = useSiteSettings()

  const historyMilestones = [
    { year: '2015', title: 'Foundation', description: 'Miss Culture Global Kenya was established with a vision to celebrate and preserve Kenya\'s rich cultural heritage.' },
    { year: '2017', title: 'First International Representation', description: 'Our first representative participated in the Miss Culture Global competition, placing in the top 10 — proving Kenya belongs on the world cultural stage.' },
    { year: '2019', title: 'Community Outreach Program', description: 'Launched our community outreach program supporting local artisans and cultural preservation initiatives across 5 counties.' },
    { year: '2021', title: 'Digital Transformation', description: 'Expanded our reach through digital platforms, connecting with global audiences and bringing Kenyan culture to screens worldwide.' },
    { year: '2023', title: 'Youth Empowerment Initiative', description: 'Introduced programs focused on youth leadership and cultural education, reaching 1,000+ young Kenyans in its first year.' },
    { year: '2024', title: 'Global Recognition', description: 'Received international recognition for our contribution to cultural preservation and promotion — now operating in partnership with 50+ nations.' }
  ]

  const values = [
    { title: 'Cultural Preservation & Innovation', description: 'Documenting and promoting diverse Kenyan traditions while integrating them into the modern creative economy — fashion, arts, and digital media.', icon: Heart },
    { title: 'Global Ambassadorship', description: 'Equipping titleholders with the diplomacy and communication skills necessary to represent Kenya on international stages and attract foreign investment.', icon: Globe },
    { title: 'Youth & Female Leadership', description: 'Providing a rigorous mentorship ecosystem focusing on entrepreneurship, public speaking, and community project management.', icon: Award },
    { title: 'Sustainable Tourism Advocacy', description: 'Partnering with stakeholders in the travel industry to highlight "Hidden Gems" of Kenya, promoting eco-tourism and community-based travel.', icon: Target },
    { title: 'Community Impact', description: 'Direct, measurable impact in 100+ communities through grassroots programs, artisan markets, and school outreach across Kenya.', icon: Users },
    { title: 'Integrity & Transparency', description: 'Every shilling accounted for, every program measured, every decision guided by our mission — because trust is built through action, not words.', icon: Shield }
  ]

  const currentLeadership = [
    {
      name: settings.leader_1_name || 'Susan Abongo',
      title: settings.leader_1_title || 'Miss Culture Global Kenya',
      bio: settings.leader_1_bio || 'A passionate cultural ambassador with over 5 years of experience promoting Kenyan heritage. Susan holds a degree in Cultural Studies and has represented Kenya in international cultural forums across 15+ countries.',
      image: settings.about_leader_1_image_url || '',
    },
    {
      name: settings.leader_2_name || 'James Mwangi',
      title: settings.leader_2_title || 'Director of Operations',
      bio: settings.leader_2_bio || 'Oversees all operational aspects of the organization with a focus on community engagement and event management. James has a background in event planning and cultural tourism.',
      image: settings.about_leader_2_image_url || '',
    },
    {
      name: settings.leader_3_name || 'Grace Njeri',
      title: settings.leader_3_title || 'Community Outreach Coordinator',
      bio: settings.leader_3_bio || 'Leads community engagement initiatives and works directly with local artisans and cultural groups. Grace has a Master\'s degree in Anthropology and extensive experience in grassroots organizing.',
      image: settings.about_leader_3_image_url || '',
    }
  ]

  const organizingCommittee = [
    { name: settings.committee_1_name || 'Robert Ochieng', role: settings.committee_1_role || 'Event Coordinator', bio: settings.committee_1_bio || 'Specializes in organizing cultural events and festivals across Kenya.' },
    { name: settings.committee_2_name || 'Mary Atieno', role: settings.committee_2_role || 'Marketing Director', bio: settings.committee_2_bio || 'Leads digital marketing and brand awareness campaigns.' },
    { name: settings.committee_3_name || 'David Kimani', role: settings.committee_3_role || 'Finance Manager', bio: settings.committee_3_bio || 'Manages budgeting and financial reporting for all programs.' },
    { name: settings.committee_4_name || 'Sarah Akinyi', role: settings.committee_4_role || 'Volunteer Coordinator', bio: settings.committee_4_bio || 'Recruits and manages volunteers for all initiatives.' },
    { name: settings.committee_5_name || 'Peter Kamau', role: settings.committee_5_role || 'International Relations', bio: settings.committee_5_bio || 'Handles partnerships with international cultural organizations.' },
    { name: settings.committee_6_name || 'Esther Muthoni', role: settings.committee_6_role || 'Youth Programs Lead', bio: settings.committee_6_bio || 'Develops and implements youth engagement programs.' }
  ]

  const impactHighlights = [
    { number: '500+', label: 'Artisans Supported', description: 'Providing sustainable income through cultural crafts' },
    { number: '1,000+', label: 'Youth Engaged', description: 'Empowering the next generation of cultural ambassadors' },
    { number: '50+', label: 'Countries Reached', description: 'Promoting Kenyan culture on the global stage' },
    { number: '100+', label: 'Communities Impacted', description: 'Strengthening local cultural preservation efforts' }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[55vh] min-h-[450px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full bg-black/80">
            {settings.about_hero_image_url ? (
              <div className="w-full h-full bg-cover bg-center bg-no-repeat opacity-40 mix-blend-overlay" style={{ backgroundImage: `url(${settings.about_hero_image_url})` }} />
            ) : null}
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
            <p className="text-sm sm:text-base uppercase tracking-[0.3em] text-green-400 mb-4 font-semibold">The Full Narrative</p>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white tracking-tight">
              We Are the Keepers of <span className="text-red-600">Kenya&apos;s Story</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto font-light leading-relaxed">
              Miss Culture Global Kenya is not just a pageant. It is a cultural preservation movement, a youth empowerment platform, and Kenya&apos;s voice in a global conversation spanning 50+ nations.
            </p>
            <div className="mt-8 flex justify-center">
              <div className="h-1 w-24 bg-red-600 rounded-full" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* 1. Mission & Vision */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Our <span className="text-red-600">Mission</span></h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-4">
                To identify, mentor, and empower visionary young women who will safeguard Kenyan cultural identity, promote responsible tourism, and foster cross-cultural partnerships that create tangible impact in local communities.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                By blending &ldquo;The Beauty of Purpose&rdquo; with &ldquo;The Power of Heritage,&rdquo; we create a stage where culture drives sustainable development and global unity.
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
              <div className="absolute inset-0 bg-green-600/10 rounded-2xl transform rotate-3" />
              {settings.about_mission_image_url ? (
                <img
                  src={settings.about_mission_image_url}
                  alt="Kenyan Culture"
                  className="relative rounded-2xl shadow-2xl transform -rotate-3 hover:rotate-0 transition-transform duration-500"
                />
              ) : (
                <div className="relative rounded-2xl shadow-2xl transform -rotate-3 hover:rotate-0 transition-transform duration-500 bg-green-100 flex items-center justify-center h-64">
                  <Landmark className="w-16 h-16 text-green-300" />
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Vision */}
      <section className="py-24 bg-green-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 decorative-pattern opacity-5" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-yellow-500/5 rounded-full blur-[100px]" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-8">Our <span className="text-red-600">Vision</span></h2>
            <p className="text-xl md:text-2xl text-green-100 font-light leading-relaxed max-w-3xl mx-auto">
              To be Africa&apos;s premier leadership platform that transforms cultural heritage into a global asset for socio-economic empowerment and international diplomacy.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 2. Part of Miss Culture Global */}
      <section className="py-16 bg-black relative overflow-hidden">
        <div className="absolute inset-0 decorative-pattern opacity-5" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row items-center gap-6 md:gap-10 text-center md:text-left"
          >
            <div className="flex-shrink-0">
              <div className="w-20 h-20 bg-red-600 rounded-2xl flex items-center justify-center shadow-2xl">
                <Globe className="w-10 h-10 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-white mb-2">A Proud Franchise of Miss Culture Global</h3>
              <p className="text-gray-400 leading-relaxed mb-4">
                Miss Culture Global Kenya operates as the Kenyan franchise of Miss Culture Global, the international cultural diplomacy platform. Together, we share a unified mission: to transform cultural heritage into a global asset for socio-economic empowerment and international diplomacy — connecting nations, building bridges, and empowering young women worldwide.
              </p>
              <a
                href="https://misscultureglobal.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-yellow-400/50 text-white hover:text-yellow-300 rounded-full text-sm font-semibold transition-all duration-300 group"
              >
                Visit Miss Culture Global
                <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. Culture with Impact Pillars */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Culture with <span className="text-red-600">Impact</span></h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light">
              Three pillars that define how culture drives sustainable development and global unity.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'Heritage & Fashion', description: 'Showcasing the evolution of Kenyan textiles and craftsmanship — where tradition meets the modern creative economy.', icon: Sparkles },
              { title: 'Diplomacy & Peace', description: 'Using culture as a tool for national cohesion and international relations — building bridges across borders.', icon: Handshake },
              { title: 'Economic Empowerment', description: 'Supporting the "Made in Kenya" movement through brand endorsements and entrepreneurial training.', icon: Dumbbell },
            ].map((pillar, index) => (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 p-10 text-center group border border-gray-100 hover:border-green-100"
              >
                <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-red-100 transition-colors duration-300">
                  <pillar.icon className="w-8 h-8 text-red-600 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-green-700 transition-colors duration-300">{pillar.title}</h3>
                <p className="text-gray-600 leading-relaxed">{pillar.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. History Timeline */}
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
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Our <span className="text-red-600">Journey</span></h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light">
              A timeline of milestones in promoting Kenyan culture globally — from a single vision to a movement spanning 50+ nations.
            </p>
          </motion.div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-green-100 hidden md:block"></div>
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

      {/* 5. Core Values */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 decorative-dots opacity-30" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Core <span className="text-red-600">Pillars</span></h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light">
              The strategic pillars that guide our mission and shape our approach to cultural representation.
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

      {/* 6. Leadership Team */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Leadership <span className="text-red-600">Team</span></h2>
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
                {leader.image ? (
                  <div className="h-80 overflow-hidden relative">
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
                    <img
                      src={leader.image}
                      alt={leader.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ) : (
                  <div className="h-32 bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center">
                    <span className="text-5xl font-bold text-white/80">{leader.name.split(' ').map(n => n[0]).join('')}</span>
                  </div>
                )}
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{leader.name}</h3>
                  <p className="text-green-600 font-medium mb-4">{leader.title}</p>
                  <p className="text-gray-600 mb-6 leading-relaxed text-sm">{leader.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Organizing Committee */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Organizing <span className="text-red-600">Committee</span></h2>
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

      {/* 8. Impact Highlights */}
      <section className="py-24 bg-green-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">Our Impact in <span className="text-red-600">Numbers</span></h2>
            <p className="text-xl text-green-100 max-w-2xl mx-auto font-light">Real people, real communities, real results. Here&apos;s the measurable difference we&apos;ve made.</p>
          </motion.div>

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

      {/* 9. CTA */}
      <section className="py-20 bg-black text-white relative overflow-hidden">
        <div className="absolute inset-0 decorative-pattern opacity-5" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Be Part of This <span className="text-red-600">Story</span>?</h2>
            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
              Whether you want to participate, partner, volunteer, or donate — there&apos;s a place for you in Kenya&apos;s cultural future.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/contribute" className="inline-flex items-center justify-center bg-red-600 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 gap-2">
                Support the Mission <ChevronRight className="w-5 h-5" />
              </Link>
              <Link href="/partnership" className="inline-flex items-center justify-center bg-transparent border-2 border-white/30 text-white hover:bg-white/10 px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 gap-2">
                Partner With Us <ChevronRight className="w-5 h-5" />
              </Link>
              <Link href="/contact" className="inline-flex items-center justify-center bg-transparent border-2 border-white/30 text-white hover:bg-white/10 px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 gap-2">
                Get in Touch <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default AboutPage
