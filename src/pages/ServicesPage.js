import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';

// ── 25 Affiliate / Niche Websites ─────────────────────────────────
// Replace slugs, urls, and names with real ones when ready
const affiliateSites = [
  { id: 1,  name: 'ApseElectronics',      niche: 'Electronics',             icon: '📱', url: '/affiliate/electronics',       color: '#2e6dce' },
  { id: 2,  name: 'ApseFashion',          niche: "Women's Fashion",          icon: '👗', url: '/affiliate/womens-fashion',    color: '#ec4899' },
  { id: 3,  name: 'ApseMenWear',          niche: "Men's Fashion",            icon: '👔', url: '/affiliate/mens-fashion',      color: '#1d4ed8' },
  { id: 4,  name: 'ApseKitchen',          niche: 'Kitchen & Cookware',       icon: '🍳', url: '/affiliate/kitchen',           color: '#f59e0b' },
  { id: 5,  name: 'ApseFurniture',        niche: 'Furniture',                icon: '🛋️', url: '/affiliate/furniture',         color: '#92400e' },
  { id: 6,  name: 'ApseJewellery',        niche: 'Imitation Jewellery',      icon: '💍', url: '/affiliate/jewellery',         color: '#7c3aed' },
  { id: 7,  name: 'ApseFood',             niche: 'Food Products',            icon: '🍫', url: '/affiliate/food',              color: '#dc2626' },
  { id: 8,  name: 'ApseCleaning',         niche: 'Cleaning Products',        icon: '🧺', url: '/affiliate/cleaning',          color: '#0891b2' },
  { id: 9,  name: 'ApseStationery',       niche: 'Stationery',               icon: '📝', url: '/affiliate/stationery',        color: '#65a30d' },
  { id: 10, name: 'ApseMedical',          niche: 'Medical & Surgical',       icon: '🏥', url: '/affiliate/medical',           color: '#ef4444' },
  { id: 11, name: 'ApseAgriculture',      niche: 'Agriculture',              icon: '🌾', url: '/affiliate/agriculture',       color: '#16a34a' },
  { id: 12, name: 'ApseFootwear',         niche: 'Footwear',                 icon: '👟', url: '/affiliate/footwear',          color: '#d97706' },
  { id: 13, name: 'ApseTableware',        niche: 'Tableware',                icon: '🍽️', url: '/affiliate/tableware',         color: '#0284c7' },
  { id: 14, name: 'ApseHomeAppliances',   niche: 'Home Appliances',          icon: '🏠', url: '/affiliate/home-appliances',   color: '#7c3aed' },
  { id: 15, name: 'ApseBodyCare',         niche: 'Body Cleansers',           icon: '🧴', url: '/affiliate/body-care',         color: '#db2777' },
  { id: 16, name: 'ApseWaterBottle',      niche: 'Water Bottles',            icon: '🧊', url: '/affiliate/water-bottle',      color: '#0ea5e9' },
  { id: 17, name: 'ApseHelmet',           niche: 'Helmets & Safety',         icon: '⛑️', url: '/affiliate/helmet',            color: '#b45309' },
  { id: 18, name: 'ApseUPS',              niche: 'UPS & Battery',            icon: '🔋', url: '/affiliate/ups-battery',       color: '#475569' },
  { id: 19, name: 'ApseImportExport',     niche: 'Import & Export',          icon: '🌐', url: '/import-export',               color: '#1e40af' },
  { id: 20, name: 'ApseWholesale',        niche: 'Wholesale',                icon: '📦', url: '/wholesale',                   color: '#166534' },
  { id: 21, name: 'ApsePreOwned',         niche: 'Pre-Owned Products',       icon: '♻️', url: '/services#preowned',           color: '#78716c' },
  { id: 22, name: 'ApseServices',         niche: 'Repair & Services',        icon: '🔧', url: '/services#repair',             color: '#0f766e' },
  { id: 23, name: 'ApseTradeIn',          niche: 'Trade-In & Exchange',      icon: '🔄', url: '/services#tradein',            color: '#7e22ce' },
  { id: 24, name: 'ApseB2B',             niche: 'B2B Procurement',          icon: '🏭', url: '/request-quote',               color: '#1d4ed8' },
  { id: 25, name: 'ApseGeneral',          niche: 'General Products',         icon: '🛍️', url: '/retail',                      color: '#374151' },
];

const services = [
  { icon: '🔧', title: 'Equipment Repair & Servicing', id: 'repair',
    desc: 'Professional repair and maintenance for electronics, kitchen appliances, home appliances, and commercial equipment.',
    features: ['Certified technicians', 'Warranty on repairs', 'Pickup & drop service', 'Transparent pricing'], badge: 'Popular' },
  { icon: '📦', title: 'Pre-Owned Products', id: 'preowned',
    desc: 'Thoroughly inspected and refurbished second-hand products at a fraction of the original price.',
    features: ['Graded quality (A/B/C)', '30-day return policy', 'Verified condition', 'Includes accessories'], badge: 'Best Value' },
  { icon: '🚚', title: 'Delivery & Logistics', id: 'logistics',
    desc: 'Fast and reliable delivery services across Karnataka and major Indian cities with real-time tracking.',
    features: ['Same-day delivery (Hubli)', 'Pan-India shipping', 'Live tracking', 'Insured shipments'], badge: null },
  { icon: '🤝', title: 'Trade-In & Exchange', id: 'tradein',
    desc: 'Trade in your old electronics, appliances or devices and get instant credit toward a new purchase.',
    features: ['Instant valuation', 'Best trade-in prices', 'Any brand accepted', 'Eco-friendly recycling'], badge: 'New' },
  { icon: '🏭', title: 'B2B Procurement', id: 'b2b',
    desc: 'End-to-end procurement services for businesses — sourcing, vendor management, and supply chain support.',
    features: ['Dedicated account manager', 'Multi-vendor sourcing', 'Regular supply contracts', 'Volume discounts'], badge: null },
  { icon: '📋', title: 'Product Inspection', id: 'inspection',
    desc: 'Third-party inspection and quality assurance for bulk orders, imports, and pre-owned purchases.',
    features: ['Pre-shipment inspection', 'Factory audits', 'Lab testing', 'Certification support'], badge: null },
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

// ── Affiliate Sidebar ─────────────────────────────────────────────
function AffiliateSidebar({ isOpen, onClose, user }) {
  const [search, setSearch] = useState('');
  const filtered = affiliateSites.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.niche.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {/* Overlay */}
      {isOpen && <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000 }} />}

      {/* Drawer */}
      <div style={{
        position: 'fixed', left: 0, top: 0, bottom: 0, width: 300,
        background: '#fff', zIndex: 1001, boxShadow: '4px 0 24px rgba(0,0,0,0.18)',
        transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.3s ease', display: 'flex', flexDirection: 'column',
      }}>
        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg, #1a1a2e, #0f3460)', padding: '20px 16px', color: '#fff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div>
              <h3 style={{ fontWeight: 800, fontSize: 16, margin: 0 }}>🌐 Apse Network</h3>
              <p style={{ fontSize: 11, color: '#94a3b8', margin: '3px 0 0' }}>25 Affiliate Platforms</p>
            </div>
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 22, cursor: 'pointer' }}>×</button>
          </div>

          {/* User status */}
          {user ? (
            <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 6, padding: '8px 12px', fontSize: 12 }}>
              <span style={{ color: '#86efac' }}>✓ Logged in as </span>
              <strong style={{ color: '#fff' }}>{user.name}</strong>
              <span style={{ color: '#94a3b8' }}> — All 25 platforms accessible</span>
            </div>
          ) : (
            <div style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 6, padding: '8px 12px', fontSize: 12 }}>
              <span style={{ color: '#fca5a5' }}>⚠️ </span>
              <span style={{ color: '#fef2f2' }}>Login to access all platforms. </span>
              <Link to="/login" onClick={onClose} style={{ color: '#60a5fa', fontWeight: 700 }}>Login →</Link>
            </div>
          )}

          {/* Search */}
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search platforms..."
            style={{ width: '100%', marginTop: 10, padding: '8px 12px', border: 'none', borderRadius: 6, fontSize: 13, boxSizing: 'border-box', outline: 'none' }}
          />
        </div>

        {/* Site List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
          {filtered.map(site => (
            <Link
              key={site.id}
              to={user ? site.url : '/login'}
              onClick={onClose}
              style={{ textDecoration: 'none' }}
            >
              <div style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '11px 16px',
                borderBottom: '1px solid #f5f5f5', cursor: 'pointer', transition: 'background 0.15s',
              }}
                onMouseEnter={e => e.currentTarget.style.background = '#f8faff'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                {/* Icon circle */}
                <div style={{
                  width: 38, height: 38, borderRadius: '50%', flexShrink: 0,
                  background: site.color + '18', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: 18, border: `1px solid ${site.color}30`,
                }}>
                  {site.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#1a1a2e' }}>{site.name}</div>
                  <div style={{ fontSize: 11, color: '#888' }}>{site.niche}</div>
                </div>
                {!user && <span style={{ fontSize: 14, color: '#ccc' }}>🔒</span>}
                {user && <span style={{ fontSize: 12, color: site.color }}>→</span>}
              </div>
            </Link>
          ))}
        </div>

        {/* Footer */}
        <div style={{ padding: '12px 16px', borderTop: '1px solid #eee', background: '#f9fafb', fontSize: 11, color: '#888', textAlign: 'center' }}>
          {user ? `All ${affiliateSites.length} platforms unlocked` : `Login to unlock all ${affiliateSites.length} platforms`}
        </div>
      </div>
    </>
  );
}

export default function ServicesPage() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tradeInForm, setTradeInForm] = useState({ name: '', phone: '', product: '', condition: '', expectedPrice: '' });
  const [tradeSubmitted, setTradeSubmitted] = useState(false);
  const handleChange = e => setTradeInForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const handleSubmit = e => { e.preventDefault(); setTradeSubmitted(true); };

  return (
    <Layout>
      <AffiliateSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} user={user} />

      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #134e4a 0%, #065f46 50%, #047857 100%)', color: '#fff', padding: '60px 20px 48px', textAlign: 'center', position: 'relative' }}>
        {/* Open Sidebar Button */}
        <button
          onClick={() => setSidebarOpen(true)}
          style={{
            position: 'absolute', left: 20, top: 20,
            background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.4)',
            padding: '10px 18px', borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
          🌐 Apse Network <span style={{ fontSize: 11, background: 'rgba(255,255,255,0.2)', padding: '2px 6px', borderRadius: 4 }}>25</span>
        </button>

        <span style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', padding: '5px 18px', borderRadius: 20, fontSize: 12, fontWeight: 700, display: 'inline-block', marginBottom: 18 }}>SERVICES &amp; PRE-OWNED</span>
        <h1 style={{ fontSize: 40, fontWeight: 900, marginBottom: 12 }}>Services &amp; Pre Owned</h1>
        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 16, maxWidth: 580, margin: '0 auto 32px' }}>
          Professional services, quality pre-owned products, and access to our global affiliate network — all under one roof.
        </p>

        {/* Affiliate Network Banner */}
        <div
          onClick={() => setSidebarOpen(true)}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 12, background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.3)', borderRadius: 12, padding: '14px 24px',
            cursor: 'pointer', marginBottom: 32, transition: 'background 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.18)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
        >
          <div style={{ display: 'flex', gap: -4 }}>
            {affiliateSites.slice(0, 6).map(s => (
              <div key={s.id} style={{ width: 32, height: 32, borderRadius: '50%', background: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, border: '2px solid rgba(255,255,255,0.5)', marginLeft: -6 }}>
                {s.icon}
              </div>
            ))}
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#fff', border: '2px solid rgba(255,255,255,0.5)', marginLeft: -6 }}>
              +19
            </div>
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontWeight: 700, fontSize: 14 }}>Access 25 Affiliate Platforms</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.75)' }}>{user ? 'All platforms unlocked for you' : 'Login required for full access'}</div>
          </div>
          <span style={{ fontSize: 18 }}>→</span>
        </div>

        <div style={{ display: 'flex', gap: 40, justifyContent: 'center', flexWrap: 'wrap' }}>
          {[['25', 'Affiliate Platforms'], ['500+', 'Happy Customers'], ['30-day', 'Return Policy'], ['Same Day', 'Hubli Delivery']].map(([n, l]) => (
            <div key={l} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#6ee7b7' }}>{n}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', marginTop: 3 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Affiliate Grid Preview */}
      <div style={{ background: '#f0fdf4', padding: '40px 20px', borderBottom: '1px solid #d1fae5' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h2 style={{ fontWeight: 800, fontSize: 22, margin: 0, color: '#065f46' }}>🌐 Our Affiliate Network</h2>
              <p style={{ color: '#6b7280', fontSize: 13, marginTop: 4 }}>{user ? 'Click any platform to access it' : 'Login to unlock all 25 platforms'}</p>
            </div>
            <button onClick={() => setSidebarOpen(true)} style={{ background: '#065f46', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 6, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
              View All 25 →
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 12 }}>
            {affiliateSites.map(site => (
              <Link key={site.id} to={user ? site.url : '/login'} style={{ textDecoration: 'none' }}>
                <div style={{
                  background: '#fff', border: `1px solid ${site.color}30`, borderRadius: 10,
                  padding: '14px 10px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s',
                  position: 'relative',
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 4px 16px ${site.color}30`; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
                >
                  {!user && <span style={{ position: 'absolute', top: 6, right: 8, fontSize: 10 }}>🔒</span>}
                  <div style={{ fontSize: 28, marginBottom: 6 }}>{site.icon}</div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#1a1a2e', lineHeight: 1.3 }}>{site.name}</div>
                  <div style={{ fontSize: 10, color: site.color, marginTop: 3, fontWeight: 600 }}>{site.niche}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div style={{ padding: '56px 20px 40px' }}>
        <h2 style={{ fontWeight: 800, fontSize: 26, textAlign: 'center', marginBottom: 8 }}>Our Services</h2>
        <p style={{ color: '#666', textAlign: 'center', marginBottom: 36, fontSize: 14 }}>Everything you need — buying, selling, repairing, or trading</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
          {services.map(s => (
            <div key={s.id} id={s.id} style={{ border: '1px solid #e5e5e5', borderRadius: 12, padding: '24px 22px', background: '#fff', position: 'relative' }}>
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
              <Link to="/request-quote">
                <button style={{ marginTop: 20, width: '100%', background: '#f0f4fb', border: '1px solid #dce8fb', color: '#2e6dce', padding: '10px', borderRadius: 6, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                  Request Quote →
                </button>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Pre-Owned */}
      <div id="preowned" style={{ background: '#f9fafb', padding: '56px 20px' }}>
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

      {/* Trade-In */}
      <div id="tradein" style={{ padding: '56px 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 48, maxWidth: 1000, margin: '0 auto', alignItems: 'center' }}>
          <div>
            <span style={{ background: '#fef3c7', color: '#d97706', padding: '4px 14px', borderRadius: 20, fontSize: 12, fontWeight: 700 }}>TRADE-IN PROGRAM</span>
            <h2 style={{ fontWeight: 800, fontSize: 26, margin: '16px 0 12px' }}>Got an old device? Trade it in!</h2>
            <p style={{ color: '#555', lineHeight: 1.7, marginBottom: 20 }}>
              We accept old electronics, appliances, and gadgets. Get a fair valuation instantly and use the credit toward your next purchase.
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
                    <input name={f.name} type="text" required={f.label.includes('*')}
                      value={tradeInForm[f.name]} onChange={handleChange} placeholder={f.placeholder}
                      style={{ width: '100%', padding: '9px 12px', border: '1px solid #ddd', borderRadius: 5, fontSize: 13, boxSizing: 'border-box' }} />
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
          <button onClick={() => setSidebarOpen(true)} style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.4)', padding: '12px 28px', borderRadius: 6, fontWeight: 700, cursor: 'pointer' }}>🌐 Browse Network</button>
        </div>
      </div>
    </Layout>
  );
}
