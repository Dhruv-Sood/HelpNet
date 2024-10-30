"use client"
import * as React from 'react'
import { useConnect, useAccount, useDisconnect } from 'wagmi'

const Navbar = () => {
    const { connectors, connect } = useConnect()
    const { address, isConnected } = useAccount()
    const { disconnect } = useDisconnect()
    const [showDropdown, setShowDropdown] = React.useState(false)
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
    }, [])

    // Function to truncate address for display
    const truncateAddress = (addr) => {
        if (!addr) return ''
        return addr.slice(0, 6) + '...' + addr.slice(-4)
    }

    if (!mounted) {
        return (
            <nav className="bg-zinc-900 p-4">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="text-white font-bold text-xl">
                        <a href="/">DisasterRelief.info</a>
                    </div>
                    <div className="relative">
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                            Connect Wallet
                        </button>
                    </div>
                </div>
            </nav>
        )
    }

    return (
        <nav className="bg-zinc-900 p-4">
            <div className="container mx-auto flex justify-between items-center">
                <div className="text-white font-bold text-xl">
                    <a href="/">DisasterRelief.info</a>
                </div>
                <div className="relative">
                    {isConnected ? (
                        <>
                            <button
                                onClick={() => setShowDropdown(!showDropdown)}
                                className="text-white font-mono hover:text-gray-300"
                            >
                                {truncateAddress(address)}
                            </button>
                            {showDropdown && (
                                <div className="absolute right-0 mt-2 w-48 bg-zinc-800 rounded-lg shadow-xl py-2">
                                    <button
                                        onClick={() => {
                                            disconnect()
                                            setShowDropdown(false)
                                        }}
                                        className="w-full text-left text-white hover:bg-zinc-700 px-4 py-2"
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
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            >
                                Connect Wallet
                            </button>
                            {showDropdown && (
                                <div className="absolute right-0 mt-2 w-48 bg-zinc-800 rounded-lg shadow-xl py-2">
                                    {connectors.map((connector) => (
                                        <button
                                            key={connector.id}
                                            onClick={() => {
                                                connect({ connector })
                                                setShowDropdown(false)
                                            }}
                                            className="w-full text-left text-white hover:bg-zinc-700 px-4 py-2"
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
        </nav>
    )
}

export default Navbar