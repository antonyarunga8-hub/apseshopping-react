import React, { createContext, useContext, useState, useEffect } from 'react';

// ── Niche context ─────────────────────────────────────────────────
export function detectNiche() {
  const params = new URLSearchParams(window.location.search);
  const urlNiche = params.get('niche');
  if (urlNiche) {
    sessionStorage.setItem('apse_niche', urlNiche);
    return urlNiche;
  }
  return sessionStorage.getItem('apse_niche') || null;
}

// ── Web Crypto password hashing (replaces bcryptjs — no Node polyfill needed) ──
// Uses PBKDF2 via browser-native crypto.subtle. No external dependency.
// Format stored: "pbkdf2:<hex-salt>:<hex-hash>"

async function hashPassword(password) {
  const encoder = new TextEncoder();
  const saltBytes = crypto.getRandomValues(new Uint8Array(16));
  const keyMaterial = await crypto.subtle.importKey(
    'raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']
  );
  const hashBuffer = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: saltBytes, iterations: 100000, hash: 'SHA-256' },
    keyMaterial, 256
  );
  const toHex = buf => Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
  return 'pbkdf2:' + toHex(saltBytes) + ':' + toHex(hashBuffer);
}

async function verifyPassword(password, stored) {
  // Support legacy plain-text passwords stored before hashing was added
  if (!stored.startsWith('pbkdf2:')) return password === stored;
  const parts = stored.split(':');
  if (parts.length !== 3) return false;
  const saltBytes = Uint8Array.from(parts[1].match(/.{2}/g).map(h => parseInt(h, 16)));
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']
  );
  const hashBuffer = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: saltBytes, iterations: 100000, hash: 'SHA-256' },
    keyMaterial, 256
  );
  const toHex = buf => Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
  return toHex(hashBuffer) === parts[2];
}

// ── Auth Context ──────────────────────────────────────────────────
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

  const [niche, setNiche] = useState(() => detectNiche());

  useEffect(() => {
    localStorage.setItem('apse_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('apse_users', JSON.stringify(users));
  }, [users]);

  // ── Register ────────────────────────────────────────────────────
  const register = async ({ name, email, phone, password, role = 'customer', nicheSource = null }) => {
    if (users.find(u => u.email === email)) {
      return { success: false, error: 'An account with this email already exists.' };
    }

    const hashedPassword = await hashPassword(password);

    const newUser = {
      id: Date.now(),
      name,
      email,
      phone,
      password: hashedPassword,   // stored as pbkdf2:<salt>:<hash>
      role,
      nicheSource,
      createdAt: new Date().toISOString(),
    };

    setUsers(prev => [...prev, newUser]);

    const { password: _, ...safeUser } = newUser;
    setUser(safeUser);

    if (!nicheSource) {
      sessionStorage.removeItem('apse_niche');
      setNiche(null);
    }

    return { success: true };
  };

  // ── Login ────────────────────────────────────────────────────────
  const login = async ({ email, password }) => {
    const found = users.find(u => u.email === email);
    if (!found) {
      return { success: false, error: 'Invalid email or password.' };
    }

    const match = await verifyPassword(password, found.password);
    if (!match) {
      return { success: false, error: 'Invalid email or password.' };
    }

    const { password: _, ...safeUser } = found;
    setUser(safeUser);

    if (!found.nicheSource && !detectNiche()) {
      sessionStorage.removeItem('apse_niche');
      setNiche(null);
    }

    return { success: true };
  };

  const logout = () => setUser(null);

  const effectiveNiche = user && !user.nicheSource ? null : niche;
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, login, register, logout, niche: effectiveNiche, rawNiche: niche, setNiche, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
