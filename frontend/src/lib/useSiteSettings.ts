import { useState, useEffect } from 'react'
import apiClient from './api'

type SiteSettings = {
  home_hero_image_url: string | null
  home_hero_video_url: string | null
  home_upcoming_event_image_url: string | null
  home_kenya_highlight_image_url: string | null
  home_ambassador_highlight_image_url: string | null
  kenya_hero_image_url: string | null
  ambassador_hero_image_url: string | null
  ambassador_profile_image_url: string | null
  ambassador_video_url: string | null
  events_hero_image_url: string | null
  gallery_hero_image_url: string | null
  voting_hero_image_url: string | null
  partnership_hero_image_url: string | null
  contribute_hero_image_url: string | null
  contact_hero_image_url: string | null
  faq_hero_image_url: string | null
  about_hero_image_url: string | null
  about_mission_image_url: string | null
  about_leader_1_image_url: string | null
  about_leader_2_image_url: string | null
  about_leader_3_image_url: string | null
  leader_1_name: string | null
  leader_1_title: string | null
  leader_1_bio: string | null
  leader_2_name: string | null
  leader_2_title: string | null
  leader_2_bio: string | null
  leader_3_name: string | null
  leader_3_title: string | null
  leader_3_bio: string | null
  committee_1_name: string | null
  committee_1_role: string | null
  committee_1_bio: string | null
  committee_2_name: string | null
  committee_2_role: string | null
  committee_2_bio: string | null
  committee_3_name: string | null
  committee_3_role: string | null
  committee_3_bio: string | null
  committee_4_name: string | null
  committee_4_role: string | null
  committee_4_bio: string | null
  committee_5_name: string | null
  committee_5_role: string | null
  committee_5_bio: string | null
  committee_6_name: string | null
  committee_6_role: string | null
  committee_6_bio: string | null
  kenya_artisan_1_image_url: string | null
  kenya_artisan_2_image_url: string | null
  kenya_artisan_3_image_url: string | null
  kenya_artisan_4_image_url: string | null
  privacy_hero_image_url: string | null
  voting_event_1_image_url: string | null
  voting_event_2_image_url: string | null
  voting_event_3_image_url: string | null
  voting_event_4_image_url: string | null
  voting_participant_1_image_url: string | null
  voting_participant_2_image_url: string | null
  voting_participant_3_image_url: string | null
  voting_participant_4_image_url: string | null
  voting_participant_5_image_url: string | null
  voting_participant_6_image_url: string | null
}

let cachedSettings: SiteSettings | null = null
let fetchPromise: Promise<SiteSettings> | null = null

const DEFAULTS: SiteSettings = {
  home_hero_image_url: null,
  home_hero_video_url: null,
  home_upcoming_event_image_url: null,
  home_kenya_highlight_image_url: null,
  home_ambassador_highlight_image_url: null,
  kenya_hero_image_url: null,
  ambassador_hero_image_url: null,
  ambassador_profile_image_url: null,
  ambassador_video_url: null,
  events_hero_image_url: null,
  gallery_hero_image_url: null,
  voting_hero_image_url: null,
  partnership_hero_image_url: null,
  contribute_hero_image_url: null,
  contact_hero_image_url: null,
  faq_hero_image_url: null,
  about_hero_image_url: null,
  about_mission_image_url: null,
  about_leader_1_image_url: null,
  about_leader_2_image_url: null,
  about_leader_3_image_url: null,
  leader_1_name: null,
  leader_1_title: null,
  leader_1_bio: null,
  leader_2_name: null,
  leader_2_title: null,
  leader_2_bio: null,
  leader_3_name: null,
  leader_3_title: null,
  leader_3_bio: null,
  committee_1_name: null,
  committee_1_role: null,
  committee_1_bio: null,
  committee_2_name: null,
  committee_2_role: null,
  committee_2_bio: null,
  committee_3_name: null,
  committee_3_role: null,
  committee_3_bio: null,
  committee_4_name: null,
  committee_4_role: null,
  committee_4_bio: null,
  committee_5_name: null,
  committee_5_role: null,
  committee_5_bio: null,
  committee_6_name: null,
  committee_6_role: null,
  committee_6_bio: null,
  kenya_artisan_1_image_url: null,
  kenya_artisan_2_image_url: null,
  kenya_artisan_3_image_url: null,
  kenya_artisan_4_image_url: null,
  privacy_hero_image_url: null,
  voting_event_1_image_url: null,
  voting_event_2_image_url: null,
  voting_event_3_image_url: null,
  voting_event_4_image_url: null,
  voting_participant_1_image_url: null,
  voting_participant_2_image_url: null,
  voting_participant_3_image_url: null,
  voting_participant_4_image_url: null,
  voting_participant_5_image_url: null,
  voting_participant_6_image_url: null,
}

async function fetchSettings(): Promise<SiteSettings> {
  if (cachedSettings) return cachedSettings
  if (fetchPromise) return fetchPromise

  fetchPromise = (async (): Promise<SiteSettings> => {
    try {
      const data = await apiClient.get('/api/main/settings/')
      cachedSettings = { ...DEFAULTS, ...(data as Partial<SiteSettings>) }
      return cachedSettings!
    } catch {
      return { ...DEFAULTS }
    } finally {
      fetchPromise = null
    }
  })()

  return fetchPromise
}

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>(cachedSettings || DEFAULTS)

  useEffect(() => {
    if (cachedSettings) {
      setSettings(cachedSettings)
      return
    }
    fetchSettings().then(s => setSettings(s))
  }, [])

  return settings
}

/** Get a single hero image URL by tab key, e.g. getHero('home') */
export function getHero(settings: SiteSettings, tab: string): string | null {
  const key = `${tab}_hero_image_url` as keyof SiteSettings
  return settings[key] || null
}

export { fetchSettings }
