import React from 'react';
import { Link, useParams } from 'react-router-dom';
import Layout from '../components/Layout';

const POLICIES = {
  shipping: {
    title: 'Shipping Policy',
    icon: '🚚',
    sections: [
      { heading: 'Free Shipping', body: 'All orders above ₹10,000 qualify for free standard shipping across India. Orders below ₹10,000 attract a flat shipping fee of ₹99.' },
      { heading: 'Estimated Delivery Times', body: 'Standard delivery: 3–7 business days. Express delivery (where available): 1–2 business days. Remote areas may take up to 10 business days. Delivery estimates begin from the date of dispatch, not the date of order.' },
      { heading: 'Dispatch Time', body: 'Orders are dispatched within 1–2 business days after payment confirmation. During peak season or sale periods, dispatch may take up to 3 business days.' },
      { heading: 'Multi-Vendor Orders', body: 'If your order contains products from multiple vendors (visible as separate Vendor Bills in your Order Summary), each vendor ships independently. You may receive multiple packages on different dates.' },
      { heading: 'Order Tracking', body: 'Once your order is dispatched, you will receive a tracking number via SMS and email. You can track your order on the carrier\'s website using the provided tracking number.' },
      { heading: 'Shipping to Remote Areas', body: 'We ship to all PIN codes serviceable by our logistics partners. Some remote or hilly areas may attract additional shipping charges, which will be shown at checkout.' },
    ]
  },
  refund: {
    title: 'Refund & Return Policy',
    icon: '↩️',
    sections: [
      { heading: '7-Day Return Window', body: 'We offer a 7-day hassle-free return policy from the date of delivery. Products must be unused, undamaged, and in original packaging with all accessories, manuals, and warranty cards.' },
      { heading: 'How to Initiate a Return', body: 'Contact us via WhatsApp (8073667950) or email (contact@apseshopping.com) within 7 days of delivery. Provide your order ID, product name, and reason for return along with supporting photos if the item is damaged.' },
      { heading: 'Refund Processing', body: 'Once the returned item is received and inspected, refunds are processed within 5–7 business days. The refund will be credited to the original payment method. COD orders are refunded via bank transfer.' },
      { heading: 'Non-Returnable Items', body: 'The following items cannot be returned: perishable goods, personalised or customised products, digital downloads, and items marked "non-returnable" on the product page.' },
      { heading: 'Damaged or Wrong Items', body: 'If you receive a damaged or incorrect item, contact us immediately with photos. We will arrange a free replacement or full refund without requiring you to return the item in some cases.' },
      { heading: 'RFQ / Wholesale Orders', body: 'Returns for RFQ, wholesale, and import/export orders are governed by the terms agreed upon in the finalized invoice. Please refer to your order documentation.' },
    ]
  },
  privacy: {
    title: 'Privacy Policy & Cookies',
    icon: '🔒',
    sections: [
      { heading: 'Information We Collect', body: 'We collect information you provide during registration (name, email, phone), during checkout (address, payment method), and when you submit an RFQ. We also collect browsing data such as pages visited, device type, and IP address.' },
      { heading: 'How We Use Your Information', body: 'Your information is used to process orders, match you with vendors for RFQs, send order confirmations and shipping updates, personalise your shopping experience, and improve our platform.' },
      { heading: 'Data Sharing', body: 'We share only the minimum necessary information with vendors to fulfil your orders. We do not sell your personal data to third parties. Payment information is processed by secure third-party payment gateways and is not stored on our servers.' },
      { heading: 'Cookies', body: 'We use cookies to remember your city preference, maintain your shopping cart, and track your login session. You can disable cookies in your browser settings, but some features may not work correctly.' },
      { heading: 'Data Security', body: 'All data is transmitted over HTTPS (SSL). Passwords are stored encrypted. We regularly review our security practices to protect your data.' },
      { heading: 'Your Rights', body: 'You can request access to, correction of, or deletion of your personal data at any time by contacting contact@apseshopping.com. We will respond within 30 days.' },
      { heading: 'Contact', body: 'For privacy-related queries, contact: contact@apseshopping.com or call 8073667950.' },
    ]
  },
  terms: {
    title: 'Terms & Conditions',
    icon: '📄',
    sections: [
      { heading: 'Acceptance of Terms', body: 'By accessing or using ApseShopping, you agree to be bound by these Terms and Conditions. If you do not agree, please do not use our platform.' },
      { heading: 'Use of Platform', body: 'ApseShopping is an e-commerce and trade facilitation platform. You agree to use it only for lawful purposes and not to engage in fraud, misrepresentation, or any activity that harms other users or vendors.' },
      { heading: 'Account Responsibility', body: 'You are responsible for maintaining the confidentiality of your account credentials. All activities under your account are your responsibility. Notify us immediately of any unauthorised use.' },
      { heading: 'Pricing & Orders', body: 'All prices are in Indian Rupees (₹) and are inclusive of GST unless stated otherwise. ApseShopping reserves the right to modify prices without prior notice. Orders are confirmed only after successful payment or COD acceptance.' },
      { heading: 'RFQ & Escrow Terms', body: 'For RFQ transactions, ApseShopping acts as an intermediary. For transactions ≤₹1,00,000, ApseShopping holds funds as platform escrow. For transactions >₹1,00,000, an external escrow partner is engaged. Funds are released only after buyer confirmation of satisfactory delivery.' },
      { heading: 'Vendor Obligations', body: 'Vendors agree to supply accurate product descriptions, honour agreed prices, dispatch within committed timelines, and maintain product quality as described. Misrepresentation may result in account suspension.' },
      { heading: 'Limitation of Liability', body: 'ApseShopping is not liable for product defects beyond the stated return policy, delays caused by logistics partners or natural events, or losses resulting from unauthorised account access.' },
      { heading: 'Governing Law', body: 'These terms are governed by the laws of India. All disputes shall be subject to the exclusive jurisdiction of courts in Hubli, Karnataka.' },
    ]
  },
  disclaimer: {
    title: 'Disclaimer',
    icon: '⚠️',
    sections: [
      { heading: 'General Disclaimer', body: 'The information on ApseShopping is provided for general informational purposes. While we strive for accuracy, we do not warrant the completeness or accuracy of product information provided by vendors.' },
      { heading: 'Product Images', body: 'Product images are for illustrative purposes only. Actual products may vary slightly in colour, size, or packaging due to photography and display settings.' },
      { heading: 'Third-Party Links', body: 'Our platform may contain links to third-party websites or affiliate services. We are not responsible for the content or privacy practices of those websites.' },
      { heading: 'Import & Export', body: 'ApseShopping provides import/export facilitation services. We do not guarantee customs clearance timelines or import duty amounts, which are subject to government regulations.' },
    ]
  },
  copyright: {
    title: 'Trademark & Copyright',
    icon: '™️',
    sections: [
      { heading: 'Our Intellectual Property', body: 'The ApseShopping name, logo, website design, and content are the property of ApseShopping and are protected by Indian copyright and trademark law. Unauthorised use is prohibited.' },
      { heading: 'Reporting Infringement', body: 'If you believe a product listed on our platform infringes your trademark or copyright, please contact contact@apseshopping.com with details of the alleged infringement. We will investigate and take appropriate action.' },
      { heading: 'User Content', body: 'By submitting reviews, photos, or other content, you grant ApseShopping a non-exclusive, royalty-free licence to use that content on our platform.' },
    ]
  },
};

export function PolicyPage() {
  const { slug } = useParams();
  const policy = POLICIES[slug];

  if (!policy) {
    return (
      <Layout>
        <div style={{ textAlign: 'center', padding: '80px 20px' }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>📄</div>
          <h2 style={{ fontWeight: 700, marginBottom: 8 }}>Page not found</h2>
          <Link to="/"><button style={{ background: '#2e6dce', color: '#fff', border: 'none', padding: '12px 32px', borderRadius: 6, fontWeight: 700, cursor: 'pointer', marginTop: 12 }}>Go Home</button></Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div style={{ background: 'linear-gradient(135deg, #1a1a2e, #0f3460)', color: '#fff', padding: '40px 20px', textAlign: 'center' }}>
        <div style={{ fontSize: 56, marginBottom: 12 }}>{policy.icon}</div>
        <h1 style={{ fontSize: 30, fontWeight: 800, marginBottom: 8 }}>{policy.title}</h1>
        <p style={{ color: '#94a3b8', fontSize: 13 }}>Last updated: March 2025 &nbsp;·&nbsp; ApseShopping, Hubli</p>
      </div>
      <div style={{ maxWidth: 820, margin: '0 auto', padding: '40px 20px' }}>
        {policy.sections.map((s, i) => (
          <div key={i} style={{ marginBottom: 28, paddingBottom: 28, borderBottom: i < policy.sections.length - 1 ? '1px solid #f0f0f0' : 'none' }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1a1a2e', marginBottom: 10, display: 'flex', gap: 10, alignItems: 'center' }}>
              <span style={{ background: '#2e6dce', color: '#fff', borderRadius: '50%', width: 28, height: 28, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, flexShrink: 0 }}>{i + 1}</span>
              {s.heading}
            </h2>
            <p style={{ fontSize: 14, color: '#555', lineHeight: 1.9, marginLeft: 38 }}>{s.body}</p>
          </div>
        ))}
        <div style={{ background: '#f0f4ff', border: '1px solid #dce8fb', borderRadius: 8, padding: '20px 24px', marginTop: 20 }}>
          <p style={{ fontSize: 13, color: '#1e40af', margin: 0 }}>
            📬 Questions about this policy? Contact us at{' '}
            <a href="mailto:contact@apseshopping.com" style={{ color: '#2e6dce', fontWeight: 700 }}>contact@apseshopping.com</a>
            {' '}or call{' '}
            <a href="tel:8073667950" style={{ color: '#2e6dce', fontWeight: 700 }}>8073667950</a>
          </p>
        </div>
      </div>
    </Layout>
  );
}

export function AboutPage() {
  return (
    <Layout>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)', color: '#fff', padding: '60px 20px', textAlign: 'center' }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>🛍️</div>
        <h1 style={{ fontSize: 36, fontWeight: 900, marginBottom: 12 }}>About ApseShopping</h1>
        <p style={{ color: '#94a3b8', fontSize: 16, maxWidth: 620, margin: '0 auto' }}>
          A global e-commerce and trade facilitation platform based in Hubli, Karnataka — connecting buyers, sellers, and service providers across India and the world.
        </p>
      </div>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '48px 20px' }}>
        {/* Our Story */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, marginBottom: 52, alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: 26, fontWeight: 800, color: '#1a1a2e', marginBottom: 16 }}>Our Story</h2>
            <p style={{ fontSize: 14, color: '#555', lineHeight: 1.9, marginBottom: 14 }}>
              ApseShopping was founded with a simple vision: to make quality products and professional services accessible to everyone — whether you're a retail customer, a wholesale buyer, or a business looking to import or export.
            </p>
            <p style={{ fontSize: 14, color: '#555', lineHeight: 1.9, marginBottom: 14 }}>
              Headquartered at Shop No. 4, Harsha Residency, Devangpeth Road, Hubli, Karnataka, we've grown from a local store into a platform with 25 affiliate niche websites covering everything from electronics to agriculture.
            </p>
            <p style={{ fontSize: 14, color: '#555', lineHeight: 1.9 }}>
              Our RFQ (Request for Quote) system with escrow-protected payments ensures that every trade transaction — however big or small — is safe, transparent, and documented.
            </p>
          </div>
          <div style={{ background: 'linear-gradient(135deg, #f0f4ff, #e0e7ff)', borderRadius: 16, padding: '36px', textAlign: 'center' }}>
            <div style={{ fontSize: 72, marginBottom: 16 }}>🏪</div>
            <div style={{ fontWeight: 800, fontSize: 18, color: '#1a1a2e', marginBottom: 6 }}>ApseShopping</div>
            <div style={{ fontSize: 13, color: '#666', lineHeight: 1.8 }}>
              Shop No. 4, Harsha Residency<br />
              Devangpeth Road, Hubli 580023<br />
              Karnataka, India<br /><br />
              📞 <a href="tel:8073667950" style={{ color: '#2e6dce' }}>8073667950</a><br />
              ✉️ <a href="mailto:contact@apseshopping.com" style={{ color: '#2e6dce' }}>contact@apseshopping.com</a>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 52 }}>
          {[['25+','Affiliate Platforms'],['500+','Active Buyers'],['All India','Coverage'],['24hr','Vendor Match']].map(([n, l]) => (
            <div key={l} style={{ background: '#f9fafb', border: '1px solid #e5e5e5', borderRadius: 10, padding: '24px 16px', textAlign: 'center' }}>
              <div style={{ fontSize: 30, fontWeight: 900, color: '#2e6dce', marginBottom: 6 }}>{n}</div>
              <div style={{ fontSize: 13, color: '#666' }}>{l}</div>
            </div>
          ))}
        </div>

        {/* What We Offer */}
        <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24, color: '#1a1a2e' }}>What We Offer</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20, marginBottom: 52 }}>
          {[
            { icon: '🛒', title: 'Retail Shopping', desc: 'Browse and buy from a wide catalogue of products at competitive prices with fast nationwide delivery.' },
            { icon: '📦', title: 'Wholesale', desc: 'Bulk purchasing with tiered discounts, dedicated account managers, and flexible payment terms.' },
            { icon: '🌐', title: 'Import & Export', desc: 'End-to-end trade facilitation for international sourcing and exports with documentation support.' },
            { icon: '🔐', title: 'RFQ with Escrow', desc: 'Request a quote for any product or service. Funds are held in escrow until you confirm delivery.' },
            { icon: '🔧', title: 'Services', desc: 'Repair, installation, maintenance, and professional services from verified providers near you.' },
            { icon: '♻️', title: 'Pre-Owned', desc: 'Certified pre-owned products with Grade A/B/C ratings at significantly reduced prices.' },
          ].map(c => (
            <div key={c.title} style={{ border: '1px solid #e5e5e5', borderRadius: 10, padding: '22px 18px', background: '#fff' }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>{c.icon}</div>
              <h3 style={{ fontWeight: 700, fontSize: 15, marginBottom: 8, color: '#1a1a2e' }}>{c.title}</h3>
              <p style={{ fontSize: 13, color: '#666', lineHeight: 1.7 }}>{c.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ background: 'linear-gradient(135deg, #1a1a2e, #0f3460)', borderRadius: 16, padding: '36px 40px', textAlign: 'center', color: '#fff' }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 10 }}>Ready to start shopping or trading?</h2>
          <p style={{ color: '#94a3b8', marginBottom: 24, fontSize: 14 }}>Create a free account and get access to all 25 affiliate platforms.</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register"><button style={{ background: '#2e6dce', color: '#fff', border: 'none', padding: '13px 32px', borderRadius: 8, fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>Create Free Account</button></Link>
            <Link to="/contact-us"><button style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.4)', color: '#fff', padding: '13px 32px', borderRadius: 8, fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>Contact Us</button></Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
