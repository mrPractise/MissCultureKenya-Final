'use client'

import { useState, useEffect } from 'react'
import apiClient from '@/lib/api'

const ApiTestPage = () => {
  const [testResults, setTestResults] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(false)

  const runTests = async () => {
    setLoading(true)
    const results: Record<string, any> = {}

    // Test 1: Blog Posts
    try {
      const blogResponse = await apiClient.getBlogPosts({ limit: 5 })
      results.blog = {
        status: 'success',
        data: Array.isArray(blogResponse) ? blogResponse : blogResponse.results || [],
        count: Array.isArray(blogResponse) ? blogResponse.length : blogResponse.count || 0
      }
    } catch (error: any) {
      results.blog = {
        status: 'error',
        error: error.message
      }
    }

    // Test 2: Events
    try {
      const eventsResponse = await apiClient.getEvents({ limit: 5 })
      results.events = {
        status: 'success',
        data: Array.isArray(eventsResponse) ? eventsResponse : eventsResponse.results || [],
        count: Array.isArray(eventsResponse) ? eventsResponse.length : eventsResponse.count || 0
      }
    } catch (error: any) {
      results.events = {
        status: 'error',
        error: error.message
      }
    }

    // Test 3: Photos
    try {
      const photosResponse = await apiClient.getPhotos({ limit: 5 })
      results.photos = {
        status: 'success',
        data: Array.isArray(photosResponse) ? photosResponse : photosResponse.results || [],
        count: Array.isArray(photosResponse) ? photosResponse.length : photosResponse.count || 0
      }
    } catch (error: any) {
      results.photos = {
        status: 'error',
        error: error.message
      }
    }

    // Test 4: Upcoming Events
    try {
      const upcomingResponse = await apiClient.getUpcomingEvents()
      results.upcomingEvents = {
        status: 'success',
        data: Array.isArray(upcomingResponse) ? upcomingResponse : [],
        count: Array.isArray(upcomingResponse) ? upcomingResponse.length : 0
      }
    } catch (error: any) {
      results.upcomingEvents = {
        status: 'error',
        error: error.message
      }
    }

    setTestResults(results)
    setLoading(false)
  }

  useEffect(() => {
    runTests()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">API Connection Test</h1>
        <p className="text-gray-600 mb-8">
          Testing connection to backend API at: <code className="bg-gray-200 px-2 py-1 rounded">http://localhost:8000/api</code>
        </p>

        <button
          onClick={runTests}
          disabled={loading}
          className="mb-8 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Testing...' : 'Run Tests Again'}
        </button>

        <div className="space-y-6">
          {Object.entries(testResults).map(([key, result]) => (
            <div key={key} className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4 capitalize">{key.replace(/([A-Z])/g, ' $1')}</h2>
              {result.status === 'success' ? (
                <div>
                  <div className="flex items-center mb-4">
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                      ✓ Connected
                    </span>
                    <span className="ml-4 text-gray-600">
                      {result.count} {result.count === 1 ? 'item' : 'items'} found
                    </span>
                  </div>
                  {result.data && result.data.length > 0 ? (
                    <div className="space-y-2">
                      {result.data.slice(0, 3).map((item: any, index: number) => (
                        <div key={index} className="bg-gray-50 p-3 rounded">
                          <p className="font-semibold">{item.title || item.name || `Item ${index + 1}`}</p>
                          {item.description && (
                            <p className="text-sm text-gray-600 line-clamp-1">{item.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-yellow-600">No data available. Add items in Django admin.</p>
                  )}
                </div>
              ) : (
                <div>
                  <div className="flex items-center mb-4">
                    <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">
                      ✗ Error
                    </span>
                  </div>
                  <p className="text-red-600">{result.error}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Make sure the Django backend is running at http://localhost:8000
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {Object.keys(testResults).length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-600">Click "Run Tests" to check API connection</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ApiTestPage


