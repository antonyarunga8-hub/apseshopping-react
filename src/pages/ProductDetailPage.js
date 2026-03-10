import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useCart } from '../context/CartContext';

// ── Shared product DB (import from here in future) ───────────────
export const ALL_PRODUCTS = [
  { id: 'P66C4CDF72B546', name: 'Canon R100 Mirrorless Camera RF-S 18-45mm F/4.5-6.3 IS STM', img: '/product_img/P66C4CDF72B546/PIMG-066c4cdf72bfbe.png', oldPrice: 10000, newPrice: 8000, rating: 4, category: 'digital-camera', cats: ['Electronics','Cameras'], weightKg: 0.7, brand: 'Canon', desc: 'The EOS R100 is Canon\'s entry-level mirrorless camera featuring a 24.1MP APS-C CMOS sensor, DIGIC 8 processor, and the versatile RF-S 18-45mm kit lens. Ideal for beginners and vloggers.', specs: [['Sensor','24.1MP APS-C CMOS'],['Processor','DIGIC 8'],['ISO Range','100–6400'],['Video','4K UHD'],['Weight','356g'],['Battery Life','~240 shots']], sku: 'CAN-R100-1845' },
  { id: 'P66C4D9FBB8CB0', name: 'SONY Alpha ILCE-6600M APS-C Mirrorless Camera With 18-135mm Zoom', img: '/product_img/P66C4D9FBB8CB0/PIMG-066c4d9fbb97ae.jpg', oldPrice: 15000, newPrice: 13000, rating: 5, category: 'digital-camera', cats: ['Electronics','Cameras'], weightKg: 0.8, brand: 'Sony', desc: 'The α6600 is Sony\'s flagship APS-C mirrorless camera with 24.2MP sensor, 5-axis in-body stabilisation, and fast AF with 425 phase-detection points. The 18-135mm zoom covers a versatile range.', specs: [['Sensor','24.2MP Exmor CMOS'],['Stabilisation','5-axis in-body'],['AF Points','425 phase-detect'],['Video','4K HDR'],['Weight','503g'],['Battery Life','~810 shots']], sku: 'SNY-6600M-18135' },
  { id: 'DEMO001', name: 'Android Smartphone 128GB — Dual SIM Fast Charging', img: null, emoji: '📱', oldPrice: 18000, newPrice: 14999, rating: 4, cats: ['Electronics','Mobiles'], weightKg: 0.2, brand: 'ApseBrand', desc: 'Powerful Android smartphone with 6.67" FHD+ display, 5000mAh battery, 64MP triple camera, and 33W fast charging. Comes with 128GB internal storage and expandable memory.', specs: [['Display','6.67" FHD+ AMOLED'],['Processor','Octa-core 2.4GHz'],['RAM/Storage','6GB / 128GB'],['Camera','64MP triple'],['Battery','5000mAh + 33W'],['OS','Android 14']], sku: 'DEMO-MOB-001' },
  { id: 'DEMO002', name: 'Bluetooth Earphones — Active Noise Cancelling Pro', img: null, emoji: '🎧', oldPrice: 3500, newPrice: 2499, rating: 4, cats: ['Electronics','Accessories'], weightKg: 0.3, brand: 'ApseBrand', desc: 'Premium over-ear Bluetooth headphones with 40dB active noise cancellation, 30hr playtime, and Hi-Res audio. Foldable design with quick-charge (10min = 3hr).', specs: [['Driver','40mm dynamic'],['ANC','Up to 40dB'],['Battery','30 hours'],['Charging','USB-C quick charge'],['Connectivity','Bluetooth 5.2'],['Weight','250g']], sku: 'DEMO-EAR-002' },
  { id: 'DEMO003', name: 'Power Bank 20000mAh — 65W Fast Charge PD', img: null, emoji: '🔋', oldPrice: 2000, newPrice: 1299, rating: 4, cats: ['Electronics','Accessories'], weightKg: 0.45, brand: 'ApseBrand', desc: 'Ultra-capacity 20000mAh power bank with 65W Power Delivery output. Charges laptops, tablets, and phones at full speed. Dual USB-A + USB-C ports with LED display.', specs: [['Capacity','20000mAh'],['Output','65W PD'],['Ports','USB-C + 2×USB-A'],['Input','USB-C 45W'],['Display','LED charge %'],['Weight','445g']], sku: 'DEMO-PB-003' },
  { id: 'DEMO004', name: 'Smart Watch Fitness Tracker — Heart Rate & GPS', img: null, emoji: '⌚', oldPrice: 5000, newPrice: 3799, rating: 3, cats: ['Electronics','Accessories'], weightKg: 0.05, brand: 'ApseBrand', desc: 'Feature-packed smartwatch with built-in GPS, continuous heart rate monitor, SpO2 tracking, 5ATM water resistance, and 14-day battery. Compatible with iOS and Android.', specs: [['Display','1.43" AMOLED'],['GPS','Built-in'],['Sensors','HR, SpO2, stress'],['Water Resistance','5ATM'],['Battery','14 days'],['Compatibility','iOS & Android']], sku: 'DEMO-SW-004' },
  { id: 'DEMO005', name: 'Mixer Grinder 750W — 3 Stainless Steel Jars', img: null, emoji: '🍳', oldPrice: 3200, newPrice: 2199, rating: 4, cats: ['Home Appliances'], weightKg: 3.5, brand: 'ApseBrand', desc: 'Powerful 750W mixer grinder with 3 stainless steel jars (1.5L, 1L, 0.5L). Features 4-speed control, overload protection, and ABS body. Ideal for Indian cooking.', specs: [['Power','750W'],['Speed','4 settings + pulse'],['Jars','1.5L + 1L + 0.5L'],['Material','Stainless steel'],['Safety','Overload protection'],['Warranty','2 years']], sku: 'DEMO-MG-005' },
  { id: 'DEMO006', name: 'Tripod Stand Professional — 62" Aluminium', img: null, emoji: '📷', oldPrice: 1800, newPrice: 999, rating: 4, cats: ['Electronics','Cameras','Accessories'], weightKg: 1.2, brand: 'ApseBrand', desc: '62" professional aluminium tripod with 360° ball head, quick-release plate, and bubble level. Supports cameras up to 5kg. Compact carry bag included.', specs: [['Max Height','62" / 158cm'],['Material','Aluminium alloy'],['Head','360° ball head'],['Max Load','5kg'],['Min Height','20cm'],['Weight','1.15kg']], sku: 'DEMO-TRP-006' },
  { id: 'DEMO007', name: 'USB-C Fast Charging Cable 3m — Braided', img: null, emoji: '🔌', oldPrice: 599, newPrice: 349, rating: 5, cats: ['Electronics','Accessories'], weightKg: 0.1, brand: 'ApseBrand', desc: '3-metre braided nylon USB-C to USB-C cable supporting 100W power delivery and USB 3.1 Gen 2 data transfer (10Gbps). Tested for 30,000+ bends.', specs: [['Length','3 metres'],['Power Delivery','100W'],['Data Speed','10Gbps USB 3.1'],['Material','Braided nylon'],['Durability','30,000+ bends'],['Compatibility','Universal USB-C']], sku: 'DEMO-CBL-007' },
  { id: 'DEMO008', name: 'Memory Card 128GB Class 10 UHS-I', img: null, emoji: '💾', oldPrice: 1200, newPrice: 699, rating: 4, cats: ['Electronics','Accessories'], weightKg: 0.01, brand: 'ApseBrand', desc: '128GB microSDXC card with Class 10 / UHS-I rating. Read up to 100MB/s, write up to 90MB/s. Ideal for 4K video recording on action cameras, smartphones, and drones. Adapter included.', specs: [['Capacity','128GB'],['Read Speed','100MB/s'],['Write Speed','90MB/s'],['Class','Class 10 / UHS-I'],['Form Factor','microSDXC + adapter'],['Warranty','Lifetime limited']], sku: 'DEMO-MC-008' },
];

function Stars({ n, size = 14 }) {
  return (
    <div style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
      {[1,2,3,4,5].map(i => (
        <i key={i} className={i <= n ? 'fas fa-star' : 'far fa-star'} style={{ fontSize: size, color: i <= n ? '#f59e0b' : '#ddd' }} />
      ))}
      <span style={{ fontSize: 12, color: '#888', marginLeft: 6 }}>({n}.0)</span>
    </div>
  );
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeTab, setActiveTab] = useState('desc');

  const product = ALL_PRODUCTS.find(p => p.id === id);

  if (!product) {
    return (
      <Layout>
        <div style={{ textAlign: 'center', padding: '80px 20px' }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🔍</div>
          <h2 style={{ fontWeight: 700, marginBottom: 8 }}>Product not found</h2>
          <p style={{ color: '#666', marginBottom: 24 }}>This product may have been removed or the link is incorrect.</p>
          <Link to="/retail"><button style={{ background: '#2e6dce', color: '#fff', border: 'none', padding: '12px 32px', borderRadius: 6, fontWeight: 700, cursor: 'pointer' }}>Browse Products</button></Link>
        </div>
      </Layout>
    );
  }

  const discount = Math.round(((product.oldPrice - product.newPrice) / product.oldPrice) * 100);
  const savings = product.oldPrice - product.newPrice;
  const related = ALL_PRODUCTS.filter(p => p.id !== product.id && p.cats?.some(c => product.cats?.includes(c))).slice(0, 4);

  const handleAddToCart = () => {
    addToCart({ ...product, qty: 1 }, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  const handleBuyNow = () => {
    addToCart({ ...product, qty: 1 }, qty);
    navigate('/checkout');
  };

  return (
    <Layout>
      {/* Breadcrumb */}
      <div style={{ background: '#f9fafb', padding: '10px 24px', fontSize: 12, color: '#888', borderBottom: '1px solid #eee' }}>
        <Link to="/" style={{ color: '#2e6dce', textDecoration: 'none' }}>Home</Link>
        {' / '}
        <Link to="/retail" style={{ color: '#2e6dce', textDecoration: 'none' }}>Retail</Link>
        {product.cats?.[0] && <><span> / </span><Link to={`/category/${product.cats[0].toLowerCase()}`} style={{ color: '#2e6dce', textDecoration: 'none' }}>{product.cats[0]}</Link></>}
        {' / '}
        <span style={{ color: '#333' }}>{product.name.slice(0, 50)}{product.name.length > 50 ? '...' : ''}</span>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '28px 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'start', marginBottom: 40 }}>

          {/* Image */}
          <div>
            <div style={{ background: '#f9f9f9', borderRadius: 10, border: '1px solid #eee', height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
              <span style={{ position: 'absolute', top: 14, left: 14, background: '#e53e3e', color: '#fff', fontSize: 12, fontWeight: 700, padding: '4px 10px', borderRadius: 4 }}>{discount}% OFF</span>
              {product.img
                ? <img src={product.img} alt={product.name} style={{ maxHeight: 360, maxWidth: '90%', objectFit: 'contain' }} onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
                : null}
              <div style={{ fontSize: 120, display: product.img ? 'none' : 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
                {product.emoji || '🛍️'}
              </div>
            </div>
            {/* Thumbnail row placeholder */}
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              {[1,2,3].map(i => (
                <div key={i} style={{ width: 72, height: 72, background: '#f0f0f0', borderRadius: 6, border: '2px solid ' + (i === 1 ? '#2e6dce' : '#eee'), display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 28 }}>
                  {product.emoji || '🛍️'}
                </div>
              ))}
            </div>
          </div>

          {/* Info */}
          <div>
            {product.brand && <div style={{ fontSize: 12, color: '#2e6dce', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>{product.brand}</div>}
            <h1 style={{ fontSize: 22, fontWeight: 800, color: '#1a1a2e', lineHeight: 1.4, marginBottom: 12 }}>{product.name}</h1>
            <Stars n={product.rating} size={16} />

            {/* Price block */}
            <div style={{ background: '#f0f4ff', borderRadius: 8, padding: '16px 20px', margin: '18px 0' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 6 }}>
                <span style={{ fontSize: 32, fontWeight: 900, color: '#1d4ed8' }}>₹{product.newPrice.toLocaleString()}</span>
                <span style={{ fontSize: 16, color: '#999', textDecoration: 'line-through' }}>₹{product.oldPrice.toLocaleString()}</span>
                <span style={{ background: '#fee2e2', color: '#dc2626', fontSize: 13, fontWeight: 700, padding: '2px 8px', borderRadius: 4 }}>SAVE ₹{savings.toLocaleString()}</span>
              </div>
              <div style={{ fontSize: 12, color: '#16a34a', fontWeight: 600 }}>✅ Inclusive of all taxes &nbsp;·&nbsp; Free shipping above ₹10,000</div>
            </div>

            {/* SKU */}
            <div style={{ fontSize: 12, color: '#999', marginBottom: 16 }}>SKU: <span style={{ color: '#555' }}>{product.sku}</span> &nbsp;·&nbsp; Weight: <span style={{ color: '#555' }}>{product.weightKg}kg</span></div>

            {/* Qty + Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: 6, overflow: 'hidden' }}>
                <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ padding: '10px 16px', background: '#f9f9f9', border: 'none', cursor: 'pointer', fontSize: 16, fontWeight: 700, color: '#444' }}>−</button>
                <span style={{ padding: '10px 20px', fontWeight: 700, fontSize: 15 }}>{qty}</span>
                <button onClick={() => setQty(q => q + 1)} style={{ padding: '10px 16px', background: '#f9f9f9', border: 'none', cursor: 'pointer', fontSize: 16, fontWeight: 700, color: '#444' }}>+</button>
              </div>
              <span style={{ fontSize: 12, color: '#22c55e', fontWeight: 600 }}>✅ In Stock</span>
            </div>

            <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
              <button onClick={handleAddToCart}
                style={{ flex: 1, background: added ? '#22c55e' : '#333', color: '#fff', border: 'none', padding: '14px', borderRadius: 6, fontWeight: 700, fontSize: 15, cursor: 'pointer', transition: 'background 0.2s' }}>
                {added ? '✓ Added to Cart!' : '🛒 Add to Cart'}
              </button>
              <button onClick={handleBuyNow}
                style={{ flex: 1, background: '#2e6dce', color: '#fff', border: 'none', padding: '14px', borderRadius: 6, fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>
                ⚡ Buy Now
              </button>
            </div>

            {/* Trust badges */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {[['🚚','Free Delivery above ₹10,000'],['↩️','Easy 7-day returns'],['🔒','Secure payments'],['📞','24/7 support']].map(([icon, label]) => (
                <div key={label} style={{ background: '#f9fafb', border: '1px solid #eee', borderRadius: 6, padding: '8px 12px', display: 'flex', gap: 8, alignItems: 'center', fontSize: 12, color: '#555' }}>
                  <span style={{ fontSize: 16 }}>{icon}</span>{label}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ borderBottom: '2px solid #e5e5e5', marginBottom: 24 }}>
          {[['desc','Description'],['specs','Specifications'],['shipping','Shipping & Returns']].map(([key, label]) => (
            <button key={key} onClick={() => setActiveTab(key)}
              style={{ padding: '12px 24px', fontWeight: 700, fontSize: 14, border: 'none', background: 'none', cursor: 'pointer', color: activeTab === key ? '#2e6dce' : '#888', borderBottom: activeTab === key ? '3px solid #2e6dce' : '3px solid transparent', marginBottom: -2, transition: 'all 0.2s' }}>
              {label}
            </button>
          ))}
        </div>

        <div style={{ marginBottom: 40 }}>
          {activeTab === 'desc' && (
            <p style={{ fontSize: 14, color: '#444', lineHeight: 1.9, maxWidth: 760 }}>{product.desc}</p>
          )}
          {activeTab === 'specs' && product.specs && (
            <table style={{ borderCollapse: 'collapse', maxWidth: 600, width: '100%' }}>
              <tbody>
                {product.specs.map(([key, val]) => (
                  <tr key={key} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{ padding: '10px 16px', fontSize: 13, fontWeight: 700, color: '#555', background: '#f9fafb', width: 180, whiteSpace: 'nowrap' }}>{key}</td>
                    <td style={{ padding: '10px 16px', fontSize: 13, color: '#333' }}>{val}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {activeTab === 'shipping' && (
            <div style={{ fontSize: 14, color: '#444', lineHeight: 1.9, maxWidth: 640 }}>
              <p>🚚 <strong>Free shipping</strong> on orders above ₹10,000. Standard shipping ₹99 for orders below ₹10,000.</p>
              <p>📦 <strong>Delivery time:</strong> 3–7 business days depending on your location.</p>
              <p>↩️ <strong>Returns:</strong> 7-day hassle-free return policy. Product must be unused and in original packaging.</p>
              <p>🔐 <strong>Secure payment:</strong> All transactions are encrypted and processed securely.</p>
            </div>
          )}
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 20, paddingBottom: 10, borderBottom: '2px solid #e5e5e5' }}>
              <span style={{ borderLeft: '4px solid #2e6dce', paddingLeft: 10 }}>Related Products</span>
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 18 }}>
              {related.map(p => {
                const pct = Math.round(((p.oldPrice - p.newPrice) / p.oldPrice) * 100);
                return (
                  <Link key={p.id} to={`/product-info/${p.id}`} style={{ textDecoration: 'none' }}>
                    <div style={{ border: '1px solid #e8e8e8', borderRadius: 8, background: '#fff', overflow: 'hidden', transition: 'box-shadow 0.2s,transform 0.2s' }}
                      onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                      onMouseLeave={e => { e.currentTarget.style.boxShadow = ''; e.currentTarget.style.transform = ''; }}>
                      <div style={{ background: '#f9f9f9', height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                        <span style={{ position: 'absolute', top: 8, left: 8, background: '#e53e3e', color: '#fff', fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 3 }}>{pct}% OFF</span>
                        {p.img ? <img src={p.img} alt={p.name} style={{ maxHeight: 140, maxWidth: '85%', objectFit: 'contain' }} /> : <span style={{ fontSize: 56 }}>{p.emoji || '🛍️'}</span>}
                      </div>
                      <div style={{ padding: '12px' }}>
                        <p style={{ fontSize: 12, color: '#333', lineHeight: 1.4, marginBottom: 8 }}>{p.name.slice(0, 55)}{p.name.length > 55 ? '...' : ''}</p>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                          <span style={{ color: '#2e6dce', fontWeight: 700, fontSize: 15 }}>₹{p.newPrice.toLocaleString()}</span>
                          <span style={{ color: '#aaa', textDecoration: 'line-through', fontSize: 12 }}>₹{p.oldPrice.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
