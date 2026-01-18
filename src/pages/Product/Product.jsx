import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { products } from '../../data/products'; // Importación directa de datos locales
import ProductList from '../../components/products/ProductList/ProductList';
import './Product.css';

const Product = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  // Configuración de WhatsApp
  const WHATSAPP_NUMBER = "+51975991831"; // ¡REEMPLAZAR CON TU NÚMERO REAL!

  // Buscar producto directamente en el array local
  const product = products.find(p => p.id === parseInt(id));
  
  // Productos relacionados (Lógica local)
  const relatedProducts = product 
    ? products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4)
    : [];
  
  // Estados de la interfaz
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Inicializar imagen cuando carga el producto
  useEffect(() => {
    if (product) {
      setSelectedImage(product.images?.[0]);
      setSelectedSize(null);
      setQuantity(1);
      setActiveTab('description');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [product]);

  // Vista: Producto No Encontrado
  if (!product) {
    return (
      <div className="product-page">
        <div className="product__not-found">
          <div className="product__not-found-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </div>
          <h2 className="product__not-found-title">Producto no encontrado</h2>
          <p className="product__not-found-text">
            Lo sentimos, el producto que buscas no está disponible o ha sido eliminado.
          </p>
          <Link to="/catalogo" className="product__not-found-button">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Volver al Catálogo
          </Link>
        </div>
      </div>
    );
  }

  // Datos procesados
  const sizes = product.sizes || [];
  const stockStatus = product.stock > 10 ? 'in-stock' : product.stock > 0 ? 'low-stock' : 'out-of-stock';
  const rating = 4.5;
  const reviewCount = 127;
  const isNew = product.isNew || false;
  const discount = product.discount || 0;
  const isOnSale = discount > 0;
  
  const features = [
    'Material premium y duradero',
    'Suela antideslizante',
    'Diseño ergonómico',
    'Fácil de limpiar',
    'Producto 100% original'
  ];

  const reviews = [
    {
      id: 1,
      author: 'María González',
      rating: 5,
      date: 'Hace 2 días',
      comment: 'Excelente calidad, muy cómodas y el envío fue rápido. ¡Totalmente recomendadas!'
    },
    {
      id: 2,
      author: 'Carlos Rodríguez',
      rating: 5,
      date: 'Hace 1 semana',
      comment: 'Perfectas para el día a día. La talla es precisa y el material es de primera.'
    }
  ];

  const specifications = [
    { label: 'Marca', value: product.brand || 'Generico' },
    { label: 'Categoría', value: product.category || 'General' },
    { label: 'Material exterior', value: 'Cuero sintético premium' },
    { label: 'Suela', value: 'Goma antideslizante' },
    { label: 'País de origen', value: 'Vietnam' },
    { label: 'Código de producto', value: `SKU-${product.id}` }
  ];

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= (product.stock || 10)) {
      setQuantity(newQuantity);
    }
  };

  // --- LÓGICA WHATSAPP ---
  const handleWhatsAppPurchase = () => {
    if (!selectedSize && sizes.length > 0) {
      alert('Por favor selecciona una talla antes de contactar.');
      return;
    }

    const message = `Hola DarenStore! 👋 Me interesa comprar:
👟 *Modelo:* ${product.name}
📏 *Talla:* ${selectedSize || 'N/A'}
📦 *Cantidad:* ${quantity}
💰 *Precio Unitario:* $${product.price}
    
¿Está disponible?`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  // Lógica Carrito Local
  const handleAddToCart = () => {
    if (!selectedSize && sizes.length > 0) {
      alert('Por favor selecciona una talla');
      return;
    }

    setIsAddingToCart(true);

    setTimeout(() => {
      addToCart({
        ...product,
        quantity: quantity,
        size: selectedSize,
        images: product.images || [] 
      });
      
      setIsAddingToCart(false);
      setShowSuccessMessage(true);

      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
    }, 500);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Enlace copiado al portapapeles');
    }
  };

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <svg
        key={index}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill={index < Math.floor(rating) ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth={1}
      >
        <path
          fillRule="evenodd"
          d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
          clipRule="evenodd"
        />
      </svg>
    ));
  };

  return (
    <div className="product-page">
      {/* Breadcrumbs */}
      <nav className="product-breadcrumbs">
        <Link to="/" className="product-breadcrumb">Inicio</Link>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
        <Link to="/catalogo" className="product-breadcrumb">Catálogo</Link>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
        <span className="product-breadcrumb product-breadcrumb--active">{product.name}</span>
      </nav>

      {/* Success Message */}
      {showSuccessMessage && (
        <div className="product__success-message">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>¡Producto agregado al carrito!</span>
        </div>
      )}

      {/* Product Detail */}
      <div className="product-detail">
        {/* Image Gallery */}
        <div className="product-detail__image-gallery">
          <div className="product-detail__main-image">
            <div className="product-detail__badges">
              {isNew && <span className="product-detail__badge product-detail__badge--new">Nuevo</span>}
              {isOnSale && <span className="product-detail__badge product-detail__badge--sale">-{discount}%</span>}
            </div>

            <button className="product-detail__zoom-icon" onClick={() => window.open(selectedImage, '_blank')}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </button>

            <img src={selectedImage || product.images?.[0]} alt={product.name} />
          </div>

          <div className="product-detail__thumbnails">
            {product.images?.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`${product.name} thumbnail ${index + 1}`}
                onClick={() => setSelectedImage(image)}
                className={`product-detail__thumbnail ${selectedImage === image ? 'product-detail__thumbnail--active' : ''}`}
              />
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="product-detail__info">
          <div className="product-detail__header">
            <div className="product-detail__brand">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
              {product.brand || 'Marca Premium'}
            </div>

            <h1 className="product-detail__title">{product.name}</h1>

            <div className="product-detail__rating">
              <div className="product-detail__stars">{renderStars(rating)}</div>
              <span className="product-detail__rating-text">{rating} ({reviewCount} reseñas)</span>
              <a href="#reviews" className="product-detail__rating-link">Ver reseñas</a>
            </div>
          </div>

          <div className="product-detail__price-section">
            <span className="product-detail__price">
              ${((product.price * (1 - discount / 100))).toLocaleString('es-CO')}
            </span>
            {discount > 0 && (
              <>
                <span className="product-detail__price-original">${product.price.toLocaleString('es-CO')}</span>
                <span className="product-detail__discount">-{discount}%</span>
              </>
            )}
          </div>

          <div className={`product-detail__stock product-detail__stock--${stockStatus}`}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {stockStatus === 'in-stock' && 'En stock - Envío inmediato'}
            {stockStatus === 'low-stock' && `Solo quedan ${product.stock} unidades`}
            {stockStatus === 'out-of-stock' && 'Agotado'}
          </div>

          <p className="product-detail__description">{product.description}</p>

          <div className="product-detail__features">
            {features.map((feature, index) => (
              <div key={index} className="product-detail__feature">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {feature}
              </div>
            ))}
          </div>

          {sizes.length > 0 && (
            <div className="product-detail__size-section">
              <div className="product-detail__size-header">
                <span className="product-detail__size-label">Selecciona tu talla</span>
                <a href="#size-guide" className="product-detail__size-guide">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                  </svg>
                  Guía de tallas
                </a>
              </div>
              <div className="product-detail__sizes">
                {sizes.map(size => (
                  <button
                    key={size}
                    className={`product-detail__size ${selectedSize === size ? 'product-detail__size--selected' : ''}`}
                    onClick={() => setSelectedSize(size)}
                    disabled={stockStatus === 'out-of-stock'}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="product-detail__quantity-section">
            <span className="product-detail__quantity-label">Cantidad</span>
            <div className="product-detail__quantity-selector">
              <div className="product-detail__quantity-controls">
                <button className="product-detail__quantity-btn" onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" /></svg>
                </button>
                <span className="product-detail__quantity-value">{quantity}</span>
                <button className="product-detail__quantity-btn" onClick={() => handleQuantityChange(1)} disabled={quantity >= (product.stock || 10)}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                </button>
              </div>
            </div>
          </div>

          <div className="product-detail__actions">
            {/* Botón WhatsApp (Principal) */}
            <button
              onClick={handleWhatsAppPurchase}
              className="product-detail__whatsapp-btn"
              disabled={stockStatus === 'out-of-stock'}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.017-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
              </svg>
              Comprar por WhatsApp
            </button>

            {/* Botón Carrito (Secundario) */}
            <button
              onClick={handleAddToCart}
              className={`product-detail__add-to-cart ${isAddingToCart ? 'product-detail__add-to-cart--loading' : ''}`}
              disabled={stockStatus === 'out-of-stock' || isAddingToCart}
            >
              {isAddingToCart ? (
                <>
                  <span className="product-detail__spinner"></span>
                  Agregando...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                  </svg>
                  Agregar al Carrito
                </>
              )}
            </button>

            <div className="product-detail__secondary-actions">
              <button
                className={`product-detail__action-btn product-detail__action-btn--wishlist ${isWishlisted ? 'product-detail__action-btn--active' : ''}`}
                onClick={toggleWishlist}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill={isWishlisted ? 'currentColor' : 'none'} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
                Favorito
              </button>

              <button className="product-detail__action-btn" onClick={handleShare}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                </svg>
                Compartir
              </button>
            </div>
          </div>

          <div className="product-detail__trust">
            <div className="product-detail__trust-item">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
              <span>Producto 100% Original</span>
            </div>
            <div className="product-detail__trust-item">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
              </svg>
              <span>Envío Gratis en compras +$150.000</span>
            </div>
            <div className="product-detail__trust-item">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
              <span>Devolución gratis hasta 30 días</span>
            </div>
          </div>
        </div>
      </div>

      <div className="product-detail__tabs">
        <div className="product-detail__tab-buttons">
          <button className={`product-detail__tab-btn ${activeTab === 'description' ? 'product-detail__tab-btn--active' : ''}`} onClick={() => setActiveTab('description')}>Descripción</button>
          <button className={`product-detail__tab-btn ${activeTab === 'specifications' ? 'product-detail__tab-btn--active' : ''}`} onClick={() => setActiveTab('specifications')}>Especificaciones</button>
          <button className={`product-detail__tab-btn ${activeTab === 'reviews' ? 'product-detail__tab-btn--active' : ''}`} onClick={() => setActiveTab('reviews')}>Reseñas ({reviewCount})</button>
        </div>

        <div className={`product-detail__tab-content ${activeTab === 'description' ? 'product-detail__tab-content--active' : ''}`}>
          <h3>Descripción del Producto</h3>
          <p>{product.description}</p>
          <p>Estas zapatillas combinan estilo y comodidad para el uso diario. Fabricadas con materiales de alta calidad.</p>
          <h4>Características Principales:</h4>
          <ul>
            {features.map((feature, index) => <li key={index}>{feature}</li>)}
          </ul>
        </div>

        <div className={`product-detail__tab-content ${activeTab === 'specifications' ? 'product-detail__tab-content--active' : ''}`}>
          <h3>Especificaciones Técnicas</h3>
          <table className="product-detail__specs-table">
            <tbody>
              {specifications.map((spec, index) => <tr key={index}><td>{spec.label}</td><td>{spec.value}</td></tr>)}
            </tbody>
          </table>
        </div>

        <div id="reviews" className={`product-detail__tab-content ${activeTab === 'reviews' ? 'product-detail__tab-content--active' : ''}`}>
          <div className="product-detail__reviews">
            <div className="product-detail__review-summary">
              <div className="product-detail__review-average">
                <span className="product-detail__review-number">{rating}</span>
                <div className="product-detail__stars">{renderStars(rating)}</div>
                <span className="product-detail__review-total">Basado en {reviewCount} reseñas</span>
              </div>
            </div>
            <div className="product-detail__review-list">
              {reviews.map(review => (
                <div key={review.id} className="product-detail__review-item">
                  <div className="product-detail__review-header">
                    <div className="product-detail__review-author">
                      <div className="product-detail__review-avatar">{review.author.charAt(0)}</div>
                      <div>
                        <div className="product-detail__review-name">{review.author}</div>
                        <div className="product-detail__review-date">{review.date}</div>
                      </div>
                    </div>
                    <div className="product-detail__stars">{renderStars(review.rating)}</div>
                  </div>
                  <p className="product-detail__review-text">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className="product-detail__related">
          <div className="product-detail__related-header">
            <h2 className="product-detail__related-title">También te puede interesar</h2>
            <p className="product-detail__related-subtitle">Productos similares</p>
          </div>
          <ProductList products={relatedProducts} />
        </div>
      )}
    </div>
  );
};

export default Product;