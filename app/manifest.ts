import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Laxance — Intelligent Finance',
        short_name: 'Laxance',
        description: 'AI-powered daily expenses, income analysis, and goal-oriented wealth building.',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#000000',
        theme_color: '#000000',
        categories: ['finance', 'productivity', 'business'],
        icons: [
            {
                src: '/app-icon.png',
                sizes: 'any',
                type: 'image/png',
                purpose: 'any',
            },
            {
                src: '/app-icon.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'maskable',
            },
        ],
        shortcuts: [
            {
                name: 'Dashboard',
                short_name: 'Dashboard',
                url: '/dashboard',
                icons: [{ src: '/app-icon.png', sizes: '192x192' }],
            },
            {
                name: 'Transactions',
                short_name: 'Transactions',
                url: '/dashboard/transactions',
                icons: [{ src: '/app-icon.png', sizes: '192x192' }],
            },
            {
                name: 'AI Chat',
                short_name: 'Chat',
                url: '/dashboard/chat',
                icons: [{ src: '/app-icon.png', sizes: '192x192' }],
            },
        ],
    }
}
