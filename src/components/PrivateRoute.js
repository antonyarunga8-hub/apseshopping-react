import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * PrivateRoute — wraps any route that requires authentication.
 *
 * Usage in App.js:
 *   <Route path="/checkout" element={<PrivateRoute><CheckoutPage /></PrivateRoute>} />
 *
 * Behaviour:
 *  - Logged-in user  → renders children normally
 *  - Guest user      → redirects to /login, preserving the intended URL
 *                      so after login they land back on the page they wanted
 */
export default function PrivateRoute({ children }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // Pass the current path as `state.from` so LoginPage can redirect back
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
