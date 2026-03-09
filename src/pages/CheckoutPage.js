import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useCart } from '../context/CartContext';

export default function CheckoutPage() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', city: '', pincode: '', payment: 'cod' });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const shipping = cartTotal >= 10000 ? 0 : 99;
  const total = cartTotal + shipping;

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Required';
    if (!form.email.includes('@')) e.email = 'Valid email required';
    if (form.phone.length < 10) e.phone = 'Valid phone required';
    if (!form.address.trim()) e.address = 'Required';
    if (!form.city.trim()) e.city = 'Required';
    if (form.pincode.length < 6) e.pincode = 'Valid pincode required';
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setSubmitted(true);
    clearCart();
  };

  if (cartItems.length === 0 && !submitted) {
    return (
      <Layout>
        <div style={{ textAlign: 'center', padding: '80px 20px' }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🛒</div>
          <h2 style={{ fontWeight: 700 }}>Your cart is empty</h2>
          <Link to="/retail"><button style={{ marginTop: 20, background: '#2e6dce', color: '#fff', border: 'none', padding: '12px 32px', borderRadius: 4, fontWeight: 700, cursor: 'pointer', fontSize: 15 }}>Shop Now</button></Link>
        </div>
      </Layout>
    );
  }

  if (submitted) {
    return (
      <Layout>
        <div style={{ textAlign: 'center', padding: '80px 20px', maxWidth: 500, margin: '0 auto' }}>
          <div style={{ fontSize: 80, marginBottom: 20 }}>🎉</div>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: '#22c55e', marginBottom: 12 }}>Order Placed!</h2>
          <p style={{ color: '#555', fontSize: 15, lineHeight: 1.7, marginBottom: 28 }}>
            Thank you <strong>{form.name}</strong>! Your order has been placed successfully.<br />
            A confirmation will be sent to <strong>{form.email}</strong>.
          </p>
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, padding: '16px 24px', marginBottom: 28, textAlign: 'left' }}>
            <p style={{ fontSize: 13, color: '#166534', margin: 0 }}>
              📦 Estimated delivery: <strong>3-7 business days</strong><br />
              💳 Payment: <strong>{form.payment === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</strong><br />
              📍 Delivering to: <strong>{form.city}, {form.pincode}</strong>
            </p>
          </div>
          <Link to="/"><button style={{ background: '#2e6dce', color: '#fff', border: 'none', padding: '13px 36px', borderRadius: 4, fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>Back to Home</button></Link>
        </div>
      </Layout>
    );
  }

  const field = (label, key, type = 'text', placeholder = '') => (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 5, color: '#444' }}>{label} *</label>
      <input
        type={type}
        value={form[key]}
        onChange={e => { setForm(f => ({ ...f, [key]: e.target.value })); setErrors(er => ({ ...er, [key]: '' })); }}
        placeholder={placeholder}
        style={{ width: '100%', padding: '10px 12px', border: `1px solid ${errors[key] ? '#e53e3e' : '#ddd'}`, borderRadius: 4, fontSize: 14, boxSizing: 'border-box', outline: 'none' }}
      />
      {errors[key] && <span style={{ fontSize: 11, color: '#e53e3e' }}>{errors[key]}</span>}
    </div>
  );

  return (
    <Layout>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 20px' }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 28, color: '#222' }}>Checkout</h1>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 28, alignItems: 'start' }}>
          {/* Form */}
          <div style={{ background: '#fff', border: '1px solid #e8e8e8', borderRadius: 6, padding: '28px' }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20, paddingBottom: 12, borderBottom: '1px solid #eee' }}>Shipping Details</h3>
            {field('Full Name', 'name', 'text', 'Enter your full name')}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>{field('Email', 'email', 'email', 'you@example.com')}</div>
              <div>{field('Phone', 'phone', 'tel', '10-digit mobile number')}</div>
            </div>
            {field('Address', 'address', 'text', 'House No, Street, Area')}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>{field('City', 'city', 'text', 'City')}</div>
              <div>{field('Pincode', 'pincode', 'text', '6-digit pincode')}</div>
            </div>

            <h3 style={{ fontSize: 16, fontWeight: 700, margin: '24px 0 16px', paddingBottom: 12, borderBottom: '1px solid #eee' }}>Payment Method</h3>
            {[['cod', '💵 Cash on Delivery'], ['online', '💳 Online Payment (UPI / Card)']].map(([val, label]) => (
              <label key={val} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', border: `2px solid ${form.payment === val ? '#2e6dce' : '#ddd'}`, borderRadius: 6, marginBottom: 10, cursor: 'pointer', background: form.payment === val ? '#f0f4ff' : '#fff', transition: 'all 0.2s' }}>
                <input type="radio" value={val} checked={form.payment === val} onChange={e => setForm(f => ({ ...f, payment: e.target.value }))} style={{ accentColor: '#2e6dce' }} />
                <span style={{ fontWeight: 600, fontSize: 14 }}>{label}</span>
              </label>
            ))}

            <button onClick={handleSubmit}
              style={{ width: '100%', background: '#2e6dce', color: '#fff', border: 'none', padding: '15px', borderRadius: 4, fontWeight: 700, fontSize: 16, cursor: 'pointer', marginTop: 20, letterSpacing: 0.5 }}>
              Place Order →
            </button>
          </div>

          {/* Order Summary */}
          <div style={{ background: '#fff', border: '1px solid #e8e8e8', borderRadius: 6, padding: '24px', position: 'sticky', top: 80 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid #eee' }}>Order Summary</h3>
            <div style={{ maxHeight: 280, overflowY: 'auto', marginBottom: 16 }}>
              {cartItems.map(item => (
                <div key={item.id} style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12, paddingBottom: 12, borderBottom: '1px solid #f5f5f5' }}>
                  <div style={{ width: 48, height: 48, background: '#f9f9f9', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid #eee' }}>
                    {item.img ? <img src={item.img} alt={item.name} style={{ maxWidth: 44, maxHeight: 44, objectFit: 'contain' }} /> : <span style={{ fontSize: 24 }}>{item.emoji || '🛍️'}</span>}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 12, color: '#333', margin: 0, lineHeight: 1.4 }}>{item.name.length > 40 ? item.name.slice(0, 40) + '...' : item.name}</p>
                    <p style={{ fontSize: 12, color: '#888', margin: '3px 0 0' }}>Qty: {item.qty} × ₹{item.newPrice.toLocaleString()}</p>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#2e6dce' }}>₹{(item.newPrice * item.qty).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div style={{ borderTop: '1px solid #eee', paddingTop: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#666', marginBottom: 8 }}>
                <span>Subtotal</span><span>₹{cartTotal.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#666', marginBottom: 12 }}>
                <span>Shipping</span><span style={{ color: shipping === 0 ? '#22c55e' : '#333', fontWeight: 600 }}>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 17, color: '#222' }}>
                <span>Total</span><span style={{ color: '#2e6dce' }}>₹{total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
