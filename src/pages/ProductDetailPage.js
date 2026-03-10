import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useCart } from '../context/CartContext';
import { ALL_PRODUCTS } from '../data-products';
import Stars from '../components/Stars';

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
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              {[1, 2, 3].map(i => (
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

            <div style={{ background: '#f0f4ff', borderRadius: 8, padding: '16px 20px', margin: '18px 0' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 6 }}>
                <span style={{ fontSize: 32, fontWeight: 900, color: '#1d4ed8' }}>₹{product.newPrice.toLocaleString()}</span>
                <span style={{ fontSize: 16, color: '#999', textDecoration: 'line-through' }}>₹{product.oldPrice.toLocaleString()}</span>
                <span style={{ background: '#fee2e2', color: '#dc2626', fontSize: 13, fontWeight: 700, padding: '2px 8px', borderRadius: 4 }}>SAVE ₹{savings.toLocaleString()}</span>
              </div>
              <div style={{ fontSize: 12, color: '#16a34a', fontWeight: 600 }}>✅ Inclusive of all taxes &nbsp;·&nbsp; Free shipping above ₹10,000</div>
            </div>

            <div style={{ fontSize: 12, color: '#999', marginBottom: 16 }}>SKU: <span style={{ color: '#555' }}>{product.sku}</span> &nbsp;·&nbsp; Weight: <span style={{ color: '#555' }}>{product.weightKg}kg</span></div>

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
              <p>🚚 <strong>Weight-based shipping</strong> from ₹49 per vendor, calculated at checkout based on item weight and vendor location.</p>
              <p>📦 <strong>Delivery time:</strong> 3–7 business days depending on your location.</p>
              <p>↩️ <strong>Returns:</strong> 7-day hassle-free return policy. Product must be unused and in original packaging.</p>
              <p>🔐 <strong>Secure payment:</strong> All transactions are encrypted and processed securely.</p>
            </div>
          )}
        </div>

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
