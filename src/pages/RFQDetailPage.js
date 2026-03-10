import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';
import { useToast } from '../context/ToastContext';

const STATUS_STEPS = [
  'open', 'matched', 'discussion', 'sample', 'agreed', 'invoiced', 'paid', 'delivered', 'released'
];
const STATUS_LABELS = {
  open: 'Open', matched: 'Vendor Matched', discussion: 'In Discussion',
  sample: 'Sample Exchange', agreed: 'Terms Agreed', invoiced: 'Invoice Sent',
  paid: 'Payment Held', delivered: 'Delivered', released: 'Completed',
};
const STATUS_COLOR = {
  open: '#f59e0b', matched: '#2e6dce', discussion: '#7c3aed',
  sample: '#f97316', agreed: '#16a34a', invoiced: '#1d4ed8',
  paid: '#0891b2', delivered: '#22c55e', released: '#15803d',
};

export default function RFQDetailPage() {
  const { rfqId } = useParams();
  const { user } = useAuth();
  const { rfqs, addRFQMessage, finalizeRFQInvoice, releaseRFQPayment } = useOrders();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();

  const [message, setMessage] = useState('');
  const [invoiceForm, setInvoiceForm] = useState({ description: '', amount: '', notes: '' });
  const [releaseForm, setReleaseForm] = useState({ amount: '', note: '' });
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  const [showReleaseForm, setShowReleaseForm] = useState(false);

  const rfq = rfqs.find(r => r.rfqId === rfqId);

  if (!user) {
    return (
      <Layout>
        <div style={{ textAlign: 'center', padding: '80px 20px' }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🔒</div>
          <h2>Please login to view this RFQ</h2>
          <Link to="/login"><button style={{ background: '#2e6dce', color: '#fff', border: 'none', padding: '12px 32px', borderRadius: 6, fontWeight: 700, cursor: 'pointer', marginTop: 16 }}>Login</button></Link>
        </div>
      </Layout>
    );
  }

  if (!rfq) {
    return (
      <Layout>
        <div style={{ textAlign: 'center', padding: '80px 20px' }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>📋</div>
          <h2>RFQ not found</h2>
          <Link to="/my-orders"><button style={{ background: '#2e6dce', color: '#fff', border: 'none', padding: '12px 32px', borderRadius: 6, fontWeight: 700, cursor: 'pointer', marginTop: 16 }}>Back to My Orders</button></Link>
        </div>
      </Layout>
    );
  }

  const stepIndex = STATUS_STEPS.indexOf(rfq.status);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    addRFQMessage(rfq.rfqId, {
      from: user.id,
      fromName: user.name,
      fromRole: 'customer',
      message: message.trim(),
    });
    setMessage('');
    success('Message sent!');
  };

  const handleFinalizeInvoice = () => {
    if (!invoiceForm.amount || isNaN(Number(invoiceForm.amount))) {
      toastError('Please enter a valid amount'); return;
    }
    finalizeRFQInvoice(rfq.rfqId, {
      description: invoiceForm.description || rfq.productDesc,
      totalAmount: Number(invoiceForm.amount),
      notes: invoiceForm.notes,
      createdAt: new Date().toISOString(),
    });
    setShowInvoiceForm(false);
    setInvoiceForm({ description: '', amount: '', notes: '' });
    success('Invoice finalized & escrow activated!');
  };

  const handleReleasePayment = () => {
    if (!releaseForm.amount || isNaN(Number(releaseForm.amount))) {
      toastError('Please enter a valid amount'); return;
    }
    releaseRFQPayment(rfq.rfqId, Number(releaseForm.amount), releaseForm.note);
    setShowReleaseForm(false);
    setReleaseForm({ amount: '', note: '' });
    success('Payment released to vendor!');
  };

  return (
    <Layout>
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '32px 20px' }}>

        {/* Breadcrumb */}
        <div style={{ fontSize: 12, color: '#888', marginBottom: 20 }}>
          <Link to="/my-orders" style={{ color: '#2e6dce', textDecoration: 'none' }}>My Orders</Link>
          {' / '}RFQ {rfq.rfqId}
        </div>

        {/* Header */}
        <div style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: 12, padding: '24px 28px', marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                <h1 style={{ fontSize: 20, fontWeight: 800, color: '#1a1a2e', margin: 0 }}>📋 {rfq.rfqId}</h1>
                <span style={{ background: (STATUS_COLOR[rfq.status] || '#888') + '20', color: STATUS_COLOR[rfq.status] || '#888', fontSize: 11, fontWeight: 700, padding: '3px 12px', borderRadius: 20, textTransform: 'uppercase' }}>{STATUS_LABELS[rfq.status] || rfq.status}</span>
              </div>
              <p style={{ fontSize: 14, color: '#555', margin: 0 }}>{rfq.productDesc}</p>
              <p style={{ fontSize: 12, color: '#888', marginTop: 6 }}>
                {rfq.category} · {rfq.tradeType} · {rfq.location?.city}, {rfq.location?.state} · Qty: {rfq.qty}
              </p>
            </div>
            {rfq.invoice && (
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 22, fontWeight: 900, color: '#2e6dce' }}>₹{rfq.invoice.totalAmount?.toLocaleString()}</div>
                <div style={{ fontSize: 11, color: rfq.escrowType === 'platform' ? '#2e6dce' : '#7c3aed', fontWeight: 600 }}>
                  {rfq.escrowType === 'platform' ? '🔐 Platform Escrow' : '🏦 External Escrow'}
                </div>
                <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>Escrow: {rfq.escrowStatus}</div>
              </div>
            )}
          </div>

          {/* Progress bar */}
          <div style={{ marginTop: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
              <div style={{ position: 'absolute', top: 14, left: '5%', right: '5%', height: 3, background: '#e5e5e5', zIndex: 0 }}>
                <div style={{ height: '100%', background: '#2e6dce', width: `${(stepIndex / (STATUS_STEPS.length - 1)) * 100}%`, transition: 'width 0.5s' }} />
              </div>
              {STATUS_STEPS.map((s, i) => (
                <div key={s} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1, flex: 1 }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: i <= stepIndex ? '#2e6dce' : '#e5e5e5', color: i <= stepIndex ? '#fff' : '#aaa', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, border: i === stepIndex ? '3px solid #93c5fd' : 'none' }}>
                    {i < stepIndex ? '✓' : i + 1}
                  </div>
                  <div style={{ fontSize: 9, color: i <= stepIndex ? '#2e6dce' : '#aaa', marginTop: 4, textAlign: 'center', fontWeight: i === stepIndex ? 700 : 400, maxWidth: 60 }}>
                    {STATUS_LABELS[s]}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 24, alignItems: 'start' }}>

          {/* Discussion thread */}
          <div>
            <div style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: 12, overflow: 'hidden' }}>
              <div style={{ padding: '18px 22px', borderBottom: '1px solid #f0f0f0', fontWeight: 700, fontSize: 15, color: '#1a1a2e' }}>
                💬 Discussion Thread
              </div>

              <div style={{ padding: '18px 22px', minHeight: 200, maxHeight: 400, overflowY: 'auto' }}>
                {rfq.discussion.length === 0 ? (
                  <div style={{ textAlign: 'center', color: '#aaa', padding: '30px 0' }}>
                    <div style={{ fontSize: 36, marginBottom: 8 }}>💬</div>
                    <p style={{ fontSize: 13 }}>No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  rfq.discussion.map(msg => {
                    const isMe = msg.from === user.id;
                    return (
                      <div key={msg.id} style={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start', marginBottom: 14 }}>
                        <div style={{ maxWidth: '75%' }}>
                          <div style={{ fontSize: 10, color: '#aaa', marginBottom: 3, textAlign: isMe ? 'right' : 'left' }}>
                            {msg.fromName} · {new Date(msg.timestamp).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                          </div>
                          <div style={{ background: isMe ? '#2e6dce' : '#f3f4f6', color: isMe ? '#fff' : '#333', padding: '10px 14px', borderRadius: isMe ? '12px 12px 2px 12px' : '12px 12px 12px 2px', fontSize: 13, lineHeight: 1.5 }}>
                            {msg.message}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <div style={{ padding: '14px 22px', borderTop: '1px solid #f0f0f0', display: 'flex', gap: 10 }}>
                <input
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
                  placeholder="Type a message..."
                  style={{ flex: 1, border: '1px solid #ddd', borderRadius: 6, padding: '10px 14px', fontSize: 13, outline: 'none' }}
                />
                <button onClick={handleSendMessage}
                  style={{ background: '#2e6dce', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 6, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                  Send
                </button>
              </div>
            </div>

            {/* Invoice Finalization */}
            {['discussion', 'sample', 'agreed'].includes(rfq.status) && !rfq.invoice && (
              <div style={{ marginTop: 16, background: '#fff', border: '1px solid #e5e5e5', borderRadius: 12, padding: '20px 22px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: showInvoiceForm ? 16 : 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: '#1a1a2e' }}>🧾 Finalize Invoice & Activate Escrow</div>
                  <button onClick={() => setShowInvoiceForm(v => !v)}
                    style={{ background: '#2e6dce', color: '#fff', border: 'none', padding: '8px 18px', borderRadius: 6, fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
                    {showInvoiceForm ? 'Cancel' : 'Create Invoice'}
                  </button>
                </div>
                {showInvoiceForm && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <input placeholder="Invoice description" value={invoiceForm.description} onChange={e => setInvoiceForm(f => ({ ...f, description: e.target.value }))}
                      style={{ border: '1px solid #ddd', borderRadius: 6, padding: '10px 14px', fontSize: 13, outline: 'none' }} />
                    <input placeholder="Total amount (₹)" type="number" value={invoiceForm.amount} onChange={e => setInvoiceForm(f => ({ ...f, amount: e.target.value }))}
                      style={{ border: '1px solid #ddd', borderRadius: 6, padding: '10px 14px', fontSize: 13, outline: 'none' }} />
                    <textarea placeholder="Additional notes..." rows={3} value={invoiceForm.notes} onChange={e => setInvoiceForm(f => ({ ...f, notes: e.target.value }))}
                      style={{ border: '1px solid #ddd', borderRadius: 6, padding: '10px 14px', fontSize: 13, outline: 'none', resize: 'vertical' }} />
                    {invoiceForm.amount && (
                      <div style={{ background: '#f0f4ff', borderRadius: 6, padding: '10px 14px', fontSize: 12, color: '#555' }}>
                        {Number(invoiceForm.amount) < 100000
                          ? '🔐 Amount < ₹1,00,000 → Platform Escrow will be used'
                          : '🏦 Amount ≥ ₹1,00,000 → External Escrow required'}
                      </div>
                    )}
                    <button onClick={handleFinalizeInvoice}
                      style={{ background: '#16a34a', color: '#fff', border: 'none', padding: '12px', borderRadius: 6, fontWeight: 700, cursor: 'pointer' }}>
                      ✅ Finalize Invoice & Activate Escrow
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Payment Release */}
            {rfq.invoice && rfq.escrowStatus === 'held' && (
              <div style={{ marginTop: 16, background: '#fff', border: '1px solid #e5e5e5', borderRadius: 12, padding: '20px 22px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: showReleaseForm ? 16 : 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: '#1a1a2e' }}>💸 Release Payment to Vendor</div>
                  <button onClick={() => setShowReleaseForm(v => !v)}
                    style={{ background: '#16a34a', color: '#fff', border: 'none', padding: '8px 18px', borderRadius: 6, fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
                    {showReleaseForm ? 'Cancel' : 'Release Funds'}
                  </button>
                </div>
                {showReleaseForm && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <input placeholder="Amount to release (₹)" type="number" value={releaseForm.amount} onChange={e => setReleaseForm(f => ({ ...f, amount: e.target.value }))}
                      style={{ border: '1px solid #ddd', borderRadius: 6, padding: '10px 14px', fontSize: 13, outline: 'none' }} />
                    <input placeholder="Release note (e.g. 'Delivery confirmed')" value={releaseForm.note} onChange={e => setReleaseForm(f => ({ ...f, note: e.target.value }))}
                      style={{ border: '1px solid #ddd', borderRadius: 6, padding: '10px 14px', fontSize: 13, outline: 'none' }} />
                    <button onClick={handleReleasePayment}
                      style={{ background: '#2e6dce', color: '#fff', border: 'none', padding: '12px', borderRadius: 6, fontWeight: 700, cursor: 'pointer' }}>
                      💸 Release ₹{releaseForm.amount ? Number(releaseForm.amount).toLocaleString() : '0'} to Vendor
                    </button>
                  </div>
                )}
                {rfq.payments.length > 0 && (
                  <div style={{ marginTop: 12, borderTop: '1px solid #f0f0f0', paddingTop: 12 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#555', marginBottom: 8 }}>Payment History</div>
                    {rfq.payments.map((p, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#666', marginBottom: 4 }}>
                        <span>{p.note || 'Payment released'}</span>
                        <span style={{ fontWeight: 700, color: '#16a34a' }}>+₹{Number(p.amount).toLocaleString()}</span>
                      </div>
                    ))}
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 700, color: '#2e6dce', paddingTop: 6, borderTop: '1px dashed #ddd', marginTop: 6 }}>
                      <span>Total Released</span>
                      <span>₹{rfq.payments.reduce((s, p) => s + p.amount, 0).toLocaleString()} / ₹{rfq.invoice.totalAmount?.toLocaleString()}</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* RFQ Details Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: 12, padding: '20px' }}>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 14, color: '#1a1a2e' }}>📄 RFQ Details</div>
              {[
                ['Category', rfq.category],
                ['Trade Type', rfq.tradeType],
                ['Quantity', rfq.qty],
                ['Budget', rfq.budget ? `₹${Number(rfq.budget).toLocaleString()}` : 'Not specified'],
                ['Deadline', rfq.deadline || 'Flexible'],
                ['Delivery', rfq.deliveryType],
                ['Sample Required', rfq.sampleRequired ? 'Yes' : 'No'],
                ['Multiple Vendors', rfq.multipleVendors ? 'Yes' : 'No'],
              ].map(([k, v]) => v && (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 8, paddingBottom: 8, borderBottom: '1px solid #f5f5f5' }}>
                  <span style={{ color: '#888', fontWeight: 600 }}>{k}</span>
                  <span style={{ color: '#333', fontWeight: 600, textAlign: 'right', maxWidth: '60%' }}>{v}</span>
                </div>
              ))}
            </div>

            <div style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: 12, padding: '20px' }}>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 14, color: '#1a1a2e' }}>👤 Customer Info</div>
              {[
                ['Name', rfq.customer?.name],
                ['Email', rfq.customer?.email],
                ['Phone', rfq.customer?.phone],
                ['City', rfq.location?.city],
                ['State', rfq.location?.state],
              ].map(([k, v]) => v && (
                <div key={k} style={{ fontSize: 12, marginBottom: 8 }}>
                  <span style={{ color: '#888' }}>{k}: </span>
                  <span style={{ color: '#333', fontWeight: 600 }}>{v}</span>
                </div>
              ))}
            </div>

            {rfq.invoice && (
              <div style={{ background: '#f0f4ff', border: '1px solid #dce8fb', borderRadius: 12, padding: '20px' }}>
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 14, color: '#1a1a2e' }}>🧾 Invoice</div>
                <div style={{ fontSize: 12, color: '#555', marginBottom: 8 }}>{rfq.invoice.description}</div>
                <div style={{ fontSize: 20, fontWeight: 900, color: '#2e6dce', marginBottom: 4 }}>₹{rfq.invoice.totalAmount?.toLocaleString()}</div>
                <div style={{ fontSize: 11, color: '#888' }}>Created {new Date(rfq.invoice.createdAt).toLocaleDateString('en-IN')}</div>
                {rfq.invoice.notes && <div style={{ fontSize: 12, color: '#666', marginTop: 8, fontStyle: 'italic' }}>{rfq.invoice.notes}</div>}
              </div>
            )}

            <Link to="/my-orders">
              <button style={{ width: '100%', background: '#f0f4fb', border: '1px solid #dce8fb', color: '#2e6dce', padding: '11px', borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                ← Back to My Orders
              </button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
