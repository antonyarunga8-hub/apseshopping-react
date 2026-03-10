import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { useOrders, generateRFQ } from '../context/OrderContext';

const ESCROW_THRESHOLD = 100000; // ₹1,00,000 — below = platform escrow, above = external

const STAGES = [
  { id: 1, label: 'Submit Request',    icon: '📋', desc: 'One product/service per RFQ for best results' },
  { id: 2, label: 'Vendor Matching',   icon: '🔍', desc: 'Matched by region, category & availability' },
  { id: 3, label: 'Discussion',        icon: '💬', desc: 'Direct messaging with vendor on platform' },
  { id: 4, label: 'Sample Exchange',   icon: '📦', desc: 'Sample → our office → inspected → forwarded to you' },
  { id: 5, label: 'Finalize Bill',     icon: '🧾', desc: 'Discussion thread becomes the final invoice' },
  { id: 6, label: 'Escrow Payment',    icon: '🔐', desc: 'You pay platform (≤₹1L) or external escrow (>₹1L)' },
  { id: 7, label: 'Delivery',          icon: '🚚', desc: 'Full or installment delivery as agreed' },
  { id: 8, label: 'Fund Release',      icon: '✅', desc: 'Confirm delivery → funds released to vendor' },
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
  { q: 'Why one product per RFQ?', a: 'Each RFQ has its own dedicated discussion thread, vendor matching, sample process, and finalized bill. Keeping one product per RFQ ensures clean documentation, focused negotiation, and clear escrow tracking for each transaction. If you need multiple products, simply submit multiple RFQs.' },
  { q: 'How does the escrow work?', a: `For orders up to ₹1,00,000: funds are held by ApseShopping platform as escrow. For orders above ₹1,00,000: we connect you with a registered escrow service. In both cases, funds are only released to the vendor after you confirm delivery and satisfaction.` },
  { q: 'What happens with the discussion thread?', a: 'Every message, file, quote, and negotiation between you and the vendor is recorded in the RFQ discussion thread. When both parties agree, that thread becomes the legal basis for the final invoice and contract.' },
  { q: 'How does sample exchange work?', a: 'Vendor ships sample(s) to our Hubli office. We inspect for quality, photograph them with a timestamp, and ship them to you. You evaluate before committing to the full order.' },
  { q: 'What if I need multiple products from different vendors?', a: 'Submit a separate RFQ for each product. This gives you the best vendor match for each item and clean separate billing and escrow for each transaction.' },
  { q: 'Can delivery be in installments?', a: 'Yes. For large orders, delivery can happen in agreed installments. Escrow releases proportionally per installment as you confirm each delivery.' },
];

// ── RFQ Card (submitted) ─────────────────────────────────────────
function RFQCard({ rfq }) {
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState('');
  const { addRFQMessage, finalizeRFQInvoice, releaseRFQPayment } = useOrders();
  const { user } = useAuth();

  const statusColors = {
    open: '#f59e0b', matched: '#2e6dce', discussion: '#7c3aed',
    sample: '#0891b2', agreed: '#16a34a', invoiced: '#1d4ed8',
    paid: '#166534', delivered: '#059669', released: '#22c55e',
  };

  const handleSend = () => {
    if (!msg.trim()) return;
    addRFQMessage(rfq.rfqId, { from: 'customer', fromName: user?.name || 'You', message: msg });
    setMsg('');
  };

  const handleFinalize = () => {
    const amount = parseInt(prompt('Enter agreed total amount (₹):') || '0');
    if (!amount) return;
    finalizeRFQInvoice(rfq.rfqId, {
      description: rfq.productDesc,
      qty: rfq.qty,
      agreedAmount: amount,
      shipping: 0,
      totalAmount: amount,
      finalizedAt: new Date().toISOString(),
    });
  };

  const handleRelease = () => {
    const amount = parseInt(prompt(`Release how much? (Total: ₹${rfq.invoice?.totalAmount?.toLocaleString()})`)) || 0;
    if (!amount) return;
    releaseRFQPayment(rfq.rfqId, amount, 'Delivery confirmed by customer');
  };

  return (
    <div style={{ border: '1px solid #e5e5e5', borderRadius: 10, marginBottom: 16, overflow: 'hidden' }}>
      <div onClick={() => setOpen(o => !o)} style={{ padding: '16px 20px', background: '#f9fafb', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: open ? '1px solid #e5e5e5' : 'none' }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 14, color: '#1a1a2e', marginBottom: 3 }}>{rfq.rfqId} &nbsp;·&nbsp; {rfq.category}</div>
          <div style={{ fontSize: 12, color: '#666' }}>{rfq.productDesc?.slice(0, 80)}{rfq.productDesc?.length > 80 ? '...' : ''}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ background: (statusColors[rfq.status] || '#888') + '20', color: statusColors[rfq.status] || '#888', fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20, textTransform: 'uppercase' }}>{rfq.status}</span>
          {rfq.escrowType && (
            <span style={{ background: rfq.escrowType === 'platform' ? '#f0f4fb' : '#fef3c7', color: rfq.escrowType === 'platform' ? '#2e6dce' : '#d97706', fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20 }}>
              {rfq.escrowType === 'platform' ? '🔐 Platform Escrow' : '🏦 External Escrow'}
            </span>
          )}
          <span style={{ color: '#2e6dce' }}>{open ? '▲' : '▼'}</span>
        </div>
      </div>

      {open && (
        <div style={{ padding: '20px' }}>
          {/* Details */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 10, marginBottom: 20 }}>
            {[
              ['Category', rfq.category], ['Trade Type', rfq.tradeType], ['Qty', rfq.qty],
              ['Budget', rfq.budget || '—'], ['Location', `${rfq.location?.city}, ${rfq.location?.state}`],
              ['Deadline', rfq.deadline || '—'], ['Sample', rfq.sampleRequired ? 'Yes' : 'No'],
              ['Delivery', rfq.deliveryType],
            ].map(([k, v]) => (
              <div key={k} style={{ background: '#f9fafb', borderRadius: 6, padding: '8px 12px' }}>
                <div style={{ fontSize: 10, color: '#888', marginBottom: 2 }}>{k}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#333' }}>{v}</div>
              </div>
            ))}
          </div>

          {/* Invoice if finalized */}
          {rfq.invoice && (
            <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 8, padding: '14px 18px', marginBottom: 16 }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: '#166534', marginBottom: 8 }}>🧾 Finalized Invoice</div>
              <div style={{ fontSize: 13, color: '#333' }}>
                Amount: <strong style={{ color: '#2e6dce', fontSize: 16 }}>₹{rfq.invoice.totalAmount?.toLocaleString()}</strong>
                &nbsp;·&nbsp; Escrow: <strong>{rfq.escrowType === 'platform' ? 'ApseShopping Platform' : 'External Escrow Partner'}</strong>
                &nbsp;·&nbsp; Status: <strong style={{ color: rfq.escrowStatus === 'released' ? '#22c55e' : '#f59e0b' }}>{rfq.escrowStatus}</strong>
              </div>
              {rfq.payments.length > 0 && (
                <div style={{ marginTop: 8, fontSize: 12, color: '#555' }}>
                  Released: ₹{rfq.payments.reduce((s, p) => s + p.amount, 0).toLocaleString()} of ₹{rfq.invoice.totalAmount?.toLocaleString()}
                </div>
              )}
              {rfq.escrowStatus === 'held' && (
                <button onClick={handleRelease} style={{ marginTop: 10, background: '#22c55e', color: '#fff', border: 'none', padding: '8px 20px', borderRadius: 6, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                  ✅ Confirm Delivery & Release Payment
                </button>
              )}
            </div>
          )}

          {/* Discussion Thread */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: '#555', marginBottom: 10 }}>💬 Discussion Thread</div>
            <div style={{ background: '#f9fafb', borderRadius: 8, padding: '12px', minHeight: 80, maxHeight: 200, overflowY: 'auto', marginBottom: 10, border: '1px solid #eee' }}>
              {rfq.discussion.length === 0 ? (
                <div style={{ color: '#aaa', fontSize: 12, textAlign: 'center', paddingTop: 16 }}>No messages yet. Vendor will be assigned within 24 hours.</div>
              ) : (
                rfq.discussion.map(m => (
                  <div key={m.id} style={{ marginBottom: 10, display: 'flex', flexDirection: 'column', alignItems: m.from === 'customer' ? 'flex-end' : 'flex-start' }}>
                    <div style={{ background: m.from === 'customer' ? '#2e6dce' : '#fff', color: m.from === 'customer' ? '#fff' : '#333', border: '1px solid #e5e5e5', borderRadius: 8, padding: '8px 12px', maxWidth: '80%', fontSize: 13 }}>
                      {m.message}
                    </div>
                    <div style={{ fontSize: 10, color: '#aaa', marginTop: 3 }}>{m.fromName} · {new Date(m.timestamp).toLocaleString('en-IN')}</div>
                  </div>
                ))
              )}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <input value={msg} onChange={e => setMsg(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Type a message to vendor..." style={{ flex: 1, padding: '9px 12px', border: '1px solid #ddd', borderRadius: 6, fontSize: 13, outline: 'none' }} />
              <button onClick={handleSend} style={{ background: '#2e6dce', color: '#fff', border: 'none', padding: '9px 18px', borderRadius: 6, fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>Send</button>
            </div>
          </div>

          {/* Actions */}
          {rfq.status === 'discussion' && !rfq.invoice && (
            <button onClick={handleFinalize} style={{ background: '#166534', color: '#fff', border: 'none', padding: '10px 22px', borderRadius: 6, fontWeight: 700, fontSize: 13, cursor: 'pointer', marginTop: 8 }}>
              🧾 Finalize & Generate Invoice
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ── Vendor Registration Form ─────────────────────────────────────
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
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4, color: '#444' }}>Category *</label>
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
        <textarea name="desc" required value={form.desc} onChange={handleChange} rows={3}
          placeholder="What do you sell or offer? Brands, specialities, capacity..."
          style={{ width: '100%', padding: '9px 11px', border: '1px solid #ddd', borderRadius: 4, fontSize: 13, resize: 'vertical', boxSizing: 'border-box' }} />
      </div>
      <button type="submit" style={{ background: '#7c3aed', color: '#fff', border: 'none', padding: '12px', borderRadius: 4, fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
        🏭 Submit Vendor Application
      </button>
    </form>
  );
}

// ── Main RFQ Page ─────────────────────────────────────────────────
export default function RequestQuotePage() {
  const { user } = useAuth();
  const { submitRFQ, getRFQsByUser } = useOrders();
  const [activeTab, setActiveTab] = useState('customer');
  const [showVendorModal, setShowVendorModal] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedRFQ, setSubmittedRFQ] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);
  const [form, setForm] = useState({
    name: user?.name || '', company: '', phone: user?.phone || '', email: user?.email || '',
    tradeType: '', category: '', productDesc: '',
    qty: '', budget: '', deadline: '',
    state: '', city: '', pincode: '',
    sampleRequired: false, multipleVendors: false,
    deliveryType: 'full', message: '',
  });

  const myRFQs = user ? getRFQsByUser(user.id) : [];

  const handleChange = e => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm(f => ({ ...f, [e.target.name]: val }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    const rfq = generateRFQ({ form, userId: user?.id || 'guest' });
    submitRFQ(rfq);
    setSubmittedRFQ(rfq);
    setSubmitted(true);
  };

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
        <h1 style={{ fontSize: 40, fontWeight: 900, marginBottom: 12 }}>Request for Quote</h1>
        <p style={{ color: '#94a3b8', fontSize: 15, maxWidth: 640, margin: '0 auto 16px' }}>
          One product per RFQ — clean documentation, dedicated vendor discussion, transparent billing, and escrow-protected payment.
        </p>
        <div style={{ display: 'inline-flex', gap: 20, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 8, padding: '10px 24px', marginBottom: 28, fontSize: 13, color: '#94a3b8' }}>
          <span>🔐 ≤₹1L: <strong style={{ color: '#60a5fa' }}>Platform Escrow</strong></span>
          <span style={{ color: 'rgba(255,255,255,0.3)' }}>|</span>
          <span>🏦 >₹1L: <strong style={{ color: '#a78bfa' }}>External Escrow</strong></span>
        </div>
        <div style={{ display: 'flex', gap: 36, justifyContent: 'center', flexWrap: 'wrap' }}>
          {[['1 Product', 'Per RFQ'], ['24hr', 'Vendor Match'], ['100%', 'Escrow Protected'], ['All India', 'Coverage']].map(([n, l]) => (
            <div key={l} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#60a5fa' }}>{n}</div>
              <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 3 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div style={{ background: '#f8faff', padding: '52px 20px', borderBottom: '1px solid #e8eaf0' }}>
        <h2 style={{ fontWeight: 800, fontSize: 24, textAlign: 'center', marginBottom: 8 }}>How the RFQ Process Works</h2>
        <p style={{ color: '#666', textAlign: 'center', marginBottom: 36, fontSize: 13 }}>8 steps — request to fund release. Submit one RFQ per product for best results.</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 0, maxWidth: 1280, margin: '0 auto' }}>
          {STAGES.map((stage, i) => (
            <div key={stage.id} style={{ display: 'flex', alignItems: 'flex-start', flexShrink: 0 }}>
              <div style={{ textAlign: 'center', width: 130, padding: '0 4px' }}>
                <div style={{
                  width: 50, height: 50, borderRadius: '50%',
                  background: stage.id >= 6 ? (stage.id === 8 ? '#22c55e' : stage.id === 7 ? '#f59e0b' : '#7c3aed') : 'linear-gradient(135deg, #2e6dce, #1d56af)',
                  color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 22, margin: '0 auto 10px', boxShadow: '0 4px 12px rgba(46,109,206,0.2)',
                }}>
                  {stage.icon}
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#1a1a2e', marginBottom: 4 }}>{stage.label}</div>
                <div style={{ fontSize: 10, color: '#888', lineHeight: 1.5 }}>{stage.desc}</div>
              </div>
              {i < STAGES.length - 1 && <div style={{ fontSize: 18, color: '#2e6dce', marginTop: 14, flexShrink: 0 }}>→</div>}
            </div>
          ))}
        </div>

        {/* Escrow explainer */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, maxWidth: 820, margin: '36px auto 0' }}>
          <div style={{ background: 'linear-gradient(135deg, #1e40af, #2e6dce)', borderRadius: 10, padding: '20px 24px', color: '#fff' }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>🔐</div>
            <h4 style={{ fontWeight: 800, marginBottom: 6 }}>Platform Escrow (≤₹1,00,000)</h4>
            <p style={{ fontSize: 12, color: '#bfdbfe', lineHeight: 1.7 }}>
              For smaller transactions, ApseShopping holds the funds. Fast, simple, and free. Funds released on your confirmation.
            </p>
          </div>
          <div style={{ background: 'linear-gradient(135deg, #4c1d95, #7c3aed)', borderRadius: 10, padding: '20px 24px', color: '#fff' }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>🏦</div>
            <h4 style={{ fontWeight: 800, marginBottom: 6 }}>External Escrow (>₹1,00,000)</h4>
            <p style={{ fontSize: 12, color: '#e9d5ff', lineHeight: 1.7 }}>
              For larger transactions, we connect you with a registered escrow partner. Maximum security with legal backing.
            </p>
          </div>
        </div>
      </div>

      {/* Tab Switch */}
      <div style={{ background: '#fff', padding: '32px 20px 0', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', border: '1px solid #ddd', borderRadius: 8, overflow: 'hidden', marginBottom: 28 }}>
          {[['customer', '🛒 Submit RFQ (Customer)'], ['myRFQs', `📋 My RFQs${myRFQs.length ? ` (${myRFQs.length})` : ''}`], ['vendor', '🏭 Join as Vendor']].map(([key, label]) => (
            <button key={key} onClick={() => setActiveTab(key)}
              style={{ padding: '12px 24px', fontSize: 13, fontWeight: 700, border: 'none', cursor: 'pointer', background: activeTab === key ? '#2e6dce' : '#fff', color: activeTab === key ? '#fff' : '#555', transition: 'all 0.2s' }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Trade type cards */}
      {activeTab === 'customer' && (
        <div style={{ padding: '0 20px 24px', background: '#fff' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 12, maxWidth: 1100, margin: '0 auto' }}>
            {tradeTypes.map(t => (
              <div key={t.label} onClick={() => setForm(f => ({ ...f, tradeType: t.label }))}
                style={{ border: `2px solid ${form.tradeType === t.label ? '#2e6dce' : '#e5e5e5'}`, borderRadius: 10, padding: '14px 12px', cursor: 'pointer', background: form.tradeType === t.label ? '#f0f4fb' : '#fff', transition: 'all 0.2s', textAlign: 'center' }}>
                <div style={{ fontSize: 26, marginBottom: 6 }}>{t.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 12, marginBottom: 3 }}>{t.label}</div>
                <div style={{ fontSize: 11, color: '#666' }}>{t.desc}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Customer RFQ Form */}
      {activeTab === 'customer' && (
        <div style={{ background: '#f9fafb', padding: '40px 20px' }}>
          <div style={{ maxWidth: 820, margin: '0 auto' }}>
            {/* One product notice */}
            <div style={{ background: '#fef3c7', border: '1px solid #fcd34d', borderRadius: 8, padding: '12px 18px', marginBottom: 24, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <span style={{ fontSize: 20, flexShrink: 0 }}>💡</span>
              <div>
                <strong style={{ fontSize: 13, color: '#92400e' }}>Submit one product per RFQ.</strong>
                <span style={{ fontSize: 13, color: '#78350f' }}> This gives you a clean discussion thread, dedicated vendor, and separate escrow billing for each product. For multiple products, submit multiple RFQs.</span>
              </div>
            </div>

            <h2 style={{ fontWeight: 800, fontSize: 24, marginBottom: 6 }}>Submit Your Quote Request</h2>
            <p style={{ color: '#666', marginBottom: 28, fontSize: 14 }}>We'll match you with verified vendors in your region within 24 hours.</p>

            {submitted && submittedRFQ ? (
              <div style={{ background: '#fff', border: '2px solid #86efac', borderRadius: 12, padding: 40, textAlign: 'center' }}>
                <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
                <h3 style={{ fontWeight: 800, fontSize: 24, marginBottom: 10, color: '#166534' }}>RFQ Submitted!</h3>
                <p style={{ color: '#555', marginBottom: 6, fontSize: 14 }}>
                  RFQ ID: <strong style={{ color: '#2e6dce' }}>{submittedRFQ.rfqId}</strong> &nbsp;·&nbsp;
                  Category: <strong>{submittedRFQ.category}</strong>
                </p>
                <p style={{ color: '#777', fontSize: 13, marginBottom: 6 }}>
                  Vendor matching within 24 hours. We'll contact you at <strong>{form.phone}</strong>.
                </p>
                <div style={{ background: '#f0f4ff', borderRadius: 8, padding: '16px 20px', margin: '16px auto', maxWidth: 460, textAlign: 'left' }}>
                  <p style={{ fontWeight: 700, fontSize: 13, marginBottom: 10, color: '#1e40af' }}>Escrow info for this RFQ:</p>
                  <p style={{ fontSize: 13, color: '#555', lineHeight: 1.7 }}>
                    {parseInt(form.budget?.replace(/[^0-9]/g, '') || '0') > ESCROW_THRESHOLD
                      ? '🏦 Budget exceeds ₹1,00,000 — external escrow service will be used.'
                      : '🔐 Budget within ₹1,00,000 — ApseShopping platform escrow will be used.'}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 16, flexWrap: 'wrap' }}>
                  <button onClick={() => { setSubmitted(false); setSubmittedRFQ(null); setForm(f => ({ ...f, productDesc: '', qty: '', budget: '', deadline: '', message: '' })); }}
                    style={{ background: '#2e6dce', color: '#fff', border: 'none', padding: '12px 28px', borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
                    + Submit Another RFQ
                  </button>
                  <button onClick={() => setActiveTab('myRFQs')}
                    style={{ background: '#f0f4fb', border: '1px solid #dce8fb', color: '#2e6dce', padding: '12px 28px', borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
                    View My RFQs
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: 12, padding: '32px 28px', display: 'flex', flexDirection: 'column', gap: 22 }}>

                {/* Contact */}
                <div>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1a1a2e', marginBottom: 14, paddingBottom: 8, borderBottom: '1px solid #f0f0f0' }}>👤 Your Details</h3>
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
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1a1a2e', marginBottom: 14, paddingBottom: 8, borderBottom: '1px solid #f0f0f0' }}>📍 Delivery Location <span style={{ fontWeight: 400, fontSize: 12, color: '#888' }}>(used to match nearby vendors)</span></h3>
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

                {/* Product — ONE product only */}
                <div>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1a1a2e', marginBottom: 14, paddingBottom: 8, borderBottom: '1px solid #f0f0f0' }}>📦 Product / Service <span style={{ fontWeight: 400, fontSize: 12, color: '#e53e3e' }}>— ONE product per RFQ</span></h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                    <div>
                      <label style={labelStyle}>Category *</label>
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
                    <label style={labelStyle}>Product / Service Description * <span style={{ fontWeight: 400, fontSize: 11, color: '#888' }}>(be specific — brand, model, specs, color, size)</span></label>
                    <textarea name="productDesc" required value={form.productDesc} onChange={handleChange} rows={4}
                      placeholder="e.g. 'Bosch GSB 500W Electric Drill, Blue, 220V, with drill bits set' — or describe the service needed in detail."
                      style={{ ...inputStyle, resize: 'vertical' }} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
                    <div>
                      <label style={labelStyle}>Quantity / Units *</label>
                      <input name="qty" type="text" required value={form.qty} onChange={handleChange} placeholder="e.g. 50 units" style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Estimated Budget <span style={{ fontWeight: 400, fontSize: 11, color: '#888' }}>(determines escrow type)</span></label>
                      <input name="budget" type="text" value={form.budget} onChange={handleChange} placeholder="e.g. ₹50,000" style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Required By (Date)</label>
                      <input name="deadline" type="text" value={form.deadline} onChange={handleChange} placeholder="e.g. 15 April 2026" style={inputStyle} />
                    </div>
                  </div>
                  {/* Escrow indicator */}
                  {form.budget && (
                    <div style={{ marginTop: 10, padding: '8px 14px', borderRadius: 6, background: parseInt(form.budget.replace(/[^0-9]/g, '') || '0') > ESCROW_THRESHOLD ? '#f3e8ff' : '#f0f4ff', border: `1px solid ${parseInt(form.budget.replace(/[^0-9]/g, '') || '0') > ESCROW_THRESHOLD ? '#c4b5fd' : '#bfdbfe'}`, fontSize: 12, color: parseInt(form.budget.replace(/[^0-9]/g, '') || '0') > ESCROW_THRESHOLD ? '#6d28d9' : '#1e40af' }}>
                      {parseInt(form.budget.replace(/[^0-9]/g, '') || '0') > ESCROW_THRESHOLD
                        ? '🏦 Budget > ₹1,00,000 — External Escrow Partner will be used for this transaction.'
                        : '🔐 Budget ≤ ₹1,00,000 — ApseShopping Platform Escrow will be used.'}
                    </div>
                  )}
                </div>

                {/* Preferences */}
                <div>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1a1a2e', marginBottom: 14, paddingBottom: 8, borderBottom: '1px solid #f0f0f0' }}>⚙️ Preferences</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <label style={{ display: 'flex', alignItems: 'flex-start', gap: 12, cursor: 'pointer', background: '#f9fafb', border: '1px solid #e5e5e5', borderRadius: 8, padding: '12px 16px' }}>
                      <input type="checkbox" name="sampleRequired" checked={form.sampleRequired} onChange={handleChange} style={{ marginTop: 2, accentColor: '#2e6dce', width: 16, height: 16 }} />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 13 }}>📦 I want to inspect a sample first</div>
                        <div style={{ fontSize: 12, color: '#666', marginTop: 2 }}>Vendor ships to our Hubli office → we inspect & photo → forward to you before you commit to full order.</div>
                      </div>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'flex-start', gap: 12, cursor: 'pointer', background: '#f9fafb', border: '1px solid #e5e5e5', borderRadius: 8, padding: '12px 16px' }}>
                      <input type="checkbox" name="multipleVendors" checked={form.multipleVendors} onChange={handleChange} style={{ marginTop: 2, accentColor: '#2e6dce', width: 16, height: 16 }} />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 13 }}>🔍 Match me with multiple vendors to compare</div>
                        <div style={{ fontSize: 12, color: '#666', marginTop: 2 }}>Receive quotes from multiple verified sellers. Compare and choose the best.</div>
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

                <div>
                  <label style={labelStyle}>Additional Notes</label>
                  <textarea name="message" value={form.message} onChange={handleChange} rows={3}
                    placeholder="Any special packaging, certifications, colour preferences, or other requirements..."
                    style={{ ...inputStyle, resize: 'vertical' }} />
                </div>

                <button type="submit" style={{ background: 'linear-gradient(135deg, #2e6dce, #1d56af)', color: '#fff', border: 'none', padding: '16px', borderRadius: 8, fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>
                  📋 Submit RFQ — Get Vendor Matched
                </button>
                <p style={{ textAlign: 'center', fontSize: 12, color: '#999' }}>Free to submit. No commitment until you approve a quote. Escrow protects your payment.</p>
              </form>
            )}
          </div>
        </div>
      )}

      {/* My RFQs */}
      {activeTab === 'myRFQs' && (
        <div style={{ background: '#f9fafb', padding: '40px 20px' }}>
          <div style={{ maxWidth: 900, margin: '0 auto' }}>
            <h2 style={{ fontWeight: 800, fontSize: 24, marginBottom: 8 }}>My RFQs</h2>
            <p style={{ color: '#666', marginBottom: 24, fontSize: 14 }}>Track discussions, invoices, and escrow status for each of your requests.</p>
            {!user ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', background: '#fff', borderRadius: 12, border: '1px solid #e5e5e5' }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>🔒</div>
                <h3 style={{ fontWeight: 700, marginBottom: 8 }}>Login to view your RFQs</h3>
                <Link to="/login"><button style={{ background: '#2e6dce', color: '#fff', border: 'none', padding: '12px 28px', borderRadius: 6, fontWeight: 700, cursor: 'pointer' }}>Login</button></Link>
              </div>
            ) : myRFQs.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', background: '#fff', borderRadius: 12, border: '1px solid #e5e5e5' }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>📋</div>
                <h3 style={{ fontWeight: 700, marginBottom: 8 }}>No RFQs yet</h3>
                <button onClick={() => setActiveTab('customer')} style={{ background: '#2e6dce', color: '#fff', border: 'none', padding: '12px 28px', borderRadius: 6, fontWeight: 700, cursor: 'pointer' }}>Submit Your First RFQ</button>
              </div>
            ) : (
              myRFQs.map(rfq => <RFQCard key={rfq.rfqId} rfq={rfq} />)
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
              Get matched with customers looking for exactly what you sell — in your region. Payments secured through escrow.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 18, marginBottom: 36 }}>
              {[
                { icon: '🎯', title: 'Targeted Leads', desc: 'Only receive RFQs matching your category & region' },
                { icon: '🔐', title: 'Escrow Payments', desc: 'Guaranteed payment after confirmed delivery' },
                { icon: '📦', title: 'Sample Support', desc: 'We inspect & forward samples on your behalf' },
                { icon: '💬', title: 'Platform Chat', desc: 'Discuss, negotiate & finalize on our platform' },
                { icon: '🌐', title: 'Pan-India Reach', desc: 'Access customers across all states' },
                { icon: '📊', title: 'Dashboard', desc: 'Track RFQs, orders & payments in one place' },
              ].map(c => (
                <div key={c.title} style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: 10, padding: '20px 16px', textAlign: 'center' }}>
                  <div style={{ fontSize: 32, marginBottom: 10 }}>{c.icon}</div>
                  <h4 style={{ fontWeight: 700, fontSize: 13, marginBottom: 6 }}>{c.title}</h4>
                  <p style={{ fontSize: 12, color: '#666', lineHeight: 1.6 }}>{c.desc}</p>
                </div>
              ))}
            </div>
            <button onClick={() => setShowVendorModal(true)}
              style={{ background: '#7c3aed', color: '#fff', border: 'none', padding: '16px 48px', borderRadius: 8, fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>
              🏭 Apply to Become a Vendor
            </button>
          </div>
        </div>
      )}

      {/* Quick Contact */}
      <div style={{ padding: '32px 20px', textAlign: 'center', background: '#fff', borderTop: '1px solid #e5e5e5' }}>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="tel:8073667950"><button style={{ background: '#2e6dce', color: '#fff', border: 'none', padding: '12px 28px', borderRadius: 6, fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>📞 8073667950</button></a>
          <a href="https://wa.me/918073667950" target="_blank" rel="noreferrer"><button style={{ background: '#25d366', color: '#fff', border: 'none', padding: '12px 28px', borderRadius: 6, fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>💬 WhatsApp Us</button></a>
        </div>
      </div>

      {/* FAQ */}
      <div style={{ padding: '48px 20px', maxWidth: 780, margin: '0 auto' }}>
        <h2 style={{ fontWeight: 800, fontSize: 24, marginBottom: 28, textAlign: 'center' }}>Frequently Asked Questions</h2>
        {faqs.map((f, i) => (
          <div key={i} style={{ border: '1px solid #e5e5e5', borderRadius: 8, marginBottom: 10, overflow: 'hidden' }}>
            <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
              style={{ width: '100%', background: openFaq === i ? '#f0f4fb' : '#fff', border: 'none', padding: '16px 20px', textAlign: 'left', fontWeight: 700, fontSize: 14, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              {f.q}<span style={{ color: '#2e6dce', fontSize: 20, fontWeight: 400 }}>{openFaq === i ? '−' : '+'}</span>
            </button>
            {openFaq === i && <div style={{ padding: '4px 20px 18px', fontSize: 13, color: '#555', lineHeight: 1.7, background: '#f9fbff' }}>{f.a}</div>}
          </div>
        ))}
      </div>
    </Layout>
  );
}
