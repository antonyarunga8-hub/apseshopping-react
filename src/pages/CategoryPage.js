import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { ALL_PRODUCTS } from '../data-products';

// Slug → display name map
const SLUG_TO_NAME = {
  'electronics': 'Electronics',
  'cameras': 'Cameras',
  'mobiles': 'Mobiles',
  'accessories': 'Accessories',
  'home-appliances': 'Home Appliances',
  'furnitures': 'Furnitures',
  'imitation-jewellery': 'Imitation Jewellery',
  'womens-garments': "Women's Garments",
  'mens-garments': "Men's Garments",
  'kitchen-cookware': 'Kitchen Cookware',
  'food-products': 'Food Products',
  'kitchen-cook-ware-appliances': 'Kitchen Appliances',
  'cleaning-products': 'Cleaning Products',
  'stationery': 'Stationery',
  'mens-fashion': "Men's Fashion",
  'tableware': 'Tableware',
  'general-products': 'General Products',
  'medical-surgical-accessories': 'Medical Surgical Accessories',
  'water-bottle': 'Water Bottle',
  'agriculture': 'Agriculture',
  'foot-wear': 'Foot Wear',
  'helmet': 'Helmet',
  'home-and-kitchen': 'Home and Kitchen',
  'ups-battery': 'UPS Battery',
  'body-cleansers': 'Body Cleansers',
  'digital-camera': 'Digital Camera',
  'security-whistle': 'Security Whistle',
};

const CATEGORY_ICONS = {
  'Electronics': '📱', 'Cameras': '📷', 'Mobiles': '📱', 'Accessories': '🔌',
  'Home Appliances': '🏠', 'Furnitures': '🛋️', 'Imitation Jewellery': '💍',
  "Women's Garments": '👗', "Men's Garments": '👔', 'Kitchen Cookware': '🍳',
  'Food Products': '🍫', 'Kitchen Appliances': '🥣', 'Cleaning Products': '🧹',
  'Stationery': '📝', "Men's Fashion": '🕶️', 'Tableware': '🍽️',
  'General Products': '📦', 'Medical Surgical Accessories': '🏥',
  'Water Bottle': '💧', 'Agriculture': '🌾', 'Foot Wear': '👟',
  'Helmet': '⛑️', 'Home and Kitchen': '🏡', 'UPS Battery': '🔋',
  'Body Cleansers': '🧴', 'Digital Camera': '📸', 'Security Whistle': '📯',
};

function ProductCard({ product }) {
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { success } = useToast();
  const pct = Math.round(((product.oldPrice - product.newPrice) / product.oldPrice) * 100);
  const wishlisted = isWishlisted(product.id);
  return (
    <div style={{ border: '1px solid #e8e8e8', borderRadius: 6, background: '#fff', overflow: 'hidden', transition: 'box-shadow 0.2s,transform 0.2s', position: 'relative' }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.12)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = ''; e.currentTarget.style.transform = ''; }}>
      <button onClick={() => { const r = toggleWishlist(product); success(r ? '❤️ Added to wishlist' : '💔 Removed from wishlist'); }}
        style={{ position: 'absolute', top: 10, right: 10, zIndex: 3, background: '#fff', border: '1px solid #eee', borderRadius: '50%', width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 15, boxShadow: '0 1px 4px rgba(0,0,0,0.1)' }}>
        {wishlisted ? '❤️' : '🤍'}
      </button>
      <Link to={`/product-info/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <div style={{ position: 'relative', background: product.img ? '#f9f9f9' : '#e8f0fe', height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ position: 'absolute', top: 10, left: 10, background: '#e53e3e', color: '#fff', fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 3 }}>{pct}% OFF</span>
          {product.img
            ? <img src={product.img} alt={product.name} style={{ maxHeight: 185, maxWidth: '90%', objectFit: 'contain' }} />
            : <span style={{ fontSize: 64 }}>{product.emoji || '🛍️'}</span>}
        </div>
        <div style={{ padding: '14px 14px 4px' }}>
          <h3 style={{ fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 6, lineHeight: 1.5 }}>{product.name}</h3>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
            <span style={{ color: '#999', textDecoration: 'line-through', fontSize: 12 }}>₹{product.oldPrice.toLocaleString()}</span>
            <span style={{ color: '#2e6dce', fontWeight: 700, fontSize: 17 }}>₹{product.newPrice.toLocaleString()}</span>
          </div>
        </div>
      </Link>
      <div style={{ padding: '4px 14px 14px', display: 'flex', gap: 8 }}>
        <button
          onClick={() => { addToCart(product); setAdded(true); success('🛒 Added to cart!'); setTimeout(() => setAdded(false), 2000); }}
          style={{ flex: 1, background: added ? '#22c55e' : '#333', color: '#fff', border: 'none', padding: '9px', borderRadius: 3, fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s' }}>
          {added ? '✓ Added!' : 'Add to Cart'}
        </button>
        <Link to={`/product-info/${product.id}`} style={{ textDecoration: 'none' }}>
          <button style={{ background: '#f0f4fb', border: '1px solid #dce8fb', borderRadius: 3, padding: '9px 12px', cursor: 'pointer', fontSize: 12, color: '#2e6dce', fontWeight: 600 }}>View</button>
        </Link>
      </div>
    </div>
  );
}

export default function CategoryPage() {
  const { slug } = useParams();
  const [sort, setSort] = useState('default');
  const [search, setSearch] = useState('');

  const categoryName = SLUG_TO_NAME[slug] || slug?.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) || 'Category';
  const icon = CATEGORY_ICONS[categoryName] || '📦';

  // Filter products matching this category
  let products = ALL_PRODUCTS.filter(p =>
    p.cats?.some(c => c.toLowerCase() === categoryName.toLowerCase()) ||
    p.category?.toLowerCase() === categoryName.toLowerCase() ||
    p.category?.toLowerCase() === slug?.toLowerCase()
  );

  // Apply search
  if (search) products = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  // Apply sort
  if (sort === 'low') products = [...products].sort((a, b) => a.newPrice - b.newPrice);
  if (sort === 'high') products = [...products].sort((a, b) => b.newPrice - a.newPrice);
  if (sort === 'rating') products = [...products].sort((a, b) => b.rating - a.rating);

  return (
    <Layout>
      {/* Category Hero */}
      <div style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%)', color: '#fff', padding: '36px 20px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
          <div style={{ fontSize: 72 }}>{icon}</div>
          <div>
            <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 4 }}>
              <Link to="/" style={{ color: '#94a3b8', textDecoration: 'none' }}>Home</Link> / <Link to="/retail" style={{ color: '#94a3b8', textDecoration: 'none' }}>Retail</Link> / {categoryName}
            </div>
            <h1 style={{ fontSize: 32, fontWeight: 900, marginBottom: 6 }}>{categoryName}</h1>
            <p style={{ color: '#94a3b8', fontSize: 14 }}>{products.length > 0 ? `${products.length} products available` : 'Browse products in this category'}</p>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 20px' }}>
        {/* Filters bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', background: '#fff', border: '1px solid #ddd', borderRadius: 6, overflow: 'hidden', maxWidth: 360 }}>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder={`Search in ${categoryName}...`}
              style={{ flex: 1, border: 'none', padding: '9px 14px', fontSize: 13, outline: 'none' }} />
            <button style={{ background: '#2e6dce', border: 'none', padding: '9px 16px', color: '#fff', cursor: 'pointer' }}>
              <i className="fas fa-search" />
            </button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 13, color: '#666' }}>{products.length} results</span>
            <select value={sort} onChange={e => setSort(e.target.value)} style={{ padding: '8px 14px', border: '1px solid #ddd', borderRadius: 4, fontSize: 13 }}>
              <option value="default">Sort: Relevance</option>
              <option value="low">Price: Low → High</option>
              <option value="high">Price: High → Low</option>
              <option value="rating">Best Rated</option>
            </select>
          </div>
        </div>

        {products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: '#fff', borderRadius: 12, border: '1px solid #e5e5e5' }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>{icon}</div>
            <h3 style={{ fontWeight: 700, marginBottom: 8, color: '#1a1a2e' }}>{categoryName} — Coming Soon</h3>
            <p style={{ color: '#666', fontSize: 14, marginBottom: 24 }}>
              We're adding products in this category. In the meantime, request a quote and we'll source it for you.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/request-quote"><button style={{ background: '#2e6dce', color: '#fff', border: 'none', padding: '12px 28px', borderRadius: 6, fontWeight: 700, cursor: 'pointer' }}>Request a Quote</button></Link>
              <Link to="/retail"><button style={{ background: '#f0f4fb', border: '1px solid #dce8fb', color: '#2e6dce', padding: '12px 28px', borderRadius: 6, fontWeight: 700, cursor: 'pointer' }}>Browse All Products</button></Link>
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 18 }}>
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}

        {/* RFQ CTA */}
        <div style={{ background: '#f0f4ff', border: '1px solid #dce8fb', borderRadius: 8, padding: '24px 28px', marginTop: 36, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h3 style={{ fontWeight: 700, marginBottom: 4 }}>Can't find what you need in {categoryName}?</h3>
            <p style={{ color: '#666', fontSize: 13 }}>Submit a quote request and we'll match you with a verified vendor within 24 hours.</p>
          </div>
          <Link to="/request-quote">
            <button style={{ background: '#2e6dce', color: '#fff', border: 'none', padding: '12px 28px', borderRadius: 6, fontWeight: 700, cursor: 'pointer' }}>Request for Quote</button>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
