import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const { register, user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) {
    return (
      <Layout>
        <div style={{ textAlign: 'center', padding: '80px 20px' }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>✅</div>
          <h2 style={{ fontWeight: 700, marginBottom: 8 }}>You're already registered, {user.name}!</h2>
          <Link to="/"><button style={{ background: '#2e6dce', color: '#fff', border: 'none', padding: '12px 32px', borderRadius: 4, fontWeight: 700, fontSize: 15, cursor: 'pointer', marginTop: 16 }}>Go to Home</button></Link>
        </div>
      </Layout>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    setTimeout(() => {
      const result = register({ name: form.name, email: form.email, phone: form.phone, password: form.password });
      if (result.success) {
        navigate('/');
      } else {
        setError(result.error);
      }
      setLoading(false);
    }, 600);
  };

  const field = (label, key, type = 'text', placeholder = '') => (
    <div>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: '#444' }}>{label}</label>
      <input
        type={type} required value={form[key]}
        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
        placeholder={placeholder}
        style={{ width: '100%', padding: '11px 14px', border: '1px solid #ddd', borderRadius: 4, fontSize: 14, boxSizing: 'border-box', outline: 'none' }}
        onFocus={e => e.target.style.border = '1px solid #2e6dce'}
        onBlur={e => e.target.style.border = '1px solid #ddd'}
      />
    </div>
  );

  return (
    <Layout>
      <div style={{ minHeight: '70vh', background: '#f5f7fa', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
        <div style={{ background: '#fff', borderRadius: 8, boxShadow: '0 4px 24px rgba(0,0,0,0.10)', padding: '44px 40px', width: '100%', maxWidth: 460 }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <img src="/assets/images/logo.png" alt="ApseShopping" style={{ height: 52, marginBottom: 12 }} onError={e => e.target.style.display = 'none'} />
            <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1a1a2e', marginBottom: 4 }}>Create an Account</h2>
            <p style={{ fontSize: 13, color: '#888' }}>Join ApseShopping today</p>
          </div>

          {error && (
            <div style={{ background: '#fff5f5', border: '1px solid #feb2b2', borderRadius: 4, padding: '10px 14px', marginBottom: 18, fontSize: 13, color: '#c53030' }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {field('Full Name *', 'name', 'text', 'Your full name')}
            {field('Email Address *', 'email', 'email', 'you@example.com')}
            {field('Phone Number *', 'phone', 'tel', '10-digit mobile number')}
            {field('Password *', 'password', 'password', 'Min 6 characters')}
            {field('Confirm Password *', 'confirm', 'password', 'Re-enter your password')}

            <button type="submit" disabled={loading}
              style={{ background: loading ? '#93b4e8' : '#2e6dce', color: '#fff', border: 'none', padding: '13px', borderRadius: 4, fontWeight: 700, fontSize: 15, cursor: loading ? 'not-allowed' : 'pointer', marginTop: 6, letterSpacing: 0.3 }}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: 22, fontSize: 13, color: '#666' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#2e6dce', fontWeight: 700, textDecoration: 'none' }}>Login here</Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
