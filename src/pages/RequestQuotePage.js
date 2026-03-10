import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';

const STAGES = [
  { id: 1, label: 'Submit Request',    icon: '📋', desc: 'Customer submits product/service requirement with location & budget' },
  { id: 2, label: 'Vendor Matching',   icon: '🔍', desc: 'Platform matches sellers & service providers by region and category' },
  { id: 3, label: 'Discussion',        icon: '💬', desc: 'Customer & vendors discuss specs, pricing and terms on platform' },
  { id: 4, label: 'Sample Exchange',   icon: '📦', desc: 'Samples sent to ApseShopping office, inspected, forwarded to customer' },
  { id: 5, label: 'Invoice & Payment', icon: '🧾', desc: 'Discussion finalised as invoice. Customer pays platform (escrow)' },
  { id: 6, label: 'Delivery',          icon: '🚚', desc: 'Products/services delivered in full or installments to customer' },
  { id: 7, label: 'Fund Release',      icon: '✅', desc: 'Upon customer confirmation, escrow releases payment to vendor' },
];

const categories = [
  'Electronics', 'Furnitures', 'Imitation Jewellery', "Women's Garments", "Men's Garments",
  'Kitchen Cookware', 'Food Products', 'Cleaning Products', 'Stationery', 'Mens Fashion',
  'Tableware', 'General Products', 'Medical Surgical Accessories', 'Water Bottle',
  'Agriculture', 'Foot Wear', 'Helmet', 'Home and Kitchen', 'UPS Battery',
  'Home Appliances', 'Body Cleansers', 'Services', 'Repair & Maintenance',
  'Import / Export', 'Other',
];

const tradeTypes = [
  { icon: '🛒', label: 'Retail Purchase',    desc: 'Individual or small quantity orders' },
  { icon: '📦', label: 'Wholesale / Bulk',   desc: 'Large quantity orders for business' },
  { icon: '🌐', label: 'Import / Export',    desc: 'International sourcing or export' },
  { icon: '🔧', label: 'Service Request',    desc: 'Repair, installation or professional service' },
  { icon: '♻️', label: 'Pre-Owned / Used',  desc: 'Refurbished or second-hand items' },
  { icon: '🏭', label: 'B2B Procurement',    desc: 'End-to-end supply chain for businesses' },
];

const indianStates = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat',
  'Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh',
  'Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab',
  'Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh',
  'Uttarakhand','West Bengal','Delhi','Jammu & Kashmir','Ladakh',
];

const faqs = [
  { q: 'How does the escrow payment work?', a: 'Once you approve the invoice, you pay the platform. Funds are held securely in escrow. Payment is only released to the vendor after you confirm receipt and satisfaction of the goods or services — either in full or per delivery installment.' },
  { q: 'What happens to samples?', a: 'Vendors ship samples to our Hubli office. We inspect them for quality, photograph them, and forward them to you. You evaluate and decide before committing to the full order.' },
  { q: 'Can I request from multiple sellers at once?', a: 'Yes. For each RFQ, we can match multiple vendors. You can compare their quotes, discuss with each, and choose one or split the order across multiple vendors.' },
  { q: 'How are vendors verified?', a: 'All vendors on our platform are onboarded through a verification process including business documents, trade licenses, and a sample quality check before they can respond to RFQs.' },
  { q: 'Is there a minimum order value for RFQ?', a: 'For retail RFQs, no minimum. For wholesale, minimum is ₹25,000. For import/export, minimum is ₹2,00,000. For services, there is no minimum.' },
  { q: 'How long does the full process take?', a: 'Initial vendor matching: 24-48 hours. Sample exchange: 3-7 days depending on location. Full order delivery: varies by product and location. We keep you updated at every stage.' },
];

// ── Vendor Registration Form ──────────────────────────────────────
function VendorRegisterForm({ onClose }) {
  const [form, setForm] = useState({ name: '', business: '', phone: '', email: '', category: '', state: '', city: '', gst: '', desc: '' });
  const [submitted, setSubmitted] = useState(false);
  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const handleSubmit = e => { e.preventDefault(); setSubmitted(true); };

  if (submitted) return (
    <div style={{ textAlign: 'center', padding: '32px 0' }}>
      <div style={{ fontSize: 56, marginBottom: 12 }}>🎉</div>
      <h3 style={{ fontWeight: 800, marginBottom: 8 }}>Application Submitted!</h3>
      <p style={{ color: '#555', fontSize: 14, marginBottom: 20 }}>Our team will review and contact you within 48 hours.</p>
      <button onClick={onClose} style={{ background: '#2e6dce', color: '#fff', border: 'none', padding: '10px 28px', borderRadius: 4, cursor: 'pointer', fontWeight: 600 }}>Close</button>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {[
          { name: 'name', label: 'Contact Name *', placeholder: 'Your full name' },
          { name: 'business', label: 'Business / Company *', placeholder: 'Company name' },
          { name: 'phone', label: 'Phone / WhatsApp *', placeholder: '+91 XXXXX XXXXX' },
          { name: 'email', label: 'Email *', placeholder: 'business@email.com' },
          { name: 'city', label: 'City *', placeholder: 'Your city' },
          { name: 'gst', label: 'GST Number', placeholder: 'Optional' },
        ].map(f => (
          <div key={f.name}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4, color: '#444' }}>{f.label}</label>
            <input name={f.name} type="text" required={f.label.includes('*')} value={form[f.name]} onChange={handleChange} placeholder={f.placeholder}
              style={{ width: '100%', padding: '9px 11px', border: '1px solid #ddd', borderRadius: 4, fontSize: 13, boxSizing: 'border-box' }} />
          </div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4, color: '#444' }}>Product/Service Category *</label>
          <select name="category" required value={form.category} onChange={handleChange} style={{ width: '100%', padding: '9px 11px', border: '1px solid #ddd', borderRadius: 4, fontSize: 13 }}>
            <option value="">Select category</option>
            {categories.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4, color: '#444' }}>State *</label>
          <select name="state" required value={form.state} onChange={handleChange} style={{ width: '100%', padding: '9px 11px', border: '1px solid #ddd', borderRadius: 4, fontSize: 13 }}>
            <option value="">Select state</option>
            {indianStates.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4, color: '#444' }}>Describe your products / services *</label>
        <textarea name="desc" required value={form.desc} onChange={handleChange} rows={3} placeholder="What do you sell or offer? Include brands, specialities, capacity..."
          style={{ width: '100%', padding: '9px 11px', border: '1px solid #ddd', borderRadius: 4, fontSize: 13, resize: 'vertical', boxSizing: 'border-box' }} />
      </div>
      <button type="submit" style={{ background: '#7c3aed', color: '#fff', border: 'none', padding: '12px', borderRadius: 4, fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
        🏭 Submit Vendor Application
      </button>
    </form>
  );
}

export default function RequestQuotePage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('customer'); // customer | vendor
  const [showVendorModal, setShowVendorModal] = useState(false);
  const [form, setForm] = useState({
    name: '', company: '', phone: '', email: '',
    tradeType: '', category: '', productDesc: '',
    qty: '', budget: '', deadline: '',
    state: '', city: '', pincode: '',
    sampleRequired: false, multipleVendors: false,
    deliveryType: 'full', message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const handleChange = e => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm(f => ({ ...f, [e.target.name]: val }));
  };
  const handleSubmit = e => { e.preventDefault(); setSubmitted(true); };

  const inputStyle = { width: '100%', padding: '10px 14px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14, outline: 'none', boxSizing: 'border-box' };
  const labelStyle = { display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 6, color: '#333' };

  return (
    <Layout>
      {/* Vendor Modal */}
      {showVendorModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#fff', borderRadius: 12, padding: '32px 28px', width: '100%', maxWidth: 640, maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}>
            <button onClick={() => setShowVendorModal(false)} style={{ position: 'absolute', top: 12, right: 16, background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#555' }}>×</button>
            <h2 style={{ fontWeight: 800, fontSize: 20, marginBottom: 6 }}>🏭 Become a Vendor / Service Provider</h2>
            <p style={{ color: '#666', fontSize: 13, marginBottom: 24 }}>Get matched with customers in your region looking for your products or services.</p>
            <VendorRegisterForm onClose={() => setShowVendorModal(false)} />
          </div>
        </div>
      )}

      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #0f3460 0%, #16213e 50%, #1a1a2e 100%)', color: '#fff', padding: '60px 20px', textAlign: 'center' }}>
        <span style={{ background: 'rgba(46,109,206,0.8)', color: '#fff', padding: '5px 18px', borderRadius: 20, fontSize: 12, fontWeight: 700, display: 'inline-block', marginBottom: 18 }}>ESCROW-PROTECTED TRADE</span>
        <h1 style={{ fontSize: 40, fontWeight: 900, marginBottom: 12, lineHeight: 1.2 }}>Request for Quote</h1>
        <p style={{ color: '#94a3b8', fontSize: 16, maxWidth: 620, margin: '0 auto 32px' }}>
          Tell us what you need. We match you with verified sellers & service providers in your region. Samples inspected at our office. Funds held in escrow until you're satisfied.
        </p>
        <div style={{ display: 'flex', gap: 36, justifyContent: 'center', flexWrap: 'wrap' }}>
          {[['24hr', 'Vendor Matching'], ['100%', 'Escrow Protected'], ['500+', 'Verified Vendors'], ['All India', 'Coverage']].map(([n, l]) => (
            <div key={l} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 26, fontWeight: 800, color: '#60a5fa' }}>{n}</div>
              <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 3 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div style={{ background: '#f8faff', padding: '52px 20px', borderBottom: '1px solid #e8eaf0' }}>
        <h2 style={{ fontWeight: 800, fontSize: 26, textAlign: 'center', marginBottom: 8 }}>How the RFQ Process Works</h2>
        <p style={{ color: '#666', textAlign: 'center', marginBottom: 40, fontSize: 14 }}>7 steps from request to fund release — fully transparent and secure</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 0, maxWidth: 1200, margin: '0 auto' }}>
          {STAGES.map((stage, i) => (
            <div key={stage.id} style={{ display: 'flex', alignItems: 'flex-start', flexShrink: 0 }}>
              <div style={{ textAlign: 'center', width: 140, padding: '0 6px' }}>
                <div style={{
                  width: 56, height: 56, borderRadius: '50%',
                  background: stage.id <= 5 ? 'linear-gradient(135deg, #2e6dce, #1d56af)' : stage.id === 6 ? '#f59e0b' : '#22c55e',
                  color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 24, margin: '0 auto 10px', boxShadow: '0 4px 12px rgba(46,109,206,0.3)',
                }}>
                  {stage.icon}
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#1a1a2e', marginBottom: 4 }}>{stage.label}</div>
                <div style={{ fontSize: 11, color: '#777', lineHeight: 1.5 }}>{stage.desc}</div>
              </div>
              {i < STAGES.length - 1 && (
                <div style={{ fontSize: 20, color: '#2e6dce', marginTop: 16, flexShrink: 0 }}>→</div>
              )}
            </div>
          ))}
        </div>

        {/* Escrow Info Box */}
        <div style={{ background: 'linear-gradient(135deg, #1e40af, #1d4ed8)', borderRadius: 12, padding: '24px 32px', maxWidth: 800, margin: '40px auto 0', color: '#fff', display: 'flex', gap: 20, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div style={{ fontSize: 40 }}>🔐</div>
          <div>
            <h3 style={{ fontWeight: 800, fontSize: 18, marginBottom: 8 }}>Escrow Payment Protection</h3>
            <p style={{ fontSize: 13, color: '#bfdbfe', lineHeight: 1.7 }}>
              When you finalise your order, payment goes to <strong style={{ color: '#fff' }}>ApseShopping's escrow</strong> — not directly to the vendor.
              Funds are held securely and released to the vendor <strong style={{ color: '#fff' }}>only after you confirm</strong> delivery and satisfaction.
              For installment deliveries, partial releases happen per delivery confirmation.
            </p>
          </div>
        </div>
      </div>

      {/* Tab Switch: Customer / Vendor */}
      <div style={{ background: '#fff', padding: '36px 20px 0', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', border: '1px solid #ddd', borderRadius: 8, overflow: 'hidden', marginBottom: 32 }}>
          {[['customer', '🛒 I\'m a Customer'], ['vendor', '🏭 I\'m a Vendor / Seller']].map(([key, label]) => (
            <button key={key} onClick={() => setActiveTab(key)}
              style={{ padding: '12px 28px', fontSize: 14, fontWeight: 700, border: 'none', cursor: 'pointer', background: activeTab === key ? '#2e6dce' : '#fff', color: activeTab === key ? '#fff' : '#555', transition: 'all 0.2s' }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Trade Type Cards */}
      {activeTab === 'customer' && (
        <div style={{ padding: '0 20px 32px', background: '#fff' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, maxWidth: 1100, margin: '0 auto 0' }}>
            {tradeTypes.map(t => (
              <div key={t.label} onClick={() => setForm(f => ({ ...f, tradeType: t.label }))}
                style={{ border: `2px solid ${form.tradeType === t.label ? '#2e6dce' : '#e5e5e5'}`, borderRadius: 10, padding: '16px 14px', cursor: 'pointer', background: form.tradeType === t.label ? '#f0f4fb' : '#fff', transition: 'all 0.2s' }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>{t.icon}</div>
                <h4 style={{ fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{t.label}</h4>
                <p style={{ fontSize: 11, color: '#666', lineHeight: 1.5 }}>{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Customer RFQ Form */}
      {activeTab === 'customer' && (
        <div style={{ background: '#f9fafb', padding: '50px 20px' }}>
          <div style={{ maxWidth: 820, margin: '0 auto' }}>
            <h2 style={{ fontWeight: 800, fontSize: 26, marginBottom: 6 }}>Submit Your Quote Request</h2>
            <p style={{ color: '#666', marginBottom: 32, fontSize: 14 }}>Describe what you need. We'll match you with verified vendors in your region within 24 hours.</p>

            {submitted ? (
              <div style={{ background: '#fff', border: '2px solid #86efac', borderRadius: 12, padding: 48, textAlign: 'center' }}>
                <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
                <h3 style={{ fontWeight: 800, fontSize: 26, marginBottom: 10, color: '#166534' }}>RFQ Submitted Successfully!</h3>
                <p style={{ color: '#555', marginBottom: 8, fontSize: 15 }}>Your request has been received. Our team will match you with vendors in <strong>{form.city || form.state}</strong>.</p>
                <p style={{ color: '#777', fontSize: 13, marginBottom: 8 }}>📞 We'll contact you at <strong>{form.phone}</strong> within 24 hours.</p>
                <p style={{ color: '#777', fontSize: 13, marginBottom: 28 }}>
                  For urgent requests WhatsApp us: <a href="https://wa.me/918073667950" style={{ color: '#25d366', fontWeight: 700 }}>8073667950</a>
                </p>

                {/* Process reminder */}
                <div style={{ background: '#f0f4ff', borderRadius: 8, padding: '16px 20px', marginBottom: 24, textAlign: 'left', maxWidth: 480, margin: '0 auto 24px' }}>
                  <p style={{ fontWeight: 700, fontSize: 13, marginBottom: 10, color: '#1e40af' }}>What happens next:</p>
                  {['Vendor matching within 24 hours', 'You review vendor profiles & quotes', 'Request samples if needed (sent to our office first)', 'Approve invoice & pay escrow', 'Receive delivery, confirm & funds released to vendor'].map((step, i) => (
                    <div key={i} style={{ display: 'flex', gap: 10, fontSize: 12, color: '#444', marginBottom: 6 }}>
                      <span style={{ color: '#2e6dce', fontWeight: 700, flexShrink: 0 }}>{i + 1}.</span> {step}
                    </div>
                  ))}
                </div>
                <button onClick={() => setSubmitted(false)} style={{ background: '#2e6dce', color: '#fff', border: 'none', padding: '12px 32px', borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>Submit Another Request</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: 12, padding: '36px 32px', display: 'flex', flexDirection: 'column', gap: 22 }}>

                {/* Contact Info */}
                <div>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1a1a2e', marginBottom: 16, paddingBottom: 8, borderBottom: '1px solid #f0f0f0' }}>👤 Your Details</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    {[
                      { name: 'name', label: 'Full Name *', type: 'text', placeholder: 'Your full name' },
                      { name: 'company', label: 'Company / Business', type: 'text', placeholder: 'Optional' },
                      { name: 'phone', label: 'Phone / WhatsApp *', type: 'tel', placeholder: '+91 XXXXX XXXXX' },
                      { name: 'email', label: 'Email Address *', type: 'email', placeholder: 'you@example.com' },
                    ].map(f => (
                      <div key={f.name}>
                        <label style={labelStyle}>{f.label}</label>
                        <input name={f.name} type={f.type} required={f.label.includes('*')} value={form[f.name]} onChange={handleChange} placeholder={f.placeholder} style={inputStyle} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Location */}
                <div>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1a1a2e', marginBottom: 16, paddingBottom: 8, borderBottom: '1px solid #f0f0f0' }}>📍 Delivery Location</h3>
                  <p style={{ fontSize: 12, color: '#888', marginBottom: 12 }}>Your location helps us match vendors closest to you, reducing shipping costs and time.</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
                    <div>
                      <label style={labelStyle}>State *</label>
                      <select name="state" required value={form.state} onChange={handleChange} style={inputStyle}>
                        <option value="">Select state</option>
                        {indianStates.map(s => <option key={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={labelStyle}>City *</label>
                      <input name="city" type="text" required value={form.city} onChange={handleChange} placeholder="Your city" style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Pincode</label>
                      <input name="pincode" type="text" value={form.pincode} onChange={handleChange} placeholder="6-digit pincode" style={inputStyle} />
                    </div>
                  </div>
                </div>

                {/* Product/Service Details */}
                <div>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1a1a2e', marginBottom: 16, paddingBottom: 8, borderBottom: '1px solid #f0f0f0' }}>📦 Product / Service Requirements</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                    <div>
                      <label style={labelStyle}>Product Category *</label>
                      <select name="category" required value={form.category} onChange={handleChange} style={inputStyle}>
                        <option value="">Select category</option>
                        {categories.map(c => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={labelStyle}>Trade Type</label>
                      <select name="tradeType" value={form.tradeType} onChange={handleChange} style={inputStyle}>
                        <option value="">Select type</option>
                        {tradeTypes.map(t => <option key={t.label}>{t.label}</option>)}
                      </select>
                    </div>
                  </div>
                  <div style={{ marginBottom: 14 }}>
                    <label style={labelStyle}>Product / Service Description *</label>
                    <textarea name="productDesc" required value={form.productDesc} onChange={handleChange} rows={4}
                      placeholder="Describe exactly what you need — brand, model, specifications, size, color, quantity per unit, any certifications required..."
                      style={{ ...inputStyle, resize: 'vertical' }} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
                    <div>
                      <label style={labelStyle}>Quantity / Units *</label>
                      <input name="qty" type="text" required value={form.qty} onChange={handleChange} placeholder="e.g. 100 units" style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Estimated Budget</label>
                      <input name="budget" type="text" value={form.budget} onChange={handleChange} placeholder="e.g. ₹50,000" style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Required By (Date)</label>
                      <input name="deadline" type="text" value={form.deadline} onChange={handleChange} placeholder="e.g. 15 April 2026" style={inputStyle} />
                    </div>
                  </div>
                </div>

                {/* Options */}
                <div>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1a1a2e', marginBottom: 16, paddingBottom: 8, borderBottom: '1px solid #f0f0f0' }}>⚙️ Preferences</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <label style={{ display: 'flex', alignItems: 'flex-start', gap: 12, cursor: 'pointer', background: '#f9fafb', border: '1px solid #e5e5e5', borderRadius: 8, padding: '12px 16px' }}>
                      <input type="checkbox" name="sampleRequired" checked={form.sampleRequired} onChange={handleChange} style={{ marginTop: 2, accentColor: '#2e6dce', width: 16, height: 16 }} />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 13 }}>📦 I want samples first</div>
                        <div style={{ fontSize: 12, color: '#666', marginTop: 2 }}>Vendors will ship samples to ApseShopping office. We inspect and forward to you before full order commitment.</div>
                      </div>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'flex-start', gap: 12, cursor: 'pointer', background: '#f9fafb', border: '1px solid #e5e5e5', borderRadius: 8, padding: '12px 16px' }}>
                      <input type="checkbox" name="multipleVendors" checked={form.multipleVendors} onChange={handleChange} style={{ marginTop: 2, accentColor: '#2e6dce', width: 16, height: 16 }} />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 13 }}>🔍 Match me with multiple vendors</div>
                        <div style={{ fontSize: 12, color: '#666', marginTop: 2 }}>Compare quotes from multiple verified sellers. You can split the order or choose the best offer.</div>
                      </div>
                    </label>
                    <div>
                      <label style={{ fontWeight: 700, fontSize: 13, display: 'block', marginBottom: 8 }}>🚚 Delivery Preference</label>
                      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                        {[['full', 'Full delivery at once'], ['installments', 'Delivery in installments']].map(([val, label]) => (
                          <label key={val} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', padding: '8px 16px', border: `2px solid ${form.deliveryType === val ? '#2e6dce' : '#ddd'}`, borderRadius: 6, background: form.deliveryType === val ? '#f0f4fb' : '#fff', fontSize: 13, fontWeight: 600 }}>
                            <input type="radio" name="deliveryType" value={val} checked={form.deliveryType === val} onChange={handleChange} style={{ accentColor: '#2e6dce' }} />
                            {label}
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Notes */}
                <div>
                  <label style={labelStyle}>Additional Notes</label>
                  <textarea name="message" value={form.message} onChange={handleChange} rows={3}
                    placeholder="Any special requirements, preferred brands, packaging, certifications, or other instructions..."
                    style={{ ...inputStyle, resize: 'vertical' }} />
                </div>

                <button type="submit" style={{ background: 'linear-gradient(135deg, #2e6dce, #1d56af)', color: '#fff', border: 'none', padding: '16px', borderRadius: 8, fontWeight: 700, fontSize: 16, cursor: 'pointer', letterSpacing: 0.3 }}>
                  📋 Submit RFQ — Get Matched with Vendors
                </button>
                <p style={{ textAlign: 'center', fontSize: 12, color: '#999' }}>Free to submit. No commitment until you approve a quote. Escrow payment protects your funds.</p>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Vendor Section */}
      {activeTab === 'vendor' && (
        <div style={{ background: '#f9fafb', padding: '50px 20px' }}>
          <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
            <h2 style={{ fontWeight: 800, fontSize: 28, marginBottom: 12 }}>Join as a Vendor or Service Provider</h2>
            <p style={{ color: '#666', fontSize: 15, maxWidth: 620, margin: '0 auto 40px', lineHeight: 1.7 }}>
              Get matched with customers looking for exactly what you offer — in your region.
              All payments are secured through escrow so you get paid reliably upon delivery.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginBottom: 40 }}>
              {[
                { icon: '🎯', title: 'Targeted Leads', desc: 'Only receive RFQs matching your category and location' },
                { icon: '🔐', title: 'Escrow Payments', desc: 'Guaranteed payment once delivery is confirmed by customer' },
                { icon: '📦', title: 'Sample Facilitation', desc: 'Ship to our office — we handle quality check and forwarding' },
                { icon: '🤝', title: 'Platform Support', desc: 'Dedicated support for onboarding, disputes, and logistics' },
                { icon: '🌐', title: 'Pan-India Reach', desc: 'Access customers across India beyond your local market' },
                { icon: '📊', title: 'Dashboard', desc: 'Track your RFQs, discussions, orders and payments in one place' },
              ].map(c => (
                <div key={c.title} style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: 10, padding: '24px 20px', textAlign: 'center' }}>
                  <div style={{ fontSize: 36, marginBottom: 12 }}>{c.icon}</div>
                  <h4 style={{ fontWeight: 700, fontSize: 14, marginBottom: 8 }}>{c.title}</h4>
                  <p style={{ fontSize: 12, color: '#666', lineHeight: 1.6 }}>{c.desc}</p>
                </div>
              ))}
            </div>

            <button onClick={() => setShowVendorModal(true)}
              style={{ background: '#7c3aed', color: '#fff', border: 'none', padding: '16px 48px', borderRadius: 8, fontWeight: 700, fontSize: 16, cursor: 'pointer', boxShadow: '0 4px 16px rgba(124,58,237,0.3)' }}>
              🏭 Apply to Become a Vendor
            </button>
            <p style={{ fontSize: 12, color: '#888', marginTop: 12 }}>Review within 48 hours. Free to join.</p>
          </div>
        </div>
      )}

      {/* Quick Contact */}
      <div style={{ padding: '36px 20px', textAlign: 'center', background: '#fff', borderTop: '1px solid #e5e5e5' }}>
        <p style={{ color: '#555', marginBottom: 16, fontSize: 15 }}>Prefer to talk directly?</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="tel:8073667950"><button style={{ background: '#2e6dce', color: '#fff', border: 'none', padding: '12px 28px', borderRadius: 6, fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>📞 8073667950</button></a>
          <a href="https://wa.me/918073667950" target="_blank" rel="noreferrer"><button style={{ background: '#25d366', color: '#fff', border: 'none', padding: '12px 28px', borderRadius: 6, fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>💬 WhatsApp Us</button></a>
        </div>
      </div>

      {/* FAQ */}
      <div style={{ padding: '50px 20px', maxWidth: 780, margin: '0 auto' }}>
        <h2 style={{ fontWeight: 800, fontSize: 24, marginBottom: 28, textAlign: 'center' }}>Frequently Asked Questions</h2>
        {faqs.map((f, i) => (
          <div key={i} style={{ border: '1px solid #e5e5e5', borderRadius: 8, marginBottom: 12, overflow: 'hidden' }}>
            <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
              style={{ width: '100%', background: openFaq === i ? '#f0f4fb' : '#fff', border: 'none', padding: '16px 20px', textAlign: 'left', fontWeight: 700, fontSize: 14, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
