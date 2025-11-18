import React, { useState, useEffect } from 'react';
import ProductCard from '../ProductCard/ProductCard';
import './ProductList.css';

const ProductList = ({ products, viewMode = 'grid', showFilters = false }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [visibleProducts, setVisibleProducts] = useState([]);
  const [itemsToShow, setItemsToShow] = useState(8);

  useEffect(() => {
    // Simular carga inicial
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
      setVisibleProducts(products.slice(0, itemsToShow));
    }, 300);

    return () => clearTimeout(timer);
  }, [products, itemsToShow]);

  const handleLoadMore = () => {
    const newItemsToShow = itemsToShow + 8;
    setItemsToShow(newItemsToShow);
    setVisibleProducts(products.slice(0, newItemsToShow));
  };

  const hasMore = visibleProducts.length < products.length;

  if (isLoading) {
    return (
      <div className={`product-list product-list--${viewMode} product-list--loading`}>
        {[...Array(8)].map((_, index) => (
          <div key={index} className="product-list__skeleton">
            <div className="skeleton__image"></div>
            <div className="skeleton__content">
              <div className="skeleton__title"></div>
              <div className="skeleton__subtitle"></div>
              <div className="skeleton__price"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="product-list__empty">
        <div className="product-list__empty-icon">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
          </svg>
        </div>
        <h3 className="product-list__empty-title">No hay productos disponibles</h3>
        <p className="product-list__empty-text">
          Intenta ajustar los filtros o explora otras categorías
        </p>
      </div>
    );
  }

  return (
    <>
      <div className={`product-list product-list--${viewMode}`}>
        {visibleProducts.map((product, index) => (
          <div
            key={product.id}
            className="product-list__item"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <ProductCard product={product} viewMode={viewMode} />
          </div>
        ))}
      </div>

      {hasMore && (
        <div className="product-list__load-more">
          <button
            className="product-list__load-more-btn"
            onClick={handleLoadMore}
          >
            <span>Cargar más productos</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
            </svg>
          </button>
          <p className="product-list__load-more-info">
            Mostrando {visibleProducts.length} de {products.length} productos
          </p>
        </div>
      )}
    </>
  );
};

export default ProductList;
