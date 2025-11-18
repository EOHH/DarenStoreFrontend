import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/shared/Header/Header';
import Footer from './components/shared/Footer/Footer';
import Cart from './components/shared/Cart/Cart';
import Home from './pages/Home/Home';
import Catalog from './pages/Catalog/Catalog';
import Product from './pages/Product/Product';
import Checkout from './pages/Checkout/Checkout';

const App = () => {
  return (
    <div className="app-container">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalogo" element={<Catalog />} />
          <Route path="/producto/:id" element={<Product />} />
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
      </main>
      <Cart />
      <Footer />
    </div>
  );
};

export default App;