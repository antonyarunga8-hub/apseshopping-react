import React, { useState } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { NICHE_CONFIG } from '../nicheConfig';

export default function LoginPage() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const nicheKey = searchParams.get('niche');
  const niCfg = nicheKey ? NICHE_CONFIG[nicheKey] : null;

  const from = location.state?.from?.pathname;

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
    try {
      const result = await login(form);
      if (result.success) {
        const destination = from || (nicheKey ? `/affiliate/${nicheKey}` : '/');
        navigate(destination, { replace: true });
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div style={{ minHeight: '70vh', background: '#f5f7fa', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
        <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 4px 24px rgba(0,0,0,0.10)', width: '100%', maxWidth: 420, overflow: 'hidden' }}>
          <div style={{ background: niCfg ? niCfg.bg : 'linear-gradient(135deg, #1a1a2e, #0f3460)', padding: '28px 32px', textAlign: 'center' }}>
            <div style={{ fontSize: 44, marginBottom: 8 }}>{niCfg ? niCfg.icon : '🛍️'}</div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 4 }}>
              {niCfg ? `Login to ${niCfg.name}` : 'Welcome Back to ApseShopping'}
            </h2>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>
              {niCfg ? `You'll access the ${niCfg.name} experience only` : 'Full access to all 25 platforms & services'}
            </p>
          </div>

          <div style={{ padding: '28px 32px' }}>
            {from && (
              <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: 6, padding: '10px 14px', marginBottom: 16, fontSize: 12, color: '#92400e' }}>
                🔒 Please log in to continue to <strong>{from}</strong>
              </div>
            )}
            {niCfg ? (
              <div style={{ background: '#fef3c7', border: '1px solid #fcd34d', borderRadius: 6, padding: '10px 14px', marginBottom: 20, fontSize: 12, color: '#78350f' }}>
                🔒 Logging in here gives you <strong>{niCfg.name}</strong> access only.
                For full access, <Link to="/login" style={{ color: '#2e6dce', fontWeight: 700 }}>login at apseshopping.com</Link>
              </div>
            ) : !from ? (
              <div style={{ background: '#f0f4ff', border: '1px solid #bfdbfe', borderRadius: 6, padding: '10px 14px', marginBottom: 20, fontSize: 12, color: '#1e40af' }}>
                ✅ Logging in here gives you <strong>full access</strong> to all 25 affiliate platforms & services.
              </div>
            ) : null}

            {error && (
              <div style={{ background: '#fff5f5', border: '1px solid #feb2b2', borderRadius: 4, padding: '10px 14px', marginBottom: 18, fontSize: 13, color: '#c53030' }}>
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: '#444' }}>Email Address *</label>
                <input type="email" required value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="you@example.com"
                  style={{ width: '100%', padding: '11px 14px', border: '1px solid #ddd', borderRadius: 4, fontSize: 14, boxSizing: 'border-box', outline: 'none' }}
                  onFocus={e => e.target.style.border = '1px solid #2e6dce'}
                  onBlur={e => e.target.style.border = '1px solid #ddd'} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: '#444' }}>Password *</label>
                <input type="password" required value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="Enter your password"
                  style={{ width: '100%', padding: '11px 14px', border: '1px solid #ddd', borderRadius: 4, fontSize: 14, boxSizing: 'border-box', outline: 'none' }}
                  onFocus={e => e.target.style.border = '1px solid #2e6dce'}
                  onBlur={e => e.target.style.border = '1px solid #ddd'} />
              </div>
              <button type="submit" disabled={loading}
                style={{ background: loading ? '#93b4e8' : (niCfg ? niCfg.color : '#2e6dce'), color: '#fff', border: 'none', padding: '13px', borderRadius: 4, fontWeight: 700, fontSize: 15, cursor: loading ? 'not-allowed' : 'pointer', marginTop: 4 }}>
                {loading ? 'Logging in...' : `Login${niCfg ? ` to ${niCfg.name}` : ''}`}
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: '#666' }}>
              Don't have an account?{' '}
              <Link to={`/register${nicheKey ? `?niche=${nicheKey}` : ''}`} style={{ color: '#2e6dce', fontWeight: 700, textDecoration: 'none' }}>Register here</Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
