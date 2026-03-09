import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';

const retailProducts = [
  { id: 'P66C4CDF72B546', name: 'Canon R100 Mirrorless Camera RF-S 18-45mm F/4.5-6.3 IS STM', img: '/product_img/P66C4CDF72B546/PIMG-066c4cdf72bfbe.png', oldPrice: 10000, newPrice: 8000, rating: 4, emoji: null },
  { id: 'P66C4D9FBB8CB0', name: 'SONY Alpha ILCE-6600M APS-C Mirrorless Camera With 18-135 Mm Zoom', img: '/product_img/P66C4D9FBB8CB0/PIMG-066c4d9fbb97ae.jpg', oldPrice: 15000, newPrice: 13000, rating: 5, emoji: null },
  { id: 'DEMO001', name: 'Android Smartphone 128GB — Dual SIM Fast Charging', img: null, emoji: '📱', oldPrice: 18000, newPrice: 14999, rating: 4 },
  { id: 'DEMO002', name: 'Bluetooth Earphones — Active Noise Cancelling Pro', img: null, emoji: '🎧', oldPrice: 3500, newPrice: 2499, rating: 4 },
  { id: 'DEMO003', name: 'Power Bank 20000mAh — 65W Fast Charge PD', img: null, emoji: '🔋', oldPrice: 2000, newPrice: 1299, rating: 4 },
  { id: 'DEMO004', name: 'Smart Watch Fitness Tracker — Heart Rate & GPS', img: null, emoji: '⌚', oldPrice: 5000, newPrice: 3799, rating: 3 },
  { id: 'DEMO005', name: 'Mixer Grinder 750W — 3 Stainless Steel Jars', img: null, emoji: '🍳', oldPrice: 3200, newPrice: 2199, rating: 4 },
  { id: 'DEMO006', name: 'Tripod Stand Professional — 62" Aluminium', img: null, emoji: '📷', oldPrice: 1800, newPrice: 999, rating: 4 },
  { id: 'DEMO007', name: 'USB-C Fast Charging Cable 3m — Braided', img: null, emoji: '🔌', oldPrice: 599, newPrice: 349, rating: 5 },
  { id: 'DEMO008', name: 'Memory Card 128GB Class 10 UHS-I', img: null, emoji: '💾', oldPrice: 1200, newPrice: 699, rating: 4 },
];
const cats = ['All', 'Electronics', 'Cameras', 'Mobiles', 'Accessories', 'Home Appliances'];

function Stars({ n }) {
  return <span style={{ color: '#f59e0b', fontSize: 13 }}>{'★'.repeat(n)}{'☆'.repeat(5 - n)}</span>;
}
function ProductCard({ product }) {
  const [added, setAdded] = useState(false);
  const pct = Math.round(((product.oldPrice - product.newPrice) / product.oldPrice) * 100);
  return (
    <div style={{ border:'1px solid #e8e8e8',borderRadius:3,background:'#fff',overflow:'hidden',transition:'box-shadow 0.2s,transform 0.2s' }}
      onMouseEnter={e=>{ e.currentTarget.style.boxShadow='0 4px 20px rgba(0,0,0,0.12)'; e.currentTarget.style.transform='translateY(-3px)'; }}
      onMouseLeave={e=>{ e.currentTarget.style.boxShadow=''; e.currentTarget.style.transform=''; }}>
      <div style={{ position:'relative' }}>
        <div style={{ background: product.img ? '#f9f9f9' : '#e8f0fe', height:200, display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden' }}>
          {product.img
            ? <img src={product.img} alt={product.name} style={{ maxHeight:185,maxWidth:'90%',objectFit:'contain' }} />
            : <span style={{ fontSize:64 }}>{product.emoji || '🛍️'}</span>}
        </div>
        <span style={{ position:'absolute',top:10,left:10,background:'#e53e3e',color:'#fff',fontSize:11,fontWeight:700,padding:'3px 8px',borderRadius:3 }}>{pct}% OFF</span>
      </div>
      <div style={{ padding:'14px 14px 4px' }}>
        <h3 style={{ fontSize:13,fontWeight:600,color:'#333',marginBottom:6,lineHeight:1.5 }}>{product.name}</h3>
        <Stars n={product.rating} />
        <div style={{ display:'flex',gap:8,alignItems:'center',marginTop:8 }}>
          <span style={{ color:'#999',textDecoration:'line-through',fontSize:12 }}>₹{product.oldPrice.toLocaleString()}</span>
          <span style={{ color:'#2e6dce',fontWeight:700,fontSize:17 }}>₹{product.newPrice.toLocaleString()}</span>
        </div>
      </div>
      <div style={{ padding:'8px 14px 14px',display:'flex',gap:8 }}>
        <button style={{ flex:1,background:added?'#22c55e':'#333',color:'#fff',border:'none',padding:'9px',borderRadius:3,fontSize:13,fontWeight:600,cursor:'pointer',transition:'background 0.2s' }}
          onClick={() => { setAdded(true); setTimeout(() => setAdded(false), 2000); }}>
          {added ? '✓ Added!' : 'Add to Cart'}
        </button>
        <button style={{ background:'#f0f4fb',border:'1px solid #ddd',borderRadius:3,padding:'9px 12px',cursor:'pointer',fontSize:16 }}>♡</button>
      </div>
    </div>
  );
}

export default function RetailPage() {
  const [activeCat, setActiveCat] = useState('All');
  const [sort, setSort] = useState('default');
  const [search, setSearch] = useState('');
  let filtered = retailProducts.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
  if (sort === 'low') filtered = [...filtered].sort((a, b) => a.newPrice - b.newPrice);
  if (sort === 'high') filtered = [...filtered].sort((a, b) => b.newPrice - a.newPrice);
  return (
    <Layout>
      <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff', padding: '40px 20px', textAlign: 'center' }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>Retail Shop</h1>
        <p style={{ opacity: 0.85 }}>Browse our full catalogue of retail products at great prices</p>
        <div style={{ marginTop: 20, display: 'flex', justifyContent: 'center' }}>
          <div style={{ display: 'flex', border: '2px solid rgba(255,255,255,0.5)', borderRadius: 4, overflow: 'hidden', maxWidth: 480, width: '100%' }}>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..." style={{ flex: 1, border: 'none', padding: '10px 16px', fontSize: 14, background: 'rgba(255,255,255,0.15)', color: '#fff', outline: 'none' }} />
            <button style={{ background: 'rgba(255,255,255,0.25)', border: 'none', padding: '10px 20px', color: '#fff', cursor: 'pointer', fontSize: 15 }}><i className="fas fa-search" /></button>
          </div>
        </div>
      </div>
      <div style={{ padding: '20px 20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {cats.map(c => (
            <button key={c} onClick={() => setActiveCat(c)} style={{ padding: '7px 16px', borderRadius: 20, border: '1px solid #ddd', background: activeCat === c ? '#2e6dce' : '#fff', color: activeCat === c ? '#fff' : '#333', fontWeight: 600, fontSize: 12, cursor: 'pointer' }}>{c}</button>
          ))}
        </div>
        <select value={sort} onChange={e => setSort(e.target.value)} style={{ padding: '8px 14px', border: '1px solid #ddd', borderRadius: 4, fontSize: 13 }}>
          <option value="default">Sort: Default</option>
          <option value="low">Price: Low to High</option>
          <option value="high">Price: High to Low</option>
        </select>
      </div>
      <div style={{ padding:'0 20px 20px' }}>
        <p style={{ color:'#777',fontSize:13,marginBottom:16 }}>Showing {filtered.length} products</p>
        {filtered.length === 0
          ? <div style={{ textAlign:'center',padding:60,color:'#aaa' }}><div style={{ fontSize:48,marginBottom:12 }}>🔍</div><p>No products found.</p></div>
          : <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:18 }}>{filtered.map(p => <ProductCard key={p.id} product={p} />)}</div>}
      </div>
      <div style={{ background: '#f5f8ff', border: '1px solid #dce8fb', margin: '20px', borderRadius: 8, padding: '28px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h3 style={{ fontWeight: 700, marginBottom: 6 }}>Need a custom order?</h3>
          <p style={{ color: '#666', fontSize: 13 }}>Request a quote for bulk or special retail orders.</p>
        </div>
        <Link to="/request-quote"><button style={{ background: '#2e6dce', color: '#fff', border: 'none', padding: '12px 28px', borderRadius: 4, fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>Request for Quote</button></Link>
      </div>
    </Layout>
  );
}
