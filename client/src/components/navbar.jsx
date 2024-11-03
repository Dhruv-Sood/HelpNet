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
                    <div className="flex items-center space-x-4">
                        <button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium py-2 px-6 rounded-full hover:opacity-90 transition-all duration-200 shadow-lg hover:shadow-blue-500/25">
                            Connect Wallet
                        </button>
                        <a href="https://github.com/yourusername/yourrepo" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                            </svg>
                        </a>
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
                    <Link href="/verifiedInfo" className="text-gray-400 hover:text-white transition-colors hidden md:block">Verified Info</Link>
                    <div className="relative">
                        {isConnected ? (
                            <>
                                <button
                                    onClick={() => setShowDropdown(!showDropdown)}
                                    className="bg-zinc-800 text-white font-medium py-2 px-4 rounded-full hover:bg-zinc-700 transition-all duration-200 flex items-center space-x-2"
                                >
                                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                    <span className="md:inline hidden">{truncateAddress(address)}</span>
                                    <span className="md:hidden">{address.slice(0, 4)}</span>
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
                                    <span className="md:inline hidden">Connect Wallet</span>
                                    <span className="md:hidden">Connect</span>
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
                    <a href="https://github.com/Dhruv-Sood/HelpNet" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                        <svg className="w-6 h-6 md:w-6 md:h-6 w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                        </svg>
                    </a>
                </div>
            </div>
        </nav>
    )
}

export default Navbar