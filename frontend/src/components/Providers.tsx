'use client'

import { SWRConfig } from 'swr'
import apiClient from '@/lib/api'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig 
      value={{
        fetcher: (url: string) => apiClient.get(url),
        revalidateOnFocus: false,
        revalidateIfStale: true,
        dedupingInterval: 10000, // 10 seconds
        errorRetryCount: 2,
        onLoadingSlow: (key, config) => {
          console.log('Loading is slow for:', key)
        }
      }}
    >
      {children}
    </SWRConfig>
  )
}
