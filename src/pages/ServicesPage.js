import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';

const services = [
  {
    icon: '🔧',
    title: 'Equipment Repair & Servicing',
    desc: 'Professional repair and maintenance for electronics, kitchen appliances, home appliances, and commercial equipment.',
    features: ['Certified technicians', 'Warranty on repairs', 'Pickup & drop service', 'Transparent pricing'],
    badge: 'Popular',
  },
  {
    icon: '📦',
    title: 'Pre-Owned Products',
    desc: 'Thoroughly inspected and refurbished second-hand products at a fraction of the original price.',
    features: ['Graded quality (A/B/C)', '30-day return policy', 'Verified condition', 'Includes accessories'],
    badge: 'Best Value',
  },
  {
    icon: '🚚',
    title: 'Delivery & Logistics',
    desc: 'Fast and reliable delivery services across Karnataka and major Indian cities with real-time tracking.',
    features: ['Same-day delivery (Hubli)', 'Pan-India shipping', 'Live tracking', 'Insured shipments'],
    badge: null,
  },
  {
    icon: '🤝',
    title: 'Trade-In & Exchange',
    desc: 'Trade in your old electronics, appliances or devices and get instant credit toward a new purchase.',
    features: ['Instant valuation', 'Best trade-in prices', 'Any brand accepted', 'Eco-friendly recycling'],
    badge: 'New',
  },
  {
    icon: '🏭',
    title: 'B2B Procurement',
    desc: 'End-to-end procurement services for businesses — sourcing, vendor management, and supply chain support.',
    features: ['Dedicated account manager', 'Multi-vendor sourcing', 'Regular supply contracts', 'Volume discounts'],
    badge: null,
  },
  {
    icon: '📋',
    title: 'Product Inspection',
    desc: 'Third-party inspection and quality assurance for bulk orders, imports, and pre-owned purchases.',
    features: ['Pre-shipment inspection', 'Factory audits', 'Lab testing', 'Certification support'],
    badge: null,
  },
];

const preOwnedProducts = [
  { icon: '📷', name: 'Canon DSLR Camera (Used)', grade: 'A', originalPrice: 35000, salePrice: 18000, condition: 'Excellent — minor cosmetic wear', tag: 'Electronics' },
  { icon: '💻', name: 'Laptop Core i5 8th Gen (Refurb)', grade: 'B', originalPrice: 45000, salePrice: 22000, condition: 'Good — cleaned and tested', tag: 'Electronics' },
  { icon: '🍳', name: 'Prestige Pressure Cooker Set', grade: 'A', originalPrice: 4500, salePrice: 2200, condition: 'Like new — barely used', tag: 'Kitchen' },
  { icon: '📱', name: 'Samsung Android Phone 128GB', grade: 'B', originalPrice: 22000, salePrice: 9500, condition: 'Good — screen protector included', tag: 'Mobile' },
  { icon: '🔊', name: 'Bluetooth Speaker (Refurb)', grade: 'A', originalPrice: 3500, salePrice: 1499, condition: 'Excellent — fully restored', tag: 'Electronics' },
  { icon: '🖨️', name: 'HP Inkjet Printer (Used)', grade: 'B', originalPrice: 8000, salePrice: 3200, condition: 'Good — ink cartridges included', tag: 'Office' },
];

const grades = {
  'A': { color: '#22c55e', label: 'Grade A — Excellent' },
  'B': { color: '#f59e0b', label: 'Grade B — Good' },
  'C': { color: '#ef4444', label: 'Grade C — Fair' },
};

export default function ServicesPage() {
  const [tradeInForm, setTradeInForm] = useState({ name: '', phone: '', product: '', condition: '', expectedPrice: '' });
  const [tradeSubmitted, setTradeSubmitted] = useState(false);
  const handleChange = e => setTradeInForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const handleSubmit = e => { e.preventDefault(); setTradeSubmitted(true); };

  return (
    <Layout>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #134e4a 0%, #065f46 50%, #047857 100%)', color: '#fff', padding: '60px 20px', textAlign: 'center' }}>
        <span style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', padding: '5px 18px', borderRadius: 20, fontSize: 12, fontWeight: 700, display: 'inline-block', marginBottom: 18 }}>SERVICES &amp; PRE-OWNED</span>
        <h1 style={{ fontSize: 40, fontWeight: 900, marginBottom: 12 }}>Services &amp; Pre Owned</h1>
        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 16, maxWidth: 580, margin: '0 auto 32px' }}>
          Professional services, quality pre-owned products, and trade-in solutions — all under one roof.
        </p>
        <div style={{ display: 'flex', gap: 40, justifyContent: 'center', flexWrap: 'wrap' }}>
          {[['500+', 'Happy Customers'], ['30-day', 'Return Policy'], ['₹50%', 'Avg. Savings'], ['Same Day', 'Hubli Delivery']].map(([n, l]) => (
            <div key={l} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#6ee7b7' }}>{n}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', marginTop: 3 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Services Grid */}
      <div style={{ padding: '56px 20px 40px' }}>
        <h2 style={{ fontWeight: 800, fontSize: 26, textAlign: 'center', marginBottom: 8 }}>Our Services</h2>
        <p style={{ color: '#666', textAlign: 'center', marginBottom: 36, fontSize: 14 }}>Everything you need — buying, selling, repairing, or trading</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
          {services.map(s => (
            <div key={s.title} style={{ border: '1px solid #e5e5e5', borderRadius: 12, padding: '24px 22px', background: '#fff', position: 'relative' }}>
              {s.badge && (
                <span style={{ position: 'absolute', top: 16, right: 16, background: s.badge === 'New' ? '#7c3aed' : s.badge === 'Best Value' ? '#059669' : '#2e6dce', color: '#fff', fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 20 }}>{s.badge}</span>
              )}
              <div style={{ fontSize: 38, marginBottom: 14 }}>{s.icon}</div>
              <h3 style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>{s.title}</h3>
              <p style={{ fontSize: 13, color: '#666', lineHeight: 1.6, marginBottom: 16 }}>{s.desc}</p>
              <ul style={{ margin: 0, padding: 0 }}>
                {s.features.map(f => (
                  <li key={f} style={{ fontSize: 12, color: '#444', padding: '4px 0', display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span style={{ color: '#22c55e', fontWeight: 700 }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <button style={{ marginTop: 20, width: '100%', background: '#f0f4fb', border: '1px solid #dce8fb', color: '#2e6dce', padding: '10px', borderRadius: 6, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                Enquire Now
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Pre-Owned Section */}
      <div style={{ background: '#f9fafb', padding: '56px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 12, marginBottom: 28 }}>
          <div>
            <h2 style={{ fontWeight: 800, fontSize: 26, marginBottom: 6 }}>Pre-Owned Products</h2>
            <p style={{ color: '#666', fontSize: 14 }}>Fully inspected and graded — buy with confidence</p>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {Object.entries(grades).map(([k, v]) => (
              <span key={k} style={{ background: '#fff', border: `1px solid ${v.color}`, color: v.color, padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 700 }}>{v.label}</span>
            ))}
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 18 }}>
          {preOwnedProducts.map(p => {
            const savings = Math.round(((p.originalPrice - p.salePrice) / p.originalPrice) * 100);
            const gradeInfo = grades[p.grade];
            return (
              <div key={p.name} style={{ border: '1px solid #e5e5e5', borderRadius: 10, background: '#fff', overflow: 'hidden' }}>
                <div style={{ background: '#f0f4fb', height: 130, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 56, position: 'relative' }}>
                  {p.icon}
                  <span style={{ position: 'absolute', top: 10, left: 10, background: '#e53e3e', color: '#fff', fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 3 }}>{savings}% OFF</span>
                  <span style={{ position: 'absolute', top: 10, right: 10, background: gradeInfo.color, color: '#fff', fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 3 }}>Grade {p.grade}</span>
                </div>
                <div style={{ padding: '16px' }}>
                  <span style={{ background: '#f0f4fb', color: '#2e6dce', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20 }}>{p.tag}</span>
                  <h4 style={{ fontWeight: 700, fontSize: 14, margin: '8px 0 4px' }}>{p.name}</h4>
                  <p style={{ fontSize: 11, color: '#888', marginBottom: 10 }}>Condition: {p.condition}</p>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 12 }}>
                    <span style={{ color: '#aaa', textDecoration: 'line-through', fontSize: 12 }}>₹{p.originalPrice.toLocaleString()}</span>
                    <span style={{ color: '#2e6dce', fontWeight: 800, fontSize: 18 }}>₹{p.salePrice.toLocaleString()}</span>
                  </div>
                  <button style={{ width: '100%', background: '#2e6dce', color: '#fff', border: 'none', padding: '9px', borderRadius: 5, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                    Add to Cart
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Trade-In Section */}
      <div style={{ padding: '56px 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 48, maxWidth: 1000, margin: '0 auto', alignItems: 'center' }}>
          <div>
            <span style={{ background: '#fef3c7', color: '#d97706', padding: '4px 14px', borderRadius: 20, fontSize: 12, fontWeight: 700 }}>TRADE-IN PROGRAM</span>
            <h2 style={{ fontWeight: 800, fontSize: 26, margin: '16px 0 12px' }}>Got an old device? Trade it in!</h2>
            <p style={{ color: '#555', lineHeight: 1.7, marginBottom: 20 }}>
              We accept old electronics, appliances, and gadgets. Get a fair valuation instantly and use the credit toward your next purchase at Apse Shopping.
            </p>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {['We accept all brands and models', 'Instant valuation within 24 hours', 'Trade-in credit never expires', 'Free pickup in Hubli'].map(item => (
                <li key={item} style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize: 14, color: '#444' }}>
                  <span style={{ fontSize: 16 }}>✅</span> {item}
                </li>
              ))}
            </ul>
          </div>
          <div style={{ background: '#f9fafb', border: '1px solid #e5e5e5', borderRadius: 12, padding: '32px 28px' }}>
            <h3 style={{ fontWeight: 700, fontSize: 18, marginBottom: 20 }}>Submit Trade-In Request</h3>
            {tradeSubmitted ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
                <h4 style={{ fontWeight: 700, marginBottom: 8 }}>Request Submitted!</h4>
                <p style={{ color: '#666', fontSize: 13 }}>We'll call you within 24 hours with a valuation.</p>
                <button onClick={() => setTradeSubmitted(false)} style={{ marginTop: 16, background: '#2e6dce', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: 4, cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>New Request</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {[
                  { name: 'name', label: 'Your Name *', placeholder: 'Full name' },
                  { name: 'phone', label: 'Phone *', placeholder: 'WhatsApp number' },
                  { name: 'product', label: 'Product to Trade In *', placeholder: 'e.g. Samsung Galaxy S10' },
                  { name: 'condition', label: 'Condition *', placeholder: 'e.g. Working, screen cracked' },
                  { name: 'expectedPrice', label: 'Expected Price (₹)', placeholder: 'Optional' },
                ].map(f => (
                  <div key={f.name}>
                    <label style={{ display: 'block', fontWeight: 600, fontSize: 12, marginBottom: 5, color: '#444' }}>{f.label}</label>
                    <input
                      name={f.name} type="text" required={f.label.includes('*')}
                      value={tradeInForm[f.name]} onChange={handleChange} placeholder={f.placeholder}
                      style={{ width: '100%', padding: '9px 12px', border: '1px solid #ddd', borderRadius: 5, fontSize: 13 }}
                    />
                  </div>
                ))}
                <button type="submit" style={{ background: '#d97706', color: '#fff', border: 'none', padding: '12px', borderRadius: 6, fontWeight: 700, fontSize: 14, cursor: 'pointer', marginTop: 4 }}>
                  🔄 Submit Trade-In
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ background: 'linear-gradient(135deg, #134e4a, #065f46)', padding: '48px 20px', textAlign: 'center' }}>
        <h3 style={{ color: '#fff', fontWeight: 800, fontSize: 24, marginBottom: 10 }}>Need a custom service?</h3>
        <p style={{ color: 'rgba(255,255,255,0.75)', marginBottom: 24, fontSize: 14 }}>Contact us directly and we'll tailor a solution for you</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="tel:8073667950"><button style={{ background: '#fff', color: '#065f46', border: 'none', padding: '12px 28px', borderRadius: 6, fontWeight: 700, cursor: 'pointer' }}>📞 Call Us</button></a>
          <a href="https://wa.me/918073667950" target="_blank" rel="noreferrer"><button style={{ background: '#25d366', color: '#fff', border: 'none', padding: '12px 28px', borderRadius: 6, fontWeight: 700, cursor: 'pointer' }}>💬 WhatsApp</button></a>
          <Link to="/request-quote"><button style={{ background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.5)', padding: '12px 28px', borderRadius: 6, fontWeight: 700, cursor: 'pointer' }}>📋 Request Quote</button></Link>
        </div>
      </div>
    </Layout>
  );
}
