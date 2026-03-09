import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) {
    return (
      <Layout>
        <div style={{ textAlign: 'center', padding: '80px 20px' }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>👋</div>
          <h2 style={{ fontWeight: 700, marginBottom: 8 }}>Welcome back, {user.name}!</h2>
          <p style={{ color: '#666', marginBottom: 24 }}>You are already logged in.</p>
          <Link to="/"><button style={{ background: '#2e6dce', color: '#fff', border: 'none', padding: '12px 32px', borderRadius: 4, fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>Go to Home</button></Link>
        </div>
      </Layout>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setTimeout(() => {
      const result = login(form);
      if (result.success) {
        navigate('/');
      } else {
        setError(result.error);
      }
      setLoading(false);
    }, 600);
  };

  return (
    <Layout>
      <div style={{ minHeight: '70vh', background: '#f5f7fa', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
        <div style={{ background: '#fff', borderRadius: 8, boxShadow: '0 4px 24px rgba(0,0,0,0.10)', padding: '44px 40px', width: '100%', maxWidth: 420 }}>
          {/* Logo / Title */}
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <img src="/assets/images/logo.png" alt="ApseShopping" style={{ height: 52, marginBottom: 12 }} onError={e => e.target.style.display = 'none'} />
            <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1a1a2e', marginBottom: 4 }}>Welcome Back</h2>
            <p style={{ fontSize: 13, color: '#888' }}>Login to your ApseShopping account</p>
          </div>

          {error && (
            <div style={{ background: '#fff5f5', border: '1px solid #feb2b2', borderRadius: 4, padding: '10px 14px', marginBottom: 18, fontSize: 13, color: '#c53030', display: 'flex', alignItems: 'center', gap: 8 }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: '#444' }}>Email Address *</label>
              <input
                type="email" required value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="you@example.com"
                style={{ width: '100%', padding: '11px 14px', border: '1px solid #ddd', borderRadius: 4, fontSize: 14, boxSizing: 'border-box', outline: 'none', transition: 'border 0.2s' }}
                onFocus={e => e.target.style.border = '1px solid #2e6dce'}
                onBlur={e => e.target.style.border = '1px solid #ddd'}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: '#444' }}>Password *</label>
              <input
                type="password" required value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                placeholder="Enter your password"
                style={{ width: '100%', padding: '11px 14px', border: '1px solid #ddd', borderRadius: 4, fontSize: 14, boxSizing: 'border-box', outline: 'none', transition: 'border 0.2s' }}
                onFocus={e => e.target.style.border = '1px solid #2e6dce'}
                onBlur={e => e.target.style.border = '1px solid #ddd'}
              />
            </div>

            <button type="submit" disabled={loading}
              style={{ background: loading ? '#93b4e8' : '#2e6dce', color: '#fff', border: 'none', padding: '13px', borderRadius: 4, fontWeight: 700, fontSize: 15, cursor: loading ? 'not-allowed' : 'pointer', letterSpacing: 0.3, transition: 'background 0.2s', marginTop: 4 }}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: 22, fontSize: 13, color: '#666' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#2e6dce', fontWeight: 700, textDecoration: 'none' }}>Register here</Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
