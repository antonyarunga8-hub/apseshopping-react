import React, { useState } from 'react';
import Layout from '../components/Layout';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const handleSubmit = e => { e.preventDefault(); setSubmitted(true); };

  return (
    <Layout>
      {/* Info Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', borderBottom: '1px solid #e8e8e8', background: '#fff' }}>
        {/* Address */}
        <div style={{ padding: '36px 24px', textAlign: 'center', borderRight: '1px solid #e8e8e8' }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, color: '#222' }}>Address</h3>
          <p style={{ fontSize: 13, color: '#555', lineHeight: 1.7 }}>
            Shop No 4, Harsha Residency,<br />
            Devangpeth road Opp Samarth<br />
            Apartment Hubli 580023,<br />
            Karnataka India
          </p>
        </div>
        {/* Phone */}
        <div style={{ padding: '36px 24px', textAlign: 'center', borderRight: '1px solid #e8e8e8' }}>
          <div style={{ fontSize: 40, color: '#2e6dce', marginBottom: 10 }}>
            <i className="fas fa-mobile-alt" />
          </div>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, color: '#222' }}>Phone Number</h3>
          <a href="tel:8073667950" style={{ color: '#2e6dce', fontSize: 15, fontWeight: 600, textDecoration: 'none' }}>8073667950</a>
        </div>
        {/* Email */}
        <div style={{ padding: '36px 24px', textAlign: 'center', borderRight: '1px solid #e8e8e8' }}>
          <div style={{ fontSize: 40, color: '#2e6dce', marginBottom: 10 }}>
            <i className="fas fa-envelope" />
          </div>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, color: '#222' }}>E-mail Address</h3>
          <a href="mailto:contact@apseshopping.com" style={{ color: '#2e6dce', fontSize: 14, textDecoration: 'none' }}>contact@apseshopping.com</a>
        </div>
        {/* Working Hours */}
        <div style={{ padding: '36px 24px', textAlign: 'center' }}>
          <div style={{ fontSize: 40, color: '#2e6dce', marginBottom: 10 }}>
            <i className="fas fa-calendar-alt" />
          </div>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, color: '#222' }}>Working Days/Hours</h3>
          <p style={{ fontSize: 13, color: '#555', lineHeight: 1.7 }}>
            Mon – Sat: 9:00 AM – 6:00 PM<br />
            <strong style={{ color: '#2e6dce' }}>Online Support: 24 Hours</strong>
          </p>
        </div>
      </div>

      {/* Map + Form */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: 520 }}>
        {/* Google Maps Embed */}
        <div style={{ lineHeight: 0 }}>
          <iframe
            title="Harsha Residency Location"
src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3848.1234567!2d75.1389326!3d15.3702416!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bb8d74d4a7d5033%3A0x209db4544ec31ec1!2sHarsha%20Residency!5e0!3m2!1sen!2sin!4v1710000000001!5m2!1sen!2sin"
            width="100%"
            height="100%"
            style={{ border: 0, minHeight: 520, display: 'block' }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        {/* Contact Form */}
        <div style={{ padding: '48px 52px', background: '#fff' }}>
          <h2 style={{ fontSize: 26, fontWeight: 800, marginBottom: 28, color: '#222' }}>Send Us a Message</h2>
          {submitted ? (
            <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 8, padding: 36, textAlign: 'center' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
              <h3 style={{ fontWeight: 700, marginBottom: 8 }}>Message Sent!</h3>
              <p style={{ color: '#555' }}>We'll get back to you as soon as possible.</p>
              <button onClick={() => setSubmitted(false)} style={{ marginTop: 16, background: '#2e6dce', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: 4, cursor: 'pointer', fontWeight: 600 }}>Send Another</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: 7, fontSize: 13, color: '#444' }}>Your Name *</label>
                <input name="name" type="text" required value={form.name} onChange={handleChange}
                  style={{ width: '100%', padding: '11px 14px', border: '1px solid #ddd', borderRadius: 3, fontSize: 14, boxSizing: 'border-box', outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: 7, fontSize: 13, color: '#444' }}>Your E-mail *</label>
                <input name="email" type="email" required value={form.email} onChange={handleChange}
                  style={{ width: '100%', padding: '11px 14px', border: '1px solid #ddd', borderRadius: 3, fontSize: 14, boxSizing: 'border-box', outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: 7, fontSize: 13, color: '#444' }}>Your Message *</label>
                <textarea name="message" required value={form.message} onChange={handleChange} rows={6}
                  style={{ width: '100%', padding: '11px 14px', border: '1px solid #ddd', borderRadius: 3, fontSize: 14, resize: 'vertical', boxSizing: 'border-box', outline: 'none' }} />
              </div>
              <button type="submit"
                style={{ background: '#222', color: '#fff', border: 'none', padding: '14px', borderRadius: 3, fontSize: 14, fontWeight: 700, cursor: 'pointer', letterSpacing: '1px', textTransform: 'uppercase' }}>
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </Layout>
  );
}
