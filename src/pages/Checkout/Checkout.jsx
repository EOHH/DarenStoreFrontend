import React, { useState, useEffect } from 'react';
import { useCart } from '../../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import './Checkout.css';

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState({});
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  
  const [formData, setFormData] = useState({
    // Información de contacto
    email: '',
    phone: '',
    
    // Dirección de envío
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Colombia',
    
    // Método de envío
    shippingMethod: 'standard',
    
    // Información de pago
    paymentMethod: 'card',
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    
    // Opciones adicionales
    saveInfo: false,
    newsletter: true,
  });

  const subtotal = getCartTotal();
  const discount = appliedCoupon ? subtotal * 0.15 : 0;
  const shippingCost = formData.shippingMethod === 'express' ? 15000 : 
                       formData.shippingMethod === 'standard' ? 5000 : 0;
  const tax = (subtotal - discount + shippingCost) * 0.19; // IVA 19%
  const total = subtotal - discount + shippingCost + tax;

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/catalogo');
    }
  }, [cartItems, navigate]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Limpiar error cuando el usuario empieza a escribir
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 1) {
      if (!formData.email) newErrors.email = 'El email es requerido';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email inválido';
      
      if (!formData.phone) newErrors.phone = 'El teléfono es requerido';
      else if (!/^\d{10}$/.test(formData.phone.replace(/\s/g, ''))) {
        newErrors.phone = 'Teléfono inválido (10 dígitos)';
      }
      
      if (!formData.firstName) newErrors.firstName = 'El nombre es requerido';
      if (!formData.lastName) newErrors.lastName = 'El apellido es requerido';
      if (!formData.address) newErrors.address = 'La dirección es requerida';
      if (!formData.city) newErrors.city = 'La ciudad es requerida';
      if (!formData.zipCode) newErrors.zipCode = 'El código postal es requerido';
    }
    
    if (step === 3 && formData.paymentMethod === 'card') {
      if (!formData.cardNumber || formData.cardNumber.length < 16) {
        newErrors.cardNumber = 'Número de tarjeta inválido';
      }
      if (!formData.cardName) newErrors.cardName = 'Nombre del titular requerido';
      if (!formData.expiryDate || !/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
        newErrors.expiryDate = 'Formato: MM/AA';
      }
      if (!formData.cvv || formData.cvv.length < 3) {
        newErrors.cvv = 'CVV inválido';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePreviousStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    
    if (!validateStep(currentStep)) {
      return;
    }

    setIsProcessing(true);

    // Simulación de procesamiento de pago
    setTimeout(() => {
      console.log('Procesando pedido:', { formData, cartItems, total });
      
      // En producción, aquí iría la llamada al backend
      /*
      try {
        const response = await fetch('http://localhost:8080/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items: cartItems,
            customerInfo: formData,
            total: total,
            discount: discount,
            shippingCost: shippingCost,
            tax: tax
          })
        });
        
        if (!response.ok) throw new Error('Error al procesar el pedido');
        
        const result = await response.json();
        clearCart();
        navigate('/order-confirmation', { state: { order: result } });
      } catch (error) {
        console.error(error);
        alert('Hubo un error al procesar tu pedido. Inténtalo de nuevo.');
        setIsProcessing(false);
      }
      */
      
      clearCart();
      navigate('/order-confirmation');
    }, 2000);
  };

  const steps = [
    { number: 1, title: 'Información', icon: '📋' },
    { number: 2, title: 'Envío', icon: '🚚' },
    { number: 3, title: 'Pago', icon: '💳' }
  ];

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        {/* Progress Steps */}
        <div className="checkout__steps">
          {steps.map((step, index) => (
            <React.Fragment key={step.number}>
              <div 
                className={`checkout__step ${currentStep >= step.number ? 'checkout__step--active' : ''} ${currentStep > step.number ? 'checkout__step--completed' : ''}`}
                onClick={() => currentStep > step.number && setCurrentStep(step.number)}
              >
                <div className="checkout__step-icon">
                  {currentStep > step.number ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  ) : (
                    <span>{step.icon}</span>
                  )}
                </div>
                <div className="checkout__step-info">
                  <span className="checkout__step-number">Paso {step.number}</span>
                  <span className="checkout__step-title">{step.title}</span>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className={`checkout__step-divider ${currentStep > step.number ? 'checkout__step-divider--completed' : ''}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="checkout__grid">
          {/* Formulario */}
          <div className="checkout__main">
            <form onSubmit={handleCheckout} className="checkout__form">
              {/* Step 1: Información de Contacto y Envío */}
              {currentStep === 1 && (
                <div className="checkout__section">
                  <div className="checkout__section-header">
                    <h2 className="checkout__section-title">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                      </svg>
                      Información de Contacto
                    </h2>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="email" className="form-label">
                        Email <span className="form-required">*</span>
                      </label>
                      <div className="form-input-wrapper">
                        <svg className="form-input-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                        </svg>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          className={`form-input ${errors.email ? 'form-input--error' : ''}`}
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="tu@email.com"
                        />
                      </div>
                      {errors.email && <span className="form-error">{errors.email}</span>}
                    </div>

                    <div className="form-group">
                      <label htmlFor="phone" className="form-label">
                        Teléfono <span className="form-required">*</span>
                      </label>
                      <div className="form-input-wrapper">
                        <svg className="form-input-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                        </svg>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          className={`form-input ${errors.phone ? 'form-input--error' : ''}`}
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="300 123 4567"
                        />
                      </div>
                      {errors.phone && <span className="form-error">{errors.phone}</span>}
                    </div>
                  </div>

                  <div className="checkout__section-header">
                    <h2 className="checkout__section-title">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                      </svg>
                      Dirección de Envío
                    </h2>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="firstName" className="form-label">
                        Nombre <span className="form-required">*</span>
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        className={`form-input ${errors.firstName ? 'form-input--error' : ''}`}
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder="Juan"
                      />
                      {errors.firstName && <span className="form-error">{errors.firstName}</span>}
                    </div>

                    <div className="form-group">
                      <label htmlFor="lastName" className="form-label">
                        Apellido <span className="form-required">*</span>
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        className={`form-input ${errors.lastName ? 'form-input--error' : ''}`}
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder="Pérez"
                      />
                      {errors.lastName && <span className="form-error">{errors.lastName}</span>}
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="address" className="form-label">
                      Dirección <span className="form-required">*</span>
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      className={`form-input ${errors.address ? 'form-input--error' : ''}`}
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Calle 123 #45-67, Apto 801"
                    />
                    {errors.address && <span className="form-error">{errors.address}</span>}
                  </div>

                  <div className="form-row form-row--3">
                    <div className="form-group">
                      <label htmlFor="city" className="form-label">
                        Ciudad <span className="form-required">*</span>
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        className={`form-input ${errors.city ? 'form-input--error' : ''}`}
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="Bogotá"
                      />
                      {errors.city && <span className="form-error">{errors.city}</span>}
                    </div>

                    <div className="form-group">
                      <label htmlFor="state" className="form-label">
                        Departamento
                      </label>
                      <input
                        type="text"
                        id="state"
                        name="state"
                        className="form-input"
                        value={formData.state}
                        onChange={handleInputChange}
                        placeholder="Cundinamarca"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="zipCode" className="form-label">
                        Código Postal <span className="form-required">*</span>
                      </label>
                      <input
                        type="text"
                        id="zipCode"
                        name="zipCode"
                        className={`form-input ${errors.zipCode ? 'form-input--error' : ''}`}
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        placeholder="110111"
                      />
                      {errors.zipCode && <span className="form-error">{errors.zipCode}</span>}
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-checkbox">
                      <input
                        type="checkbox"
                        name="saveInfo"
                        checked={formData.saveInfo}
                        onChange={handleInputChange}
                      />
                      <span>Guardar esta información para futuras compras</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Step 2: Método de Envío */}
              {currentStep === 2 && (
                <div className="checkout__section">
                  <div className="checkout__section-header">
                    <h2 className="checkout__section-title">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                      </svg>
                      Selecciona tu Método de Envío
                    </h2>
                  </div>

                  <div className="shipping-options">
                    <label className={`shipping-option ${formData.shippingMethod === 'standard' ? 'shipping-option--selected' : ''}`}>
                      <input
                        type="radio"
                        name="shippingMethod"
                        value="standard"
                        checked={formData.shippingMethod === 'standard'}
                        onChange={handleInputChange}
                      />
                      <div className="shipping-option__content">
                        <div className="shipping-option__header">
                          <span className="shipping-option__icon">📦</span>
                          <div className="shipping-option__info">
                            <span className="shipping-option__name">Envío Estándar</span>
                            <span className="shipping-option__time">5-7 días hábiles</span>
                          </div>
                        </div>
                        <span className="shipping-option__price">
                          ${shippingCost.toLocaleString('es-CO')}
                        </span>
                      </div>
                    </label>

                    <label className={`shipping-option ${formData.shippingMethod === 'express' ? 'shipping-option--selected' : ''}`}>
                      <input
                        type="radio"
                        name="shippingMethod"
                        value="express"
                        checked={formData.shippingMethod === 'express'}
                        onChange={handleInputChange}
                      />
                      <div className="shipping-option__content">
                        <div className="shipping-option__header">
                          <span className="shipping-option__icon">⚡</span>
                          <div className="shipping-option__info">
                            <span className="shipping-option__name">Envío Express</span>
                            <span className="shipping-option__time">2-3 días hábiles</span>
                          </div>
                        </div>
                        <span className="shipping-option__price">$15.000</span>
                      </div>
                    </label>

                    <label className={`shipping-option ${formData.shippingMethod === 'free' ? 'shipping-option--selected' : ''}`}>
                      <input
                        type="radio"
                        name="shippingMethod"
                        value="free"
                        checked={formData.shippingMethod === 'free'}
                        onChange={handleInputChange}
                        disabled={subtotal < 150000}
                      />
                      <div className="shipping-option__content">
                        <div className="shipping-option__header">
                          <span className="shipping-option__icon">🎁</span>
                          <div className="shipping-option__info">
                            <span className="shipping-option__name">Envío Gratis</span>
                            <span className="shipping-option__time">7-10 días hábiles</span>
                            {subtotal < 150000 && (
                              <span className="shipping-option__requirement">
                                Compra mínima $150.000
                              </span>
                            )}
                          </div>
                        </div>
                        <span className="shipping-option__price shipping-option__price--free">Gratis</span>
                      </div>
                    </label>
                  </div>
                </div>
              )}

              {/* Step 3: Pago */}
              {currentStep === 3 && (
                <div className="checkout__section">
                  <div className="checkout__section-header">
                    <h2 className="checkout__section-title">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                      </svg>
                      Método de Pago
                    </h2>
                  </div>

                  <div className="payment-methods">
                    <label className={`payment-method ${formData.paymentMethod === 'card' ? 'payment-method--selected' : ''}`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="card"
                        checked={formData.paymentMethod === 'card'}
                        onChange={handleInputChange}
                      />
                      <div className="payment-method__content">
                        <span className="payment-method__icon">💳</span>
                        <span className="payment-method__name">Tarjeta de Crédito/Débito</span>
                      </div>
                    </label>

                    <label className={`payment-method ${formData.paymentMethod === 'pse' ? 'payment-method--selected' : ''}`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="pse"
                        checked={formData.paymentMethod === 'pse'}
                        onChange={handleInputChange}
                      />
                      <div className="payment-method__content">
                        <span className="payment-method__icon">🏦</span>
                        <span className="payment-method__name">PSE</span>
                      </div>
                    </label>

                    <label className={`payment-method ${formData.paymentMethod === 'cash' ? 'payment-method--selected' : ''}`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cash"
                        checked={formData.paymentMethod === 'cash'}
                        onChange={handleInputChange}
                      />
                      <div className="payment-method__content">
                        <span className="payment-method__icon">💵</span>
                        <span className="payment-method__name">Efectivo contra entrega</span>
                      </div>
                    </label>
                  </div>

                  {formData.paymentMethod === 'card' && (
                    <div className="payment-card-form">
                      <div className="form-group">
                        <label htmlFor="cardNumber" className="form-label">
                          Número de Tarjeta <span className="form-required">*</span>
                        </label>
                        <div className="form-input-wrapper">
                          <svg className="form-input-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                          </svg>
                          <input
                            type="text"
                            id="cardNumber"
                            name="cardNumber"
                            className={`form-input ${errors.cardNumber ? 'form-input--error' : ''}`}
                            value={formData.cardNumber}
                            onChange={handleInputChange}
                            placeholder="1234 5678 9012 3456"
                            maxLength="19"
                          />
                        </div>
                        {errors.cardNumber && <span className="form-error">{errors.cardNumber}</span>}
                      </div>

                      <div className="form-group">
                        <label htmlFor="cardName" className="form-label">
                          Nombre del Titular <span className="form-required">*</span>
                        </label>
                        <input
                          type="text"
                          id="cardName"
                          name="cardName"
                          className={`form-input ${errors.cardName ? 'form-input--error' : ''}`}
                          value={formData.cardName}
                          onChange={handleInputChange}
                          placeholder="JUAN PEREZ"
                        />
                        {errors.cardName && <span className="form-error">{errors.cardName}</span>}
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label htmlFor="expiryDate" className="form-label">
                            Fecha de Expiración <span className="form-required">*</span>
                          </label>
                          <input
                            type="text"
                            id="expiryDate"
                            name="expiryDate"
                            className={`form-input ${errors.expiryDate ? 'form-input--error' : ''}`}
                            value={formData.expiryDate}
                            onChange={handleInputChange}
                            placeholder="MM/AA"
                            maxLength="5"
                          />
                          {errors.expiryDate && <span className="form-error">{errors.expiryDate}</span>}
                        </div>

                        <div className="form-group">
                          <label htmlFor="cvv" className="form-label">
                            CVV <span className="form-required">*</span>
                          </label>
                          <input
                            type="text"
                            id="cvv"
                            name="cvv"
                            className={`form-input ${errors.cvv ? 'form-input--error' : ''}`}
                            value={formData.cvv}
                            onChange={handleInputChange}
                            placeholder="123"
                            maxLength="4"
                          />
                          {errors.cvv && <span className="form-error">{errors.cvv}</span>}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="form-group">
                    <label className="form-checkbox">
                      <input
                        type="checkbox"
                        name="newsletter"
                        checked={formData.newsletter}
                        onChange={handleInputChange}
                      />
                      <span>Quiero recibir ofertas exclusivas y novedades por email</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="checkout__actions">
                {currentStep > 1 && (
                  <button
                    type="button"
                    className="checkout__button checkout__button--secondary"
                    onClick={handlePreviousStep}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                    Volver
                  </button>
                )}

                {currentStep < 3 ? (
                  <button
                    type="button"
                    className="checkout__button checkout__button--primary"
                    onClick={handleNextStep}
                  >
                    Continuar
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="checkout__button checkout__button--primary"
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <span className="checkout__spinner"></span>
                        Procesando...
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                        </svg>
                        Finalizar Compra
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Order Summary Sidebar */}
          <aside className="checkout__sidebar">
            <div className="order-summary">
              <h2 className="order-summary__title">Resumen del Pedido</h2>

              <div className="order-summary__items">
                {cartItems.map(item => (
                  <div key={item.id} className="order-item">
                    <div className="order-item__image-wrapper">
                      <img src={item.images[0]} alt={item.name} className="order-item__image" />
                      <span className="order-item__quantity">{item.quantity}</span>
                    </div>
                    <div className="order-item__details">
                      <p className="order-item__name">{item.name}</p>
                      {item.size && (
                        <p className="order-item__variant">Talla: {item.size}</p>
                      )}
                      <p className="order-item__price">${(item.price * item.quantity).toLocaleString('es-CO')}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="order-summary__breakdown">
                <div className="order-summary__row">
                  <span>Subtotal</span>
                  <span>${subtotal.toLocaleString('es-CO')}</span>
                </div>
                {discount > 0 && (
                  <div className="order-summary__row order-summary__row--discount">
                    <span>Descuento</span>
                    <span>-${discount.toLocaleString('es-CO')}</span>
                  </div>
                )}
                <div className="order-summary__row">
                  <span>Envío</span>
                  <span>
                    {shippingCost === 0 ? 'Gratis' : `$${shippingCost.toLocaleString('es-CO')}`}
                  </span>
                </div>
                <div className="order-summary__row">
                  <span>IVA (19%)</span>
                  <span>${tax.toLocaleString('es-CO')}</span>
                </div>
                <div className="order-summary__row order-summary__row--total">
                  <span>Total</span>
                  <span>${total.toLocaleString('es-CO')}</span>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="order-summary__trust">
                <div className="trust-badge">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                  <span>Pago 100% Seguro</span>
                </div>
                <div className="trust-badge">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                  <span>SSL Encriptado</span>
                </div>
                <div className="trust-badge">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                  </svg>
                  <span>Devolución 30 días</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
