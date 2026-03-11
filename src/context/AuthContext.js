import React, { createContext, useContext, useState, useEffect } from 'react';
import bcrypt from 'bcryptjs';

// ── Niche context ─────────────────────────────────────────────────
// Detected from URL param ?niche=xxx or sessionStorage 'apse_niche'
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

const SALT_ROUNDS = 10;

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
  // Hashes password with bcrypt before storing.
  // Returns { success, error? }
  // To create an admin: call register({ ..., role: 'admin' })
  // Admin role is never set from UI — only programmatically or by seeding.
  const register = async ({ name, email, phone, password, role = 'customer', nicheSource = null }) => {
    if (users.find(u => u.email === email)) {
      return { success: false, error: 'An account with this email already exists.' };
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const newUser = {
      id: Date.now(),
      name,
      email,
      phone,
      password: hashedPassword,   // ✅ never stored in plain text
      role,
      nicheSource,
      createdAt: new Date().toISOString(),
    };

    setUsers(prev => [...prev, newUser]);

    // Strip password before putting in session state
    const { password: _, ...safeUser } = newUser;
    setUser(safeUser);

    if (!nicheSource) {
      sessionStorage.removeItem('apse_niche');
      setNiche(null);
    }

    return { success: true };
  };

  // ── Login ───────────────────────────────────────────────────────
  // Uses bcrypt.compare so plain-text passwords never touch the comparison.
  // Returns { success, error? }
  const login = async ({ email, password }) => {
    const found = users.find(u => u.email === email);
    if (!found) {
      return { success: false, error: 'Invalid email or password.' };
    }

    const match = await bcrypt.compare(password, found.password);
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

  const logout = () => {
    setUser(null);
  };

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
