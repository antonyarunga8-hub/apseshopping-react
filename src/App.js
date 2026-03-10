import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RetailPage from './pages/RetailPage';
import WholesalePage from './pages/WholesalePage';
import ImportExportPage from './pages/ImportExportPage';
import ContactPage from './pages/ContactPage';
import RequestQuotePage from './pages/RequestQuotePage';
import ServicesPage from './pages/ServicesPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MyOrdersPage from './pages/MyOrdersPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CategoryPage from './pages/CategoryPage';
import SearchPage from './pages/SearchPage';
import WishlistPage from './pages/WishlistPage';
import RFQDetailPage from './pages/RFQDetailPage';
import AdminPage from './pages/AdminPage';
import { PolicyPage, AboutPage } from './pages/PolicyPages';
import PrivateRoute from './components/PrivateRoute';
import './App.css';

// All context providers are in index.js — no need to wrap again here.

function App() {
  return (
    <Router>
      <Routes>
        {/* ── Public routes ───────────────────────────────────── */}
        <Route path="/" element={<HomePage />} />
        <Route path="/retail" element={<RetailPage />} />
        <Route path="/wholesale" element={<WholesalePage />} />
        <Route path="/import-export" element={<ImportExportPage />} />
        <Route path="/request-quote" element={<RequestQuotePage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/contact-us" element={<ContactPage />} />
        <Route path="/view-cart" element={<CartPage />} />
        <Route path="/product-info/:id" element={<ProductDetailPage />} />
        <Route path="/category/:slug" element={<CategoryPage />} />
        <Route path="/policies/:slug" element={<PolicyPage />} />
        <Route path="/about-us" element={<AboutPage />} />

        {/* ── Auth routes ─────────────────────────────────────── */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* ── Protected routes (must be logged in) ────────────── */}
        <Route path="/checkout" element={
          <PrivateRoute><CheckoutPage /></PrivateRoute>
        } />
        <Route path="/my-orders" element={
          <PrivateRoute><MyOrdersPage /></PrivateRoute>
        } />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/rfq/:rfqId" element={
          <PrivateRoute><RFQDetailPage /></PrivateRoute>
        } />
        <Route path="/admin" element={
          <PrivateRoute><AdminPage /></PrivateRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
