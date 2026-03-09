import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';

const tradeTypes = [
  { icon: '🛒', label: 'Retail Purchase', desc: 'Individual or small quantity orders for personal or resale use.' },
  { icon: '📦', label: 'Wholesale Bulk', desc: 'Large quantity orders for businesses, retailers and distributors.' },
  { icon: '🌐', label: 'Import / Export', desc: 'International sourcing or export of goods across borders.' },
  { icon: '🔧', label: 'Pre-Owned / Used', desc: 'Refurbished or pre-owned equipment and machinery.' },
];
const categories = [
  'Electronics', 'Furnitures', 'Imitation Jewellery', "Women's Garments", "Men's Garments",
  'Kitchen Cookware', 'Food Products', 'Cleaning Products', 'Stationery', 'Mens Fashion',
  'Tableware', 'General Products', 'Medical Surgical Accessories', 'Water Bottle',
  'Agriculture', 'Foot Wear', 'Helmet', 'Home and Kitchen', 'UPS Battery',
  'Home Appliances', 'Body Cleansers', 'Other',
];
const faqs = [
  { q: 'How long does it take to get a quote?', a: 'We typically respond within 24 hours on business days. For urgent requirements, call or WhatsApp us directly at 8073667950.' },
  { q: 'Is there a minimum order value for a quote?', a: 'For retail, there is no minimum. For wholesale, the minimum order starts at ₹25,000. For import/export, minimum is ₹2,00,000.' },
  { q: 'Can I request quotes for multiple categories?', a: 'Yes! You can describe all your requirements in the Additional Details field, or submit separate quote requests per category.' },
  { q: 'Are the quoted prices final?', a: 'Quoted prices are valid for 7 days. Final pricing may vary slightly based on availability, shipping, and taxes.' },
];

export default function RequestQuotePage() {
  const [form, setForm] = useState({
    name: '', company: '', phone: '', email: '',
    tradeType: '', category: '', productDesc: '', qty: '', budget: '', deadline: '', message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const handleSubmit = e => { e.preventDefault(); setSubmitted(true); };

  return (
    <Layout>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #0f3460 0%, #16213e 50%, #1a1a2e 100%)', color: '#fff', padding: '60px 20px', textAlign: 'center' }}>
        <span style={{ background: 'rgba(46,109,206,0.8)', color: '#fff', padding: '5px 18px', borderRadius: 20, fontSize: 12, fontWeight: 700, display: 'inline-block', marginBottom: 18 }}>ALL TRADES WELCOME</span>
        <h1 style={{ fontSize: 40, fontWeight: 900, marginBottom: 12, lineHeight: 1.2 }}>Request for Quote</h1>
        <p style={{ color: '#94a3b8', fontSize: 16, maxWidth: 580, margin: '0 auto 32px' }}>
          Whether you're buying retail, sourcing wholesale, or exploring global trade — tell us what you need and we'll send you the best price.
        </p>
        <div style={{ display: 'flex', gap: 36, justifyContent: 'center', flexWrap: 'wrap' }}>
          {[['24hr', 'Response Time'], ['100%', 'Free Quotes'], ['500+', 'Happy Clients'], ['50+', 'Categories']].map(([n, l]) => (
            <div key={l} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 26, fontWeight: 800, color: '#60a5fa' }}>{n}</div>
              <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 3 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Trade Type Cards */}
      <div style={{ padding: '48px 20px 0' }}>
        <h2 style={{ fontWeight: 800, fontSize: 24, textAlign: 'center', marginBottom: 8 }}>What kind of trade?</h2>
        <p style={{ color: '#666', textAlign: 'center', marginBottom: 28, fontSize: 14 }}>Select your trade type below (optional — you can also describe it in the form)</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, maxWidth: 1000, margin: '0 auto 40px' }}>
          {tradeTypes.map(t => (
            <div
              key={t.label}
              onClick={() => setForm(f => ({ ...f, tradeType: t.label }))}
              style={{
                border: `2px solid ${form.tradeType === t.label ? '#2e6dce' : '#e5e5e5'}`,
                borderRadius: 10, padding: '20px 18px', cursor: 'pointer',
                background: form.tradeType === t.label ? '#f0f4fb' : '#fff',
                transition: 'all 0.2s',
              }}
            >
              <div style={{ fontSize: 32, marginBottom: 10 }}>{t.icon}</div>
              <h4 style={{ fontWeight: 700, fontSize: 14, marginBottom: 6 }}>{t.label}</h4>
              <p style={{ fontSize: 12, color: '#666', lineHeight: 1.5 }}>{t.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quote Form */}
      <div style={{ background: '#f9fafb', padding: '50px 20px' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <h2 style={{ fontWeight: 800, fontSize: 26, marginBottom: 6 }}>Quote Request Form</h2>
          <p style={{ color: '#666', marginBottom: 32, fontSize: 14 }}>Fill in your details and we'll prepare a custom quotation for you.</p>

          {submitted ? (
            <div style={{ background: '#fff', border: '2px solid #86efac', borderRadius: 12, padding: 48, textAlign: 'center' }}>
              <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
              <h3 style={{ fontWeight: 800, fontSize: 24, marginBottom: 10 }}>Quote Request Received!</h3>
              <p style={{ color: '#555', marginBottom: 6 }}>We'll contact you at <strong>{form.email || form.phone}</strong> within 24 hours.</p>
              <p style={{ color: '#777', fontSize: 13, marginBottom: 28 }}>For urgent requests, WhatsApp us directly at <a href="https://wa.me/918073667950" style={{ color: '#25d366', fontWeight: 700 }}>8073667950</a></p>
              <button onClick={() => setSubmitted(false)} style={{ background: '#2e6dce', color: '#fff', border: 'none', padding: '12px 32px', borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>Submit Another Request</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: 12, padding: '36px 32px', display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {[
                  { name: 'name', label: 'Full Name *', type: 'text', placeholder: 'John Doe' },
                  { name: 'company', label: 'Company / Business Name', type: 'text', placeholder: 'Optional' },
                  { name: 'phone', label: 'Phone / WhatsApp *', type: 'tel', placeholder: '+91 XXXXX XXXXX' },
                  { name: 'email', label: 'Email Address *', type: 'email', placeholder: 'you@example.com' },
                ].map(f => (
                  <div key={f.name}>
                    <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 6, color: '#333' }}>{f.label}</label>
                    <input
                      name={f.name} type={f.type} required={f.label.includes('*')}
                      value={form[f.name]} onChange={handleChange} placeholder={f.placeholder}
                      style={{ width: '100%', padding: '10px 14px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14, outline: 'none' }}
                    />
                  </div>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 6, color: '#333' }}>Product Category *</label>
                  <select name="category" required value={form.category} onChange={handleChange} style={{ width: '100%', padding: '10px 14px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14 }}>
                    <option value="">Select a category</option>
                    {categories.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 6, color: '#333' }}>Trade Type</label>
                  <select name="tradeType" value={form.tradeType} onChange={handleChange} style={{ width: '100%', padding: '10px 14px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14 }}>
                    <option value="">Select type</option>
                    {tradeTypes.map(t => <option key={t.label}>{t.label}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 6, color: '#333' }}>Product Description *</label>
                <textarea
                  name="productDesc" required value={form.productDesc} onChange={handleChange} rows={3}
                  placeholder="Describe the product(s) you need — brand, specifications, model, etc."
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14, resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                {[
                  { name: 'qty', label: 'Quantity / Units *', placeholder: 'e.g. 100 units' },
                  { name: 'budget', label: 'Estimated Budget', placeholder: 'e.g. ₹50,000' },
                  { name: 'deadline', label: 'Required By (Date)', placeholder: 'e.g. 15 April 2026' },
                ].map(f => (
                  <div key={f.name}>
                    <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 6, color: '#333' }}>{f.label}</label>
                    <input
                      name={f.name} type="text" required={f.label.includes('*')}
                      value={form[f.name]} onChange={handleChange} placeholder={f.placeholder}
                      style={{ width: '100%', padding: '10px 14px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14 }}
                    />
                  </div>
                ))}
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 6, color: '#333' }}>Additional Notes</label>
                <textarea
                  name="message" value={form.message} onChange={handleChange} rows={4}
                  placeholder="Shipping requirements, special conditions, preferred brands, delivery location..."
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14, resize: 'vertical' }}
                />
              </div>

              <button type="submit" style={{ background: 'linear-gradient(135deg, #2e6dce, #1d56af)', color: '#fff', border: 'none', padding: '14px', borderRadius: 8, fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>
                📋 Submit Quote Request
              </button>
              <p style={{ textAlign: 'center', fontSize: 12, color: '#999' }}>By submitting, you agree to our <Link to="/terms" style={{ color: '#2e6dce' }}>Terms & Conditions</Link>. We'll never spam you.</p>
            </form>
          )}
        </div>
      </div>

      {/* Quick Contact */}
      <div style={{ padding: '40px 20px', textAlign: 'center', borderBottom: '1px solid #e5e5e5' }}>
        <p style={{ color: '#555', marginBottom: 16, fontSize: 15 }}>Prefer to talk directly? Reach us instantly:</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="tel:8073667950"><button style={{ background: '#2e6dce', color: '#fff', border: 'none', padding: '12px 28px', borderRadius: 6, fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>📞 8073667950</button></a>
          <a href="https://wa.me/918073667950" target="_blank" rel="noreferrer"><button style={{ background: '#25d366', color: '#fff', border: 'none', padding: '12px 28px', borderRadius: 6, fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>💬 WhatsApp</button></a>
        </div>
      </div>

      {/* FAQ */}
      <div style={{ padding: '50px 20px', maxWidth: 780, margin: '0 auto' }}>
        <h2 style={{ fontWeight: 800, fontSize: 24, marginBottom: 28, textAlign: 'center' }}>Frequently Asked Questions</h2>
        {faqs.map((f, i) => (
          <div key={i} style={{ border: '1px solid #e5e5e5', borderRadius: 8, marginBottom: 12, overflow: 'hidden' }}>
            <button
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
              style={{ width: '100%', background: openFaq === i ? '#f0f4fb' : '#fff', border: 'none', padding: '16px 20px', textAlign: 'left', fontWeight: 700, fontSize: 14, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
              {f.q}<span style={{ color: '#2e6dce', fontSize: 20, fontWeight: 400 }}>{openFaq === i ? '−' : '+'}</span>
            </button>
            {openFaq === i && (
              <div style={{ padding: '4px 20px 18px', fontSize: 13, color: '#555', lineHeight: 1.7, background: '#f9fbff' }}>{f.a}</div>
            )}
          </div>
        ))}
      </div>
    </Layout>
  );
}
