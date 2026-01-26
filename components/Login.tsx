import React, { useState } from 'react';
import { Lock, User, Loader2, AlertCircle } from 'lucide-react';
import { UserResponse } from '../types';

interface LoginProps {
  onLoginSuccess: (user: UserResponse) => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState(() => {
    const savedUser = localStorage.getItem('skyzoom_last_username');
    return savedUser || '';
  });
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/User/Login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Identifier: username, Password: password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Login error:', errorData);
        throw new Error(errorData.title || errorData.message || 'Invalid credentials');
      }

      const data: UserResponse = await response.json();
      localStorage.setItem('skyzoom_token', data.accessToken);
      localStorage.setItem('skyzoom_refresh', data.refreshToken);
      localStorage.setItem('skyzoom_last_username', username);
      onLoginSuccess(data);
    } catch (err) {
      setError('Login failed. Please check your username and password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <div className="mb-8 text-center">
        <div className="bg-pink-600 w-16 h-16 rounded-2xl shadow-xl flex items-center justify-center mx-auto mb-4">
          <Lock className="text-white" size={32} />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
        <p className="text-gray-500 mt-2">Sign in to access Flight Price Comparison</p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 w-full max-w-md overflow-hidden">
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 uppercase tracking-wide block">Username</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400 group-focus-within:text-pink-500 transition-colors" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all"
                  placeholder="Enter your username"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 uppercase tracking-wide block">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-pink-500 transition-colors" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="animate-spin" size={18} />
                  Signing In...
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>
        <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-400">Restricted Access • Authorized Personnel Only</p>
        </div>
      </div>
    </div>
  );
};
