import React, { useState } from 'react';
import Layout from '../components/Layout';

// ─── EmailJS config ───────────────────────────────────────────────
// 1. Go to https://www.emailjs.com and create a free account
// 2. Add an Email Service (Gmail recommended) → copy the Service ID
// 3. Create an Email Template with variables: {{from_name}}, {{from_email}}, {{message}}
//    Set "To Email" in the template to: contact@apseshopping.com
// 4. Go to Account → API Keys → copy your Public Key
// 5. Replace the three values below with your own:
const EMAILJS_SERVICE_ID  = 'YOUR_SERVICE_ID';   // e.g. 'service_abc123'
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';  // e.g. 'template_xyz789'
const EMAILJS_PUBLIC_KEY  = 'YOUR_PUBLIC_KEY';   // e.g. 'user_XXXXXXXXXXXX'
// ──────────────────────────────────────────────────────────────────

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | sending | success | error
  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');

    try {
      const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id:  EMAILJS_SERVICE_ID,
          template_id: EMAILJS_TEMPLATE_ID,
          user_id:     EMAILJS_PUBLIC_KEY,
          template_params: {
            from_name:  form.name,
            from_email: form.email,
            message:    form.message,
            to_email:   'contact@apseshopping.com',
          },
        }),
      });

      if (res.ok) {
        setStatus('success');
        setForm({ name: '', email: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <Layout>
      {/* Info Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', borderBottom: '1px solid #e8e8e8', background: '#fff' }}>
        <div style={{ padding: '36px 24px', textAlign: 'center', borderRight: '1px solid #e8e8e8' }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, color: '#222' }}>Address</h3>
          <p style={{ fontSize: 13, color: '#555', lineHeight: 1.7 }}>
            Shop No 4, Harsha Residency,<br />
            Devangpeth road Opp Samarth<br />
            Apartment Hubli 580023,<br />
            Karnataka India
          </p>
        </div>
        <div style={{ padding: '36px 24px', textAlign: 'center', borderRight: '1px solid #e8e8e8' }}>
          <div style={{ fontSize: 40, color: '#2e6dce', marginBottom: 10 }}><i className="fas fa-mobile-alt" /></div>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, color: '#222' }}>Phone Number</h3>
          <a href="tel:8073667950" style={{ color: '#2e6dce', fontSize: 15, fontWeight: 600, textDecoration: 'none' }}>8073667950</a>
        </div>
        <div style={{ padding: '36px 24px', textAlign: 'center', borderRight: '1px solid #e8e8e8' }}>
          <div style={{ fontSize: 40, color: '#2e6dce', marginBottom: 10 }}><i className="fas fa-envelope" /></div>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, color: '#222' }}>E-mail Address</h3>
          <a href="mailto:contact@apseshopping.com" style={{ color: '#2e6dce', fontSize: 14, textDecoration: 'none' }}>contact@apseshopping.com</a>
        </div>
        <div style={{ padding: '36px 24px', textAlign: 'center' }}>
          <div style={{ fontSize: 40, color: '#2e6dce', marginBottom: 10 }}><i className="fas fa-calendar-alt" /></div>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, color: '#222' }}>Working Days/Hours</h3>
          <p style={{ fontSize: 13, color: '#555', lineHeight: 1.7 }}>
            Mon – Sat: 9:00 AM – 6:00 PM<br />
            <strong style={{ color: '#2e6dce' }}>Online Support: 24 Hours</strong>
          </p>
        </div>
      </div>

      {/* Map + Form */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: 520 }}>
        {/* Google Maps */}
        <div style={{ lineHeight: 0 }}>
          <iframe
            title="Harsha Residency Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3848.1234567!2d75.1389326!3d15.3702416!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bb8d74d4a7d5033%3A0x209db4544ec31ec1!2sHarsha%20Residency!5e0!3m2!1sen!2sin!4v1710000000001!5m2!1sen!2sin"
            width="100%" height="100%"
            style={{ border: 0, minHeight: 520, display: 'block' }}
            allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        {/* Contact Form */}
        <div style={{ padding: '48px 52px', background: '#fff' }}>
          <h2 style={{ fontSize: 26, fontWeight: 800, marginBottom: 28, color: '#222' }}>Send Us a Message</h2>

          {status === 'success' ? (
            <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 8, padding: 36, textAlign: 'center' }}>
              <div style={{ fontSize: 56, marginBottom: 12 }}>✅</div>
              <h3 style={{ fontWeight: 700, marginBottom: 8, color: '#166534' }}>Message Sent!</h3>
              <p style={{ color: '#555', marginBottom: 20 }}>Thank you! We'll get back to you as soon as possible.</p>
              <button onClick={() => setStatus('idle')}
                style={{ background: '#2e6dce', color: '#fff', border: 'none', padding: '10px 28px', borderRadius: 4, cursor: 'pointer', fontWeight: 600, fontSize: 14 }}>
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {status === 'error' && (
                <div style={{ background: '#fff5f5', border: '1px solid #feb2b2', borderRadius: 4, padding: '12px 16px', fontSize: 13, color: '#c53030' }}>
                  ⚠️ Failed to send message. Please try again or email us directly at <a href="mailto:contact@apseshopping.com" style={{ color: '#c53030' }}>contact@apseshopping.com</a>
                </div>
              )}

              <div>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: 7, fontSize: 13, color: '#444' }}>Your Name *</label>
                <input name="name" type="text" required value={form.name} onChange={handleChange}
                  style={{ width: '100%', padding: '11px 14px', border: '1px solid #ddd', borderRadius: 3, fontSize: 14, boxSizing: 'border-box', outline: 'none' }}
                  onFocus={e => e.target.style.border = '1px solid #2e6dce'}
                  onBlur={e => e.target.style.border = '1px solid #ddd'} />
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: 7, fontSize: 13, color: '#444' }}>Your E-mail *</label>
                <input name="email" type="email" required value={form.email} onChange={handleChange}
                  style={{ width: '100%', padding: '11px 14px', border: '1px solid #ddd', borderRadius: 3, fontSize: 14, boxSizing: 'border-box', outline: 'none' }}
                  onFocus={e => e.target.style.border = '1px solid #2e6dce'}
                  onBlur={e => e.target.style.border = '1px solid #ddd'} />
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: 7, fontSize: 13, color: '#444' }}>Your Message *</label>
                <textarea name="message" required value={form.message} onChange={handleChange} rows={6}
                  style={{ width: '100%', padding: '11px 14px', border: '1px solid #ddd', borderRadius: 3, fontSize: 14, resize: 'vertical', boxSizing: 'border-box', outline: 'none' }}
                  onFocus={e => e.target.style.border = '1px solid #2e6dce'}
                  onBlur={e => e.target.style.border = '1px solid #ddd'} />
              </div>

              <button type="submit" disabled={status === 'sending'}
                style={{
                  background: status === 'sending' ? '#555' : '#222',
                  color: '#fff', border: 'none', padding: '14px',
                  borderRadius: 3, fontSize: 14, fontWeight: 700,
                  cursor: status === 'sending' ? 'not-allowed' : 'pointer',
                  letterSpacing: '1px', textTransform: 'uppercase',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
                }}>
                {status === 'sending' ? (
                  <><span style={{ display: 'inline-block', width: 16, height: 16, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />Sending...</>
                ) : 'Send Message'}
              </button>

              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </form>
          )}
        </div>
      </div>
    </Layout>
  );
}
