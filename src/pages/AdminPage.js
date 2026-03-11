import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { useOrders } from '../context/OrderContext';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

const ORDER_STATUSES = ['confirmed', 'packed', 'shipped', 'delivered'];
const BILL_STATUSES  = ['confirmed', 'packed', 'shipped', 'delivered'];

const STATUS_COLOR = {
  confirmed: '#2e6dce', packed: '#f59e0b', shipped: '#7c3aed', delivered: '#22c55e',
  open: '#f59e0b', matched: '#2e6dce', discussion: '#7c3aed', agreed: '#16a34a',
  invoiced: '#1d4ed8', released: '#15803d',
};

export default function AdminPage() {
  const { orders, rfqs, setOrders } = useOrders();
  const { success } = useToast();
  const { isAdmin } = useAuth();
  const [tab, setTab] = useState('orders');
  const [search, setSearch] = useState('');
  const [expandedOrder, setExpandedOrder] = useState(null);

  // Update order + optionally a specific baby bill status
  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(o => {
      if (o.orderId !== orderId) return o;
      return {
        ...o,
        status: newStatus,
        babyBills: o.babyBills.map(b => ({ ...b, status: newStatus })),
      };
    }));
    success(`Order ${orderId} → ${newStatus}`);
  };

  const updateBillStatus = (orderId, billId, newStatus) => {
    setOrders(prev => prev.map(o => {
      if (o.orderId !== orderId) return o;
      const updatedBills = o.babyBills.map(b => b.billId === billId ? { ...b, status: newStatus } : b);
      const allDelivered = updatedBills.every(b => b.status === 'delivered');
      const anyShipped   = updatedBills.some(b => b.status === 'shipped');
      const parentStatus = allDelivered ? 'delivered' : anyShipped ? 'shipped' : o.status;
      return { ...o, babyBills: updatedBills, status: parentStatus };
    }));
    success(`Bill ${billId} → ${newStatus}`);
  };

  const filteredOrders = orders.filter(o =>
    o.orderId.toLowerCase().includes(search.toLowerCase()) ||
    o.customer?.name?.toLowerCase().includes(search.toLowerCase()) ||
    o.customer?.email?.toLowerCase().includes(search.toLowerCase())
  );

  const filteredRFQs = rfqs.filter(r =>
    r.rfqId.toLowerCase().includes(search.toLowerCase()) ||
    r.customer?.name?.toLowerCase().includes(search.toLowerCase())
  );

  // Summary stats
  const stats = {
    totalOrders: orders.length,
    totalRevenue: orders.reduce((s, o) => s + o.grandTotal, 0),
    pending: orders.filter(o => ['confirmed', 'packed'].includes(o.status)).length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    openRFQs: rfqs.filter(r => r.status === 'open').length,
  };

  if (!isAdmin) {
    return (
      <Layout>
        <div style={{ textAlign: 'center', padding: '80px 20px' }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🚫</div>
          <h2 style={{ fontWeight: 700, marginBottom: 8 }}>Access Denied</h2>
          <p style={{ color: '#666', marginBottom: 24 }}>You do not have admin privileges to view this page.</p>
          <Link to="/"><button style={{ background: '#2e6dce', color: '#fff', border: 'none', padding: '12px 32px', borderRadius: 6, fontWeight: 700, cursor: 'pointer' }}>Go to Home</button></Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 20px' }}>
        <h1 style={{ fontSize: 26, fontWeight: 900, color: '#1a1a2e', marginBottom: 8 }}>⚙️ Admin Dashboard</h1>
        <p style={{ color: '#888', fontSize: 13, marginBottom: 28 }}>Manage orders, update shipment status, and handle RFQs.</p>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: 28 }}>
          {[
            ['📦 Total Orders',   stats.totalOrders,                              '#2e6dce'],
            ['💰 Total Revenue',  `₹${stats.totalRevenue.toLocaleString()}`,       '#16a34a'],
            ['⏳ Pending',        stats.pending,                                   '#f59e0b'],
            ['✅ Delivered',      stats.delivered,                                 '#22c55e'],
            ['📋 Open RFQs',      stats.openRFQs,                                  '#7c3aed'],
          ].map(([label, val, color]) => (
            <div key={label} style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: 10, padding: '16px 20px' }}>
              <div style={{ fontSize: 11, color: '#888', marginBottom: 4 }}>{label}</div>
              <div style={{ fontSize: 22, fontWeight: 900, color }}>{val}</div>
            </div>
          ))}
        </div>

        {/* Tabs + Search */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'inline-flex', border: '1px solid #ddd', borderRadius: 8, overflow: 'hidden' }}>
            {[['orders', `📦 Orders (${orders.length})`], ['rfqs', `📋 RFQs (${rfqs.length})`]].map(([key, label]) => (
              <button key={key} onClick={() => setTab(key)}
                style={{ padding: '10px 22px', fontSize: 13, fontWeight: 700, border: 'none', cursor: 'pointer', background: tab === key ? '#2e6dce' : '#fff', color: tab === key ? '#fff' : '#555' }}>
                {label}
              </button>
            ))}
          </div>
          <input
            placeholder="Search by order ID, name, email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ border: '1px solid #ddd', borderRadius: 6, padding: '10px 16px', fontSize: 13, width: 280, outline: 'none' }}
          />
        </div>

        {/* Orders Tab */}
        {tab === 'orders' && (
          filteredOrders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px', background: '#fff', borderRadius: 12, border: '1px solid #e5e5e5', color: '#aaa' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>📦</div>
              <p>No orders found</p>
            </div>
          ) : (
            filteredOrders.map(order => (
              <div key={order.orderId} style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: 12, marginBottom: 14, overflow: 'hidden' }}>
                {/* Order row */}
                <div style={{ padding: '16px 22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, cursor: 'pointer', background: expandedOrder === order.orderId ? '#f9fafb' : '#fff' }}
                  onClick={() => setExpandedOrder(expandedOrder === order.orderId ? null : order.orderId)}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                      <span style={{ fontWeight: 800, fontSize: 14, color: '#1a1a2e' }}>{order.orderId}</span>
                      <span style={{ background: (STATUS_COLOR[order.status] || '#888') + '20', color: STATUS_COLOR[order.status] || '#888', fontSize: 11, fontWeight: 700, padding: '2px 10px', borderRadius: 20, textTransform: 'uppercase' }}>{order.status}</span>
                    </div>
                    <div style={{ fontSize: 12, color: '#888' }}>
                      {order.customer?.name} · {order.customer?.email} · {order.itemCount} items · {new Date(order.createdAt).toLocaleDateString('en-IN')}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ fontWeight: 800, fontSize: 16, color: '#2e6dce' }}>₹{order.grandTotal.toLocaleString()}</div>
                    {/* Quick status update */}
                    <select
                      value={order.status}
                      onClick={e => e.stopPropagation()}
                      onChange={e => { e.stopPropagation(); updateOrderStatus(order.orderId, e.target.value); }}
                      style={{ border: '1px solid #ddd', borderRadius: 6, padding: '6px 10px', fontSize: 12, fontWeight: 600, cursor: 'pointer', background: '#f9fafb' }}>
                      {ORDER_STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                    </select>
                    <span style={{ color: '#2e6dce' }}>{expandedOrder === order.orderId ? '▲' : '▼'}</span>
                  </div>
                </div>

                {/* Expanded: baby bills */}
                {expandedOrder === order.orderId && (
                  <div style={{ padding: '0 22px 20px', borderTop: '1px solid #f0f0f0' }}>
                    <div style={{ fontSize: 12, color: '#555', fontWeight: 700, margin: '14px 0 10px' }}>Vendor Bills</div>
                    {order.babyBills.map(bill => (
                      <div key={bill.billId} style={{ background: '#f9fafb', border: '1px solid #e5e5e5', borderRadius: 8, padding: '12px 16px', marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 13 }}>{bill.vendor.name}</div>
                          <div style={{ fontSize: 11, color: '#888' }}>
                            {bill.billId} · {bill.lineItems.length} line item{bill.lineItems.length > 1 ? 's' : ''} · {bill.totalWeightKg}kg · ₹{bill.totalAmount.toLocaleString()}
                          </div>
                          <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>
                            {bill.lineItems.map(i => `${i.productName.slice(0, 25)} ×${i.qty}`).join(' | ')}
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <span style={{ background: (STATUS_COLOR[bill.status] || '#888') + '20', color: STATUS_COLOR[bill.status] || '#888', fontSize: 11, fontWeight: 700, padding: '2px 10px', borderRadius: 20, textTransform: 'uppercase' }}>{bill.status}</span>
                          <select
                            value={bill.status}
                            onChange={e => updateBillStatus(order.orderId, bill.billId, e.target.value)}
                            style={{ border: '1px solid #ddd', borderRadius: 6, padding: '5px 8px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                            {BILL_STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                          </select>
                        </div>
                      </div>
                    ))}

                    {/* Customer details */}
                    <div style={{ background: '#f0f4ff', borderRadius: 8, padding: '12px 16px', fontSize: 12, color: '#555' }}>
                      <span style={{ fontWeight: 700 }}>Deliver to: </span>
                      {order.customer?.name}, {order.customer?.address}, {order.customer?.city} – {order.customer?.pincode} · 📞 {order.customer?.phone}
                    </div>
                  </div>
                )}
              </div>
            ))
          )
        )}

        {/* RFQs Tab */}
        {tab === 'rfqs' && (
          filteredRFQs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px', background: '#fff', borderRadius: 12, border: '1px solid #e5e5e5', color: '#aaa' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>📋</div>
              <p>No RFQs found</p>
            </div>
          ) : (
            filteredRFQs.map(rfq => (
              <div key={rfq.rfqId} style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: 10, padding: '18px 22px', marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <span style={{ fontWeight: 800, fontSize: 14, color: '#1a1a2e' }}>{rfq.rfqId}</span>
                    <span style={{ background: (STATUS_COLOR[rfq.status] || '#888') + '20', color: STATUS_COLOR[rfq.status] || '#888', fontSize: 11, fontWeight: 700, padding: '2px 10px', borderRadius: 20, textTransform: 'uppercase' }}>{rfq.status}</span>
                  </div>
                  <div style={{ fontSize: 13, color: '#444', marginBottom: 4 }}>{rfq.productDesc?.slice(0, 80)}{rfq.productDesc?.length > 80 ? '...' : ''}</div>
                  <div style={{ fontSize: 12, color: '#888' }}>
                    {rfq.customer?.name} · {rfq.category} · {rfq.location?.city} · {new Date(rfq.createdAt).toLocaleDateString('en-IN')}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  {rfq.invoice && <span style={{ fontWeight: 800, color: '#2e6dce', fontSize: 15 }}>₹{rfq.invoice.totalAmount?.toLocaleString()}</span>}
                  <Link to={`/rfq/${rfq.rfqId}`}>
                    <button style={{ background: '#2e6dce', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 6, fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
                      Open →
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
