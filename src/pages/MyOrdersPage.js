import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';

const STATUS_COLOR = {
  confirmed: '#2e6dce', packed: '#f59e0b', shipped: '#7c3aed', delivered: '#22c55e',
};

function BabyBillMini({ bill }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ border: '1px solid #e5e5e5', borderRadius: 8, marginBottom: 8 }}>
      <div onClick={() => setOpen(o => !o)} style={{ padding: '10px 16px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fafafa', borderRadius: open ? '8px 8px 0 0' : 8 }}>
        <div>
          <span style={{ fontWeight: 700, fontSize: 13, color: '#1a1a2e' }}>{bill.vendor.name}</span>
          <span style={{ fontSize: 11, color: '#888', marginLeft: 8 }}>{bill.vendor.city}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ background: (STATUS_COLOR[bill.status] || '#888') + '20', color: STATUS_COLOR[bill.status] || '#888', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20, textTransform: 'uppercase' }}>{bill.status}</span>
          <span style={{ fontWeight: 700, color: '#2e6dce', fontSize: 13 }}>₹{bill.totalAmount.toLocaleString()}</span>
          <span style={{ color: '#2e6dce', fontSize: 14 }}>{open ? '▲' : '▼'}</span>
        </div>
      </div>
      {open && (
        <div style={{ padding: '12px 16px', borderTop: '1px solid #eee' }}>
          {bill.lineItems.map(item => (
            <div key={item.productId} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#444', marginBottom: 6, paddingBottom: 6, borderBottom: '1px solid #f5f5f5' }}>
              <span>{item.emoji || '🛍️'} {item.productName.slice(0, 50)} × {item.qty}</span>
              <span style={{ fontWeight: 600 }}>₹{item.lineTotal.toLocaleString()}</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#666', marginTop: 6 }}>
            <span>Shipping · {bill.totalWeightKg}kg · {bill.totalPackages} pkg</span>
            <span>₹{bill.shippingAmount.toLocaleString()}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 13, color: '#2e6dce', marginTop: 6, paddingTop: 6, borderTop: '1px solid #eee' }}>
            <span>Vendor Total</span><span>₹{bill.totalAmount.toLocaleString()}</span>
          </div>
        </div>
      )}
    </div>
  );
}

function OrderCard({ order }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ border: '1px solid #e5e5e5', borderRadius: 12, marginBottom: 16, overflow: 'hidden' }}>
      {/* Parent order header */}
      <div onClick={() => setOpen(o => !o)} style={{ padding: '18px 22px', cursor: 'pointer', background: '#f9fafb', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: open ? '1px solid #e5e5e5' : 'none' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <span style={{ fontWeight: 800, fontSize: 14, color: '#1a1a2e' }}>{order.orderId}</span>
            <span style={{ background: (STATUS_COLOR[order.status] || '#888') + '20', color: STATUS_COLOR[order.status] || '#888', fontSize: 11, fontWeight: 700, padding: '2px 10px', borderRadius: 20, textTransform: 'uppercase' }}>{order.status}</span>
          </div>
          <div style={{ fontSize: 12, color: '#888' }}>
            {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })} &nbsp;·&nbsp;
            {order.itemCount} items &nbsp;·&nbsp; {order.vendorCount} vendor{order.vendorCount > 1 ? 's' : ''} &nbsp;·&nbsp; {order.totalPackages} packages
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontWeight: 900, fontSize: 18, color: '#2e6dce' }}>₹{order.grandTotal.toLocaleString()}</div>
            <div style={{ fontSize: 11, color: '#aaa' }}>incl. ₹{order.totalShipping} shipping</div>
          </div>
          <span style={{ color: '#2e6dce', fontSize: 18 }}>{open ? '▲' : '▼'}</span>
        </div>
      </div>

      {open && (
        <div style={{ padding: '20px 22px' }}>
          {/* Delivery & payment info */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 10, marginBottom: 20 }}>
            {[
              ['📍 Deliver to', `${order.customer.city}, ${order.customer.pincode}`],
              ['💳 Payment', order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online'],
              ['📅 Est. Delivery', order.estimatedDelivery],
              ['⚖️ Total Weight', `${order.totalWeightKg} kg`],
            ].map(([k, v]) => (
              <div key={k} style={{ background: '#f9fafb', borderRadius: 6, padding: '8px 12px' }}>
                <div style={{ fontSize: 10, color: '#888', marginBottom: 2 }}>{k}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#333' }}>{v}</div>
              </div>
            ))}
          </div>

          {/* Parent order totals */}
          <div style={{ background: '#f0f4ff', borderRadius: 8, padding: '12px 16px', marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#555', marginBottom: 4 }}>
              <span>Products Subtotal</span><span>₹{order.productSubtotal.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#555', marginBottom: 8 }}>
              <span>Total Shipping</span><span>₹{order.totalShipping.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: 16, color: '#2e6dce', paddingTop: 8, borderTop: '1px solid #bfdbfe' }}>
              <span>Grand Total</span><span>₹{order.grandTotal.toLocaleString()}</span>
            </div>
          </div>

          {/* Baby bills */}
          <h4 style={{ fontWeight: 700, fontSize: 13, color: '#555', marginBottom: 10 }}>🧾 Vendor Bills</h4>
          {order.babyBills.map(bill => <BabyBillMini key={bill.billId} bill={bill} />)}
        </div>
      )}
    </div>
  );
}

export default function MyOrdersPage() {
  const { user } = useAuth();
  const { getOrdersByUser, getRFQsByUser } = useOrders();
  const [tab, setTab] = useState('orders');

  if (!user) {
    return (
      <Layout>
        <div style={{ textAlign: 'center', padding: '80px 20px' }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🔒</div>
          <h2 style={{ fontWeight: 700, marginBottom: 8 }}>Login to view your orders</h2>
          <Link to="/login"><button style={{ background: '#2e6dce', color: '#fff', border: 'none', padding: '12px 32px', borderRadius: 6, fontWeight: 700, cursor: 'pointer', marginTop: 12 }}>Login</button></Link>
        </div>
      </Layout>
    );
  }

  const myOrders = getOrdersByUser(user.id);
  const myRFQs = getRFQsByUser(user.id);

  const rfqStatusColor = { open: '#f59e0b', matched: '#2e6dce', discussion: '#7c3aed', agreed: '#16a34a', invoiced: '#1d4ed8', released: '#22c55e' };

  return (
    <Layout>
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '32px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 900, color: '#1a1a2e', marginBottom: 4 }}>My Account</h1>
            <p style={{ color: '#888', fontSize: 14 }}>Welcome, <strong>{user.name}</strong></p>
          </div>
          <div style={{ display: 'inline-flex', border: '1px solid #ddd', borderRadius: 8, overflow: 'hidden' }}>
            {[['orders', `📦 Orders (${myOrders.length})`], ['rfqs', `📋 RFQs (${myRFQs.length})`]].map(([key, label]) => (
              <button key={key} onClick={() => setTab(key)}
                style={{ padding: '10px 22px', fontSize: 13, fontWeight: 700, border: 'none', cursor: 'pointer', background: tab === key ? '#2e6dce' : '#fff', color: tab === key ? '#fff' : '#555' }}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Orders tab */}
        {tab === 'orders' && (
          myOrders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', background: '#fff', borderRadius: 12, border: '1px solid #e5e5e5' }}>
              <div style={{ fontSize: 56, marginBottom: 12 }}>📦</div>
              <h3 style={{ fontWeight: 700, marginBottom: 8 }}>No orders yet</h3>
              <Link to="/retail"><button style={{ background: '#2e6dce', color: '#fff', border: 'none', padding: '12px 28px', borderRadius: 6, fontWeight: 700, cursor: 'pointer' }}>Start Shopping</button></Link>
            </div>
          ) : (
            myOrders.map(order => <OrderCard key={order.orderId} order={order} />)
          )
        )}

        {/* RFQs tab */}
        {tab === 'rfqs' && (
          myRFQs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', background: '#fff', borderRadius: 12, border: '1px solid #e5e5e5' }}>
              <div style={{ fontSize: 56, marginBottom: 12 }}>📋</div>
              <h3 style={{ fontWeight: 700, marginBottom: 8 }}>No RFQs yet</h3>
              <Link to="/request-quote"><button style={{ background: '#2e6dce', color: '#fff', border: 'none', padding: '12px 28px', borderRadius: 6, fontWeight: 700, cursor: 'pointer' }}>Submit an RFQ</button></Link>
            </div>
          ) : (
            myRFQs.map(rfq => (
              <div key={rfq.rfqId} style={{ border: '1px solid #e5e5e5', borderRadius: 10, padding: '18px 22px', marginBottom: 14, background: '#fff' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10 }}>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 14, color: '#1a1a2e', marginBottom: 4 }}>{rfq.rfqId}</div>
                    <div style={{ fontSize: 12, color: '#888', marginBottom: 6 }}>{rfq.category} · {rfq.tradeType} · {rfq.location?.city}, {rfq.location?.state}</div>
                    <div style={{ fontSize: 13, color: '#444' }}>{rfq.productDesc?.slice(0, 100)}{rfq.productDesc?.length > 100 ? '...' : ''}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                    <span style={{ background: (rfqStatusColor[rfq.status] || '#888') + '20', color: rfqStatusColor[rfq.status] || '#888', fontSize: 11, fontWeight: 700, padding: '3px 12px', borderRadius: 20, textTransform: 'uppercase' }}>{rfq.status}</span>
                    {rfq.invoice && <span style={{ fontWeight: 800, color: '#2e6dce', fontSize: 15 }}>₹{rfq.invoice.totalAmount?.toLocaleString()}</span>}
                    {rfq.escrowType && <span style={{ fontSize: 11, color: rfq.escrowType === 'platform' ? '#2e6dce' : '#7c3aed', fontWeight: 600 }}>{rfq.escrowType === 'platform' ? '🔐 Platform Escrow' : '🏦 External Escrow'}</span>}
                  </div>
                </div>
                <div style={{ marginTop: 12 }}>
                  <Link to={`/rfq/${rfq.rfqId}`}>
                    <button style={{ background: '#f0f4fb', border: '1px solid #dce8fb', color: '#2e6dce', padding: '7px 16px', borderRadius: 6, fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
                      View Discussion & Details →
                    </button>
                  </Link>
                </div>
              </div>
            ))
          )
        )}
      </div>
    </Layout>
  );
}
