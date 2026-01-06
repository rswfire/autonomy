// components/admin/ui/LogoutButton.tsx
'use client'

import { useRouter } from 'next/navigation'

export function LogoutButton() {
    const router = useRouter()

    const handleLogout = async () => {
        await fetch('/api/admin/auth/logout', { method: 'POST' })
        router.push('/admin/login')
        router.refresh()
    }

    return (
        <button
            onClick={handleLogout}
            className="text-sm text-gray-600 hover:text-gray-900 hover:underline"
        >
            Logout
        </button>
    )
}
