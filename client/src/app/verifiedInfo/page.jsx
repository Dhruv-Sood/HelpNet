'use client'

import { useState, useEffect } from 'react'

const Page = () => {
  const [verifiedInfo, setVerifiedInfo] = useState([])

  useEffect(() => {
    const fetchVerifiedInfo = async () => {
      try {
        const response = await fetch('http://localhost:3001/verifiedInfo')
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        const data = await response.json()
        setVerifiedInfo(data)
      } catch (error) {
        console.error('Error fetching verified info:', error)
      }
    }

    fetchVerifiedInfo()
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-white text-center">Verified Disaster Relief Information</h1>
      <div className="max-w-4xl mx-auto space-y-6">
        {verifiedInfo.map((info, index) => (
          <div key={index} className="bg-zinc-800 border border-zinc-700 p-6 rounded-lg text-white shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold">{info.title}</h2>
              <span className="bg-green-600/20 text-green-400 px-3 py-1 rounded-full text-sm">
                Verified ✓
              </span>
            </div>
            <p className="text-gray-300 text-lg mb-6">{info.description}</p>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <span className="text-white font-medium">📍 Location:</span>
                <span>{info.location}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-white font-medium">🏷️ Category:</span>
                <span>{info.category}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-white font-medium">👤 Sender:</span>
                <span className="font-mono">{info.sender}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-white font-medium">✅ Verified:</span>
                <span>{new Date(info.verifiedAt).toLocaleString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Page