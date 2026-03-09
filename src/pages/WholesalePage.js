import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';

const wholesaleCategories = [
  { icon: '📱', name: 'Mobile & Accessories', moq: '50 units', discount: 'Up to 30% off' },
  { icon: '💻', name: 'Electronics', moq: '20 units', discount: 'Up to 25% off' },
  { icon: '🍳', name: 'Kitchen & Cookware', moq: '100 units', discount: 'Up to 35% off' },
  { icon: '👗', name: "Women's Garments", moq: '200 units', discount: 'Up to 40% off' },
  { icon: '👔', name: "Men's Garments", moq: '200 units', discount: 'Up to 40% off' },
  { icon: '🧹', name: 'Cleaning Products', moq: '500 units', discount: 'Up to 45% off' },
  { icon: '💍', name: 'Imitation Jewellery', moq: '100 units', discount: 'Up to 50% off' },
  { icon: '🛋️', name: 'Furnitures', moq: '10 units', discount: 'Up to 20% off' },
];
const tiers = [
  { label: 'Bronze', min: '₹25,000', discount: '10%', color: '#cd7f32', features: ['Dedicated account manager', 'Net 30 payment terms', 'Free delivery above ₹50k'] },
  { label: 'Silver', min: '₹75,000', discount: '20%', color: '#94a3b8', features: ['Priority processing', 'Net 45 payment terms', 'Free delivery on all orders', 'Exclusive product access'] },
  { label: 'Gold', min: '₹2,00,000', discount: '30%', color: '#f59e0b', features: ['Dedicated sales rep', 'Net 60 payment terms', 'Free delivery + insurance', 'First access to new products', 'Custom branding available'] },
];
export default function WholesalePage() {
  const [form, setForm] = useState({ name: '', business: '', phone: '', email: '', category: '', qty: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const handleSubmit = e => { e.preventDefault(); setSubmitted(true); };
  return (
    <Layout>
      <div style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)', color: '#fff', padding: '60px 20px', textAlign: 'center' }}>
        <span style={{ background: '#2e6dce', color: '#fff', padding: '4px 16px', borderRadius: 20, fontSize: 12, fontWeight: 700, display: 'inline-block', marginBottom: 16 }}>WHOLESALE PLATFORM</span>
        <h1 style={{ fontSize: 40, fontWeight: 800, marginBottom: 12 }}>Wholesale Buying Made Simple</h1>
        <p style={{ color: '#94a3b8', fontSize: 16, maxWidth: 560, margin: '0 auto 28px' }}>Source bulk products at unbeatable prices. Trusted by 500+ retailers and resellers across India.</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 32, flexWrap: 'wrap' }}>
          {[['500+', 'Active Buyers'], ['50+', 'Product Categories'], ['30%', 'Avg. Savings'], ['24hr', 'Dispatch']].map(([n, l]) => (
            <div key={l} style={{ textAlign: 'center' }}><div style={{ fontSize: 30, fontWeight: 800, color: '#60a5fa' }}>{n}</div><div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>{l}</div></div>
          ))}
        </div>
      </div>
      <div style={{ background: '#f9fafb', padding: '50px 20px' }}>
        <h2 style={{ textAlign: 'center', fontWeight: 800, fontSize: 26, marginBottom: 36 }}>How Wholesale Works</h2>
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', maxWidth: 900, margin: '0 auto' }}>
          {[{ n: 1, icon: '📋', title: 'Submit Inquiry', desc: 'Fill the form with your requirements' }, { n: 2, icon: '💬', title: 'Get Quote', desc: 'Receive a quote within 24 hours' }, { n: 3, icon: '✅', title: 'Confirm Order', desc: 'Approve the quote and pay' }, { n: 4, icon: '🚚', title: 'Get Delivered', desc: 'Fast dispatch with tracking' }].map((s, i, arr) => (
            <div key={s.n} style={{ textAlign: 'center', flex: 1, minWidth: 160, maxWidth: 220, padding: '0 12px', position: 'relative' }}>
              {i < arr.length - 1 && <span style={{ position: 'absolute', right: -10, top: '30%', fontSize: 20, color: '#2e6dce' }}>→</span>}
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#2e6dce', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, margin: '0 auto 14px' }}>{s.icon}</div>
              <h4 style={{ fontWeight: 700, marginBottom: 6 }}>{s.title}</h4>
              <p style={{ fontSize: 12, color: '#666' }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
      <div style={{ padding: '50px 20px' }}>
        <h2 className="section-title">Wholesale Categories</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16, marginTop: 28 }}>
          {wholesaleCategories.map(c => (
            <div key={c.name} style={{ border: '1px solid #e5e5e5', borderRadius: 8, padding: '20px 16px', background: '#fff', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={{ fontSize: 32 }}>{c.icon}</span>
              <h4 style={{ fontWeight: 700, fontSize: 14 }}>{c.name}</h4>
              <p style={{ fontSize: 12, color: '#2e6dce', fontWeight: 600 }}>{c.discount}</p>
              <p style={{ fontSize: 11, color: '#777' }}>MOQ: {c.moq}</p>
            </div>
          ))}
        </div>
      </div>
      <div style={{ background: '#f9fafb', padding: '50px 20px' }}>
        <h2 style={{ textAlign: 'center', fontWeight: 800, fontSize: 26, marginBottom: 8 }}>Wholesale Pricing Tiers</h2>
        <p style={{ textAlign: 'center', color: '#666', marginBottom: 36 }}>The more you buy, the more you save</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24, maxWidth: 900, margin: '0 auto' }}>
          {tiers.map(t => (
            <div key={t.label} style={{ border: `2px solid ${t.color}`, borderRadius: 12, padding: '28px 24px', background: '#fff', textAlign: 'center' }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: t.color, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>{t.label}</div>
              <div style={{ fontSize: 32, fontWeight: 800, marginBottom: 4 }}>{t.discount}</div>
              <div style={{ fontSize: 12, color: '#777', marginBottom: 20 }}>Min. order {t.min}</div>
              <ul style={{ textAlign: 'left', marginBottom: 24 }}>
                {t.features.map(f => <li key={f} style={{ fontSize: 13, color: '#444', padding: '5px 0', borderBottom: '1px solid #f0f0f0', display: 'flex', gap: 8 }}><span style={{ color: '#22c55e' }}>✓</span> {f}</li>)}
              </ul>
              <button style={{ width: '100%', background: t.color, color: '#fff', border: 'none', padding: '11px', borderRadius: 6, fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>Get Started</button>
            </div>
          ))}
        </div>
      </div>
      <div style={{ padding: '50px 20px', maxWidth: 700, margin: '0 auto' }}>
        <h2 style={{ fontWeight: 800, fontSize: 26, marginBottom: 8 }}>Submit Wholesale Inquiry</h2>
        <p style={{ color: '#666', marginBottom: 28 }}>Tell us what you need and we'll get back with a custom quote.</p>
        {submitted ? (
          <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 8, padding: 28, textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
            <h3 style={{ fontWeight: 700, marginBottom: 8 }}>Inquiry Submitted!</h3>
            <p style={{ color: '#666' }}>We'll contact you within 24 hours. Call <a href="tel:8073667950" style={{ color: '#2e6dce', fontWeight: 600 }}>8073667950</a> for urgent queries.</p>
            <button onClick={() => setSubmitted(false)} style={{ marginTop: 16, background: '#2e6dce', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: 4, cursor: 'pointer', fontWeight: 600 }}>New Inquiry</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[{ name: 'name', label: 'Your Name *', type: 'text' }, { name: 'business', label: 'Business Name *', type: 'text' }, { name: 'phone', label: 'Phone Number *', type: 'tel' }, { name: 'email', label: 'Email Address *', type: 'email' }].map(f => (
              <div key={f.name}>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: 6, fontSize: 13 }}>{f.label}</label>
                <input name={f.name} type={f.type} required value={form[f.name]} onChange={handleChange} style={{ width: '100%', padding: '10px 14px', border: '1px solid #ddd', borderRadius: 4, fontSize: 14 }} />
              </div>
            ))}
            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: 6, fontSize: 13 }}>Product Category *</label>
              <select name="category" required value={form.category} onChange={handleChange} style={{ width: '100%', padding: '10px 14px', border: '1px solid #ddd', borderRadius: 4, fontSize: 14 }}>
                <option value="">Select Category</option>
                {wholesaleCategories.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: 6, fontSize: 13 }}>Estimated Quantity *</label>
              <input name="qty" type="number" required value={form.qty} onChange={handleChange} placeholder="e.g. 100" style={{ width: '100%', padding: '10px 14px', border: '1px solid #ddd', borderRadius: 4, fontSize: 14 }} />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: 6, fontSize: 13 }}>Additional Requirements</label>
              <textarea name="message" value={form.message} onChange={handleChange} rows={4} placeholder="Describe your requirements..." style={{ width: '100%', padding: '10px 14px', border: '1px solid #ddd', borderRadius: 4, fontSize: 14, resize: 'vertical' }} />
            </div>
            <button type="submit" className="btn-cart" style={{ padding: '13px', fontSize: 15 }}>Submit Wholesale Inquiry</button>
          </form>
        )}
      </div>
    </Layout>
  );
}
