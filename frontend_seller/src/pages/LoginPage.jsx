import React, { useState } from 'react';
import apiClient, { setAuthTokens } from '../api/api';

const LoginPage = ({ onLogin, showRegister }) => {
  const [forgotOpen, setForgotOpen] = useState(false);
  const [email, setEmail] = useState('');

  const submitForgot = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    alert(`Password reset link sent to ${email}`);
    setForgotOpen(false);
    setEmail('');
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const username = form.get('email');
    const password = form.get('password');
    try {
      const { data } = await apiClient.post('/auth/token/', { username, password });
      setAuthTokens({ access: data.access, refresh: data.refresh });
      onLogin?.({ name: username, email: username, shopName: '' });
    } catch (err) {
      const msg = err?.response?.data?.detail || 'Invalid credentials or account not approved yet.';
      alert(msg);
    }
  };

  return (
    <div className="bg-[var(--background-color)] text-[var(--text-color)] min-h-screen flex items-center justify-center py-8 animate-fade-in">
      <div className="absolute top-4 left-4 flex items-center gap-2">
        <img src="/logo.png" alt="Tour On Go" className="h-8 w-8 rounded" />
        <div className="font-bold">Tour On Go</div>
      </div>
      <div className="w-full max-w-md">
        <div className="p-8 rounded-lg shadow-lg card elevated-card">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold">Sign in to your account</h1>
            <p className="text-sm text-[var(--muted-text)] mt-1">Seller Portal</p>
          </div>

      <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[var(--muted-text)] mb-1">Email address</label>
        <input id="email" name="email" type="email" placeholder="you@example.com" autoComplete="email" required className="w-full bg-[var(--input-bg)] text-[var(--input-text)] border border-[var(--border-color)] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[var(--muted-text)] mb-1">Password</label>
        <input id="password" name="password" type="password" placeholder="••••••••" autoComplete="current-password" required className="w-full bg-[var(--input-bg)] text-[var(--input-text)] border border-[var(--border-color)] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-[var(--muted-text)]">
                <input type="checkbox" className="accent-blue-600" />
                Remember me
              </label>
              <button type="button" onClick={() => setForgotOpen(true)} className="text-sm text-blue-500 hover:underline">Forgot password?</button>
            </div>
            <button type="submit" className="w-full bg-[var(--button-primary)] hover:bg-blue-700 text-[var(--button-primary-text)] font-bold py-2 px-4 rounded-lg">Sign in</button>
          </form>

          <div className="text-center text-sm text-[var(--muted-text)] mt-6">
            Don’t have an account?{' '}
            <button type="button" onClick={showRegister} className="text-blue-500 hover:underline">Create one</button>
          </div>
        </div>
      </div>

      {forgotOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="card elevated-card rounded-lg shadow-xl w-full max-w-md">
            <div className="p-4 border-b border-[var(--border-color)] flex items-center justify-between">
              <div className="text-lg font-bold">Reset Password</div>
              <button onClick={() => setForgotOpen(false)} className="text-[var(--muted-text)]">✕</button>
            </div>
            <form onSubmit={submitForgot} className="p-4 space-y-4">
              <p className="text-sm text-[var(--muted-text)]">Enter your account email and we'll send a reset link.</p>
              <label htmlFor="forgotEmail" className="block text-sm font-medium text-[var(--muted-text)]">Email address</label>
              <input id="forgotEmail" type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com" className="w-full bg-[var(--input-bg)] text-[var(--input-text)] border border-[var(--border-color)] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setForgotOpen(false)} className="px-4 py-2 rounded bg-[var(--btn-gray)] text-white">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded bg-[var(--button-primary)] text-[var(--button-primary-text)]">Send Link</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
