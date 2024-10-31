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
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Verified Information</h1>
      <div className="grid gap-6">
        {verifiedInfo.map((info, index) => (
          <div key={index} className="border p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">{info.title}</h2>
            <p className="mb-2">{info.description}</p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Location:</span> {info.location}
              </div>
              <div>
                <span className="font-medium">Category:</span> {info.category}
              </div>
              <div>
                <span className="font-medium">Sender:</span> {info.sender}
              </div>
              <div>
                <span className="font-medium">Verified At:</span> {new Date(info.verifiedAt).toLocaleString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Page