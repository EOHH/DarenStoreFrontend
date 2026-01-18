import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const { register } = useAuth();
  const navigate = useNavigate();

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 10) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    return Math.min(strength, 4);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData({ ...formData, [name]: newValue });
    setError('');

    // Calcular fortaleza de contraseña
    if (name === 'password') {
      setPasswordStrength(calculatePasswordStrength(value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validaciones
    if (!formData.firstName || !formData.lastName || !formData.email || 
        !formData.password || !formData.confirmPassword) {
      setError('Todos los campos son obligatorios');
      setIsLoading(false);
      return;
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Por favor ingresa un email válido');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      setIsLoading(false);
      return;
    }

    if (!formData.acceptTerms) {
      setError('Debes aceptar los términos y condiciones');
      setIsLoading(false);
      return;
    }

    const result = await register({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password
    });

    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
    setIsLoading(false);
  };

  const getPasswordStrengthLabel = () => {
    const labels = ['Muy débil', 'Débil', 'Aceptable', 'Fuerte', 'Muy fuerte'];
    return labels[passwordStrength];
  };

  const getPasswordStrengthColor = () => {
    const colors = ['#EF4444', '#F59E0B', '#F59E0B', '#10B981', '#059669'];
    return colors[passwordStrength];
  };

  return (
    <div className="auth-container">
      {/* Background Decoration */}
      <div className="auth-decoration">
        <div className="auth-decoration__circle auth-decoration__circle--1"></div>
        <div className="auth-decoration__circle auth-decoration__circle--2"></div>
        <div className="auth-decoration__circle auth-decoration__circle--3"></div>
      </div>

      <div className="auth-wrapper">
        {/* Left Side - Form */}
        <div className="auth-card">
          {/* Logo */}
          <Link to="/" className="auth-logo">
            <span className="auth-logo__icon">👟</span>
            <span className="auth-logo__text">DAREN STORE</span>
          </Link>

          {/* Header */}
          <div className="auth-header">
            <h1 className="auth-title">Crear cuenta nueva</h1>
            <p className="auth-subtitle">
              Únete a miles de clientes satisfechos
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="auth-alert auth-alert--error">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="auth-form">
            {/* Name Fields */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  Nombre
                  <span className="form-required">*</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  className="form-input"
                  placeholder="Juan"
                  value={formData.firstName}
                  onChange={handleChange}
                  autoComplete="given-name"
                />
              </div>
              <div className="form-group">
                <label className="form-label">
                  Apellido
                  <span className="form-required">*</span>
                </label>
                <input
                  type="text"
                  name="lastName"
                  className="form-input"
                  placeholder="Pérez"
                  value={formData.lastName}
                  onChange={handleChange}
                  autoComplete="family-name"
                />
              </div>
            </div>

            {/* Email Input */}
            <div className="form-group">
              <label className="form-label">
                Email
                <span className="form-required">*</span>
              </label>
              <div className="form-input-wrapper">
                <svg className="form-input-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
                <input
                  type="email"
                  name="email"
                  className="form-input"
                  placeholder="tu@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="form-group">
              <label className="form-label">
                Contraseña
                <span className="form-required">*</span>
              </label>
              <div className="form-input-wrapper">
                <svg className="form-input-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  className="form-input"
                  placeholder="Mínimo 6 caracteres"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="form-input-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
              
              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="password-strength">
                  <div className="password-strength__bar">
                    <div 
                      className="password-strength__fill"
                      style={{ 
                        width: `${(passwordStrength / 4) * 100}%`,
                        backgroundColor: getPasswordStrengthColor()
                      }}
                    />
                  </div>
                  <span 
                    className="password-strength__label"
                    style={{ color: getPasswordStrengthColor() }}
                  >
                    {getPasswordStrengthLabel()}
                  </span>
                </div>
              )}
            </div>

            {/* Confirm Password Input */}
            <div className="form-group">
              <label className="form-label">
                Confirmar Contraseña
                <span className="form-required">*</span>
              </label>
              <div className="form-input-wrapper">
                <svg className="form-input-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  className="form-input"
                  placeholder="Repite tu contraseña"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="form-input-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showConfirmPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="form-checkbox-wrapper">
              <label className="form-checkbox">
                <input
                  type="checkbox"
                  name="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={handleChange}
                />
                <span className="form-checkbox-label">
                  Acepto los <Link to="/terminos" className="form-inline-link">términos y condiciones</Link> y la <Link to="/privacidad" className="form-inline-link">política de privacidad</Link>
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              className="auth-button auth-button--primary"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="auth-button__spinner"></span>
                  Creando cuenta...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                  Crear Cuenta Gratis
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="auth-divider">
            <span>o regístrate con</span>
          </div>

          {/* Social Login */}
          <div className="auth-social">
            <button className="auth-social-button">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </button>
            <button className="auth-social-button">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="#1877F2"/>
              </svg>
              Facebook
            </button>
          </div>

          {/* Footer */}
          <div className="auth-footer">
            <p>
              ¿Ya tienes una cuenta? 
              <Link to="/login" className="auth-link">Inicia sesión</Link>
            </p>
          </div>
        </div>

        {/* Right Side - Info */}
        <div className="auth-info">
          <div className="auth-info__content">
            <div className="auth-info__icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
              </svg>
            </div>
            <h2 className="auth-info__title">Beneficios exclusivos te esperan</h2>
            <p className="auth-info__description">
              Únete a nuestra comunidad y disfruta de ventajas únicas en cada compra.
            </p>

            {/* Benefits */}
            <div className="auth-info__benefits">
              <div className="auth-benefit">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>15% de descuento en tu primera compra</span>
              </div>
              <div className="auth-benefit">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Acceso anticipado a nuevos lanzamientos</span>
              </div>
              <div className="auth-benefit">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Ofertas y promociones exclusivas</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
