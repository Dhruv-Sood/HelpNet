'use client'

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'

export default function Page() {
    const [verifications, setVerifications] = useState([])
    const [verificationStatus, setVerificationStatus] = useState({})
    const { address } = useAccount()

    useEffect(() => {
        const fetchSubmissions = async () => {
            try {
                const response = await fetch('http://localhost:3001/submissions')
                if (!response.ok) {
                    throw new Error('Network response was not ok')
                }
                const data = await response.json()
                setVerifications(data)
            } catch (error) {
                console.error('Error fetching submissions:', error)
            }
        }

        fetchSubmissions()
    }, [])

    const handleVerify = async (submissionId, vote) => {
        try {
            const response = await fetch('http://localhost:3001/verify', {
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
            const updatedResponse = await fetch('http://localhost:3001/submissions')
            const updatedData = await updatedResponse.json()
            setVerifications(updatedData)

        } catch (error) {
            console.error('Error verifying submission:', error)
        }
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-8 text-white">Verify Disaster Relief Information</h1>
            <div className="space-y-6 max-w-2xl mx-auto">
                {verifications.map(info => (
                    <div key={info._id} className="bg-zinc-800 border border-zinc-700 p-6 rounded-lg text-white h-[200px] flex flex-col justify-between">
                        <div>
                            <h2 className="text-2xl font-semibold mb-3">{info.title}</h2>
                            <p className="text-gray-300 mb-2">{info.description}</p>
                            <p className="text-gray-400 text-sm mb-4">Posted: {new Date(info.createdAt).toLocaleString()}</p>
                        </div>
                        <div>
                            {info.verified || verificationStatus[info._id] ? (
                                <span className={`inline-block px-4 py-2 rounded-lg ${
                                    (info.verificationResult === 'yes' || verificationStatus[info._id] === 'yes')
                                        ? 'bg-green-600/20 text-green-400'
                                        : 'bg-red-600/20 text-red-400'
                                }`}>
                                    Verified {(info.verificationResult === 'yes' || verificationStatus[info._id] === 'yes') ? 'True ✓' : 'False ✗'}
                                </span>
                            ) : info.voters.some(v => v.address === address) ? (
                                <span className="inline-block px-4 py-2 rounded-lg bg-gray-600/20 text-gray-400">
                                    You have already voted on this submission
                                </span>
                            ) : (
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => handleVerify(info._id, true)}
                                        className="bg-green-700 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors duration-200">
                                        Verify True
                                    </button>
                                    <button
                                        onClick={() => handleVerify(info._id, false)}
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