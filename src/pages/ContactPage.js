import React, { useState } from 'react';
import Layout from '../components/Layout';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const handleSubmit = e => { e.preventDefault(); setSubmitted(true); };
  return (
    <Layout>
      <div style={{ background: 'linear-gradient(135deg, #2e6dce 0%, #1a1a2e 100%)', color: '#fff', padding: '50px 20px', textAlign: 'center' }}>
        <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: 10 }}>Contact Us</h1>
        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 15 }}>We're here to help. Reach out via phone, WhatsApp, or the form below.</p>
      </div>
      <div style={{ padding: '50px 20px', maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 48 }}>
        <div>
          <h2 style={{ fontWeight: 800, fontSize: 22, marginBottom: 24 }}>Get in Touch</h2>
          {[
            { icon: '📍', title: 'Address', value: 'Shop No 4, Harsha Residency, Devangpeth Road, Opp Samarth Apartment, Hubli 580023, Karnataka, India' },
            { icon: '📞', title: 'Phone', value: '8073667950', href: 'tel:8073667950' },
            { icon: '💬', title: 'WhatsApp', value: '8073667950', href: 'https://wa.me/918073667950' },
            { icon: '✉️', title: 'Email', value: 'contact@apseshopping.com', href: 'mailto:contact@apseshopping.com' },
          ].map(i => (
            <div key={i.title} style={{ display: 'flex', gap: 16, marginBottom: 24, alignItems: 'flex-start' }}>
              <span style={{ fontSize: 24, minWidth: 36 }}>{i.icon}</span>
              <div>
                <h4 style={{ fontWeight: 700, marginBottom: 4, fontSize: 14 }}>{i.title}</h4>
                {i.href ? <a href={i.href} style={{ color: '#2e6dce', fontSize: 14 }}>{i.value}</a> : <p style={{ fontSize: 14, color: '#555', lineHeight: 1.5 }}>{i.value}</p>}
              </div>
            </div>
          ))}
          <div style={{ background: '#f0f4fb', borderRadius: 8, padding: '20px', marginTop: 16 }}>
            <h4 style={{ fontWeight: 700, marginBottom: 8 }}>Business Hours</h4>
            <p style={{ fontSize: 13, color: '#555' }}>Monday – Saturday: 9:00 AM – 6:00 PM IST</p>
            <p style={{ fontSize: 13, color: '#555' }}>Sunday: Closed</p>
          </div>
        </div>
        <div>
          <h2 style={{ fontWeight: 800, fontSize: 22, marginBottom: 24 }}>Send a Message</h2>
          {submitted ? (
            <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 8, padding: 36, textAlign: 'center' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
              <h3 style={{ fontWeight: 700, marginBottom: 8 }}>Message Sent!</h3>
              <p style={{ color: '#555' }}>We'll get back to you as soon as possible.</p>
              <button onClick={() => setSubmitted(false)} style={{ marginTop: 16, background: '#2e6dce', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: 4, cursor: 'pointer', fontWeight: 600 }}>Send Another</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[{ name: 'name', label: 'Your Name *', type: 'text' }, { name: 'email', label: 'Email Address *', type: 'email' }, { name: 'phone', label: 'Phone Number', type: 'tel' }, { name: 'subject', label: 'Subject *', type: 'text' }].map(f => (
                <div key={f.name}>
                  <label style={{ display: 'block', fontWeight: 600, marginBottom: 6, fontSize: 13 }}>{f.label}</label>
                  <input name={f.name} type={f.type} required={f.label.includes('*')} value={form[f.name]} onChange={handleChange} style={{ width: '100%', padding: '10px 14px', border: '1px solid #ddd', borderRadius: 4, fontSize: 14 }} />
                </div>
              ))}
              <div>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: 6, fontSize: 13 }}>Message *</label>
                <textarea name="message" required value={form.message} onChange={handleChange} rows={5} placeholder="How can we help you?" style={{ width: '100%', padding: '10px 14px', border: '1px solid #ddd', borderRadius: 4, fontSize: 14, resize: 'vertical' }} />
              </div>
              <button type="submit" className="btn-cart" style={{ padding: '13px', fontSize: 15 }}>Send Message</button>
            </form>
          )}
        </div>
      </div>
    </Layout>
  );
}
