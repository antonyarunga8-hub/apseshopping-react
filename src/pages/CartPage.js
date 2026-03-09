import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { useCart } from '../context/CartContext';

export default function CartPage() {
  const { cartItems, removeFromCart, updateQty, cartTotal, clearCart } = useCart();

  if (cartItems.length === 0) {
    return (
      <Layout>
        <div style={{ textAlign: 'center', padding: '80px 20px' }}>
          <div style={{ fontSize: 72, marginBottom: 20 }}>🛒</div>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: '#333', marginBottom: 12 }}>Your cart is empty</h2>
          <p style={{ color: '#888', marginBottom: 28 }}>Looks like you haven't added anything yet.</p>
          <Link to="/retail">
            <button style={{ background: '#2e6dce', color: '#fff', border: 'none', padding: '14px 36px', borderRadius: 4, fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>
              Continue Shopping
            </button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 20px' }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 28, color: '#222' }}>🛒 Your Cart</h1>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 28, alignItems: 'start' }}>
          {/* Cart Items */}
          <div>
            {cartItems.map(item => (
              <div key={item.id} style={{ display: 'flex', gap: 20, padding: '20px', background: '#fff', border: '1px solid #e8e8e8', borderRadius: 6, marginBottom: 14, alignItems: 'center' }}>
                {/* Image */}
                <div style={{ width: 90, height: 90, background: '#f9f9f9', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid #eee' }}>
                  {item.img
                    ? <img src={item.img} alt={item.name} style={{ maxWidth: 80, maxHeight: 80, objectFit: 'contain' }} />
                    : <span style={{ fontSize: 44 }}>{item.emoji || '🛍️'}</span>}
                </div>

                {/* Details */}
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 600, color: '#333', marginBottom: 6, lineHeight: 1.4 }}>{item.name}</h3>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12 }}>
                    <span style={{ color: '#999', textDecoration: 'line-through', fontSize: 12 }}>₹{item.oldPrice?.toLocaleString()}</span>
                    <span style={{ color: '#2e6dce', fontWeight: 700, fontSize: 16 }}>₹{item.newPrice.toLocaleString()}</span>
                  </div>
                  {/* Qty controls */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <button onClick={() => updateQty(item.id, item.qty - 1)}
                      style={{ width: 30, height: 30, border: '1px solid #ddd', background: '#f5f5f5', borderRadius: 4, cursor: 'pointer', fontSize: 16, fontWeight: 700 }}>−</button>
                    <span style={{ fontSize: 15, fontWeight: 600, minWidth: 24, textAlign: 'center' }}>{item.qty}</span>
                    <button onClick={() => updateQty(item.id, item.qty + 1)}
                      style={{ width: 30, height: 30, border: '1px solid #ddd', background: '#f5f5f5', borderRadius: 4, cursor: 'pointer', fontSize: 16, fontWeight: 700 }}>+</button>
                    <span style={{ color: '#aaa', fontSize: 12, marginLeft: 8 }}>Subtotal: <strong style={{ color: '#333' }}>₹{(item.newPrice * item.qty).toLocaleString()}</strong></span>
                  </div>
                </div>

                {/* Remove */}
                <button onClick={() => removeFromCart(item.id)}
                  style={{ background: 'none', border: 'none', color: '#e53e3e', cursor: 'pointer', fontSize: 20, padding: 4 }}>✕</button>
              </div>
            ))}

            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
              <Link to="/retail">
                <button style={{ background: '#f5f5f5', color: '#333', border: '1px solid #ddd', padding: '10px 22px', borderRadius: 4, fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
                  ← Continue Shopping
                </button>
              </Link>
              <button onClick={clearCart}
                style={{ background: '#fff', color: '#e53e3e', border: '1px solid #e53e3e', padding: '10px 22px', borderRadius: 4, fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
                Clear Cart
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div style={{ background: '#fff', border: '1px solid #e8e8e8', borderRadius: 6, padding: '24px', position: 'sticky', top: 80 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20, paddingBottom: 12, borderBottom: '1px solid #eee' }}>Order Summary</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: 14, color: '#666' }}>
              <span>Items ({cartItems.reduce((s, i) => s + i.qty, 0)})</span>
              <span>₹{cartTotal.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: 14, color: '#666' }}>
              <span>Shipping</span>
              <span style={{ color: '#22c55e', fontWeight: 600 }}>{cartTotal >= 10000 ? 'FREE' : '₹99'}</span>
            </div>
            <div style={{ borderTop: '1px solid #eee', paddingTop: 14, marginTop: 14, display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 17 }}>
              <span>Total</span>
              <span style={{ color: '#2e6dce' }}>₹{(cartTotal + (cartTotal >= 10000 ? 0 : 99)).toLocaleString()}</span>
            </div>
            {cartTotal < 10000 && (
              <p style={{ fontSize: 11, color: '#888', marginTop: 8 }}>Add ₹{(10000 - cartTotal).toLocaleString()} more for FREE shipping!</p>
            )}
            <Link to="/checkout">
              <button style={{ width: '100%', background: '#2e6dce', color: '#fff', border: 'none', padding: '14px', borderRadius: 4, fontWeight: 700, fontSize: 15, cursor: 'pointer', marginTop: 18, letterSpacing: 0.5 }}>
                Proceed to Checkout →
              </button>
            </Link>
            <Link to="/request-quote">
              <button style={{ width: '100%', background: '#f5f5f5', color: '#333', border: '1px solid #ddd', padding: '11px', borderRadius: 4, fontWeight: 600, fontSize: 13, cursor: 'pointer', marginTop: 10 }}>
                Request for Quote
              </button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
