import React, { useState } from 'react';
import { useCart } from '../../../contexts/CartContext';
import { Link } from 'react-router-dom';
import './Cart.css';

const Cart = () => {
  const { 
    cartItems, 
    getCartTotal, 
    isCartOpen, 
    setIsCartOpen, 
    removeFromCart,
    updateQuantity // Asume que tienes esta función en tu contexto
  } = useCart();

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const subtotal = getCartTotal();
  const discount = appliedCoupon ? subtotal * 0.15 : 0;
  const freeShippingThreshold = 150000;
  const shippingProgress = Math.min((subtotal / freeShippingThreshold) * 100, 100);
  const remainingForFreeShipping = Math.max(freeShippingThreshold - subtotal, 0);

  const handleApplyCoupon = () => {
    if (couponCode.toLowerCase() === 'bienvenido15') {
      setAppliedCoupon({ code: couponCode, discount: 0.15 });
      setCouponCode('');
    }
  };

  const handleQuantityChange = (itemId, change) => {
    const item = cartItems.find(i => i.id === itemId);
    const newQuantity = item.quantity + change;
    if (newQuantity > 0) {
      updateQuantity(itemId, newQuantity);
    }
  };

  const handleCheckout = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsCartOpen(false);
    }, 1000);
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className={`cart-overlay ${isCartOpen ? 'cart-overlay--open' : ''}`}
        onClick={() => setIsCartOpen(false)}
      />
      
      {/* Cart Drawer */}
      <div className={`cart ${isCartOpen ? 'cart--open' : ''}`}>
        {/* Header */}
        <div className="cart__header">
          <div className="cart__header-content">
            <h2 className="cart__title">
              <svg className="cart__title-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
              Mi Carrito
              {cartItems.length > 0 && (
                <span className="cart__count-badge">{cartItems.length}</span>
              )}
            </h2>
            <button 
              onClick={() => setIsCartOpen(false)} 
              className="cart__close-button"
              aria-label="Cerrar carrito"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Free Shipping Progress */}
          {cartItems.length > 0 && remainingForFreeShipping > 0 && (
            <div className="cart__shipping-progress">
              <div className="cart__shipping-info">
                <svg className="cart__shipping-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                </svg>
                <span className="cart__shipping-text">
                  ¡Te faltan <strong>${remainingForFreeShipping.toLocaleString('es-CO')}</strong> para envío gratis!
                </span>
              </div>
              <div className="cart__progress-bar">
                <div 
                  className="cart__progress-fill" 
                  style={{ width: `${shippingProgress}%` }}
                />
              </div>
            </div>
          )}

          {cartItems.length > 0 && remainingForFreeShipping <= 0 && (
            <div className="cart__free-shipping-achieved">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>¡Felicidades! Tienes envío gratis</span>
            </div>
          )}
        </div>

        {/* Items Container */}
        <div className="cart__items-container">
          {cartItems.length === 0 ? (
            <div className="cart__empty">
              <div className="cart__empty-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
              </div>
              <h3 className="cart__empty-title">Tu carrito está vacío</h3>
              <p className="cart__empty-text">
                ¡Descubre nuestras zapatillas exclusivas y comienza a armar tu colección!
              </p>
              <Link 
                to="/catalogo" 
                className="cart__empty-button"
                onClick={() => setIsCartOpen(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
                </svg>
                Explorar Catálogo
              </Link>

              {/* Trust badges en carrito vacío */}
              <div className="cart__empty-features">
                <div className="cart__feature">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                  <span>Compra 100% Segura</span>
                </div>
                <div className="cart__feature">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                  </svg>
                  <span>Envío Gratis +$150k</span>
                </div>
                <div className="cart__feature">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                  </svg>
                  <span>Devolución 30 días</span>
                </div>
              </div>
            </div>
          ) : (
            <>
              {cartItems.map(item => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item__image-wrapper">
                    <img 
                      src={item.images[0]} 
                      alt={item.name} 
                      className="cart-item__image" 
                      loading="lazy"
                    />
                  </div>
                  
                  <div className="cart-item__details">
                    <h3 className="cart-item__title">{item.name}</h3>
                    
                    {item.size && (
                      <p className="cart-item__variant">
                        Talla: <strong>{item.size}</strong>
                      </p>
                    )}

                    <div className="cart-item__footer">
                      <div className="cart-item__quantity-control">
                        <button 
                          className="cart-item__qty-btn"
                          onClick={() => handleQuantityChange(item.id, -1)}
                          aria-label="Disminuir cantidad"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
                          </svg>
                        </button>
                        <span className="cart-item__quantity">{item.quantity}</span>
                        <button 
                          className="cart-item__qty-btn"
                          onClick={() => handleQuantityChange(item.id, 1)}
                          aria-label="Aumentar cantidad"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                          </svg>
                        </button>
                      </div>

                      <p className="cart-item__price">
                        ${(item.price * item.quantity).toLocaleString('es-CO')}
                      </p>
                    </div>
                  </div>

                  <button 
                    onClick={() => removeFromCart(item.id)} 
                    className="cart-item__remove-button"
                    aria-label="Eliminar producto"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                  </button>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Footer con resumen */}
        {cartItems.length > 0 && (
          <div className="cart__footer">
            {/* Coupon Section */}
            <div className="cart__coupon">
              <div className="cart__coupon-input-wrapper">
                <svg className="cart__coupon-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 14.25l6-6m4.5-3.493V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0c1.1.128 1.907 1.077 1.907 2.185zM9.75 9h.008v.008H9.75V9zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm4.125 4.5h.008v.008h-.008V13.5zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Código de cupón"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="cart__coupon-input"
                  disabled={appliedCoupon}
                />
                {!appliedCoupon && (
                  <button 
                    onClick={handleApplyCoupon}
                    className="cart__coupon-button"
                    disabled={!couponCode}
                  >
                    Aplicar
                  </button>
                )}
              </div>
              {appliedCoupon && (
                <div className="cart__coupon-applied">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Cupón "{appliedCoupon.code}" aplicado</span>
                  <button onClick={() => setAppliedCoupon(null)}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}
            </div>

            {/* Summary */}
            <div className="cart__summary">
              <div className="cart__summary-row">
                <span>Subtotal</span>
                <span>${subtotal.toLocaleString('es-CO')}</span>
              </div>
              {appliedCoupon && (
                <div className="cart__summary-row cart__summary-row--discount">
                  <span>Descuento ({appliedCoupon.discount * 100}%)</span>
                  <span>-${discount.toLocaleString('es-CO')}</span>
                </div>
              )}
              <div className="cart__summary-row cart__summary-row--shipping">
                <span>Envío</span>
                <span className="cart__shipping-badge">
                  {remainingForFreeShipping <= 0 ? 'Gratis' : 'Calculado en checkout'}
                </span>
              </div>
              <div className="cart__summary-row cart__summary-row--total">
                <span>Total</span>
                <span className="cart__total-amount">
                  ${(subtotal - discount).toLocaleString('es-CO')}
                </span>
              </div>
            </div>

            {/* Checkout Button */}
            <Link
              to="/checkout"
              className={`cart__checkout-button ${isProcessing ? 'cart__checkout-button--processing' : ''}`}
              onClick={handleCheckout}
            >
              {isProcessing ? (
                <>
                  <span className="cart__spinner"></span>
                  Procesando...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                  Proceder al Pago Seguro
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </>
              )}
            </Link>

            <button 
              className="cart__continue-shopping"
              onClick={() => setIsCartOpen(false)}
            >
              Continuar Comprando
            </button>

            {/* Trust Indicators */}
            <div className="cart__trust">
              <div className="cart__trust-item">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
                <span>Pago seguro SSL</span>
              </div>
              <div className="cart__trust-item">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                </svg>
                <span>Múltiples métodos de pago</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;
