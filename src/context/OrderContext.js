import React, { createContext, useContext, useState, useEffect } from 'react';

// ── Mock vendor assignment ────────────────────────────────────────
// In production this comes from the product database.
// For now we assign vendors based on product category.
const VENDOR_MAP = {
  'digital-camera':   { id: 'V001', name: 'ApseElectronics Hub',   city: 'Bangalore',  gstin: '29AABCU9603R1ZP' },
  'electronics':      { id: 'V001', name: 'ApseElectronics Hub',   city: 'Bangalore',  gstin: '29AABCU9603R1ZP' },
  'kitchen':          { id: 'V002', name: 'KitchenWorld Supplies',  city: 'Mumbai',     gstin: '27AAKCS1234A1ZQ' },
  'home-appliances':  { id: 'V002', name: 'KitchenWorld Supplies',  city: 'Mumbai',     gstin: '27AAKCS1234A1ZQ' },
  'fashion':          { id: 'V003', name: 'FashionLine India',      city: 'Surat',      gstin: '24AABCF5678B1ZR' },
  'default':          { id: 'V000', name: 'ApseShopping Warehouse', city: 'Hubli',      gstin: '29AAPSE0001A1Z0' },
};

// Mock shipping rates per vendor (₹ per kg, approx)
const SHIPPING_RATE_PER_KG = 40;

function getVendorForProduct(product) {
  return VENDOR_MAP[product.category] || VENDOR_MAP['default'];
}

// Approx dimensions/weight — in production comes from product DB
function getProductPhysical(product) {
  return {
    weightKg: product.weightKg || 0.5,
    lengthCm: product.lengthCm || 20,
    widthCm:  product.widthCm  || 15,
    heightCm: product.heightCm || 10,
  };
}

// ── Generate parent order + baby bills ───────────────────────────
export function generateOrder({ cartItems, shipping, form, userId }) {
  const orderId = 'ORD-' + Date.now();
  const orderDate = new Date().toISOString();

  // Group items by vendor
  const vendorGroups = {};
  cartItems.forEach(item => {
    const vendor = getVendorForProduct(item);
    if (!vendorGroups[vendor.id]) {
      vendorGroups[vendor.id] = { vendor, items: [] };
    }
    vendorGroups[vendor.id].items.push(item);
  });

  // Build baby bills (one per vendor)
  const babyBills = Object.values(vendorGroups).map((group, idx) => {
    const billId = orderId + '-V' + String(idx + 1).padStart(2, '0');

    // Calculate totals and physical details for this vendor's items
    let subtotal = 0;
    let totalWeightKg = 0;
    let packageCount = 0;
    const lineItems = group.items.map(item => {
      const physical = getProductPhysical(item);
      const lineTotal = item.newPrice * item.qty;
      const lineWeight = physical.weightKg * item.qty;
      subtotal += lineTotal;
      totalWeightKg += lineWeight;
      packageCount += item.qty; // 1 package per unit (simplified)
      return {
        productId: item.id,
        productName: item.name,
        emoji: item.emoji || null,
        img: item.img || null,
        qty: item.qty,
        unitPrice: item.newPrice,
        lineTotal,
        physical: {
          ...physical,
          totalWeightKg: lineWeight,
          packageCount: item.qty,
        },
      };
    });

    const vendorShipping = Math.max(Math.round(totalWeightKg * SHIPPING_RATE_PER_KG), 49);
    const billTotal = subtotal + vendorShipping;

    return {
      billId,
      parentOrderId: orderId,
      vendor: group.vendor,
      status: 'confirmed',           // confirmed → packed → shipped → delivered
      lineItems,
      subtotal,
      shippingAmount: vendorShipping,
      totalAmount: billTotal,
      totalWeightKg: Math.round(totalWeightKg * 100) / 100,
      totalPackages: packageCount,
      estimatedDimensions: `${30 * packageCount}cm × 20cm × 15cm (approx)`,
      createdAt: orderDate,
    };
  });

  // Parent order totals
  const productSubtotal = babyBills.reduce((s, b) => s + b.subtotal, 0);
  const totalShipping = babyBills.reduce((s, b) => s + b.shippingAmount, 0);
  const grandTotal = productSubtotal + totalShipping;

  const parentOrder = {
    orderId,
    userId,
    status: 'confirmed',
    orderType: 'retail',            // 'retail' | 'wholesale'
    customer: {
      name: form.name,
      email: form.email,
      phone: form.phone,
      address: form.address,
      city: form.city,
      pincode: form.pincode,
    },
    paymentMethod: form.payment,
    paymentStatus: form.payment === 'cod' ? 'pending' : 'paid',
    itemCount: cartItems.reduce((s, i) => s + i.qty, 0),
    vendorCount: babyBills.length,
    productSubtotal,
    totalShipping,
    grandTotal,
    totalWeightKg: Math.round(babyBills.reduce((s, b) => s + b.totalWeightKg, 0) * 100) / 100,
    totalPackages: babyBills.reduce((s, b) => s + b.totalPackages, 0),
    babyBillIds: babyBills.map(b => b.billId),
    babyBills,                      // embedded for localStorage simplicity
    createdAt: orderDate,
    estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN'),
  };

  return parentOrder;
}

// ── RFQ context ───────────────────────────────────────────────────
// Each RFQ = one product/service request
// Has discussion thread + finalized bill if agreed
export function generateRFQ({ form, userId }) {
  const rfqId = 'RFQ-' + Date.now();
  return {
    rfqId,
    userId,
    status: 'open',         // open → matched → discussion → sample → agreed → invoiced → paid → delivered → released
    productDesc: form.productDesc,
    category: form.category,
    tradeType: form.tradeType,
    qty: form.qty,
    budget: form.budget,
    deadline: form.deadline,
    location: { state: form.state, city: form.city, pincode: form.pincode },
    deliveryType: form.deliveryType,
    sampleRequired: form.sampleRequired,
    multipleVendors: form.multipleVendors,
    customer: { name: form.name, email: form.email, phone: form.phone, company: form.company },
    matchedVendors: [],             // filled when vendors respond
    discussion: [],                 // { id, from, fromName, message, timestamp, attachments }
    invoice: null,                  // filled when both parties agree
    escrowType: null,               // 'platform' | 'external' — set based on invoice amount
    escrowStatus: null,             // null | 'held' | 'released' | 'refunded'
    payments: [],                   // installment releases
    createdAt: new Date().toISOString(),
  };
}

// ── Order Context ─────────────────────────────────────────────────
const OrderContext = createContext();

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState(() => {
    try { return JSON.parse(localStorage.getItem('apse_orders')) || []; }
    catch { return []; }
  });

  const [rfqs, setRfqs] = useState(() => {
    try { return JSON.parse(localStorage.getItem('apse_rfqs')) || []; }
    catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem('apse_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('apse_rfqs', JSON.stringify(rfqs));
  }, [rfqs]);

  const placeOrder = (orderData) => {
    setOrders(prev => [orderData, ...prev]);
    return orderData;
  };

  const submitRFQ = (rfqData) => {
    setRfqs(prev => [rfqData, ...prev]);
    return rfqData;
  };

  const addRFQMessage = (rfqId, message) => {
    setRfqs(prev => prev.map(r =>
      r.rfqId === rfqId
        ? { ...r, discussion: [...r.discussion, { id: Date.now(), ...message, timestamp: new Date().toISOString() }] }
        : r
    ));
  };

  const finalizeRFQInvoice = (rfqId, invoice) => {
    // Determine escrow type: platform if < ₹1,00,000 else external
    const escrowType = invoice.totalAmount < 100000 ? 'platform' : 'external';
    setRfqs(prev => prev.map(r =>
      r.rfqId === rfqId
        ? { ...r, status: 'invoiced', invoice, escrowType, escrowStatus: 'held' }
        : r
    ));
  };

  const releaseRFQPayment = (rfqId, amount, note) => {
    setRfqs(prev => prev.map(r => {
      if (r.rfqId !== rfqId) return r;
      const payments = [...r.payments, { amount, note, releasedAt: new Date().toISOString() }];
      const totalReleased = payments.reduce((s, p) => s + p.amount, 0);
      const fullyReleased = r.invoice && totalReleased >= r.invoice.totalAmount;
      return { ...r, payments, escrowStatus: fullyReleased ? 'released' : 'held', status: fullyReleased ? 'released' : 'delivered' };
    }));
  };

  const getOrdersByUser = (userId) => orders.filter(o => o.userId === userId);
  const getRFQsByUser = (userId) => rfqs.filter(r => r.userId === userId);

  return (
    <OrderContext.Provider value={{
      orders, rfqs,
      placeOrder, submitRFQ,
      addRFQMessage, finalizeRFQInvoice, releaseRFQPayment,
      getOrdersByUser, getRFQsByUser,
    }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  return useContext(OrderContext);
}
