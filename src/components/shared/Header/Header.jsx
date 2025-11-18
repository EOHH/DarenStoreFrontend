import React, { useState, useEffect } from 'react';
import { useCart } from '../../../contexts/CartContext';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const { cartItems, setIsCartOpen } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [showCartAnimation, setShowCartAnimation] = useState(false);
  const location = useLocation();
  
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (totalItems > 0) {
      setShowCartAnimation(true);
      const timer = setTimeout(() => setShowCartAnimation(false), 600);
      return () => clearTimeout(timer);
    }
  }, [totalItems]);

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Banner Superior - Promociones */}
      <div className="header__top-banner">
        <p className="header__banner-text">
          <span className="header__banner-icon">🚚</span>
          Envío gratis en compras superiores a $150.000
          <span className="header__banner-divider">|</span>
          <span className="header__banner-highlight">30% OFF</span> en productos seleccionados
        </p>
      </div>

      <header className={`header ${scrolled ? 'header--scrolled' : ''}`}>
        <div className="header__container">
          {/* Logo */}
          <Link to="/" className="header__logo">
            <span className="header__logo-icon">👟</span>
            <div className="header__logo-text">
              <span className="header__logo-main">DAREN</span>
              <span className="header__logo-sub">STORE</span>
            </div>
          </Link>

          {/* Barra de búsqueda */}
          <div className="header__search">
            <svg className="header__search-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input 
              type="text" 
              placeholder="Buscar zapatillas, marcas, modelos..." 
              className="header__search-input"
            />
            <kbd className="header__search-shortcut">⌘K</kbd>
          </div>

          {/* Navegación */}
          <nav className="header__nav">
            <Link 
              to="/" 
              className={`header__nav-link ${isActive('/') ? 'header__nav-link--active' : ''}`}
            >
              Inicio
            </Link>
            <Link 
              to="/catalogo" 
              className={`header__nav-link ${isActive('/catalogo') ? 'header__nav-link--active' : ''}`}
            >
              Catálogo
              <span className="header__nav-badge">New</span>
            </Link>
            <Link to="/ofertas" className="header__nav-link header__nav-link--special">
              Ofertas
            </Link>
          </nav>

          {/* Carrito */}
          <div className="header__actions">
            <button 
              onClick={() => setIsCartOpen(true)} 
              className={`header__cart-button ${showCartAnimation ? 'header__cart-button--shake' : ''}`}
              aria-label="Abrir carrito de compras"
            >
              <div className="header__cart-icon-wrapper">
                <svg className="header__cart-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
                {totalItems > 0 && (
                  <span className="header__cart-badge">{totalItems}</span>
                )}
              </div>
              <div className="header__cart-info">
                <span className="header__cart-label">Carrito</span>
                {totalItems > 0 && (
                  <span className="header__cart-total">${totalPrice.toLocaleString('es-CO')}</span>
                )}
              </div>
            </button>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
