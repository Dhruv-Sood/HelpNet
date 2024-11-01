'use client'

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL

export default function Page() {
    const [verifications, setVerifications] = useState([])
    const [verificationStatus, setVerificationStatus] = useState({})
    const [isLoading, setIsLoading] = useState(true)
    const { address } = useAccount()

    useEffect(() => {
        const fetchSubmissions = async () => {
            try {
                const response = await fetch(`${BACKEND_URL}/submissions`)
                if (!response.ok) {
                    throw new Error('Network response was not ok')
                }
                const data = await response.json()
                setVerifications(data)
            } catch (error) {
                console.error('Error fetching submissions:', error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchSubmissions()
    }, [])

    const handleVerify = async (submissionId, vote) => {
        try {
            const response = await fetch(`${BACKEND_URL}/verify`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    submissionId,
                    vote: vote ? 'yes' : 'no',
                    verifier: address
                }),
            })

            if (!response.ok) {
                throw new Error('Network response was not ok')
            }

            // Update local state immediately
            setVerificationStatus(prev => ({
                ...prev,
                [submissionId]: vote ? 'yes' : 'no'
            }))

            // Refresh submissions after voting
            const updatedResponse = await fetch(`${BACKEND_URL}/submissions`)
            const updatedData = await updatedResponse.json()
            setVerifications(updatedData)

        } catch (error) {
            console.error('Error verifying submission:', error)
        }
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500"></div>
            </div>
        )
    }

    if (verifications.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black py-12">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-5xl font-bold mb-12 text-white text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                        Verify Disaster Relief Information
                    </h1>
                    <div className="bg-zinc-800/50 backdrop-blur-sm border border-zinc-700/50 p-8 rounded-2xl text-white max-w-2xl mx-auto">
                        <svg className="w-20 h-20 mx-auto mb-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h2 className="text-2xl font-semibold mb-4">No Submissions to Verify</h2>
                        <p className="text-gray-400">There are currently no disaster relief information submissions that need verification. Please check back later.</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black py-12">
            <div className="container mx-auto px-4">
                <h1 className="text-5xl font-bold mb-12 text-white text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                    Verify Disaster Relief Information
                </h1>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
                    {verifications.map(info => (
                        <div key={info._id} 
                            className="bg-zinc-800/50 backdrop-blur-sm border border-zinc-700/50 p-8 rounded-2xl text-white 
                                     shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-2">
                                        {info.title}
                                    </h2>
                                    <div className="flex flex-wrap gap-3 mt-3">
                                        <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm flex items-center">
                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                                            </svg>
                                            {info.location}
                                        </span>
                                        <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm flex items-center">
                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
                                            </svg>
                                            {info.category}
                                        </span>
                                    </div>
                                </div>

                                <p className="text-gray-300 text-lg leading-relaxed">{info.description}</p>
                                
                                <div className="flex items-center gap-2 text-gray-400 border-t border-zinc-700/50 pt-4">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p className="text-sm">{new Date(info.createdAt).toLocaleString()}</p>
                                </div>
                            </div>

                            <div className="mt-8">
                                {info.verified || verificationStatus[info._id] ? (
                                    <div className={`flex items-center justify-center p-4 rounded-xl ${
                                        (info.verificationResult === 'yes' || verificationStatus[info._id] === 'yes')
                                            ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                                            : 'bg-red-500/10 text-red-400 border border-red-500/20'
                                    }`}>
                                        <span className="text-lg font-semibold flex items-center gap-2">
                                            {(info.verificationResult === 'yes' || verificationStatus[info._id] === 'yes') 
                                                ? '✓ Verified True' 
                                                : '✗ Verified False'}
                                        </span>
                                    </div>
                                ) : info.voters.some(v => v.address === address) ? (
                                    <div className="bg-gray-700/20 border border-gray-600 p-4 rounded-xl text-center">
                                        <span className="text-gray-400 text-lg">You have already voted on this submission</span>
                                    </div>
                                ) : (
                                    <div className="flex gap-4 justify-center">
                                        <button
                                            onClick={() => handleVerify(info._id, true)}
                                            className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-4 rounded-xl 
                                                     font-semibold hover:from-green-500 hover:to-green-600 transition-all duration-300 
                                                     shadow-lg hover:shadow-green-500/20">
                                            Verify True
                                        </button>
                                        <button
                                            onClick={() => handleVerify(info._id, false)}
                                            className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-4 rounded-xl 
                                                     font-semibold hover:from-red-500 hover:to-red-600 transition-all duration-300 
                                                     shadow-lg hover:shadow-red-500/20">
                                            Verify False
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}