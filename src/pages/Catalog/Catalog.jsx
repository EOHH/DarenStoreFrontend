import React, { useState, useMemo } from 'react';
import ProductList from '../../components/products/ProductList/ProductList';
import { products } from '../../data/products';
import './Catalog.css';

const Catalog = () => {
  const [filters, setFilters] = useState({
    search: '',
    brands: [],
    priceRange: [0, 500000],
    sizes: [],
    colors: [],
    onSale: false,
  });
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' o 'list'
  const [showFilters, setShowFilters] = useState(false);

  // Obtener valores únicos para filtros
  const uniqueBrands = useMemo(() => 
    [...new Set(products.map(p => p.brand))].sort(), 
  []);

  const uniqueSizes = useMemo(() => 
    [...new Set(products.flatMap(p => p.sizes || []))].sort((a, b) => a - b),
  []);

  const uniqueColors = useMemo(() => 
    [...new Set(products.flatMap(p => p.colors || []))],
  []);

  const priceRange = useMemo(() => {
    const prices = products.map(p => p.price);
    return [Math.min(...prices), Math.max(...prices)];
  }, []);

  // Filtrar y ordenar productos
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Búsqueda por texto
    if (filters.search) {
      result = result.filter(p => 
        p.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        p.brand?.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Filtrar por marca
    if (filters.brands.length > 0) {
      result = result.filter(p => filters.brands.includes(p.brand));
    }

    // Filtrar por rango de precio
    result = result.filter(p => 
      p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
    );

    // Filtrar por tallas
    if (filters.sizes.length > 0) {
      result = result.filter(p => 
        p.sizes?.some(size => filters.sizes.includes(size))
      );
    }

    // Filtrar por colores
    if (filters.colors.length > 0) {
      result = result.filter(p => 
        p.colors?.some(color => filters.colors.includes(color))
      );
    }

    // Filtrar ofertas
    if (filters.onSale) {
      result = result.filter(p => p.onSale || p.discount);
    }

    // Ordenar
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        break;
      default:
        // 'featured' - mantener orden original
        break;
    }

    return result;
  }, [products, filters, sortBy]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleArrayFilterToggle = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType].includes(value)
        ? prev[filterType].filter(v => v !== value)
        : [...prev[filterType], value]
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      brands: [],
      priceRange: priceRange,
      sizes: [],
      colors: [],
      onSale: false,
    });
  };

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.brands.length > 0) count++;
    if (filters.sizes.length > 0) count++;
    if (filters.colors.length > 0) count++;
    if (filters.onSale) count++;
    if (filters.priceRange[0] !== priceRange[0] || filters.priceRange[1] !== priceRange[1]) count++;
    return count;
  }, [filters, priceRange]);

  return (
    <div className="catalog">
      {/* Hero Section */}
      <div className="catalog__hero">
        <div className="catalog__hero-content">
          <h1 className="catalog__title">
            <span className="catalog__title-icon">👟</span>
            Catálogo Premium
          </h1>
          <p className="catalog__subtitle">
            Descubre nuestra colección exclusiva de zapatillas de las mejores marcas
          </p>
          
          {/* Breadcrumbs */}
          <nav className="catalog__breadcrumbs">
            <a href="/" className="catalog__breadcrumb">Inicio</a>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
            <span className="catalog__breadcrumb catalog__breadcrumb--active">Catálogo</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="catalog__container">
        {/* Filters Sidebar */}
        <aside className={`catalog__sidebar ${showFilters ? 'catalog__sidebar--open' : ''}`}>
          <div className="catalog__sidebar-header">
            <h2 className="catalog__sidebar-title">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" />
              </svg>
              Filtros
              {activeFiltersCount > 0 && (
                <span className="catalog__filter-badge">{activeFiltersCount}</span>
              )}
            </h2>
            <button 
              className="catalog__sidebar-close"
              onClick={() => setShowFilters(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Search */}
          <div className="catalog__filter-group">
            <label className="catalog__filter-label">Buscar</label>
            <div className="catalog__search">
              <svg className="catalog__search-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <input
                type="text"
                placeholder="Buscar productos..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="catalog__search-input"
              />
            </div>
          </div>

          {/* Brands */}
          <div className="catalog__filter-group">
            <label className="catalog__filter-label">
              Marca
              {filters.brands.length > 0 && (
                <span className="catalog__filter-count">({filters.brands.length})</span>
              )}
            </label>
            <div className="catalog__filter-options">
              {uniqueBrands.map(brand => (
                <label key={brand} className="catalog__checkbox">
                  <input
                    type="checkbox"
                    checked={filters.brands.includes(brand)}
                    onChange={() => handleArrayFilterToggle('brands', brand)}
                  />
                  <span className="catalog__checkbox-label">{brand}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="catalog__filter-group">
            <label className="catalog__filter-label">
              Rango de Precio
            </label>
            <div className="catalog__price-range">
              <input
                type="range"
                min={priceRange[0]}
                max={priceRange[1]}
                value={filters.priceRange[1]}
                onChange={(e) => handleFilterChange('priceRange', [filters.priceRange[0], Number(e.target.value)])}
                className="catalog__range-slider"
              />
              <div className="catalog__price-values">
                <span>${filters.priceRange[0].toLocaleString('es-CO')}</span>
                <span>${filters.priceRange[1].toLocaleString('es-CO')}</span>
              </div>
            </div>
          </div>

          {/* Sizes */}
          {uniqueSizes.length > 0 && (
            <div className="catalog__filter-group">
              <label className="catalog__filter-label">
                Talla
                {filters.sizes.length > 0 && (
                  <span className="catalog__filter-count">({filters.sizes.length})</span>
                )}
              </label>
              <div className="catalog__size-grid">
                {uniqueSizes.map(size => (
                  <button
                    key={size}
                    className={`catalog__size-button ${filters.sizes.includes(size) ? 'catalog__size-button--active' : ''}`}
                    onClick={() => handleArrayFilterToggle('sizes', size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Colors */}
          {uniqueColors.length > 0 && (
            <div className="catalog__filter-group">
              <label className="catalog__filter-label">
                Color
                {filters.colors.length > 0 && (
                  <span className="catalog__filter-count">({filters.colors.length})</span>
                )}
              </label>
              <div className="catalog__color-grid">
                {uniqueColors.map(color => (
                  <button
                    key={color}
                    className={`catalog__color-button ${filters.colors.includes(color) ? 'catalog__color-button--active' : ''}`}
                    onClick={() => handleArrayFilterToggle('colors', color)}
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Special Filters */}
          <div className="catalog__filter-group">
            <label className="catalog__checkbox catalog__checkbox--featured">
              <input
                type="checkbox"
                checked={filters.onSale}
                onChange={(e) => handleFilterChange('onSale', e.target.checked)}
              />
              <span className="catalog__checkbox-label">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
                </svg>
                Solo Ofertas
              </span>
            </label>
          </div>

          {/* Clear Filters */}
          {activeFiltersCount > 0 && (
            <button className="catalog__clear-filters" onClick={clearFilters}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
              Limpiar Filtros
            </button>
          )}
        </aside>

        {/* Products Section */}
        <main className="catalog__main">
          {/* Toolbar */}
          <div className="catalog__toolbar">
            <div className="catalog__toolbar-left">
              <button 
                className="catalog__filter-toggle"
                onClick={() => setShowFilters(!showFilters)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" />
                </svg>
                Filtros
                {activeFiltersCount > 0 && (
                  <span className="catalog__filter-badge">{activeFiltersCount}</span>
                )}
              </button>

              <p className="catalog__results-count">
                <strong>{filteredProducts.length}</strong> {filteredProducts.length === 1 ? 'producto' : 'productos'}
              </p>
            </div>

            <div className="catalog__toolbar-right">
              {/* Sort */}
              <div className="catalog__sort">
                <label htmlFor="sort" className="catalog__sort-label">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
                  </svg>
                  Ordenar:
                </label>
                <select
                  id="sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="catalog__sort-select"
                >
                  <option value="featured">Destacados</option>
                  <option value="newest">Más Recientes</option>
                  <option value="price-asc">Precio: Menor a Mayor</option>
                  <option value="price-desc">Precio: Mayor a Menor</option>
                  <option value="name-asc">Nombre: A-Z</option>
                </select>
              </div>

              {/* View Mode */}
              <div className="catalog__view-toggle">
                <button
                  className={`catalog__view-button ${viewMode === 'grid' ? 'catalog__view-button--active' : ''}`}
                  onClick={() => setViewMode('grid')}
                  aria-label="Vista de cuadrícula"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                  </svg>
                </button>
                <button
                  className={`catalog__view-button ${viewMode === 'list' ? 'catalog__view-button--active' : ''}`}
                  onClick={() => setViewMode('list')}
                  aria-label="Vista de lista"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Active Filters Pills */}
          {activeFiltersCount > 0 && (
            <div className="catalog__active-filters">
              {filters.brands.map(brand => (
                <button
                  key={`brand-${brand}`}
                  className="catalog__filter-pill"
                  onClick={() => handleArrayFilterToggle('brands', brand)}
                >
                  {brand}
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              ))}
              {filters.sizes.map(size => (
                <button
                  key={`size-${size}`}
                  className="catalog__filter-pill"
                  onClick={() => handleArrayFilterToggle('sizes', size)}
                >
                  Talla {size}
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              ))}
              {filters.onSale && (
                <button
                  className="catalog__filter-pill catalog__filter-pill--special"
                  onClick={() => handleFilterChange('onSale', false)}
                >
                  Solo Ofertas
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          )}

          {/* Products Grid/List */}
          {filteredProducts.length > 0 ? (
            <ProductList products={filteredProducts} viewMode={viewMode} />
          ) : (
            <div className="catalog__no-results">
              <div className="catalog__no-results-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </div>
              <h3 className="catalog__no-results-title">No se encontraron productos</h3>
              <p className="catalog__no-results-text">
                Intenta ajustar los filtros o realiza una nueva búsqueda
              </p>
              <button className="catalog__no-results-button" onClick={clearFilters}>
                Limpiar todos los filtros
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Catalog;
