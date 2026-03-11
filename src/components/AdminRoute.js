import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * AdminRoute — wraps any route that requires admin privileges.
 *
 * Usage in App.js:
 *   <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
 *
 * Behaviour:
 *  - Admin user             → renders children normally
 *  - Logged-in, not admin   → redirects to / (home, silently — page is never revealed)
 *  - Guest user             → redirects to /login, preserving the intended URL
 */
export default function AdminRoute({ children }) {
  const { user, isAdmin } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    // Logged in but not an admin — send home silently, don't expose the route
    return <Navigate to="/" replace />;
  }

  return children;
}
