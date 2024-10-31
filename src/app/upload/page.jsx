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
        try {
            const response = await fetch('http://localhost:3001/submission', {
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
            
            // Reset form after successful submission but keep the wallet address
            setFormData({ 
                title: '', 
                description: '', 
                location: '', 
                category: '',
                sender: walletAddress 
            })
        } catch (error) {
            console.error('Error:', error)
        }
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-8 text-white">Upload Disaster Relief Information</h1>
            {walletAddress ? (
                <p className="text-gray-300 mb-4">Connected wallet: {walletAddress}</p>
            ) : (
                <p className="text-yellow-500 mb-4">Please connect your wallet to submit information</p>
            )}
            <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
                <div>
                    <label htmlFor="title" className="block mb-2 text-lg text-gray-300">Title</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    />
                </div>
                <div>
                    <label htmlFor="description" className="block mb-2 text-lg text-gray-300">Description</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        rows="4"
                        className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    ></textarea>
                </div>
                <div>
                    <label htmlFor="location" className="block mb-2 text-lg text-gray-300">Location</label>
                    <input
                        type="text"
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        required
                        className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    />
                </div>
                <div>
                    <label htmlFor="category" className="block mb-2 text-lg text-gray-300">Category</label>
                    <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                        className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
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
                    className="w-full bg-zinc-800 text-white px-6 py-3 rounded-lg hover:bg-zinc-700 transition-colors duration-200"
                    disabled={!walletAddress}
                >
                    Submit Information
                </button>
            </form>
        </div>
    )
}