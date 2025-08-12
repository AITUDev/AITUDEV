"use client"
import { LogOut, Shield } from "lucide-react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

export default function AuthCheck({ children }: { children: React.ReactNode }) {

    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        // Simple authentication check

        if (email === process.env.NEXT_PUBLIC_DASHBOARD_EMAIL && password === process.env.NEXT_PUBLIC_DASHBOARD_PASS) {
            setIsAuthenticated(true)
            localStorage.setItem('dashboard_auth', 'true')
            localStorage.setItem('dashboard_email', email)
            localStorage.setItem('dashboard_password', password)
        } else {
            setError('Invalid credentials. Only aitudev member is authorized.')
        }
        setLoading(false)
    }

    const handleLogout = () => {
        setIsAuthenticated(false)
        localStorage.removeItem('dashboard_auth')
        localStorage.removeItem('dashboard_email')
        localStorage.removeItem('dashboard_password')
    }

    // Check if already authenticated on mount
    useEffect(() => {
        const auth = localStorage.getItem('dashboard_auth')
        const storedEmail = localStorage.getItem('dashboard_email')
        const storedPassword = localStorage.getItem('dashboard_password')
        if (auth === 'true' && storedEmail === process.env.NEXT_PUBLIC_DASHBOARD_EMAIL && storedPassword === process.env.NEXT_PUBLIC_DASHBOARD_PASS) {
            setIsAuthenticated(true)
        }
    }, [])

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    <div>
                        <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100">
                            <Shield className="h-6 w-6 text-blue-600" />
                        </div>
                        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                            AITU Dev Dashboard
                        </h2>
                        <p className="mt-2 text-center text-sm text-gray-600">
                            Authorized access only
                        </p>
                    </div>
                    <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="email" className="sr-only">
                                    Email address
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                    placeholder="Email address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="sr-only">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="text-red-600 text-sm text-center">{error}</div>
                        )}

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                            >
                                {loading ? 'Signing in...' : 'Sign in'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )
    }

    return (
        <div>
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <h1 className="text-xl font-semibold text-gray-900">AITU Dev Dashboard</h1>
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-600">aitudevelopment@gmail.com</span>
                            <Button
                                onClick={handleLogout}
                                variant="outline"
                                size="sm"
                                className="flex items-center space-x-2"
                            >
                                <LogOut className="h-4 w-4" />
                                <span>Logout</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            {children}
        </div>
    )
}