'use client'

import { useState, useEffect } from 'react'
import apiClient from './api'

// Types for each page settings
interface HomePageSettings {
  hero_image_url: string | null
  hero_video_url: string | null
  welcome_title: string
  welcome_subtitle: string
  kenya_highlight_image_url: string | null
  kenya_highlight_enabled: boolean
  ambassador_highlight_image_url: string | null
  ambassador_highlight_enabled: boolean
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

// Hook for Home Page Settings
export function useHomePageSettings() {
  const [settings, setSettings] = useState<HomePageSettings>({
    hero_image_url: null,
    hero_video_url: null,
    welcome_title: 'Welcome to Miss Culture Global Kenya',
    welcome_subtitle: '',
    kenya_highlight_image_url: null,
    kenya_highlight_enabled: true,
    ambassador_highlight_image_url: null,
    ambassador_highlight_enabled: true,
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
