import React, { createContext, useContext, useState, useEffect } from 'react';

// ── Niche context ─────────────────────────────────────────────────
// Detected from URL param ?niche=xxx or localStorage 'apse_niche'
// null = full ApseShopping experience
// 'electronics' etc = niche-only experience
export function detectNiche() {
  const params = new URLSearchParams(window.location.search);
  const urlNiche = params.get('niche');
  if (urlNiche) {
    sessionStorage.setItem('apse_niche', urlNiche);
    return urlNiche;
  }
  return sessionStorage.getItem('apse_niche') || null;
}

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('apse_user')) || null; }
    catch { return null; }
  });

  const [users, setUsers] = useState(() => {
    try { return JSON.parse(localStorage.getItem('apse_users')) || []; }
    catch { return []; }
  });

  // niche: null = full apseshopping, string = niche-only (e.g. 'electronics')
  const [niche, setNiche] = useState(() => detectNiche());

  useEffect(() => {
    localStorage.setItem('apse_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('apse_users', JSON.stringify(users));
  }, [users]);

  // When user logs in from ApseShopping directly, clear any niche lock
  const register = ({ name, email, phone, password, role = 'customer', nicheSource = null }) => {
    if (users.find(u => u.email === email)) {
      return { success: false, error: 'An account with this email already exists.' };
    }
    const newUser = {
      id: Date.now(), name, email, phone, password,
      role,           // 'customer' | 'vendor' | 'seller' | 'service_provider'
      nicheSource,    // null = apseshopping, 'electronics' etc = came from niche site
      createdAt: new Date().toISOString(),
    };
    setUsers(prev => [...prev, newUser]);
    const { password: _, ...safeUser } = newUser;
    setUser(safeUser);
    // If registering from ApseShopping (no niche), clear niche lock
    if (!nicheSource) {
      sessionStorage.removeItem('apse_niche');
      setNiche(null);
    }
    return { success: true };
  };

  const login = ({ email, password }) => {
    const found = users.find(u => u.email === email && u.password === password);
    if (!found) return { success: false, error: 'Invalid email or password.' };
    const { password: _, ...safeUser } = found;
    setUser(safeUser);
    // If user originally registered from ApseShopping (no nicheSource), clear niche lock
    if (!found.nicheSource && !detectNiche()) {
      sessionStorage.removeItem('apse_niche');
      setNiche(null);
    }
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    // Keep niche in session — they're still on the niche site
  };

  // Computed: effective niche considering both URL and user account
  // If user logged in from ApseShopping (no nicheSource) → full access regardless of URL
  const effectiveNiche = user && !user.nicheSource ? null : niche;

  return (
    <AuthContext.Provider value={{ user, login, register, logout, niche: effectiveNiche, rawNiche: niche, setNiche }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
