'use client'

import { useState } from 'react'

export default function Page() {
    const [verifications, setVerifications] = useState([
        { 
            id: 1, 
            title: 'Food Distribution Center', 
            description: 'Free meals available at City Hall', 
            verified: null,
            datePosted: '2024-01-20 09:30 AM'
        },
        { 
            id: 2, 
            title: 'Medical Camp', 
            description: 'Doctors providing free check-ups at Central Park', 
            verified: null,
            datePosted: '2024-01-20 10:15 AM'
        },
        { 
            id: 3, 
            title: 'Shelter Available', 
            description: 'Emergency shelter open at Community Center', 
            verified: null,
            datePosted: '2024-01-20 11:45 AM'
        },
    ])

    const handleVerify = (id, isVerified) => {
        setVerifications(verifications.map(v =>
            v.id === id ? { ...v, verified: isVerified } : v))
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-8 text-white">Verify Disaster Relief Information</h1>
            <div className="space-y-6 max-w-2xl mx-auto">
                {verifications.map(info => (
                    <div key={info.id} className="bg-zinc-800 border border-zinc-700 p-6 rounded-lg text-white h-[200px] flex flex-col justify-between">
                        <div>
                            <h2 className="text-2xl font-semibold mb-3">{info.title}</h2>
                            <p className="text-gray-300 mb-2">{info.description}</p>
                            <p className="text-gray-400 text-sm mb-4">Posted: {info.datePosted}</p>
                        </div>
                        <div>
                            {info.verified === true ? (
                                <span className="inline-block px-4 py-2 bg-green-600/20 text-green-400 rounded-lg">Verified True ✓</span>
                            ) : info.verified === false ? (
                                <span className="inline-block px-4 py-2 bg-red-600/20 text-red-400 rounded-lg">Verified False ✗</span>
                            ) : (
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => handleVerify(info.id, true)}
                                        className="bg-green-700 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors duration-200">
                                        Verify True
                                    </button>
                                    <button
                                        onClick={() => handleVerify(info.id, false)}
                                        className="bg-red-700 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors duration-200">
                                        Verify False
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}