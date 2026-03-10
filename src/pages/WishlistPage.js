import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import Stars from '../components/Stars';

export default function WishlistPage() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { success } = useToast();

  if (wishlist.length === 0) {
    return (
      <Layout>
        <div style={{ textAlign: 'center', padding: '80px 20px' }}>
          <div style={{ fontSize: 72, marginBottom: 20 }}>🤍</div>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: '#333', marginBottom: 12 }}>Your wishlist is empty</h2>
          <p style={{ color: '#888', marginBottom: 28 }}>Save products you love and come back to them later.</p>
          <Link to="/retail">
            <button style={{ background: '#2e6dce', color: '#fff', border: 'none', padding: '14px 36px', borderRadius: 6, fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>
              Browse Products
            </button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#222' }}>❤️ My Wishlist ({wishlist.length})</h1>
          <Link to="/retail">
            <button style={{ background: '#f0f4fb', border: '1px solid #dce8fb', color: '#2e6dce', padding: '10px 20px', borderRadius: 6, fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
              Continue Shopping
            </button>
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 20 }}>
          {wishlist.map(product => {
            const pct = Math.round(((product.oldPrice - product.newPrice) / product.oldPrice) * 100);
            return (
              <div key={product.id} style={{ border: '1px solid #e8e8e8', borderRadius: 8, background: '#fff', overflow: 'hidden', position: 'relative' }}>
                <button
                  onClick={() => { removeFromWishlist(product.id); success('💔 Removed from wishlist'); }}
                  style={{ position: 'absolute', top: 10, right: 10, zIndex: 2, background: '#fff', border: '1px solid #eee', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 16 }}>
                  ✕
                </button>
                <span style={{ position: 'absolute', top: 10, left: 10, background: '#e53e3e', color: '#fff', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 3, zIndex: 2 }}>{pct}% OFF</span>
                <Link to={`/product-info/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div style={{ background: '#f9f9f9', height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
                    onClick={() => { addToCart(product); success(`🛒 Added to cart!`); }}
                    style={{ width: '100%', background: '#2e6dce', color: '#fff', border: 'none', padding: '10px', borderRadius: 4, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                    🛒 Move to Cart
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}
