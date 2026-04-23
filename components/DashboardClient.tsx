'use client'

import { useState, useEffect } from 'react'
import { signOut } from 'next-auth/react'
import Image from 'next/image'

interface Log {
  id: string
  text: string
  category: string
  imageUrl?: string
  createdAt: string
}

export default function DashboardClient() {
  const [logs, setLogs] = useState<Log[]>([])
  const [text, setText] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchLogs()
  }, [])

  const fetchLogs = async () => {
    const res = await fetch('/api/logs')
    if (res.ok) {
      const data = await res.json()
      setLogs(data)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const res = await fetch('/api/logs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text, imageUrl: imageUrl || undefined }),
    })

    if (res.ok) {
      setText('')
      setImageUrl('')
      fetchLogs()
    }

    setLoading(false)
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'ELECTRICAL':
        return 'bg-yellow-100 text-yellow-800'
      case 'FLOORING':
        return 'bg-green-100 text-green-800'
      case 'PAINTING':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">SiteFlow Dashboard</h1>
            <button
              onClick={() => signOut()}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
            >
              Sign Out
            </button>
          </div>

          <div className="bg-white shadow rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Add New Log</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="text" className="block text-sm font-medium text-gray-700">
                  Log Text
                </label>
                <textarea
                  id="text"
                  rows={4}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">
                  Image URL (optional)
                </label>
                <input
                  type="url"
                  id="imageUrl"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {loading ? 'Submitting...' : 'Submit Log'}
              </button>
            </form>
          </div>

          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-xl font-semibold mb-4">Your Logs</h2>
              {logs.length === 0 ? (
                <p className="text-gray-500">No logs yet. Add your first log above!</p>
              ) : (
                <div className="space-y-4">
                  {logs.map((log) => (
                    <div key={log.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(log.category)}`}>
                          {log.category}
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(log.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-gray-900 mb-2">{log.text}</p>
                      {log.imageUrl && (
                        <Image src={log.imageUrl} alt="Log image" width={500} height={300} className="max-w-full h-auto rounded" unoptimized />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}