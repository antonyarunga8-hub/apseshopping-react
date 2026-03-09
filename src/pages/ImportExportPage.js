import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';

const importCategories = [
  { icon: '📱', name: 'Electronics & Gadgets', origin: 'China, Taiwan, South Korea', desc: 'Smartphones, accessories, components & consumer electronics.' },
  { icon: '👗', name: 'Textiles & Garments', origin: 'Bangladesh, Vietnam, Turkey', desc: 'Bulk fabric, readymade garments & fashion accessories.' },
  { icon: '🍳', name: 'Kitchen & Cookware', origin: 'China, Germany, Italy', desc: 'Utensils, appliances, and premium cookware sets.' },
  { icon: '💍', name: 'Jewellery & Accessories', origin: 'China, Thailand, UAE', desc: 'Imitation jewellery, fashion accessories & costume pieces.' },
  { icon: '🌿', name: 'Agriculture & Food', origin: 'USA, Australia, Brazil', desc: 'Grains, spices, processed food & agri-equipment.' },
  { icon: '🏗️', name: 'Hardware & Tools', origin: 'China, Germany, USA', desc: 'Industrial tools, hardware components & safety equipment.' },
];
const exportCategories = [
  { icon: '🌶️', name: 'Spices & Herbs', dest: 'USA, UK, UAE, EU', desc: 'Premium Indian spices, masalas and dried herbs.' },
  { icon: '🪡', name: 'Handloom & Crafts', dest: 'USA, Europe, Australia', desc: 'Handwoven textiles, handicrafts & artisan goods.' },
  { icon: '💊', name: 'Pharmaceuticals', dest: 'Africa, SE Asia, LATAM', desc: 'Generic medicines, APIs and health supplements.' },
  { icon: '🧴', name: 'Beauty & Wellness', dest: 'Middle East, Europe', desc: 'Ayurvedic products, cosmetics & wellness goods.' },
  { icon: '⚙️', name: 'Engineering Goods', dest: 'Global', desc: 'Auto parts, machinery components & precision instruments.' },
  { icon: '🫘', name: 'Pulses & Grains', dest: 'GCC, UK, USA', desc: 'Lentils, rice, wheat and other staple grains.' },
];
const tradeSteps = [
  { n: 1, icon: '📋', title: 'Submit Inquiry', desc: 'Tell us what you want to import or export — product, quantity, destination.' },
  { n: 2, icon: '🔍', title: 'Sourcing & Verification', desc: 'Our team identifies and verifies the best suppliers or buyers for you.' },
  { n: 3, icon: '💰', title: 'Pricing & Negotiation', desc: 'We negotiate competitive prices and send you a detailed quotation.' },
  { n: 4, icon: '📑', title: 'Documentation', desc: 'We handle all customs, shipping documents, and compliance paperwork.' },
  { n: 5, icon: '🚢', title: 'Logistics & Shipping', desc: 'We arrange freight, insurance, and real-time shipment tracking.' },
  { n: 6, icon: '✅', title: 'Delivery & Support', desc: 'Goods delivered with full after-service support.' },
];
const faqs = [
  { q: 'What is the minimum order value for import?', a: 'The minimum import order value starts at ₹2,00,000 (approx. USD 2,500). This varies by product category.' },
  { q: 'Which countries do you currently export to?', a: 'We currently export to 50+ countries including the USA, UK, UAE, Australia, Germany, and across Southeast Asia and Africa.' },
  { q: 'Do you handle all customs and documentation?', a: 'Yes. Our dedicated trade team handles all export/import documentation including customs declarations, certificates of origin, and compliance.' },
  { q: 'How long does international shipping typically take?', a: 'Sea freight: 15–45 days depending on destination. Air freight: 3–7 days. We provide real-time tracking throughout.' },
  { q: 'Can I get product samples before placing a bulk order?', a: 'Yes, samples can be arranged for most product categories. Sample costs are adjusted against your first bulk order.' },
];

export default function ImportExportPage() {
  const [activeTab, setActiveTab] = useState('import');
  const [openFaq, setOpenFaq] = useState(null);
  const [form, setForm] = useState({ name: '', company: '', phone: '', email: '', type: 'import', product: '', country: '', qty: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const handleSubmit = e => { e.preventDefault(); setSubmitted(true); };

  return (
    <Layout>
      <div style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 60%, #533483 100%)', color: '#fff', padding: '70px 20px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <span style={{ background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)', color: '#fff', padding: '5px 18px', borderRadius: 20, fontSize: 12, fontWeight: 700, display: 'inline-block', marginBottom: 18 }}>NEW MODULE — IMPORT &amp; EXPORT</span>
          <h1 style={{ fontSize: 44, fontWeight: 900, marginBottom: 14, lineHeight: 1.2 }}>🌐 Global Trade <br />Made Easy</h1>
          <p style={{ color: '#94a3b8', fontSize: 17, maxWidth: 600, margin: '0 auto 32px' }}>Import quality products from around the world or export Indian goods globally. Your complete trade partner.</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="#inquiry"><button style={{ background: 'linear-gradient(135deg, #2e6dce, #7c3aed)', color: '#fff', border: 'none', padding: '14px 32px', borderRadius: 8, fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>Start Your Trade Inquiry</button></a>
            <a href="#how-it-works"><button style={{ background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.4)', padding: '14px 32px', borderRadius: 8, fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>How It Works</button></a>
          </div>
        </div>
      </div>

      <div style={{ background: '#fff', borderBottom: '1px solid #e5e5e5', padding: '28px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 60, flexWrap: 'wrap', maxWidth: 900, margin: '0 auto' }}>
          {[['50+', 'Countries Served'], ['200+', 'Product Categories'], ['1000+', 'Trade Partners'], ['₹50Cr+', 'Trade Value Handled']].map(([n, l]) => (
            <div key={l} style={{ textAlign: 'center' }}><div style={{ fontSize: 28, fontWeight: 800, color: '#2e6dce' }}>{n}</div><div style={{ fontSize: 12, color: '#777', marginTop: 4 }}>{l}</div></div>
          ))}
        </div>
      </div>

      <div style={{ padding: '50px 20px 0' }}>
        <h2 style={{ textAlign: 'center', fontWeight: 800, fontSize: 28, marginBottom: 24 }}>What We Trade</h2>
        <div style={{ display: 'flex', justifyContent: 'center', border: '1px solid #ddd', borderRadius: 8, overflow: 'hidden', maxWidth: 400, margin: '0 auto 32px' }}>
          {['import', 'export'].map(t => (
            <button key={t} onClick={() => setActiveTab(t)} style={{ flex: 1, padding: '12px 0', fontWeight: 700, fontSize: 14, border: 'none', background: activeTab === t ? '#2e6dce' : '#fff', color: activeTab === t ? '#fff' : '#333', cursor: 'pointer', textTransform: 'uppercase' }}>
              {t === 'import' ? '📦 Import' : '🚢 Export'}
            </button>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20, padding: '0 0 40px' }}>
          {(activeTab === 'import' ? importCategories : exportCategories).map(c => (
            <div key={c.name} style={{ border: '1px solid #e5e5e5', borderRadius: 10, padding: '22px 20px', background: '#fff' }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>{c.icon}</div>
              <h3 style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>{c.name}</h3>
              <p style={{ fontSize: 12, color: '#2e6dce', fontWeight: 600, marginBottom: 8 }}>{activeTab === 'import' ? '🌏 Origin: ' : '✈️ Destination: '}{c.origin || c.dest}</p>
              <p style={{ fontSize: 13, color: '#666', lineHeight: 1.5 }}>{c.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div id="how-it-works" style={{ background: '#f9fafb', padding: '60px 20px' }}>
        <h2 style={{ textAlign: 'center', fontWeight: 800, fontSize: 28, marginBottom: 8 }}>How It Works</h2>
        <p style={{ textAlign: 'center', color: '#666', marginBottom: 40 }}>Our simple 6-step trade process from inquiry to delivery</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20, maxWidth: 1000, margin: '0 auto' }}>
          {tradeSteps.map(s => (
            <div key={s.n} style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: 10, padding: '24px 20px', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <div style={{ minWidth: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg, #2e6dce, #7c3aed)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 16 }}>{s.n}</div>
              <div><div style={{ fontSize: 22, marginBottom: 6 }}>{s.icon}</div><h4 style={{ fontWeight: 700, marginBottom: 5 }}>{s.title}</h4><p style={{ fontSize: 13, color: '#666', lineHeight: 1.5 }}>{s.desc}</p></div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '50px 20px' }}>
        <h2 style={{ textAlign: 'center', fontWeight: 800, fontSize: 28, marginBottom: 36 }}>Our Trade Services</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
          {[
            { icon: '📋', title: 'Trade Documentation', desc: 'Customs, invoices, certificate of origin & compliance docs.' },
            { icon: '🚢', title: 'Freight & Logistics', desc: 'Sea, air & land freight with real-time tracking and insurance.' },
            { icon: '🏦', title: 'Trade Finance', desc: 'LC, DP, DA, advance payment support through banking partners.' },
            { icon: '🔍', title: 'Supplier Verification', desc: 'Due diligence and verification of all international suppliers.' },
            { icon: '🛃', title: 'Customs Clearance', desc: 'End-to-end customs filing and clearance at all major ports.' },
            { icon: '📦', title: 'Warehousing', desc: 'Bonded and general warehousing at ports and key cities.' },
          ].map(s => (
            <div key={s.title} style={{ border: '1px solid #e5e5e5', borderRadius: 10, padding: '24px 18px', background: '#fff', textAlign: 'center' }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>{s.icon}</div>
              <h4 style={{ fontWeight: 700, fontSize: 14, marginBottom: 8 }}>{s.title}</h4>
              <p style={{ fontSize: 12, color: '#666', lineHeight: 1.5 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div id="inquiry" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)', padding: '60px 20px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <h2 style={{ color: '#fff', fontWeight: 800, fontSize: 28, marginBottom: 8, textAlign: 'center' }}>Submit Trade Inquiry</h2>
          <p style={{ color: '#94a3b8', textAlign: 'center', marginBottom: 36 }}>Fill in your requirements and our trade specialist will contact you within 24 hours.</p>
          {submitted ? (
            <div style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 12, padding: 40, textAlign: 'center' }}>
              <div style={{ fontSize: 52, marginBottom: 16 }}>🎉</div>
              <h3 style={{ color: '#fff', fontWeight: 700, fontSize: 22, marginBottom: 10 }}>Inquiry Received!</h3>
              <p style={{ color: '#94a3b8', marginBottom: 24 }}>Our trade specialist will contact you at <strong style={{ color: '#fff' }}>{form.email || form.phone}</strong> within 24 hours.</p>
              <button onClick={() => setSubmitted(false)} style={{ marginTop: 20, background: 'linear-gradient(135deg, #2e6dce, #7c3aed)', color: '#fff', border: 'none', padding: '12px 28px', borderRadius: 8, cursor: 'pointer', fontWeight: 700 }}>Submit Another Inquiry</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ color: '#e2e8f0', fontWeight: 600, fontSize: 13, display: 'block', marginBottom: 8 }}>Trade Type *</label>
                <div style={{ display: 'flex', gap: 12 }}>
                  {['import', 'export'].map(t => (
                    <label key={t} style={{ flex: 1, border: `2px solid ${form.type === t ? '#60a5fa' : 'rgba(255,255,255,0.2)'}`, borderRadius: 8, padding: '12px', textAlign: 'center', cursor: 'pointer', background: form.type === t ? 'rgba(96,165,250,0.15)' : 'rgba(255,255,255,0.05)', color: '#fff' }}>
                      <input type="radio" name="type" value={t} checked={form.type === t} onChange={handleChange} style={{ display: 'none' }} />
                      <div style={{ fontSize: 22, marginBottom: 4 }}>{t === 'import' ? '📦' : '🚢'}</div>
                      <div style={{ fontWeight: 700, textTransform: 'capitalize' }}>{t}</div>
                    </label>
                  ))}
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {[{ name: 'name', label: 'Your Name *', type: 'text' }, { name: 'company', label: 'Company Name', type: 'text' }, { name: 'phone', label: 'Phone / WhatsApp *', type: 'tel' }, { name: 'email', label: 'Email Address *', type: 'email' }].map(f => (
                  <div key={f.name}>
                    <label style={{ color: '#e2e8f0', fontWeight: 600, fontSize: 13, display: 'block', marginBottom: 6 }}>{f.label}</label>
                    <input name={f.name} type={f.type} required={f.label.includes('*')} value={form[f.name]} onChange={handleChange} style={{ width: '100%', padding: '10px 14px', borderRadius: 6, fontSize: 14, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', outline: 'none' }} />
                  </div>
                ))}
              </div>
              {[{ name: 'product', label: 'Product / Category *', placeholder: 'e.g. Electronics, Spices...' }, { name: 'country', label: form.type === 'import' ? 'Source Country' : 'Destination Country', placeholder: 'e.g. China, USA, UAE...' }, { name: 'qty', label: 'Estimated Quantity / Value *', placeholder: 'e.g. 500 units or ₹5,00,000' }].map(f => (
                <div key={f.name}>
                  <label style={{ color: '#e2e8f0', fontWeight: 600, fontSize: 13, display: 'block', marginBottom: 6 }}>{f.label}</label>
                  <input name={f.name} type="text" required={f.label.includes('*')} value={form[f.name]} onChange={handleChange} placeholder={f.placeholder} style={{ width: '100%', padding: '10px 14px', borderRadius: 6, fontSize: 14, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', outline: 'none' }} />
                </div>
              ))}
              <div>
                <label style={{ color: '#e2e8f0', fontWeight: 600, fontSize: 13, display: 'block', marginBottom: 6 }}>Additional Details</label>
                <textarea name="message" value={form.message} onChange={handleChange} rows={4} placeholder="Describe your requirements, timeline, special conditions..." style={{ width: '100%', padding: '10px 14px', borderRadius: 6, fontSize: 14, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', outline: 'none', resize: 'vertical' }} />
              </div>
              <button type="submit" style={{ background: 'linear-gradient(135deg, #2e6dce, #7c3aed)', color: '#fff', border: 'none', padding: '14px', borderRadius: 8, fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>🌐 Submit Trade Inquiry</button>
            </form>
          )}
        </div>
      </div>

      <div style={{ padding: '60px 20px', maxWidth: 800, margin: '0 auto' }}>
        <h2 style={{ fontWeight: 800, fontSize: 28, marginBottom: 8, textAlign: 'center' }}>Frequently Asked Questions</h2>
        <p style={{ color: '#666', textAlign: 'center', marginBottom: 36 }}>Everything you need to know about our import &amp; export services</p>
        {faqs.map((f, i) => (
          <div key={i} style={{ border: '1px solid #e5e5e5', borderRadius: 8, marginBottom: 12, overflow: 'hidden' }}>
            <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{ width: '100%', background: openFaq === i ? '#f0f4fb' : '#fff', border: 'none', padding: '16px 20px', textAlign: 'left', fontWeight: 700, fontSize: 14, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              {f.q}<span style={{ color: '#2e6dce', fontSize: 18 }}>{openFaq === i ? '−' : '+'}</span>
            </button>
            {openFaq === i && <div style={{ padding: '0 20px 18px', fontSize: 13, color: '#555', lineHeight: 1.7, background: '#f9fbff' }}>{f.a}</div>}
          </div>
        ))}
      </div>

      <div style={{ background: '#f0f4fb', padding: '40px 20px', textAlign: 'center', borderTop: '1px solid #dce8fb' }}>
        <h3 style={{ fontWeight: 700, fontSize: 22, marginBottom: 8 }}>Still have questions?</h3>
        <p style={{ color: '#666', marginBottom: 20 }}>Our trade specialists are available Mon–Sat, 9am to 6pm IST</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="tel:8073667950"><button style={{ background: '#2e6dce', color: '#fff', border: 'none', padding: '12px 28px', borderRadius: 6, fontWeight: 700, cursor: 'pointer' }}>📞 Call Us: 8073667950</button></a>
          <a href="https://wa.me/918073667950" target="_blank" rel="noreferrer"><button style={{ background: '#25d366', color: '#fff', border: 'none', padding: '12px 28px', borderRadius: 6, fontWeight: 700, cursor: 'pointer' }}>💬 WhatsApp Us</button></a>
          <Link to="/contact-us"><button style={{ background: '#fff', color: '#2e6dce', border: '2px solid #2e6dce', padding: '12px 28px', borderRadius: 6, fontWeight: 700, cursor: 'pointer' }}>📧 Email Us</button></Link>
        </div>
      </div>
    </Layout>
  );
}
