import React, { useState, useEffect, useRef } from 'react';
import { useCart } from '../../../contexts/CartContext';
import { useAuth } from '../../../contexts/AuthContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const { cartItems, setIsCartOpen } = useCart();
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [showCartAnimation, setShowCartAnimation] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Nuevo estado para menú móvil
  const location = useLocation();
  const navigate = useNavigate();
  const userMenuRef = useRef(null);
  
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Cerrar menú móvil al cambiar de ruta
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setShowUserMenu(false);
  }, [location]);

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

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/');
  };

  const getInitials = () => {
    if (!user) return '';
    return `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`.toUpperCase();
  };

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
          
          {/* Botón Menú Hamburguesa (Solo Móvil) */}
          <button 
            className="header__mobile-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Abrir menú"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"} />
            </svg>
          </button>

          {/* Logo */}
          <Link to="/" className="header__logo">
            <span className="header__logo-icon">👟</span>
            <div className="header__logo-text">
              <span className="header__logo-main">DAREN</span>
              <span className="header__logo-sub">STORE</span>
            </div>
          </Link>

          {/* Barra de búsqueda (Oculta en móvil muy pequeño por CSS) */}
          <div className="header__search">
            <svg className="header__search-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input 
              type="text" 
              placeholder="Buscar zapatillas..." 
              className="header__search-input"
            />
            <kbd className="header__search-shortcut">⌘K</kbd>
          </div>

          {/* Navegación (Ahora responsiva) */}
          <nav className={`header__nav ${isMobileMenuOpen ? 'header__nav--open' : ''}`}>
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
            
            {/* En móvil, agregamos opciones extra si es necesario, o dejamos que el usuario use el menú de perfil */}
          </nav>

          {/* Acciones: Usuario + Carrito */}
          <div className="header__actions">
            {/* Sección de Usuario */}
            {user ? (
              <div className="header__user" ref={userMenuRef}>
                <button 
                  className="header__user-button"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  aria-label="Menú de usuario"
                >
                  <div className="header__user-avatar">
                    <span className="header__user-initials">{getInitials()}</span>
                    <span className="header__user-status"></span>
                  </div>
                  <div className="header__user-info">
                    <span className="header__user-greeting">Hola,</span>
                    <span className="header__user-name">{user.firstName}</span>
                  </div>
                  <svg 
                    className={`header__user-chevron ${showUserMenu ? 'header__user-chevron--open' : ''}`}
                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {showUserMenu && (
                  <div className="header__user-dropdown">
                    <div className="header__user-dropdown-header">
                      <div className="header__user-dropdown-avatar">
                        {getInitials()}
                      </div>
                      <div className="header__user-dropdown-info">
                        <p className="header__user-dropdown-name">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="header__user-dropdown-email">
                          {user.email}
                        </p>
                      </div>
                    </div>

                    <div className="header__user-dropdown-divider"></div>

                    <div className="header__user-dropdown-section">
                      <Link to="/perfil" className="header__user-dropdown-item" onClick={() => setShowUserMenu(false)}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                        </svg>
                        <span>Mi Perfil</span>
                      </Link>
                      <Link to="/pedidos" className="header__user-dropdown-item" onClick={() => setShowUserMenu(false)}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
                        </svg>
                        <span>Mis Pedidos</span>
                      </Link>
                      <Link to="/favoritos" className="header__user-dropdown-item" onClick={() => setShowUserMenu(false)}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                        </svg>
                        <span>Favoritos</span>
                      </Link>
                    </div>

                    <div className="header__user-dropdown-divider"></div>

                    <div className="header__user-dropdown-section">
                      <button className="header__user-dropdown-item header__user-dropdown-item--danger" onClick={handleLogout}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                        </svg>
                        <span>Cerrar Sesión</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="header__auth-buttons">
                <Link to="/login" className="header__auth-button header__auth-button--login">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                  </svg>
                  <span>Ingresar</span>
                </Link>
                <Link to="/register" className="header__auth-button header__auth-button--register">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
                  </svg>
                  <span>Registrarse</span>
                </Link>
              </div>
            )}

            {/* Carrito */}
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