import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/shared/Header/Header';
import Footer from './components/shared/Footer/Footer';
import Cart from './components/shared/Cart/Cart';
import ProtectedRoute from './components/shared/ProtectedRoute/ProtectedRoute'; 

// Páginas
import Home from './pages/Home/Home';
import Catalog from './pages/Catalog/Catalog';
import Product from './pages/Product/Product';
import Checkout from './pages/Checkout/Checkout';
import Login from './pages/Auth/Login';       
import Register from './pages/Auth/Register'; 

const App = () => {
  return (
    <div className="app-container">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalogo" element={<Catalog />} />
          <Route path="/producto/:id" element={<Product />} />
          
          {/* Rutas Públicas de Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Rutas Protegidas */}
          <Route 
            path="/checkout" 
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </main>
      <Cart />
      <Footer />
    </div>
  );
};

export default App;