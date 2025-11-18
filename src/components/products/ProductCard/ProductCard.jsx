import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../../contexts/CartContext';
import './ProductCard.css';

const ProductCard = ({ product, viewMode = 'grid' }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);

  // Mock data - en producción vendría del producto
  const discount = product.discount || 0;
  const isNew = product.isNew || false;
  const isOnSale = discount > 0;
  const rating = product.rating || 4.5;
  const reviewCount = product.reviewCount || 0;
  const stock = product.stock || 10;
  const hasMultipleImages = product.images && product.images.length > 1;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsAdding(true);
    
    setTimeout(() => {
      addToCart(product);
      setIsAdding(false);
    }, 500);
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/producto/${product.id}`);
  };

  const toggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    // Aquí iría la lógica para guardar en wishlist
  };

  const handleImageChange = () => {
    if (hasMultipleImages) {
      setCurrentImageIndex((prev) => 
        prev === product.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const renderStars = () => {
    return [...Array(5)].map((_, index) => (
      <svg
        key={index}
        className="product-card__star"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill={index < Math.floor(rating) ? 'currentColor' : 'none'}
        stroke="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
          clipRule="evenodd"
        />
      </svg>
    ));
  };

  if (viewMode === 'list') {
    return (
      <div className="product-card product-card--list">
        <Link to={`/producto/${product.id}`} className="product-card__link">
          {/* Image */}
          <div className="product-card__image-container">
            {/* Badges */}
            <div className="product-card__badges">
              {isNew && (
                <span className="product-card__badge product-card__badge--new">Nuevo</span>
              )}
              {isOnSale && (
                <span className="product-card__badge product-card__badge--sale">-{discount}%</span>
              )}
              {stock <= 5 && stock > 0 && (
                <span className="product-card__badge product-card__badge--low-stock">
                  ¡Últimas unidades!
                </span>
              )}
            </div>

            <img 
              src={product.images[currentImageIndex]} 
              alt={product.name} 
              className="product-card__image" 
              onMouseEnter={handleImageChange}
            />

            {/* Wishlist Button */}
            <button
              className={`product-card__wishlist ${isWishlisted ? 'product-card__wishlist--active' : ''}`}
              onClick={toggleWishlist}
              aria-label="Agregar a favoritos"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill={isWishlisted ? 'currentColor' : 'none'} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
            </button>
          </div>

          {/* Info */}
          <div className="product-card__info">
            <div className="product-card__header">
              {product.brand && (
                <span className="product-card__brand">{product.brand}</span>
              )}
              <h3 className="product-card__title">{product.name}</h3>
              
              {/* Rating */}
              {rating > 0 && (
                <div className="product-card__rating">
                  <div className="product-card__stars">
                    {renderStars()}
                  </div>
                  {reviewCount > 0 && (
                    <span className="product-card__review-count">({reviewCount})</span>
                  )}
                </div>
              )}

              <p className="product-card__description">{product.description}</p>
            </div>

            {/* Price and Actions */}
            <div className="product-card__footer">
              <div className="product-card__price-section">
                <span className="product-card__price">
                  ${((product.price * (1 - discount / 100))).toLocaleString('es-CO')}
                </span>
                {discount > 0 && (
                  <span className="product-card__price-original">
                    ${product.price.toLocaleString('es-CO')}
                  </span>
                )}
              </div>

              <button 
                onClick={handleAddToCart}
                className={`product-card__add-button ${isAdding ? 'product-card__add-button--loading' : ''}`}
                disabled={stock === 0 || isAdding}
              >
                {isAdding ? (
                  <>
                    <span className="product-card__spinner"></span>
                    Agregando...
                  </>
                ) : stock === 0 ? (
                  'Agotado'
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                    </svg>
                    Agregar al Carrito
                  </>
                )}
              </button>
            </div>
          </div>
        </Link>
      </div>
    );
  }

  // Grid View (Default)
  return (
    <div className="product-card product-card--grid">
      <Link to={`/producto/${product.id}`} className="product-card__link">
        {/* Image Container */}
        <div className="product-card__image-container">
          {/* Badges */}
          <div className="product-card__badges">
            {isNew && (
              <span className="product-card__badge product-card__badge--new">Nuevo</span>
            )}
            {isOnSale && (
              <span className="product-card__badge product-card__badge--sale">-{discount}%</span>
            )}
          </div>

          {/* Image */}
          <img 
            src={product.images[currentImageIndex]} 
            alt={product.name} 
            className="product-card__image" 
            onMouseEnter={handleImageChange}
          />

          {/* Quick Actions Overlay */}
          <div className="product-card__overlay">
            <button
              className="product-card__quick-view"
              onClick={handleQuickView}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Vista Rápida</span>
            </button>
          </div>

          {/* Wishlist Button */}
          <button
            className={`product-card__wishlist ${isWishlisted ? 'product-card__wishlist--active' : ''}`}
            onClick={toggleWishlist}
            aria-label="Agregar a favoritos"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill={isWishlisted ? 'currentColor' : 'none'} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
          </button>

          {/* Image Dots */}
          {hasMultipleImages && (
            <div className="product-card__dots">
              {product.images.map((_, index) => (
                <span
                  key={index}
                  className={`product-card__dot ${index === currentImageIndex ? 'product-card__dot--active' : ''}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="product-card__info">
          {product.brand && (
            <span className="product-card__brand">{product.brand}</span>
          )}
          
          <h3 className="product-card__title">{product.name}</h3>

          {/* Rating */}
          {rating > 0 && (
            <div className="product-card__rating">
              <div className="product-card__stars">
                {renderStars()}
              </div>
              {reviewCount > 0 && (
                <span className="product-card__review-count">({reviewCount})</span>
              )}
            </div>
          )}

          {/* Price */}
          <div className="product-card__price-section">
            <span className="product-card__price">
              ${((product.price * (1 - discount / 100))).toLocaleString('es-CO')}
            </span>
            {discount > 0 && (
              <span className="product-card__price-original">
                ${product.price.toLocaleString('es-CO')}
              </span>
            )}
          </div>

          {/* Stock Info */}
          {stock <= 5 && stock > 0 && (
            <span className="product-card__stock-warning">
              ¡Solo quedan {stock}!
            </span>
          )}
        </div>
      </Link>

      {/* Add to Cart Button */}
      <button 
        onClick={handleAddToCart}
        className={`product-card__add-button ${isAdding ? 'product-card__add-button--loading' : ''}`}
        disabled={stock === 0 || isAdding}
      >
        {isAdding ? (
          <>
            <span className="product-card__spinner"></span>
            Agregando...
          </>
        ) : stock === 0 ? (
          'Agotado'
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
            Agregar
          </>
        )}
      </button>
    </div>
  );
};

export default ProductCard;
