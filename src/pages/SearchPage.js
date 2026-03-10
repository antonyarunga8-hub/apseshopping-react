import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Layout from '../components/Layout';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { ALL_PRODUCTS } from '../data-products';
import Stars from '../components/Stars';

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
      <button
        onClick={() => {
          const added = toggleWishlist(product);
          success(added ? `❤️ Added to wishlist` : `💔 Removed from wishlist`);
        }}
        style={{ position: 'absolute', top: 10, right: 10, zIndex: 2, background: '#fff', border: '1px solid #eee', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.1)' }}>
        {wishlisted ? '❤️' : '🤍'}
      </button>
      <span style={{ position: 'absolute', top: 10, left: 10, background: '#e53e3e', color: '#fff', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 3, zIndex: 2 }}>{pct}% OFF</span>
      <Link to={`/product-info/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <div style={{ background: '#f9f9f9', height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
          {product.img
            ? <img src={product.img} alt={product.name} style={{ maxHeight: 185, maxWidth: '90%', objectFit: 'contain' }} />
            : <span style={{ fontSize: 64 }}>{product.emoji || '🛍️'}</span>}
        </div>
        <div style={{ padding: '14px 14px 4px' }}>
          <h3 style={{ fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 6, lineHeight: 1.5 }}>{product.name}</h3>
          <Stars n={product.rating} size={12} />
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 8 }}>
            <span style={{ color: '#999', textDecoration: 'line-through', fontSize: 12 }}>₹{product.oldPrice.toLocaleString()}</span>
            <span style={{ color: '#2e6dce', fontWeight: 700, fontSize: 17 }}>₹{product.newPrice.toLocaleString()}</span>
          </div>
        </div>
      </Link>
      <div style={{ padding: '8px 14px 14px' }}>
        <button
          onClick={() => { addToCart(product); setAdded(true); success(`🛒 ${product.name.slice(0, 30)}... added to cart`); setTimeout(() => setAdded(false), 2000); }}
          style={{ width: '100%', background: added ? '#22c55e' : '#333', color: '#fff', border: 'none', padding: '9px', borderRadius: 3, fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s' }}>
          {added ? '✓ Added!' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sort, setSort] = useState('default');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [localQ, setLocalQ] = useState(searchParams.get('q') || '');

  const q = searchParams.get('q') || '';

  let results = ALL_PRODUCTS.filter(p => {
    const term = q.toLowerCase();
    return (
      p.name.toLowerCase().includes(term) ||
      p.desc?.toLowerCase().includes(term) ||
      p.brand?.toLowerCase().includes(term) ||
      p.cats?.some(c => c.toLowerCase().includes(term))
    );
  });

  if (minPrice) results = results.filter(p => p.newPrice >= Number(minPrice));
  if (maxPrice) results = results.filter(p => p.newPrice <= Number(maxPrice));
  if (sort === 'low') results = [...results].sort((a, b) => a.newPrice - b.newPrice);
  if (sort === 'high') results = [...results].sort((a, b) => b.newPrice - a.newPrice);
  if (sort === 'rating') results = [...results].sort((a, b) => (b.rating || 0) - (a.rating || 0));

  const handleSearch = (e) => {
    e.preventDefault();
    if (localQ.trim()) setSearchParams({ q: localQ.trim() });
  };

  return (
    <Layout>
      {/* Search Header */}
      <div style={{ background: 'linear-gradient(135deg,#1a1a2e,#2e6dce)', color: '#fff', padding: '36px 20px' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
          <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 6 }}>
            {q ? `Search results for "${q}"` : 'Search Products'}
          </h1>
          {q && <p style={{ opacity: 0.8, fontSize: 14, marginBottom: 20 }}>{results.length} product{results.length !== 1 ? 's' : ''} found</p>}
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: 0, background: '#fff', borderRadius: 6, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
            <input
              value={localQ}
              onChange={e => setLocalQ(e.target.value)}
              placeholder="Search products, brands, categories..."
              style={{ flex: 1, border: 'none', padding: '14px 20px', fontSize: 15, outline: 'none', color: '#333' }}
            />
            <button type="submit" style={{ background: '#2e6dce', border: 'none', padding: '14px 24px', color: '#fff', cursor: 'pointer', fontSize: 16, fontWeight: 700 }}>
              🔍 Search
            </button>
          </form>
        </div>
      </div>

      {q && (
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 28, alignItems: 'start' }}>

            {/* Filters Sidebar */}
            <div style={{ background: '#fff', border: '1px solid #e8e8e8', borderRadius: 8, padding: '20px' }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, color: '#1a1a2e' }}>🔧 Filters</h3>

              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#555', marginBottom: 10, textTransform: 'uppercase' }}>Price Range</div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <input
                    type="number" placeholder="Min" value={minPrice}
                    onChange={e => setMinPrice(e.target.value)}
                    style={{ width: '100%', border: '1px solid #ddd', borderRadius: 4, padding: '7px 10px', fontSize: 12 }}
                  />
                  <span style={{ color: '#aaa', fontSize: 12 }}>–</span>
                  <input
                    type="number" placeholder="Max" value={maxPrice}
                    onChange={e => setMaxPrice(e.target.value)}
                    style={{ width: '100%', border: '1px solid #ddd', borderRadius: 4, padding: '7px 10px', fontSize: 12 }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#555', marginBottom: 10, textTransform: 'uppercase' }}>Sort By</div>
                {[['default', 'Relevance'], ['low', 'Price: Low to High'], ['high', 'Price: High to Low'], ['rating', 'Highest Rated']].map(([val, label]) => (
                  <label key={val} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, cursor: 'pointer', fontSize: 13 }}>
                    <input type="radio" name="sort" value={val} checked={sort === val} onChange={() => setSort(val)} style={{ accentColor: '#2e6dce' }} />
                    {label}
                  </label>
                ))}
              </div>

              {(minPrice || maxPrice || sort !== 'default') && (
                <button
                  onClick={() => { setMinPrice(''); setMaxPrice(''); setSort('default'); }}
                  style={{ width: '100%', background: '#fee2e2', border: '1px solid #fca5a5', color: '#dc2626', padding: '8px', borderRadius: 4, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                  ✕ Clear Filters
                </button>
              )}
            </div>

            {/* Results */}
            <div>
              {results.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px', background: '#fff', borderRadius: 8, border: '1px solid #e8e8e8' }}>
                  <div style={{ fontSize: 64, marginBottom: 16 }}>🔍</div>
                  <h3 style={{ fontWeight: 700, marginBottom: 8 }}>No results for "{q}"</h3>
                  <p style={{ color: '#666', marginBottom: 20 }}>Try different keywords or browse our categories.</p>
                  <Link to="/retail"><button style={{ background: '#2e6dce', color: '#fff', border: 'none', padding: '12px 28px', borderRadius: 6, fontWeight: 700, cursor: 'pointer' }}>Browse All Products</button></Link>
                </div>
              ) : (
                <>
                  <p style={{ fontSize: 13, color: '#777', marginBottom: 16 }}>Showing {results.length} result{results.length !== 1 ? 's' : ''} for <strong>"{q}"</strong></p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: 18 }}>
                    {results.map(p => <ProductCard key={p.id} product={p} />)}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {!q && (
        <div style={{ maxWidth: 800, margin: '40px auto', padding: '0 20px', textAlign: 'center' }}>
          <p style={{ color: '#888', fontSize: 15 }}>Start typing to search products, brands, or categories.</p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', marginTop: 20 }}>
            {['Electronics', 'Camera', 'Kitchen', 'Fashion', 'Furniture'].map(tag => (
              <button key={tag} onClick={() => { setLocalQ(tag); setSearchParams({ q: tag }); }}
                style={{ background: '#f0f4fb', border: '1px solid #dce8fb', color: '#2e6dce', padding: '8px 18px', borderRadius: 20, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}
    </Layout>
  );
}
