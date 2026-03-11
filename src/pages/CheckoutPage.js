import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useOrders, generateOrder, VENDOR_MAP, SHIPPING_RATE_PER_KG, MIN_SHIPPING_PER_VENDOR } from '../context/OrderContext';

function getVendorGroups(cartItems) {
  const groups = {};
  cartItems.forEach(item => {
    const vendorId = (VENDOR_MAP[item.category] || VENDOR_MAP['default']).id;
    if (!groups[vendorId]) groups[vendorId] = 0;
    groups[vendorId] += (item.weightKg || 0.5) * item.qty;
  });
  return groups;
}

function estimateShipping(cartItems) {
  if (!cartItems.length) return 0;
  return Object.values(getVendorGroups(cartItems)).reduce((total, weightKg) => {
    return total + Math.max(Math.round(weightKg * SHIPPING_RATE_PER_KG), MIN_SHIPPING_PER_VENDOR);
  }, 0);
}

// ── Baby Bill Card ────────────────────────────────────────────────
function BabyBill({ bill, index }) {
  const [open, setOpen] = useState(index === 0);
  const statusColors = { confirmed: '#2e6dce', packed: '#f59e0b', shipped: '#7c3aed', delivered: '#22c55e' };
  return (
    <div style={{ border: '1px solid #e5e5e5', borderRadius: 10, marginBottom: 14, overflow: 'hidden' }}>
      {/* Bill Header */}
      <div
        onClick={() => setOpen(o => !o)}
        style={{ background: '#f8faff', padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', borderBottom: open ? '1px solid #e5e5e5' : 'none' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#2e6dce', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 14, flexShrink: 0 }}>
            {index + 1}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: '#1a1a2e' }}>📦 {bill.vendor.name}</div>
            <div style={{ fontSize: 11, color: '#888' }}>{bill.vendor.city} · GSTIN: {bill.vendor.gstin} · Bill #{bill.billId}</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ background: statusColors[bill.status] + '20', color: statusColors[bill.status], fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20, textTransform: 'uppercase' }}>
            {bill.status}
          </span>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontWeight: 800, color: '#2e6dce', fontSize: 15 }}>₹{bill.totalAmount.toLocaleString()}</div>
            <div style={{ fontSize: 11, color: '#888' }}>{bill.totalPackages} pkg · {bill.totalWeightKg} kg</div>
          </div>
          <span style={{ color: '#2e6dce', fontSize: 18 }}>{open ? '▲' : '▼'}</span>
        </div>
      </div>

      {open && (
        <div style={{ padding: '18px 20px' }}>
          {/* Line items */}
          {bill.lineItems.map(item => (
            <div key={item.productId} style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12, paddingBottom: 12, borderBottom: '1px solid #f5f5f5' }}>
              <div style={{ width: 44, height: 44, background: '#f9f9f9', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid #eee' }}>
                {item.img ? <img src={item.img} alt={item.productName} style={{ maxWidth: 40, maxHeight: 40, objectFit: 'contain' }} /> : <span style={{ fontSize: 22 }}>{item.emoji || '🛍️'}</span>}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#333' }}>{item.productName}</div>
                <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>
                  Qty: {item.qty} × ₹{item.unitPrice.toLocaleString()} &nbsp;|&nbsp;
                  {item.physical.totalWeightKg} kg &nbsp;|&nbsp;
                  {item.physical.lengthCm}×{item.physical.widthCm}×{item.physical.heightCm} cm &nbsp;|&nbsp;
                  {item.physical.packageCount} pkg
                </div>
              </div>
              <span style={{ fontWeight: 700, color: '#1a1a2e', fontSize: 14 }}>₹{item.lineTotal.toLocaleString()}</span>
            </div>
          ))}

          {/* Bill totals */}
          <div style={{ background: '#f9fafb', borderRadius: 8, padding: '14px 16px', marginTop: 8 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#555' }}>
                <span>Products Subtotal</span><span>₹{bill.subtotal.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#555' }}>
                <span>Shipping ({bill.totalWeightKg} kg · {bill.totalPackages} packages)</span>
                <span>₹{bill.shippingAmount.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#666', paddingTop: 4, borderTop: '1px dashed #ddd' }}>
                <span>Approx. Dimensions</span><span>{bill.estimatedDimensions}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: 15, color: '#2e6dce', paddingTop: 6, borderTop: '1px solid #ddd', marginTop: 2 }}>
                <span>Vendor Bill Total</span><span>₹{bill.totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Order Confirmation ────────────────────────────────────────────
function OrderConfirmation({ order }) {
  const [showBills, setShowBills] = useState(false);
  return (
    <div style={{ maxWidth: 860, margin: '40px auto', padding: '0 20px' }}>
      {/* Success header */}
      <div style={{ textAlign: 'center', padding: '40px 20px 32px', background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)', borderRadius: 16, marginBottom: 28, border: '1px solid #86efac' }}>
        <div style={{ fontSize: 72, marginBottom: 12 }}>🎉</div>
        <h2 style={{ fontSize: 28, fontWeight: 900, color: '#166534', marginBottom: 6 }}>Order Confirmed!</h2>
        <p style={{ color: '#166534', fontSize: 15, marginBottom: 4 }}>
          Thank you <strong>{order.customer.name}</strong>! Your order has been placed.
        </p>
        <p style={{ fontSize: 13, color: '#555' }}>
          Confirmation sent to <strong>{order.customer.email}</strong> &nbsp;·&nbsp;
          Order ID: <strong style={{ color: '#2e6dce' }}>{order.orderId}</strong>
        </p>
      </div>

      {/* Parent Order Summary */}
      <div style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: 12, padding: '24px 28px', marginBottom: 24 }}>
        <h3 style={{ fontWeight: 800, fontSize: 17, marginBottom: 20, paddingBottom: 12, borderBottom: '1px solid #f0f0f0', color: '#1a1a2e' }}>
          📋 Parent Order Summary &nbsp;
          <span style={{ fontSize: 12, fontWeight: 600, color: '#888' }}>#{order.orderId}</span>
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 20 }}>
          {[
            ['📦 Items', `${order.itemCount} products`],
            ['🏭 Vendors', `${order.vendorCount} seller${order.vendorCount > 1 ? 's' : ''}`],
            ['📬 Packages', `${order.totalPackages} total`],
            ['⚖️ Total Weight', `${order.totalWeightKg} kg`],
            ['📅 Est. Delivery', order.estimatedDelivery],
            ['💳 Payment', order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online'],
          ].map(([label, val]) => (
            <div key={label} style={{ background: '#f9fafb', borderRadius: 8, padding: '12px 14px' }}>
              <div style={{ fontSize: 11, color: '#888', marginBottom: 3 }}>{label}</div>
              <div style={{ fontWeight: 700, fontSize: 14, color: '#1a1a2e' }}>{val}</div>
            </div>
          ))}
        </div>

        {/* Grand total breakdown */}
        <div style={{ background: '#f0f4ff', borderRadius: 8, padding: '16px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#555', marginBottom: 6 }}>
            <span>Products Subtotal</span><span>₹{order.productSubtotal.toLocaleString()}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#555', marginBottom: 10 }}>
            <span>Total Shipping ({order.vendorCount} vendor{order.vendorCount > 1 ? 's' : ''})</span>
            <span>₹{order.totalShipping.toLocaleString()}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 900, fontSize: 18, color: '#2e6dce', paddingTop: 10, borderTop: '2px solid #dce8fb' }}>
            <span>Grand Total</span><span>₹{order.grandTotal.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Baby Bills */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ fontWeight: 800, fontSize: 17, color: '#1a1a2e', margin: 0 }}>
            🧾 Vendor Bills ({order.babyBills.length})
          </h3>
          <button
            onClick={() => setShowBills(v => !v)}
            style={{ background: '#f0f4fb', border: '1px solid #dce8fb', color: '#2e6dce', padding: '8px 18px', borderRadius: 6, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}
          >
            {showBills ? 'Hide Bills' : 'View All Vendor Bills'}
          </button>
        </div>

        {(showBills || order.babyBills.length <= 2) && order.babyBills.map((bill, i) => (
          <BabyBill key={bill.billId} bill={bill} index={i} />
        ))}
      </div>

      <div style={{ textAlign: 'center', marginTop: 28, display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link to="/"><button style={{ background: '#2e6dce', color: '#fff', border: 'none', padding: '13px 32px', borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>Continue Shopping</button></Link>
        <Link to="/my-orders"><button style={{ background: '#f0f4fb', border: '1px solid #dce8fb', color: '#2e6dce', padding: '13px 32px', borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>View My Orders</button></Link>
      </div>
    </div>
  );
}

// ── Checkout Page ─────────────────────────────────────────────────
export default function CheckoutPage() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const { placeOrder } = useOrders();

  const [form, setForm] = useState({
    name: user?.name || '', email: user?.email || '', phone: user?.phone || '',
    address: '', city: '', pincode: '', payment: 'cod',
  });
  const [placedOrder, setPlacedOrder] = useState(null);
  const [errors, setErrors] = useState({});

  const shipping = useMemo(() => estimateShipping(cartItems), [cartItems]);
  const vendorCount = useMemo(() => Object.keys(getVendorGroups(cartItems)).length, [cartItems]);
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
    const order = generateOrder({
      cartItems,
      shipping,
      form,
      userId: user?.id || 'guest',
    });
    placeOrder(order);
    clearCart();
    setPlacedOrder(order);
  };

  if (cartItems.length === 0 && !placedOrder) {
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

  if (placedOrder) {
    return <Layout><OrderConfirmation order={placedOrder} /></Layout>;
  }

  const field = (label, key, type = 'text', placeholder = '') => (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 5, color: '#444' }}>{label} *</label>
      <input
        type={type} value={form[key]}
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

            {/* Vendor breakdown preview */}
            <div style={{ background: '#f9fafb', border: '1px solid #e5e5e5', borderRadius: 8, padding: '14px 16px', marginTop: 4, marginBottom: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#555', marginBottom: 8 }}>📦 Your order will be fulfilled by:</div>
              <div style={{ fontSize: 12, color: '#777', lineHeight: 1.8 }}>
                Each vendor ships separately. Individual vendor bills will be shown after placing the order.
              </div>
            </div>

            <h3 style={{ fontSize: 16, fontWeight: 700, margin: '4px 0 16px', paddingBottom: 12, borderBottom: '1px solid #eee' }}>Payment Method</h3>
            {[['cod', '💵 Cash on Delivery'], ['online', '💳 Online Payment (UPI / Card)']].map(([val, label]) => (
              <label key={val} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', border: `2px solid ${form.payment === val ? '#2e6dce' : '#ddd'}`, borderRadius: 6, marginBottom: 10, cursor: 'pointer', background: form.payment === val ? '#f0f4ff' : '#fff', transition: 'all 0.2s' }}>
                <input type="radio" value={val} checked={form.payment === val} onChange={e => setForm(f => ({ ...f, payment: e.target.value }))} style={{ accentColor: '#2e6dce' }} />
                <span style={{ fontWeight: 600, fontSize: 14 }}>{label}</span>
              </label>
            ))}

            <button onClick={handleSubmit}
              style={{ width: '100%', background: '#2e6dce', color: '#fff', border: 'none', padding: '15px', borderRadius: 4, fontWeight: 700, fontSize: 16, cursor: 'pointer', marginTop: 20, letterSpacing: 0.5 }}>
              Place Order & Generate Bills →
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
                <span>Shipping (est.)</span>
                <span style={{ color: '#333', fontWeight: 600 }}>₹{shipping.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 17, color: '#222' }}>
                <span>Total</span><span style={{ color: '#2e6dce' }}>₹{total.toLocaleString()}</span>
              </div>
              <p style={{ fontSize: 11, color: '#aaa', marginTop: 8 }}>* Estimated shipping — split across {vendorCount} vendor(s) by weight</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
