import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductList from '../../components/products/ProductList/ProductList';
import { products as localProducts } from '../../data/products'; // Importamos datos locales
import './Home.css';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Estado para productos dinámicos (ahora locales)
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar productos al montar el componente (Simulación)
  useEffect(() => {
    setLoading(true);
    // Simulamos un pequeño delay para dar sensación de carga real
    const timer = setTimeout(() => {
      setProducts(localProducts);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Datos del Hero Slider (Usando imágenes de Unsplash para evitar errores de importación)
  const heroSlides = [
    {
      title: 'Colección Primavera 2025',
      subtitle: 'Descubre los últimos lanzamientos exclusivos',
      cta: 'Explorar Ahora',
      image: 'https://sneakerlane.es/cdn/shop/files/AirJordan4RetroFireRed2020_GS_2_processed.png?v=1759490887&width=1445',
      link: '/catalogo'
    },
    {
      title: 'Hasta 40% OFF',
      subtitle: 'En productos seleccionados esta temporada',
      cta: 'Ver Ofertas',
      image: 'https://images.unsplash.com/photo-1512374382149-233c42b6a83b?auto=format&fit=crop&w=1920&q=80',
      link: '/ofertas'
    },
    {
      title: 'Ediciones Limitadas',
      subtitle: 'Zapatillas únicas que no querrás perderte',
      cta: 'Descubrir',
      image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1920&q=80',
      link: '/catalogo'
    }
  ];

  // Datos estáticos para Categorías
  const categories = [
    { name: 'Retro', icon: '👟', color: '#6366F1', link: '/catalogo' },
    { name: 'Casual', icon: '🏙️', color: '#10B981', link: '/catalogo' },
    { name: 'Deportivas', icon: '🏀', color: '#F59E0B', link: '/catalogo' },
    { name: 'Skate', icon: '🛹', color: '#EF4444', link: '/catalogo' },
  ];

  // Datos de Marcas (Logos CDN para asegurar que se vean)
  const brands = [
    { name: 'Nike', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg' },
    { name: 'Adidas', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg' },
    { name: 'Puma', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/ae/Puma-logo-%28text%29.svg' }, // Nota: PNG transparente
    { name: 'New Balance', logo: 'https://upload.wikimedia.org/wikipedia/commons/e/ea/New_Balance_logo.svg' },
    { name: 'Reebok', logo: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Reebok_2019_logo.svg' },
  ];

  // Datos estáticos de Testimonios
  const testimonials = [
    {
      name: 'María González',
      rating: 5,
      comment: 'Excelente calidad y entrega rápida. ¡Las zapatillas son increíbles!',
      avatar: '👩',
      date: 'Hace 2 días'
    },
    {
      name: 'Carlos Rodríguez',
      rating: 5,
      comment: 'Mejor tienda online de zapatillas. Atención al cliente de 10.',
      avatar: '👨',
      date: 'Hace 1 semana'
    },
    {
      name: 'Ana Martínez',
      rating: 5,
      comment: 'Productos auténticos y precios competitivos. Totalmente recomendado.',
      avatar: '👩‍🦰',
      date: 'Hace 3 días'
    }
  ];

  // Efecto para rotación automática del slider
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroSlides.length]);

  // Filtrar los primeros 4 u 8 productos para la sección destacados
  const featuredProducts = products.filter(p => p.isNew || p.rating >= 4.8).slice(0, 4);

  return (
    <div className="home">
      {/* Hero Slider */}
      <section className="hero">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`hero__slide ${index === currentSlide ? 'hero__slide--active' : ''}`}
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="hero__overlay" />
            <div className="hero__content">
              <span className="hero__badge">Nueva Temporada</span>
              <h1 className="hero__title">{slide.title}</h1>
              <p className="hero__subtitle">{slide.subtitle}</p>
              <Link to={slide.link} className="hero__cta">
                {slide.cta}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>
          </div>
        ))}

        {/* Slider Controls */}
        <div className="hero__controls">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              className={`hero__dot ${index === currentSlide ? 'hero__dot--active' : ''}`}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Ir a slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Scroll Indicator */}
        <div className="hero__scroll-indicator">
          <span>Descubre más</span>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
          </svg>
        </div>
      </section>

      {/* Promo Banner */}
      <section className="promo-banner">
        <div className="promo-banner__container">
          <div className="promo-banner__item">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
            </svg>
            <div>
              <strong>Envío Gratis</strong>
              <span>En compras superiores a $150.000</span>
            </div>
          </div>
          <div className="promo-banner__item">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
            <div>
              <strong>Compra Segura</strong>
              <span>Protección en cada transacción</span>
            </div>
          </div>
          <div className="promo-banner__item">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
            <div>
              <strong>Devolución Fácil</strong>
              <span>Hasta 30 días después de tu compra</span>
            </div>
          </div>
          <div className="promo-banner__item">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
            </svg>
            <div>
              <strong>Soporte 24/7</strong>
              <span>Estamos aquí para ayudarte</span>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="categories">
        <div className="section__container">
          <div className="section__header">
            <h2 className="section__title">Compra por Categoría</h2>
            <p className="section__subtitle">Encuentra las zapatillas perfectas para cada ocasión</p>
          </div>

          <div className="categories__grid">
            {categories.map((category, index) => (
              <Link
                key={index}
                to={category.link}
                className="category-card"
                style={{ '--category-color': category.color }}
              >
                <div className="category-card__icon">{category.icon}</div>
                <h3 className="category-card__name">{category.name}</h3>
                <span className="category-card__arrow">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products (AHORA CON DATOS LOCALES) */}
      <section className="featured-products">
        <div className="section__container">
          <div className="section__header">
            <h2 className="section__title">Productos Destacados</h2>
            <p className="section__subtitle">Las zapatillas más populares de la temporada</p>
          </div>
          
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
              <div className="product-list__spinner" style={{ width: '40px', height: '40px', border: '3px solid #eee', borderTopColor: '#6366F1', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
            </div>
          ) : (
            <ProductList products={featuredProducts} />
          )}

          <div className="section__cta">
            <Link to="/catalogo" className="button button--primary">
              Ver Catálogo Completo
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Dual Banner */}
      <section className="dual-banner">
        <div className="section__container">
          <div className="dual-banner__grid">
            <Link to="/catalogo" className="banner-card banner-card--primary">
              <div className="banner-card__content">
                <span className="banner-card__badge">Nuevo</span>
                <h3 className="banner-card__title">Nuevos Lanzamientos</h3>
                <p className="banner-card__description">Las últimas tendencias en sneakers</p>
                <span className="banner-card__cta">
                  Explorar
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </span>
              </div>
              <div className="banner-card__image">
                <span className="banner-card__emoji">🔥</span>
              </div>
            </Link>

            <Link to="/catalogo" className="banner-card banner-card--secondary">
              <div className="banner-card__content">
                <span className="banner-card__badge">Oferta</span>
                <h3 className="banner-card__title">Hasta 40% OFF</h3>
                <p className="banner-card__description">En productos seleccionados</p>
                <span className="banner-card__cta">
                  Ver Ofertas
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </span>
              </div>
              <div className="banner-card__image">
                <span className="banner-card__emoji">💰</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Brands */}
      <section className="brands">
        <div className="section__container">
          <div className="section__header">
            <h2 className="section__title">Marcas Premium</h2>
            <p className="section__subtitle">Trabajamos con las mejores marcas del mundo</p>
          </div>

          <div className="brands__slider">
            <div className="brands__track">
              {[...brands, ...brands].map((brand, index) => (
                <div key={index} className="brand-item">
                  <img src={brand.logo} alt={brand.name} className="brand-item__logo" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials">
        <div className="section__container">
          <div className="section__header">
            <h2 className="section__title">Lo que Dicen Nuestros Clientes</h2>
            <p className="section__subtitle">Miles de clientes satisfechos en todo el país</p>
          </div>

          <div className="testimonials__grid">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card">
                <div className="testimonial-card__header">
                  <div className="testimonial-card__avatar">{testimonial.avatar}</div>
                  <div className="testimonial-card__info">
                    <h4 className="testimonial-card__name">{testimonial.name}</h4>
                    <span className="testimonial-card__date">{testimonial.date}</span>
                  </div>
                </div>
                <div className="testimonial-card__rating">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                      <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                    </svg>
                  ))}
                </div>
                <p className="testimonial-card__comment">"{testimonial.comment}"</p>
              </div>
            ))}
          </div>

          <div className="testimonials__stats">
            <div className="stat-item">
              <span className="stat-item__value">15K+</span>
              <span className="stat-item__label">Clientes Felices</span>
            </div>
            <div className="stat-item">
              <span className="stat-item__value">4.9/5</span>
              <span className="stat-item__label">Calificación Promedio</span>
            </div>
            <div className="stat-item">
              <span className="stat-item__value">98%</span>
              <span className="stat-item__label">Satisfacción</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;