import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { ALL_PRODUCTS, FEATURED_IDS, NEW_ARRIVAL_IDS } from '../data-products';
import Stars from '../components/Stars';

const banners = [
  '/admin/images/banner-1720956851.jpg',
  '/admin/images/banner-1720956887.jpg',
  '/admin/images/banner-1720956897.jpg',
  '/admin/images/banner-1736268069.jpg',
  '/admin/images/banner-1736268401.jpg',
  '/admin/images/banner-1736268651.jpg',
];

const topCategories = [
  { name: 'Electronics', slug: 'electronics', emoji: '📱' },
  { name: 'Furnitures', slug: 'furnitures', emoji: '🛋️' },
  { name: 'Imitation Jewellery', slug: 'imitation-jewellery', emoji: '💍' },
  { name: "Women's Garments", slug: 'womens-garments', emoji: '👗' },
  { name: "Men's Garments", slug: 'mens-garments', emoji: '👔' },
  { name: 'Kitchen Cookware', slug: 'kitchen-cookware', emoji: '🍳' },
  { name: 'Food Products', slug: 'food-products', emoji: '🍫' },
  { name: 'Kitchen Appliances', slug: 'kitchen-cook-ware-appliances', emoji: '🥣' },
  { name: 'Cleaning Products', slug: 'cleaning-products', emoji: '🧺' },
  { name: 'Stationery', slug: 'stationery', emoji: '📝' },
];

const featuredProducts = ALL_PRODUCTS.filter(p => FEATURED_IDS.includes(p.id));
const newArrivals = ALL_PRODUCTS.filter(p => NEW_ARRIVAL_IDS.includes(p.id));

function HeroSlider() {
  const [cur, setCur] = useState(0);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const t = setInterval(() => setCur(c => (c + 1) % banners.length), 4500);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ position:'relative', background:'#f0f4f8', lineHeight:0, overflow:'hidden' }}>
      {banners.map((src, i) => (
        <div key={i} style={{ display: i === cur ? 'block' : 'none', position:'relative' }}>
          {!errors[i] && (
            <img
              src={src}
              alt={`Banner ${i+1}`}
              onError={() => setErrors(e => ({ ...e, [i]: true }))}
              style={{ width:'100%', height:380, objectFit:'cover', display:'block' }}
            />
          )}
          {errors[i] && i === cur && (
            <div style={{ height:380, background:'linear-gradient(135deg,#e0f2fe,#bae6fd)', display:'flex',alignItems:'center',justifyContent:'center' }}>
              <div style={{ textAlign:'center' }}>
                <h2 style={{ fontSize:40,fontWeight:900,color:'#1a1a2e' }}>ApseShopping.com</h2>
                <p style={{ color:'#555',marginTop:8,fontSize:16 }}>All Products and Services Express Shopping.</p>
              </div>
            </div>
          )}
        </div>
      ))}
      <button onClick={() => setCur(c => (c-1+banners.length)%banners.length)}
        style={{ position:'absolute',left:16,top:'50%',transform:'translateY(-50%)',background:'rgba(0,0,0,0.35)',color:'#fff',border:'none',width:40,height:40,borderRadius:'50%',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,zIndex:10 }}>
        <i className="fas fa-chevron-left" />
      </button>
      <button onClick={() => setCur(c => (c+1)%banners.length)}
        style={{ position:'absolute',right:16,top:'50%',transform:'translateY(-50%)',background:'rgba(0,0,0,0.35)',color:'#fff',border:'none',width:40,height:40,borderRadius:'50%',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,zIndex:10 }}>
        <i className="fas fa-chevron-right" />
      </button>
      <div style={{ position:'absolute',bottom:14,left:'50%',transform:'translateX(-50%)',display:'flex',gap:8,zIndex:10 }}>
        {banners.map((_, i) => errors[i] ? null : (
          <button key={i} onClick={() => setCur(i)}
            style={{ width:12,height:12,borderRadius:'50%',border:'2px solid rgba(255,255,255,0.8)',padding:0,background: i===cur ? '#2e6dce':'rgba(255,255,255,0.4)',cursor:'pointer' }} />
        ))}
      </div>
    </div>
  );
}

function ProductCard({ product }) {
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { success } = useToast();
  const pct = Math.round(((product.oldPrice - product.newPrice) / product.oldPrice) * 100);
  const wishlisted = isWishlisted(product.id);
  return (
    <div style={{ border:'1px solid #e8e8e8',borderRadius:3,background:'#fff',overflow:'hidden',transition:'box-shadow 0.2s,transform 0.2s',position:'relative' }}
      onMouseEnter={e=>{ e.currentTarget.style.boxShadow='0 4px 20px rgba(0,0,0,0.12)'; e.currentTarget.style.transform='translateY(-3px)'; }}
      onMouseLeave={e=>{ e.currentTarget.style.boxShadow=''; e.currentTarget.style.transform=''; }}>
      <button onClick={() => { const r = toggleWishlist(product); success(r ? '❤️ Added to wishlist' : '💔 Removed from wishlist'); }}
        style={{ position:'absolute',top:10,right:10,zIndex:3,background:'#fff',border:'1px solid #eee',borderRadius:'50%',width:30,height:30,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',fontSize:15,boxShadow:'0 1px 4px rgba(0,0,0,0.1)' }}>
        {wishlisted ? '❤️' : '🤍'}
      </button>
      <Link to={`/product-info/${product.id}`} style={{ textDecoration:'none',color:'inherit' }}>
        <div style={{ position:'absolute',top:10,left:10,zIndex:2 }}>
          <span style={{ background:'#e53e3e',color:'#fff',fontSize:11,fontWeight:700,padding:'2px 8px',borderRadius:2,display:'block' }}>
            {pct}% OFF
          </span>
        </div>
        <div style={{ background:'#f9f9f9',height:200,display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden' }}>
          {product.img
            ? <img src={product.img} alt={product.name} style={{ maxHeight:185,maxWidth:'90%',objectFit:'contain' }} />
            : <span style={{ fontSize:64 }}>{product.emoji || '🛍️'}</span>}
        </div>
        <div style={{ padding:'14px 14px 4px' }}>
          <h3 style={{ fontSize:13,fontWeight:600,color:'#333',marginBottom:6,lineHeight:1.5 }}>{product.name}</h3>
          <Stars n={product.rating} size={11} />
          <div style={{ display:'flex',gap:8,alignItems:'center',flexWrap:'wrap',marginTop:4 }}>
            <span style={{ color:'#999',textDecoration:'line-through',fontSize:12 }}>₹{product.oldPrice.toLocaleString()}</span>
            <span style={{ color:'#2e6dce',fontWeight:700,fontSize:17 }}>₹{product.newPrice.toLocaleString()}</span>
          </div>
        </div>
      </Link>
      <div style={{ padding:'8px 14px 14px' }}>
        <button
          onClick={() => { addToCart(product); setAdded(true); success('🛒 Added to cart!'); setTimeout(()=>setAdded(false),2000); }}
          style={{ width:'100%',background: added ? '#22c55e':'#333',color:'#fff',border:'none',padding:'9px',borderRadius:3,fontSize:13,fontWeight:600,cursor:'pointer',transition:'background 0.2s' }}>
          {added ? '✓ Added!' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}

function CategoriesCarousel() {
  const [idx, setIdx] = React.useState(0);
  const visible = 5;
  const canPrev = idx > 0;
  const canNext = idx + visible < topCategories.length;
  const shown = topCategories.slice(idx, idx + visible);
  return (
    <div style={{ position:'relative', marginBottom:8 }}>
      {canPrev && (
        <button onClick={() => setIdx(i => i - 1)}
          style={{ position:'absolute',left:-20,top:'38%',transform:'translateY(-50%)',zIndex:10,background:'#fff',border:'1px solid #ddd',borderRadius:'50%',width:36,height:36,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',boxShadow:'0 2px 6px rgba(0,0,0,0.12)',fontSize:14,color:'#444' }}>
          <i className="fas fa-chevron-left" />
        </button>
      )}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:16 }}>
        {shown.map(c => (
          <Link key={c.slug} to={`/category/${c.slug}`} style={{ textDecoration:'none',textAlign:'center' }}>
            <div style={{ width:'100%',paddingBottom:'100%',position:'relative',borderRadius:'50%',background:'#f0f0f0',marginBottom:12 }}>
              <div style={{ position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',fontSize:52 }}>
                {c.emoji}
              </div>
            </div>
            <h4 style={{ fontSize:12,fontWeight:700,color:'#333',textTransform:'uppercase',letterSpacing:'0.3px',lineHeight:1.4 }}>{c.name}</h4>
          </Link>
        ))}
      </div>
      {canNext && (
        <button onClick={() => setIdx(i => i + 1)}
          style={{ position:'absolute',right:-20,top:'38%',transform:'translateY(-50%)',zIndex:10,background:'#fff',border:'1px solid #ddd',borderRadius:'50%',width:36,height:36,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',boxShadow:'0 2px 6px rgba(0,0,0,0.12)',fontSize:14,color:'#444' }}>
          <i className="fas fa-chevron-right" />
        </button>
      )}
    </div>
  );
}

export default function HomePage() {
  return (
    <Layout>
      <HeroSlider />

      {/* Feature Strip */}
      <div style={{ display:'flex',borderTop:'1px solid #e8e8e8',borderBottom:'1px solid #e8e8e8',background:'#fff' }}>
        {[
          { icon:'fas fa-shipping-fast', title:'FREE SHIPPING & RETURN', sub:'Free shipping on all orders over ₹10,000.' },
          { icon:'fas fa-rupee-sign', title:'MONEY BACK GUARANTEE', sub:'100% money back guarantee' },
          { icon:'fas fa-clock', title:'ONLINE SUPPORT 24/7', sub:'Mon–Sat 9AM–6PM | 24hr online support.' },
        ].map((f,i) => (
          <div key={i} style={{ flex:1,display:'flex',alignItems:'center',gap:16,padding:'22px 28px',borderRight: i<2?'1px solid #e8e8e8':'none' }}>
            <div style={{ width:56,height:56,borderRadius:'50%',border:'2px solid #e8e8e8',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>
              <i className={f.icon} style={{ fontSize:22,color:'#444' }} />
            </div>
            <div>
              <h4 style={{ fontSize:13,fontWeight:700,color:'#222',marginBottom:3 }}>{f.title}</h4>
              <p style={{ fontSize:12,color:'#888' }}>{f.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Promo Banners */}
      <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr 1fr',padding:'20px',background:'#f5f5f5',gap:16 }}>
        {[
          { img:'/assets/images/demoes/demo4/banners/banner-1.jpg', to:'/retail', title:'Porto Watches', sub:<div style={{lineHeight:1.3}}><s style={{fontSize:12,color:'rgba(0,0,0,0.5)',fontWeight:600}}>20%</s><span style={{fontSize:26,fontWeight:900,color:'#222'}}> 30%</span><span style={{fontSize:14,fontWeight:700,color:'#222'}}> OFF</span></div>, btn:'SHOP NOW' },
          { img:'/assets/images/demoes/demo4/banners/banner-2.jpg', to:'/wholesale', title:'Deal Promos', sub:<div style={{fontSize:15,color:'#333',fontWeight:500,lineHeight:1.4}}>Starting at ₹999</div>, btn:'SHOP NOW' },
          { img:'/assets/images/demoes/demo4/banners/banner-3.jpg', to:'/retail', title:'Handbags', sub:<div style={{fontSize:15,color:'#e53e3e',fontWeight:700,lineHeight:1.4}}>Starting at ₹999</div>, btn:'SHOP NOW' },
        ].map((b,i) => (
          <Link key={i} to={b.to} style={{ display:'block',borderRadius:3,overflow:'hidden',lineHeight:0,position:'relative',boxShadow:'0 1px 4px rgba(0,0,0,0.1)' }}
            onMouseEnter={e=>e.currentTarget.querySelector('img')?.style && (e.currentTarget.querySelector('img').style.transform='scale(1.04)')}
            onMouseLeave={e=>e.currentTarget.querySelector('img')?.style && (e.currentTarget.querySelector('img').style.transform='scale(1)')}>
            <img src={b.img} alt={`Promo ${i+1}`} style={{ width:'100%',display:'block',transition:'transform 0.4s',height:220,objectFit:'cover' }} onError={e=>{ e.target.style.display='none'; }} />
            <div style={{ position:'absolute',inset:0,display:'flex',flexDirection:'column',justifyContent:'center',padding:'0 28px' }}>
              <h3 style={{ color:'#222',fontSize:22,fontWeight:800,marginBottom:4,lineHeight:1.2 }}>{b.title}</h3>
              <div style={{ marginBottom:16 }}>{b.sub}</div>
              <span style={{ display:'inline-block',background:'#1a1a1a',color:'#fff',padding:'9px 20px',fontSize:12,fontWeight:700,letterSpacing:'0.8px',width:'fit-content',borderRadius:2 }}>{b.btn}</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Products */}
      <div style={{ padding:'28px 20px',maxWidth:1400,margin:'0 auto',boxSizing:'border-box' }}>
        <h2 style={{ fontSize:21,fontWeight:700,color:'#222',marginBottom:20,paddingBottom:8,borderBottom:'2px solid #e8e8e8',display:'flex',alignItems:'center',gap:10 }}>
          <span style={{ borderLeft:'4px solid #2e6dce',paddingLeft:10 }}>POPULAR PRODUCTS</span>
        </h2>
        <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:18,marginBottom:36 }}>
          {featuredProducts.map(p => <ProductCard key={p.id} product={p} />)}
        </div>

        <h2 style={{ fontSize:21,fontWeight:700,color:'#222',marginBottom:20,paddingBottom:8,borderBottom:'2px solid #e8e8e8',display:'flex',alignItems:'center',gap:10 }}>
          <span style={{ borderLeft:'4px solid #2e6dce',paddingLeft:10 }}>NEW ARRIVALS</span>
        </h2>
        <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:18,marginBottom:36 }}>
          {newArrivals.map(p => <ProductCard key={p.id+'_new'} product={p} />)}
        </div>

        <h2 style={{ fontSize:18,fontWeight:700,color:'#222',marginBottom:24 }}>TOP 10 CATEGORIES</h2>
        <CategoriesCarousel />
      </div>

      {/* Top Fashion Deals */}
      <div style={{ background:'#222',padding:'40px 20px',display:'flex',alignItems:'center',justifyContent:'center',gap:40,flexWrap:'wrap' }}>
        <div style={{ textAlign:'center' }}>
          <div style={{ fontSize:36,fontWeight:900,color:'#fff',textTransform:'uppercase',letterSpacing:2,lineHeight:1.1 }}>TOP FASHION</div>
          <div style={{ fontSize:36,fontWeight:900,color:'#fff',textTransform:'uppercase',letterSpacing:2,lineHeight:1.1,marginBottom:20 }}>DEALS</div>
          <Link to="/retail"><button style={{ background:'#444',color:'#fff',border:'none',padding:'14px 36px',fontWeight:700,fontSize:13,cursor:'pointer',letterSpacing:1 }}>VIEW SALE</button></Link>
        </div>
        <div style={{ background:'#fff',padding:'20px 28px',position:'relative',minWidth:160,textAlign:'center' }}>
          <div style={{ position:'absolute',top:-1,left:0,right:0,background:'#1a1a1a',color:'#fff',fontSize:11,fontWeight:800,padding:'4px 0',letterSpacing:1,textAlign:'center' }}>Exclusive COUPON</div>
          <div style={{ marginTop:18,fontSize:11,color:'#888',fontWeight:600,letterSpacing:1 }}>UP TO</div>
          <div style={{ display:'flex',alignItems:'flex-start',justifyContent:'center',lineHeight:1 }}>
            <span style={{ fontSize:18,fontWeight:800,color:'#e53e3e',marginTop:4 }}>₹</span>
            <span style={{ fontSize:52,fontWeight:900,color:'#e53e3e',lineHeight:1 }}>500</span>
          </div>
          <div style={{ fontSize:14,fontWeight:700,color:'#333',letterSpacing:2 }}>OFF</div>
        </div>
      </div>

      {/* 4-col product grid */}
      <div style={{ background:'#f9f9f9',padding:'36px 20px' }}>
        <div style={{ display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:24,maxWidth:1400,margin:'0 auto' }}>
          {[
            ['FEATURED PRODUCTS', [...featuredProducts].reverse()],
            ['BEST SELLING PRODUCTS', featuredProducts],
            ['LATEST PRODUCTS', featuredProducts],
            ['TOP RATED PRODUCTS', [...featuredProducts].reverse()],
          ].map(([title, prods]) => (
            <div key={title}>
              <h3 style={{ fontSize:13,fontWeight:700,color:'#222',textTransform:'uppercase',letterSpacing:'0.8px',marginBottom:18,paddingBottom:10,borderBottom:'2px solid #e8e8e8' }}>{title}</h3>
              {prods.map(p => (
                <div key={p.id+title} style={{ display:'flex',gap:12,marginBottom:16,paddingBottom:16,borderBottom:'1px solid #f0f0f0',alignItems:'center' }}>
                  <Link to={`/product-info/${p.id}`} style={{ flexShrink:0 }}>
                    {p.img
                      ? <img src={p.img} alt={p.name} style={{ width:65,height:65,objectFit:'contain',background:'#fff',borderRadius:3,border:'1px solid #eee' }} />
                      : <div style={{ width:65,height:65,background:'#e8f0fe',borderRadius:3,display:'flex',alignItems:'center',justifyContent:'center',fontSize:28 }}>{p.emoji}</div>}
                  </Link>
                  <div>
                    <Link to={`/product-info/${p.id}`} style={{ textDecoration:'none',color:'#333',fontSize:12,display:'block',lineHeight:1.4,marginBottom:4,fontWeight:500 }}>
                      {p.name.length>42?p.name.substring(0,42)+'...':p.name}
                    </Link>
                    <Stars n={p.rating} size={10} />
                    <div style={{ fontSize:13,fontWeight:700,color:'#2e6dce',marginTop:2 }}>₹{p.newPrice.toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Import & Export CTA */}
      <div style={{ background:'linear-gradient(135deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%)',color:'#fff',padding:'60px 20px' }}>
        <div style={{ maxWidth:1100,margin:'0 auto' }}>
          <div style={{ textAlign:'center',marginBottom:48 }}>
            <h2 style={{ fontSize:34,fontWeight:800,marginBottom:12,background:'linear-gradient(90deg,#60a5fa,#a78bfa)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent' }}>
              🌐 Import &amp; Export Services
            </h2>
            <p style={{ color:'#94a3b8',fontSize:16,maxWidth:600,margin:'0 auto' }}>Connect with global markets. Source products internationally or export your goods worldwide.</p>
          </div>
          <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))',gap:24,marginBottom:40 }}>
            {[
              { icon:'📦',title:'Import Products',desc:'Source quality goods from international suppliers across Asia, Europe & Americas.' },
              { icon:'🚢',title:'Export Services',desc:'Reach global buyers and expand your business across 50+ countries.' },
              { icon:'📋',title:'Trade Documentation',desc:'Complete assistance with customs, invoices, certificates & compliance.' },
              { icon:'🤝',title:'Verified Partners',desc:'Network of trusted freight forwarders, customs agents & logistics providers.' },
            ].map(c => (
              <div key={c.title} style={{ background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:12,padding:'28px 24px' }}>
                <div style={{ fontSize:40,marginBottom:16 }}>{c.icon}</div>
                <h3 style={{ fontSize:16,fontWeight:700,marginBottom:10,color:'#f1f5f9' }}>{c.title}</h3>
                <p style={{ fontSize:13,color:'#94a3b8',lineHeight:1.6 }}>{c.desc}</p>
              </div>
            ))}
          </div>
          <div style={{ background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.15)',borderRadius:12,padding:'36px 40px',display:'flex',alignItems:'center',justifyContent:'space-between',gap:24,flexWrap:'wrap' }}>
            <div>
              <h3 style={{ fontSize:22,fontWeight:700,marginBottom:8,color:'#f1f5f9' }}>Ready to go global?</h3>
              <p style={{ fontSize:14,color:'#94a3b8' }}>Submit your trade inquiry and our team will get back to you within 24 hours.</p>
            </div>
            <div style={{ display:'flex',gap:12,flexWrap:'wrap' }}>
              <Link to="/import-export"><button style={{ background:'linear-gradient(135deg,#2e6dce,#7c3aed)',color:'#fff',border:'none',padding:'13px 28px',borderRadius:8,fontWeight:700,fontSize:14,cursor:'pointer' }}>Explore Import &amp; Export</button></Link>
              <Link to="/contact-us"><button style={{ background:'transparent',color:'#fff',border:'1px solid rgba(255,255,255,0.4)',padding:'13px 28px',borderRadius:8,fontWeight:600,fontSize:14,cursor:'pointer' }}>Contact Us</button></Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
