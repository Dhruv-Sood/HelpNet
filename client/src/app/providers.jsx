// src/app/Providers.jsx
'use client' // necessary to make this a client component

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { config } from '../config'  // adjust the path to where `config` is defined
import { useState } from 'react'

const queryClient = new QueryClient()

export function Providers({ children }) {
    // Create a new QueryClient instance once


    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </WagmiProvider>
    )
}
