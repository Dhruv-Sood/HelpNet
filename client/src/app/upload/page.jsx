'use client'

import { useState, useEffect } from 'react'

export default function Page() {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        location: '', 
        category: '',
        sender: '',
    })
    const [walletAddress, setWalletAddress] = useState('')
    const [submitStatus, setSubmitStatus] = useState('')

    useEffect(() => {
        // Check if window.ethereum is available
        const checkWallet = async () => {
            if (typeof window.ethereum !== 'undefined') {
                try {
                    // Request account access
                    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
                    setWalletAddress(accounts[0])
                    setFormData(prev => ({...prev, sender: accounts[0]}))
                } catch (error) {
                    console.error('Error connecting to wallet:', error)
                }
            }
        }
        
        checkWallet()
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSubmitStatus('submitting')
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/submission`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    sender: walletAddress
                })
            })

            if (!response.ok) {
                throw new Error('Network response was not ok')
            }

            const data = await response.json()
            console.log('Success:', data)
            setSubmitStatus('success')
            
            // Reset form after successful submission but keep the wallet address
            setFormData({ 
                title: '', 
                description: '', 
                location: '', 
                category: '',
                sender: walletAddress 
            })

            // Clear success message after 5 seconds
            setTimeout(() => {
                setSubmitStatus('')
            }, 5000)
        } catch (error) {
            console.error('Error:', error)
            setSubmitStatus('error')
            setTimeout(() => {
                setSubmitStatus('')
            }, 5000)
        }
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black py-8">
            <div className="container mx-auto px-4">
                {!walletAddress ? (
                    <div className="max-w-xl mx-auto bg-zinc-800/50 backdrop-blur-sm border border-zinc-700/50 p-6 rounded-2xl shadow-xl text-center">
                        <h1 className="text-3xl font-bold mb-6 text-white text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                            Connect Your Wallet
                        </h1>
                        <div className="flex items-center justify-center mb-6 gap-2 text-yellow-500">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <p className="text-lg">Please connect your wallet to submit disaster relief information</p>
                        </div>
                        <button 
                            onClick={() => window.ethereum.request({ method: 'eth_requestAccounts' })}
                            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold text-base transition-all duration-300 shadow-lg hover:shadow-blue-500/20"
                        >
                            Connect Wallet
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="max-w-xl mx-auto bg-zinc-800/50 backdrop-blur-sm border border-zinc-700/50 p-6 rounded-2xl shadow-xl">
                        <h1 className="text-3xl font-bold mb-8 text-white text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                            Submit Disaster Relief Information
                        </h1>
                        
                        {submitStatus === 'success' && (
                            <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-center">
                                Information submitted successfully!
                            </div>
                        )}

                        {submitStatus === 'error' && (
                            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-center">
                                Failed to submit information. Please try again.
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <label htmlFor="title" className="block mb-1 text-base font-medium text-gray-200">Title</label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                    className="w-full p-3 bg-zinc-900/50 border border-zinc-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                                    placeholder="Enter a descriptive title"
                                />
                            </div>

                            <div>
                                <label htmlFor="description" className="block mb-1 text-base font-medium text-gray-200">Description</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    required
                                    rows="3"
                                    className="w-full p-3 bg-zinc-900/50 border border-zinc-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                                    placeholder="Provide detailed information about the situation"
                                ></textarea>
                            </div>

                            <div>
                                <label htmlFor="location" className="block mb-1 text-base font-medium text-gray-200">Location</label>
                                <input
                                    type="text"
                                    id="location"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    required
                                    className="w-full p-3 bg-zinc-900/50 border border-zinc-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                                    placeholder="Enter the location"
                                />
                            </div>

                            <div>
                                <label htmlFor="category" className="block mb-1 text-base font-medium text-gray-200">Category</label>
                                <select
                                    id="category"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    required
                                    className="w-full p-3 bg-zinc-900/50 border border-zinc-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                                >
                                    <option value="">Select a category</option>
                                    <option value="shelter">Shelter</option>
                                    <option value="food">Food</option>
                                    <option value="medical">Medical</option>
                                    <option value="rescue">Rescue</option>
                                </select>
                            </div>

                            <button
                                type="submit"
                                disabled={submitStatus === 'submitting'}
                                className={`w-full p-3 rounded-xl font-semibold text-base transition-all duration-300 ${
                                    submitStatus === 'submitting' 
                                    ? 'bg-gray-600 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-blue-500/20'
                                } text-white`}
                            >
                                {submitStatus === 'submitting' ? 'Submitting...' : 'Submit Information'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    )
}