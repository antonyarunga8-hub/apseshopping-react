import React, { createContext, useContext, useState, useEffect } from 'react';

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

  useEffect(() => {
    localStorage.setItem('apse_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('apse_users', JSON.stringify(users));
  }, [users]);

  const register = ({ name, email, phone, password }) => {
    if (users.find(u => u.email === email)) {
      return { success: false, error: 'An account with this email already exists.' };
    }
    const newUser = { id: Date.now(), name, email, phone, password, createdAt: new Date().toISOString() };
    setUsers(prev => [...prev, newUser]);
    const { password: _, ...safeUser } = newUser;
    setUser(safeUser);
    return { success: true };
  };

  const login = ({ email, password }) => {
    const found = users.find(u => u.email === email && u.password === password);
    if (!found) return { success: false, error: 'Invalid email or password.' };
    const { password: _, ...safeUser } = found;
    setUser(safeUser);
    return { success: true };
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
