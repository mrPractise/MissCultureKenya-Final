'use client'

import { useState, useEffect } from 'react'
import apiClient from './api'

// Types for each page settings
interface HomePageSettings {
  hero_image_url: string | null
  kenya_highlight_image_url: string | null
  ambassador_highlight_image_url: string | null
  kenya_highlight_enabled: boolean
  ambassador_highlight_enabled: boolean
  upcoming_event_enabled: boolean
  recent_event_enabled: boolean
}

interface KenyaPageSettings {
  hero_image_url: string | null
  page_title: string
  page_subtitle: string
}

interface AmbassadorPageSettings {
  hero_image_url: string | null
  page_title: string
  page_subtitle: string
  profile_image_url: string | null
  video_url: string | null
}

interface EventsPageSettings {
  hero_image_url: string | null
  page_title: string
  page_subtitle: string
}

interface GalleryPageSettings {
  hero_image_url: string | null
  page_title: string
  page_subtitle: string
}

interface AboutPageSettings {
  hero_image_url: string | null
  mission_image_url: string | null
  page_title: string
  page_subtitle: string
  leader_1_name: string
  leader_1_title: string
  leader_1_bio: string
  leader_1_image_url: string | null
  leader_2_name: string
  leader_2_title: string
  leader_2_bio: string
  leader_2_image_url: string | null
  leader_3_name: string
  leader_3_title: string
  leader_3_bio: string
  leader_3_image_url: string | null
  committee_1_name: string
  committee_1_role: string
  committee_1_bio: string
  committee_2_name: string
  committee_2_role: string
  committee_2_bio: string
  committee_3_name: string
  committee_3_role: string
  committee_3_bio: string
  committee_4_name: string
  committee_4_role: string
  committee_4_bio: string
  committee_5_name: string
  committee_5_role: string
  committee_5_bio: string
  committee_6_name: string
  committee_6_role: string
  committee_6_bio: string
}

interface PartnershipPageSettings {
  hero_image_url: string | null
  page_title: string
  page_subtitle: string
}

interface ContactPageSettings {
  hero_image_url: string | null
  page_title: string
  page_subtitle: string
}

interface FAQPageSettings {
  hero_image_url: string | null
  page_title: string
  page_subtitle: string
}

interface ContributePageSettings {
  hero_image_url: string | null
  page_title: string
  page_subtitle: string
}

interface PrivacyPageSettings {
  hero_image_url: string | null
  page_title: string
  page_subtitle: string
}

interface TermsPageSettings {
  hero_image_url: string | null
  page_title: string
  page_subtitle: string
}

// Hook for Home Page Settings
export function useHomePageSettings() {
  const [settings, setSettings] = useState<HomePageSettings>({
    hero_image_url: null,
    kenya_highlight_image_url: null,
    ambassador_highlight_image_url: null,
    kenya_highlight_enabled: true,
    ambassador_highlight_enabled: true,
    upcoming_event_enabled: true,
    recent_event_enabled: true,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadSettings() {
      try {
        const data = await apiClient.getHomePageSettings()
        setSettings(prev => ({ ...prev, ...data }))
      } catch (err: any) {
        setError(err.message || 'Failed to load home page settings')
      } finally {
        setLoading(false)
      }
    }
    loadSettings()
  }, [])

  return { settings, loading, error }
}

// Hook for Kenya Page Settings
export function useKenyaPageSettings() {
  const [settings, setSettings] = useState<KenyaPageSettings>({
    hero_image_url: null,
    page_title: 'Kenya',
    page_subtitle: 'Our homeland, our culture, our global stage.',
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadSettings() {
      try {
        const data = await apiClient.getKenyaPageSettings()
        setSettings(prev => ({ ...prev, ...data }))
      } catch (err: any) {
        setError(err.message || 'Failed to load Kenya page settings')
      } finally {
        setLoading(false)
      }
    }
    loadSettings()
  }, [])

  return { settings, loading, error }
}

// Hook for Ambassador Page Settings
export function useAmbassadorPageSettings() {
  const [settings, setSettings] = useState<AmbassadorPageSettings>({
    hero_image_url: null,
    page_title: "Susan — Kenya's Voice on the World Stage",
    page_subtitle: 'Miss Culture Global Kenya Ambassador · Cultural diplomat · Youth champion',
    profile_image_url: null,
    video_url: null,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadSettings() {
      try {
        const data = await apiClient.getAmbassadorPageSettings()
        setSettings(prev => ({ ...prev, ...data }))
      } catch (err: any) {
        setError(err.message || 'Failed to load ambassador page settings')
      } finally {
        setLoading(false)
      }
    }
    loadSettings()
  }, [])

  return { settings, loading, error }
}

// Hook for Events Page Settings
export function useEventsPageSettings() {
  const [settings, setSettings] = useState<EventsPageSettings>({
    hero_image_url: null,
    page_title: 'Events',
    page_subtitle: 'Upcoming events and past highlights',
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadSettings() {
      try {
        const data = await apiClient.getEventsPageSettings()
        setSettings(prev => ({ ...prev, ...data }))
      } catch (err: any) {
        setError(err.message || 'Failed to load events page settings')
      } finally {
        setLoading(false)
      }
    }
    loadSettings()
  }, [])

  return { settings, loading, error }
}

// Hook for Gallery Page Settings
export function useGalleryPageSettings() {
  const [settings, setSettings] = useState<GalleryPageSettings>({
    hero_image_url: null,
    page_title: 'Gallery',
    page_subtitle: 'Photos and videos from our journey',
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadSettings() {
      try {
        const data = await apiClient.getGalleryPageSettings()
        setSettings(prev => ({ ...prev, ...data }))
      } catch (err: any) {
        setError(err.message || 'Failed to load gallery page settings')
      } finally {
        setLoading(false)
      }
    }
    loadSettings()
  }, [])

  return { settings, loading, error }
}

// Hook for About Page Settings
export function useAboutPageSettings() {
  const [settings, setSettings] = useState<AboutPageSettings>({
    hero_image_url: null,
    mission_image_url: null,
    page_title: 'About Us',
    page_subtitle: "We Are the Keepers of Kenya's Story",
    leader_1_name: 'Susan Abongo',
    leader_1_title: 'Miss Culture Global Kenya',
    leader_1_bio: 'A passionate cultural ambassador with over 5 years of experience promoting Kenyan heritage.',
    leader_1_image_url: null,
    leader_2_name: 'Pacific Awuor Oriato',
    leader_2_title: 'Director of Operations',
    leader_2_bio: 'Oversees all operational aspects of the organization with a focus on community engagement.',
    leader_2_image_url: null,
    leader_3_name: 'Grace Njeri',
    leader_3_title: 'Community Outreach Coordinator',
    leader_3_bio: 'Leads community engagement initiatives and works directly with local artisans.',
    leader_3_image_url: null,
    committee_1_name: 'Robert Ochieng',
    committee_1_role: 'Event Coordinator',
    committee_1_bio: 'Specializes in organizing cultural events and festivals across Kenya.',
    committee_2_name: 'Mary Atieno',
    committee_2_role: 'Marketing Director',
    committee_2_bio: 'Leads digital marketing and brand awareness campaigns.',
    committee_3_name: 'David Kimani',
    committee_3_role: 'Finance Manager',
    committee_3_bio: 'Manages budgeting and financial reporting for all programs.',
    committee_4_name: 'Sarah Akinyi',
    committee_4_role: 'Volunteer Coordinator',
    committee_4_bio: 'Recruits and manages volunteers for all initiatives.',
    committee_5_name: 'Peter Kamau',
    committee_5_role: 'International Relations',
    committee_5_bio: 'Handles partnerships with international cultural organizations.',
    committee_6_name: 'Esther Muthoni',
    committee_6_role: 'Youth Programs Lead',
    committee_6_bio: 'Develops and implements youth engagement programs.',
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadSettings() {
      try {
        const data = await apiClient.getAboutPageSettings()
        setSettings(prev => ({ ...prev, ...data }))
      } catch (err: any) {
        setError(err.message || 'Failed to load about page settings')
      } finally {
        setLoading(false)
      }
    }
    loadSettings()
  }, [])

  return { settings, loading, error }
}

// Hook for Partnership Page Settings
export function usePartnershipPageSettings() {
  const [settings, setSettings] = useState<PartnershipPageSettings>({
    hero_image_url: null,
    page_title: 'Partner with Heritage',
    page_subtitle: "Align your brand with Kenya's cultural diplomacy movement.",
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadSettings() {
      try {
        const data = await apiClient.getPartnershipPageSettings()
        setSettings(prev => ({ ...prev, ...data }))
      } catch (err: any) {
        setError(err.message || 'Failed to load partnership page settings')
      } finally {
        setLoading(false)
      }
    }
    loadSettings()
  }, [])

  return { settings, loading, error }
}

// Hook for Contact Page Settings
export function useContactPageSettings() {
  const [settings, setSettings] = useState<ContactPageSettings>({
    hero_image_url: null,
    page_title: 'Contact Us',
    page_subtitle: 'Get in touch with us',
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadSettings() {
      try {
        const data = await apiClient.getContactPageSettings()
        setSettings(prev => ({ ...prev, ...data }))
      } catch (err: any) {
        setError(err.message || 'Failed to load contact page settings')
      } finally {
        setLoading(false)
      }
    }
    loadSettings()
  }, [])

  return { settings, loading, error }
}

// Hook for FAQ Page Settings
export function useFAQPageSettings() {
  const [settings, setSettings] = useState<FAQPageSettings>({
    hero_image_url: null,
    page_title: 'FAQ',
    page_subtitle: 'Frequently asked questions',
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadSettings() {
      try {
        const data = await apiClient.getFAQPageSettings()
        setSettings(prev => ({ ...prev, ...data }))
      } catch (err: any) {
        setError(err.message || 'Failed to load FAQ page settings')
      } finally {
        setLoading(false)
      }
    }
    loadSettings()
  }, [])

  return { settings, loading, error }
}

// Hook for Contribute Page Settings
export function useContributePageSettings() {
  const [settings, setSettings] = useState<ContributePageSettings>({
    hero_image_url: null,
    page_title: 'Contribute',
    page_subtitle: 'Support our mission',
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadSettings() {
      try {
        const data = await apiClient.getContributePageSettings()
        setSettings(prev => ({ ...prev, ...data }))
      } catch (err: any) {
        setError(err.message || 'Failed to load contribute page settings')
      } finally {
        setLoading(false)
      }
    }
    loadSettings()
  }, [])

  return { settings, loading, error }
}

// Hook for Privacy Page Settings
export function usePrivacyPageSettings() {
  const [settings, setSettings] = useState<PrivacyPageSettings>({
    hero_image_url: null,
    page_title: 'Privacy Policy',
    page_subtitle: 'Your privacy matters to us',
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadSettings() {
      try {
        const data = await apiClient.getPrivacyPageSettings()
        setSettings(prev => ({ ...prev, ...data }))
      } catch (err: any) {
        setError(err.message || 'Failed to load privacy page settings')
      } finally {
        setLoading(false)
      }
    }
    loadSettings()
  }, [])

  return { settings, loading, error }
}

// Hook for Terms Page Settings
export function useTermsPageSettings() {
  const [settings, setSettings] = useState<TermsPageSettings>({
    hero_image_url: null,
    page_title: 'Terms of Service',
    page_subtitle: 'Terms and conditions',
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadSettings() {
      try {
        const data = await apiClient.getTermsPageSettings()
        setSettings(prev => ({ ...prev, ...data }))
      } catch (err: any) {
        setError(err.message || 'Failed to load terms page settings')
      } finally {
        setLoading(false)
      }
    }
    loadSettings()
  }, [])

  return { settings, loading, error }
}
