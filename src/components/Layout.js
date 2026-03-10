import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const categories = [
  { name: 'Electronics', sub: ['Android Mobiles','Mobile Cables','Mobile Chargers','Power Banks','Earphones And Headphones','Tripod','Screen Guards','Memory Cards (SD Cards)','Mobile Cover','Mobile Car Charger','Mixer Grinders','Watches','Speakers','Digital Camera','Mouse'] },
  { name: 'Furnitures' }, { name: 'Imitation Jewellery' }, { name: "Women's Garments" },
  { name: "Men's Garments" }, { name: 'Kitchen Cookware' }, { name: 'Food Products' },
  { name: 'Kitchen Cook Ware/Appliances' }, { name: 'Cleaning Products' }, { name: 'Stationery' },
  { name: 'Mens Fashion' }, { name: 'Security Whistle' }, { name: 'Tableware' },
  { name: 'General Products' }, { name: 'Medical Surgical Accessories' }, { name: 'Water Bottle' },
  { name: 'Agriculture' }, { name: 'Foot Wear' }, { name: 'Helmet' },
  { name: 'Home and Kitchen' }, { name: 'UPS Battery' }, { name: 'Home Appliances' }, { name: 'Body Cleansers' },
];

const cities = [
  'Select City','Adra','Algarah','Alipurduar','Ankola','Arsikere','Asansol','Bagalkot',
  'Bagepalli','Ballari (Bellary)','Bally','Balurghat','Bangarapet','Bankura','Barasat',
  'Bardhaman (Burdwan)','Baruipur','Basavakalyan','Basavana Bagevadi','Basirhat',
  'Belagavi (Belgaum)','Bengaluru (Bangalore)','Berhampore','Bhadravati','Bhalki','Bidar',
  'Bilgi','Bishnupur','Bolpur','Bongaon','Byadgi','Canning','Challakere','Chamarajanagar',
  'Chandannagar','Channapatna','Chikkaballapur','Chikkamagaluru (Chikmagalur)','Chikkodi',
  'Chincholi','Chinsurah','Chitradurga','Contai','Cooch Behar','Darjeeling','Davanagere',
  'Devanahalli','Dharwad','Dhupguri','Diamond Harbour','Dinhata','Durgapur','English Bazar',
  'Falakata','Gadag-Betageri','Gangarampur','Gangawati','Gauribidanur','Ghatal','Gokak',
  'Gopiballavpur','Gubbi','Gundlupet','Gurmatkal','Haldia','Harihar','Hassan','Haveri',
  'Hili','Hiriyur','Honnali','Hoskote','Hospet','Howrah','Hubballi (Hubli)','Hunsur',
  'Indi','Islampur','Jaigaon','Jalpaiguri','Jamakhandi','Jhargram','Jiaganj-Azimganj',
  'Kalaburagi (Gulbarga)','Kalghatgi','Kalimpong','Kaliyaganj','Kalna','Karkala','Karwar',
  'Kharagpur','Kolar','Kolkata','Kollegal','Koppa','Koppal','Krishnanagar','Kudligi',
  'Kundapura','Lalgola','Maddur','Madikeri','Magadi','Mainaguri','Malavalli','Malda',
  'Mandya','Mangaluru (Mangalore)','Manvi','Midnapore','Mulbagal','Mysuru (Mysore)',
  'Nabadwip','Nanjangud','Nelamangala','Old Malda','Purulia','Puttur','Raghunathpur',
  'Raichur','Raiganj','Ramanagara','Rampurhat','Ranaghat','Ranebennur','Raniganj','Ron',
  'Sagar','Sakleshpur','Sedam','Serampore','Shahapur','Shirhatti','Shivamogga (Shimoga)',
  'Sindhnur','Sirsi','Somwarpet','Sonamukhi','Suri','Tamluk','Tarikere','Tiptur',
  'Tufanganj','Tumakuru (Tumkur)','Udupi','Uluberia','Vijayapura (Bijapur)','Virajpet',
  'Yadgir','Yelbarga',
];

export default function Layout({ children }) {
  const [catOpen, setCatOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cityModal, setCityModal] = useState(() => !localStorage.getItem('apse_city_dismissed'));
  const [selectedCity, setSelectedCity] = useState('Select City');
  const { cartItems, removeFromCart, cartCount, cartTotal } = useCart();
  const { user, logout } = useAuth();
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <div style={{ fontFamily: "'Open Sans','Segoe UI',Tahoma,sans-serif", fontSize: 14, color: '#333' }}>

      {/* City Modal */}
      {cityModal && (
        <div style={{ position:'fixed',inset:0,background:'rgba(0,0,0,0.6)',zIndex:9999,display:'flex',alignItems:'center',justifyContent:'center' }}>
          <div style={{ background:'#fff',borderRadius:4,padding:'28px 24px',width:460,maxWidth:'95vw',position:'relative',boxShadow:'0 10px 40px rgba(0,0,0,0.3)' }}>
            <button onClick={() => { localStorage.setItem('apse_city_dismissed','1'); setCityModal(false); }} style={{ position:'absolute',top:10,right:14,background:'none',border:'none',fontSize:24,cursor:'pointer',color:'#555',lineHeight:1 }}>×</button>
            <h3 style={{ fontSize:18,fontWeight:700,marginBottom:18,borderBottom:'1px solid #eee',paddingBottom:12 }}>Select City</h3>
            <select value={selectedCity} onChange={e => setSelectedCity(e.target.value)}
              style={{ width:'100%',padding:'9px 12px',border:'1px solid #ccc',borderRadius:3,fontSize:14,marginBottom:16,appearance:'auto' }}>
              {cities.map(c => <option key={c}>{c}</option>)}
            </select>
            <button onClick={() => { localStorage.setItem('apse_city_dismissed','1'); setCityModal(false); }}
              style={{ background:'#333',color:'#fff',border:'none',padding:'10px 32px',borderRadius:3,fontSize:14,fontWeight:700,cursor:'pointer' }}>
              SEARCH
            </button>
          </div>
        </div>
      )}

      {/* Cart Sidebar */}
      {cartOpen && (
        <div style={{ position:'fixed',inset:0,zIndex:8888 }} onClick={() => setCartOpen(false)}>
          <div style={{ position:'absolute',right:0,top:0,bottom:0,width:320,background:'#fff',boxShadow:'-4px 0 20px rgba(0,0,0,0.15)',padding:24,display:'flex',flexDirection:'column' }} onClick={e => e.stopPropagation()}>
            <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20,borderBottom:'2px solid #2e6dce',paddingBottom:14 }}>
              <h3 style={{ fontWeight:700,fontSize:16 }}>Shopping Cart</h3>
              <button onClick={() => setCartOpen(false)} style={{ background:'none',border:'none',fontSize:22,cursor:'pointer',color:'#555' }}>×</button>
            </div>
            <div style={{ flex:1,overflowY:'auto' }}>
              {cartItems.length === 0 ? (
                <div style={{ display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',height:'100%',color:'#aaa',gap:10 }}>
                  <i className="fas fa-shopping-cart" style={{ fontSize:48 }} />
                  <p style={{ fontSize:14 }}>Your cart is empty</p>
                </div>
              ) : (
                cartItems.map(item => (
                  <div key={item.id} style={{ display:'flex',gap:10,alignItems:'center',marginBottom:14,paddingBottom:14,borderBottom:'1px solid #f0f0f0' }}>
                    <div style={{ width:52,height:52,background:'#f9f9f9',borderRadius:4,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,border:'1px solid #eee' }}>
                      {item.img ? <img src={item.img} alt={item.name} style={{ maxWidth:48,maxHeight:48,objectFit:'contain' }} /> : <span style={{ fontSize:28 }}>{item.emoji||'🛍️'}</span>}
                    </div>
                    <div style={{ flex:1 }}>
                      <p style={{ fontSize:12,color:'#333',margin:0,lineHeight:1.4 }}>{item.name.length>35?item.name.slice(0,35)+'...':item.name}</p>
                      <p style={{ fontSize:12,color:'#2e6dce',fontWeight:700,margin:'3px 0 0' }}>{item.qty} × ₹{item.newPrice.toLocaleString()}</p>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} style={{ background:'none',border:'none',color:'#aaa',cursor:'pointer',fontSize:16,padding:2 }}>✕</button>
                  </div>
                ))
              )}
            </div>
            <div style={{ borderTop:'1px solid #eee',paddingTop:14 }}>
              <div style={{ display:'flex',justifyContent:'space-between',fontWeight:700,marginBottom:14,fontSize:15 }}>
                <span>SUBTOTAL:</span><span>₹{cartTotal.toLocaleString()}</span>
              </div>
              <Link to="/view-cart"><button style={{ width:'100%',padding:'11px',background:'#555',color:'#fff',border:'none',fontWeight:700,cursor:'pointer',marginBottom:8,borderRadius:3 }}>View Cart</button></Link>
              <Link to="/checkout"><button style={{ width:'100%',padding:'11px',background:'#2e6dce',color:'#fff',border:'none',fontWeight:700,cursor:'pointer',borderRadius:3 }}>Checkout</button></Link>
            </div>
          </div>
        </div>
      )}

      {/* Top Bar */}
      <div style={{ background:'#2e6dce',color:'#fff',fontSize:12,padding:'6px 20px',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:6 }}>
        <div style={{ display:'flex',gap:24,alignItems:'center',flexWrap:'wrap' }}>
          <span style={{ display:'flex',alignItems:'center',gap:6 }}><i className="fas fa-shipping-fast" />FREE DELIVERY. STANDARD SHIPPING ORDERS 10000+</span>
          <a href="tel:+918073667950" style={{ color:'#fff',display:'flex',alignItems:'center',gap:6 }}><i className="fas fa-phone-alt" />8073667950</a>
          <a href="https://wa.me/918073667950" target="_blank" rel="noreferrer" style={{ color:'#fff',display:'flex',alignItems:'center',gap:6 }}><i className="fab fa-whatsapp" />WHATSAPP SUPPORT</a>
        </div>
        <div style={{ display:'flex',gap:18,alignItems:'center' }}>
          <button onClick={() => setCityModal(true)} style={{ background:'none',border:'none',color:'#fff',cursor:'pointer',fontSize:12,display:'flex',alignItems:'center',gap:5 }}>
            <i className="fas fa-map-marker-alt" />Locate Me
          </button>
          {user ? (
            <>
              <span style={{ color:'#fff',fontSize:12,display:'flex',alignItems:'center',gap:5 }}><i className="fas fa-user-circle" />{user.name}</span>
              <Link to="/my-orders" style={{ color:'#fff',display:'flex',alignItems:'center',gap:5,fontSize:12 }}><i className="fas fa-box" />My Orders</Link>
              <button onClick={logout} style={{ background:'none',border:'1px solid rgba(255,255,255,0.5)',color:'#fff',cursor:'pointer',fontSize:12,padding:'2px 10px',borderRadius:3,display:'flex',alignItems:'center',gap:5 }}><i className="fas fa-sign-out-alt" />Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ color:'#fff',display:'flex',alignItems:'center',gap:5,fontSize:12 }}><i className="fas fa-sign-in-alt" />Log In</Link>
              <Link to="/register" style={{ color:'#fff',display:'flex',alignItems:'center',gap:5,fontSize:12 }}><i className="fas fa-user-plus" />Register</Link>
            </>
          )}
          <div style={{ display:'flex',gap:10,marginLeft:4 }}>
            <a href="https://facebook.com/apseshopping" target="_blank" rel="noreferrer" style={{ color:'#fff',fontSize:13 }}><i className="fab fa-facebook-f" /></a>
            <a href="https://twitter.com/apseshopping" target="_blank" rel="noreferrer" style={{ color:'#fff',fontSize:13 }}><i className="fab fa-twitter" /></a>
            <a href="https://instagram.com/apseshopping" target="_blank" rel="noreferrer" style={{ color:'#fff',fontSize:13 }}><i className="fab fa-instagram" /></a>
          </div>
        </div>
      </div>

      {/* Header */}
      <div style={{ background:'linear-gradient(180deg,#1a7ad4 0%,#1565c0 100%)',padding:'16px 24px',display:'flex',alignItems:'center',justifyContent:'space-between',gap:20 }}>
        <Link to="/" style={{ display:'flex',alignItems:'center',textDecoration:'none',flexShrink:0 }}>
          <img
            src="/assets/images/logo.png"
            alt="Apse Shopping"
            style={{ height:70 }}
            onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }}
          />
          <div style={{ display:'none',alignItems:'center',gap:8 }}>
            <div style={{ background:'rgba(255,255,255,0.15)',borderRadius:8,padding:'6px 10px',border:'2px solid rgba(255,255,255,0.4)' }}>
              <div style={{ fontSize:28,fontWeight:900,color:'#fff',lineHeight:1 }}>Apse</div>
              <div style={{ fontSize:9,color:'rgba(255,255,255,0.85)',fontWeight:600,letterSpacing:'2px',textTransform:'uppercase' }}>Shopping</div>
            </div>
          </div>
        </Link>

        {/* Search */}
        <div style={{ flex:1,maxWidth:700,display:'flex',background:'#fff',borderRadius:4,overflow:'hidden',boxShadow:'0 1px 4px rgba(0,0,0,0.2)' }}>
          <input type="text" placeholder="Search..." style={{ flex:1,border:'none',padding:'13px 20px',fontSize:14,outline:'none' }} />
          <button style={{ background:'#2e6dce',color:'#fff',border:'none',padding:'13px 22px',cursor:'pointer',fontSize:16 }}>
            <i className="fas fa-search" />
          </button>
        </div>

        {/* Cart */}
        <div style={{ position:'relative',cursor:'pointer',color:'#fff',fontSize:28 }} onClick={() => setCartOpen(true)}>
          <i className="fas fa-shopping-cart" />
          <span style={{ position:'absolute',top:-8,right:-10,background:'#e53e3e',color:'#fff',borderRadius:'50%',width:20,height:20,fontSize:10,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,border:'2px solid #1565c0' }}>{cartCount}</span>
        </div>
      </div>

      {/* Navbar */}
      <nav style={{ background:'#222',display:'flex',alignItems:'stretch',position:'sticky',top:0,zIndex:500,boxShadow:'0 2px 4px rgba(0,0,0,0.3)' }}>
        {/* All Categories */}
        <div style={{ position:'relative' }}>
          <button
            onClick={() => setCatOpen(v => !v)}
            style={{ background:'#333',color:'#fff',border:'none',padding:'14px 20px',fontSize:13,fontWeight:700,textTransform:'uppercase',cursor:'pointer',display:'flex',alignItems:'center',gap:10,whiteSpace:'nowrap',height:'100%',borderRight:'1px solid #444' }}>
            <i className="fas fa-bars" /> ALL CATEGORIES <i className="fas fa-chevron-right" style={{ fontSize:10 }} />
          </button>
          {catOpen && (
            <ul style={{ position:'absolute',top:'100%',left:0,width:250,background:'#fff',border:'1px solid #ddd',boxShadow:'0 6px 16px rgba(0,0,0,0.15)',zIndex:600,listStyle:'none',margin:0,padding:'4px 0',maxHeight:480,overflowY:'auto' }} onMouseLeave={() => setCatOpen(false)}>
              {categories.map(c => (
                <li key={c.name}>
                  <Link
                    to={`/category/${c.name.toLowerCase().replace(/[\s/]+/g,'-').replace(/[^a-z0-9-]/g,'')}`}
                    onClick={() => setCatOpen(false)}
                    style={{ color:'#444',padding:'9px 18px',borderBottom:'1px solid #f5f5f5',fontSize:13,display:'block',textDecoration:'none',transition:'all 0.15s' }}
                    onMouseEnter={e => { e.currentTarget.style.background='#f0f4fb'; e.currentTarget.style.color='#2e6dce'; e.currentTarget.style.paddingLeft='24px'; }}
                    onMouseLeave={e => { e.currentTarget.style.background=''; e.currentTarget.style.color='#444'; e.currentTarget.style.paddingLeft='18px'; }}>
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Nav Links */}
        {[
          { to:'/', label:'HOME' },
          { to:'/retail', label:'RETAIL' },
          { to:'/wholesale', label:'WHOLESALE' },
          { to:'/request-quote', label:'REQUEST FOR QUOTE ALL TRADES' },
          { to:'/services', label:'SERVICES & PRE OWNED' },
          { to:'/import-export', label:'IMPORT & EXPORT', special:true },
          { to:'/contact-us', label:'CONTACT US' },
        ].map(item => (
          <Link key={item.to} to={item.to}
            style={{
              color: '#fff',
              padding:'14px 14px',
              fontSize:12,
              fontWeight:600,
              letterSpacing:'0.3px',
              display:'flex',
              alignItems:'center',
              textDecoration:'none',
              whiteSpace:'nowrap',
              background: isActive(item.to) ? '#2e6dce' : item.special ? '#7c3aed' : 'transparent',
              borderBottom: isActive(item.to) ? '3px solid #60a5fa' : '3px solid transparent',
              transition:'all 0.2s',
            }}
            onMouseEnter={e => { if(!isActive(item.to)) { e.currentTarget.style.background = item.special ? '#5b21b6' : 'rgba(255,255,255,0.08)'; } }}
            onMouseLeave={e => { if(!isActive(item.to)) { e.currentTarget.style.background = item.special ? '#7c3aed' : 'transparent'; } }}>
            {item.label}
          </Link>
        ))}

        {/* Logo in navbar */}
        <Link to="/" style={{ display:'flex',alignItems:'center',padding:'6px 16px',marginLeft:'auto',borderLeft:'1px solid #444' }}>
          <img src="/assets/images/logo.png" alt="Apse" style={{ height:28,filter:'brightness(10)' }} onError={e => { e.target.style.display='none'; }} />
        </Link>
      </nav>

      <main>{children}</main>

      {/* Footer */}
      <footer style={{ background:'#1a1a1a',color:'#ccc',padding:'50px 40px 0' }}>
        <div style={{ display:'grid',gridTemplateColumns:'1.4fr 1fr 1fr 1.4fr',gap:40,maxWidth:1300,margin:'0 auto',paddingBottom:40 }}>

          {/* Contact */}
          <div>
            <h4 style={{ color:'#fff',fontSize:13,fontWeight:700,textTransform:'uppercase',letterSpacing:'1px',marginBottom:20,paddingBottom:10,borderBottom:'2px solid #2e6dce',display:'inline-block' }}>Contact Info</h4>
            <div style={{ display:'flex',flexDirection:'column',gap:10 }}>
              <div style={{ display:'flex',gap:8,alignItems:'flex-start' }}>
                <i className="fas fa-location-dot" style={{ color:'#2e6dce',marginTop:3,flexShrink:0 }} />
                <div>
                  <span style={{ fontSize:12,fontWeight:700,color:'#fff',display:'block',marginBottom:2 }}>ADDRESS :</span>
                  <span style={{ fontSize:12,color:'#aaa',lineHeight:1.6 }}>Shop No 4, Harsha Residency, Devangpeth road Opp Samarth Apartment Hubli 580023, Karnataka India</span>
                </div>
              </div>
              <div style={{ display:'flex',gap:8,alignItems:'center' }}>
                <i className="fas fa-phone" style={{ color:'#2e6dce',flexShrink:0 }} />
                <div>
                  <span style={{ fontSize:12,fontWeight:700,color:'#fff',display:'block' }}>PHONE :</span>
                  <a href="tel:8073667950" style={{ color:'#aaa',fontSize:12 }}>8073667950</a>
                </div>
              </div>
              <div style={{ display:'flex',gap:8,alignItems:'center' }}>
                <i className="fab fa-whatsapp" style={{ color:'#2e6dce',flexShrink:0 }} />
                <div>
                  <span style={{ fontSize:12,fontWeight:700,color:'#fff',display:'block' }}>WHATSAPP SERVICE :</span>
                  <a href="https://wa.me/918073667950" style={{ color:'#aaa',fontSize:12 }}>8073667950</a>
                </div>
              </div>
              <div style={{ display:'flex',gap:8,alignItems:'center' }}>
                <i className="fas fa-envelope" style={{ color:'#2e6dce',flexShrink:0 }} />
                <div>
                  <span style={{ fontSize:12,fontWeight:700,color:'#fff',display:'block' }}>EMAIL :</span>
                  <a href="mailto:contact@apseshopping.com" style={{ color:'#aaa',fontSize:12 }}>contact@apseshopping.com</a>
                </div>
              </div>
            </div>
            {/* Social icons */}
            <div style={{ display:'flex',gap:10,marginTop:20 }}>
              {[
                ['fab fa-facebook-f','#3b5998','https://facebook.com/apseshopping'],
                ['fab fa-twitter','#1da1f2','https://twitter.com/apseshopping'],
                ['fab fa-instagram','#e4405f','https://instagram.com/apseshopping'],
              ].map(([icon,color,url]) => (
                <a key={icon} href={url} target="_blank" rel="noreferrer" style={{ width:36,height:36,borderRadius:'50%',border:'1px solid #444',display:'flex',alignItems:'center',justifyContent:'center',color:'#ccc',fontSize:14,transition:'all 0.2s',textDecoration:'none' }}
                  onMouseEnter={e => { e.currentTarget.style.background=color; e.currentTarget.style.borderColor=color; e.currentTarget.style.color='#fff'; }}
                  onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.borderColor='#444'; e.currentTarget.style.color='#ccc'; }}>
                  <i className={icon} />
                </a>
              ))}
            </div>
          </div>

          {/* Information */}
          <div>
            <h4 style={{ color:'#fff',fontSize:13,fontWeight:700,textTransform:'uppercase',letterSpacing:'1px',marginBottom:20,paddingBottom:10,borderBottom:'2px solid #2e6dce',display:'inline-block' }}>Information</h4>
            <ul style={{ listStyle:'none',padding:0,margin:0,display:'flex',flexDirection:'column',gap:2 }}>
              {[
                ['Disclaimer','/policies/disclaimer'],
                ['Shipping Policy','/policies/shipping'],
                ['Refund Policy','/policies/refund'],
                ['Trademark & Copyright','/policies/copyright'],
                ['Shopping Online For Festival','/retail'],
                ['Privacy Policy & Cookies','/policies/privacy'],
                ['Terms & Conditions','/policies/terms'],
                ['Sitemap','/sitemap'],
              ].map(([item, to]) => (
                <li key={item}>
                  <Link to={to} style={{ color:'#aaa',fontSize:12,lineHeight:2,textDecoration:'none',display:'flex',alignItems:'center',gap:6 }}
                    onMouseEnter={e => e.currentTarget.style.color='#2e6dce'}
                    onMouseLeave={e => e.currentTarget.style.color='#aaa'}>
                    <i className="fas fa-link" style={{ fontSize:10 }} />{item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 style={{ color:'#fff',fontSize:13,fontWeight:700,textTransform:'uppercase',letterSpacing:'1px',marginBottom:20,paddingBottom:10,borderBottom:'2px solid #2e6dce',display:'inline-block' }}>Customer Service</h4>
            <ul style={{ listStyle:'none',padding:0,margin:0,display:'flex',flexDirection:'column',gap:2 }}>
              {[['About Us','/about-us'],['Contact Us','/contact-us'],['Customer Login','/login'],['Customer Register','/register'],['Vendor Login','/request-quote'],['Vendor Register','/request-quote'],['Seller Login','/request-quote'],['Seller Register','/request-quote'],['Services & Pre-Owned','/services'],['Import & Export','/import-export']].map(([label,to]) => (
                <li key={label}>
                  <Link to={to} style={{ color:'#aaa',fontSize:12,lineHeight:2,textDecoration:'none',display:'flex',alignItems:'center',gap:6 }}
                    onMouseEnter={e => e.currentTarget.style.color='#2e6dce'}
                    onMouseLeave={e => e.currentTarget.style.color='#aaa'}>
                    <i className="fas fa-link" style={{ fontSize:10 }} />{label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 style={{ color:'#fff',fontSize:13,fontWeight:700,textTransform:'uppercase',letterSpacing:'1px',marginBottom:20,paddingBottom:10,borderBottom:'2px solid #2e6dce',display:'inline-block' }}>Newsletter</h4>
            <p style={{ fontSize:13,color:'#aaa',marginBottom:16,lineHeight:1.7 }}>Get all the latest information on events, sales and offers. Sign up for newsletter:</p>
            <input type="email" placeholder="Email address"
              style={{ width:'100%',padding:'11px 14px',border:'1px solid #444',background:'#2a2a2a',color:'#fff',borderRadius:3,fontSize:13,marginBottom:10,boxSizing:'border-box' }} />
            <button style={{ background:'#2e6dce',color:'#fff',border:'none',padding:'11px 28px',borderRadius:3,fontSize:13,fontWeight:700,cursor:'pointer',letterSpacing:'0.5px' }}>
              SUBSCRIBE
            </button>
          </div>
        </div>

        {/* Footer Bottom */}
        <div style={{ borderTop:'1px solid #2a2a2a',padding:'16px 40px',maxWidth:1300,margin:'0 auto',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:12 }}>
          <p style={{ fontSize:12,color:'#666' }}>© <a href="https://apseshopping.com" style={{ color:'#666' }}>Apseshopping</a> 2018. All Rights Reserved</p>
          {/* Payment icons */}
          <div style={{ display:'flex',gap:6,alignItems:'center' }}>
            {['VISA','PayPal','stripe','VeriSign'].map(p => (
              <span key={p} style={{ background:'#fff',color:'#333',fontSize:10,fontWeight:800,padding:'4px 8px',borderRadius:3,letterSpacing:'0.5px' }}>{p}</span>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
