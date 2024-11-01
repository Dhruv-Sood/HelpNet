"use client"
import * as React from 'react'
import { useConnect, useAccount, useDisconnect } from 'wagmi'
import Link from 'next/link'

const Navbar = () => {
    const { connectors, connect } = useConnect()
    const { address, isConnected } = useAccount()
    const { disconnect } = useDisconnect()
    const [showDropdown, setShowDropdown] = React.useState(false)
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
    }, [])

    const truncateAddress = (addr) => {
        if (!addr) return ''
        return addr.slice(0, 6) + '...' + addr.slice(-4)
    }

    if (!mounted) {
        return (
            <nav className="backdrop-blur-md bg-zinc-900/70 border-b border-zinc-800  w-full z-50">
                <div className="container mx-auto flex justify-between items-center h-16 px-4">
                    <div className="text-white font-bold text-xl">
                        <Link href="/" className="flex items-center space-x-2">
                            <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">DisasterRelief.info</span>
                        </Link>
                    </div>
                    <div>
                        <button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium py-2 px-6 rounded-full hover:opacity-90 transition-all duration-200 shadow-lg hover:shadow-blue-500/25">
                            Connect Wallet
                        </button>
                    </div>
                </div>
            </nav>
        )
    }

    return (
        <nav className="backdrop-blur-md bg-zinc-900/70 border-b border-zinc-800 w-full z-50">
            <div className="container mx-auto flex justify-between items-center h-16 px-4">
                <div className="text-white font-bold text-xl">
                    <Link href="/" className="flex items-center space-x-2">
                        <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">HelpNet</span>
                    </Link>
                </div>
                <div className="flex items-center space-x-6">
                    
                    <Link href="/verifiedInfo" className="text-gray-400 hover:text-white transition-colors">Verified Info</Link>
                    <div className="relative">
                        {isConnected ? (
                            <>
                                <button
                                    onClick={() => setShowDropdown(!showDropdown)}
                                    className="bg-zinc-800 text-white font-medium py-2 px-4 rounded-full hover:bg-zinc-700 transition-all duration-200 flex items-center space-x-2"
                                >
                                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                    <span>{truncateAddress(address)}</span>
                                </button>
                                {showDropdown && (
                                    <div className="absolute right-0 mt-2 w-48 bg-zinc-800/90 backdrop-blur-lg rounded-xl shadow-xl py-2 border border-zinc-700">
                                        <button
                                            onClick={() => {
                                                disconnect()
                                                setShowDropdown(false)
                                            }}
                                            className="w-full text-left text-white hover:bg-zinc-700/50 px-4 py-2 transition-colors"
                                        >
                                            Disconnect
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() => setShowDropdown(!showDropdown)}
                                    className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium py-2 px-6 rounded-full hover:opacity-90 transition-all duration-200 shadow-lg hover:shadow-blue-500/25"
                                >
                                    Connect Wallet
                                </button>
                                {showDropdown && (
                                    <div className="absolute right-0 mt-2 w-48 bg-zinc-800/90 backdrop-blur-lg rounded-xl shadow-xl py-2 border border-zinc-700">
                                        {connectors.map((connector) => (
                                            <button
                                                key={connector.id}
                                                onClick={() => {
                                                    connect({ connector })
                                                    setShowDropdown(false)
                                                }}
                                                className="w-full text-left text-white hover:bg-zinc-700/50 px-4 py-2 transition-colors"
                                            >
                                                {connector.name}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar