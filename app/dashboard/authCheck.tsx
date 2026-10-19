"use client"
import { useEffect, useState, createContext, useContext } from "react"
import { LogOut, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'lead' | 'member';
  status?: string;
  avatar?: { url: string };
  skills?: string[];
  bio?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  logout: () => void;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  logout: () => {},
  refreshUser: () => {},
});

export const useAuth = () => useContext(AuthContext);

export default function AuthCheck({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchCurrentUser = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.user) {
          setUser(data.user);
          setLoading(false);
          return;
        }
      }
      setUser(null);
    } catch (e) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setUser(data.user);
        if (data.token) {
          localStorage.setItem('aitu_auth_token', data.token);
        }
      } else {
        setError(data.error || 'Invalid credentials. Only authorized members can log in.');
      }
    } catch (err: any) {
      setError('Connection error while logging in.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {}
    localStorage.removeItem('aitu_auth_token');
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="text-gray-600 text-sm font-medium">Checking authorization...</p>
      </div>
    );
  }

  if (!user) {
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
              Authorized team member access only
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-sm text-center bg-red-50 p-2 rounded-md border border-red-200">{error}</div>
            )}

            <div>
              <button
                type="submit"
                disabled={submitting}
                className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 shadow-sm"
              >
                {submitting ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loading, logout: handleLogout, refreshUser: fetchCurrentUser }}>
      <div>
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <h1 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                AITU Dev Dashboard
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-medium uppercase">
                  {user.role}
                </span>
              </h1>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">{user.email}</span>
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
    </AuthContext.Provider>
  );
}