export const products = [
  {
    id: 1,
    name: 'Air Jordan 1 Retro High OG',
    brand: 'Jordan',
    price: 180.00,
    category: 'Retro',
    description: 'El clásico atemporal que definió una era. Confeccionado en cuero premium, es el ícono del estilo y la cultura de las zapatillas. Su diseño de corte alto y la amortiguación Air encapsulada ofrecen comodidad durante todo el día.',
    images: [
      '/images/jordan1_Chicago_1.webp', 
      '/images/jordan1_Chicago_2.webp', 
      '/images/jordan1_Chicago_3.webp'
    ],
    sizes: [7, 8, 8.5, 9, 9.5, 10, 11, 12],
    colors: ['#B91C1C', '#FFFFFF', '#000000'], // Rojo, Blanco, Negro
    stock: 15,
    discount: 0,
    isNew: true,
    rating: 4.9,
    reviewCount: 450,
    createdAt: '2024-02-10'
  },
  {
    id: 2,
    name: 'Nike Dunk Low Panda',
    brand: 'Nike',
    price: 110.00,
    category: 'Casual',
    description: 'Una silueta simple y limpia que se ha convertido en un básico del streetwear. Su esquema de colores blanco y negro combina con absolutamente todo, haciéndolas perfectas para el uso diario.',
    images: [
      '/images/dunklow_panda_1.webp',
      '/images/dunklow_panda_2.webp'
    ],
    sizes: [5, 6, 7, 8, 9, 10],
    colors: ['#000000', '#FFFFFF'],
    stock: 5, // Stock bajo para probar alertas
    discount: 0,
    isNew: false,
    rating: 4.7,
    reviewCount: 890,
    createdAt: '2023-11-15'
  },
  {
    id: 3,
    name: 'Adidas Yeezy Boost 350 V2',
    brand: 'Adidas',
    price: 230.00,
    category: 'Modern',
    description: 'Comodidad y diseño futurista en una sola zapatilla. La tecnología Boost proporciona una amortiguación inigualable, mientras que el tejido Primeknit se adapta a tu pie como un calcetín.',
    images: [
      '/images/yeezy350_1.webp',
      '/images/yeezy350_2.webp'
    ],
    sizes: [8, 9, 10, 11],
    colors: ['#D1D5DB', '#4B5563'], // Grises
    stock: 20,
    discount: 10, // 10% de descuento
    isNew: false,
    rating: 4.8,
    reviewCount: 320,
    createdAt: '2024-01-20'
  },
  {
    id: 4,
    name: 'New Balance 550 White Green',
    brand: 'New Balance',
    price: 130.00,
    category: 'Retro',
    description: 'Un clásico de los 80 que regresó con fuerza. Estilo vintage con materiales de alta calidad y un ajuste excepcional que rinde homenaje a los jugadores profesionales de aquella época.',
    images: [
      '/images/nb550_green_1.webp'
    ],
    sizes: [7, 8, 9, 10, 11, 12],
    colors: ['#FFFFFF', '#10B981'], // Blanco, Verde
    stock: 8,
    discount: 0,
    isNew: true,
    rating: 4.6,
    reviewCount: 150,
    createdAt: '2024-02-01'
  },
  {
    id: 5,
    name: 'Converse Chuck 70 High',
    brand: 'Converse',
    price: 85.00,
    category: 'Clásicos',
    description: 'La versión mejorada del icónico Chuck Taylor. Mayor comodidad y durabilidad con detalles premium, lona más gruesa y una plantilla acolchada para uso prolongado.',
    images: [
      '/images/chuck70_black_1.webp'
    ],
    sizes: [6, 7, 8, 9, 10, 11, 12],
    colors: ['#000000', '#F3F4F6'],
    stock: 50,
    discount: 15,
    isNew: false,
    rating: 4.9,
    reviewCount: 1200,
    createdAt: '2023-05-10'
  },
  {
    id: 6,
    name: 'Puma Suede Classic XXI',
    brand: 'Puma',
    price: 70.00,
    category: 'Retro',
    description: 'Un icono del hip-hop y el breakdance de los 80. Su silueta de ante suave es sinónimo de estilo urbano auténtico y ha perdurado a través de generaciones.',
    images: [
      '/images/pumasuede_black_1.webp'
    ],
    sizes: [8, 9, 10],
    colors: ['#000000', '#FFFFFF'],
    stock: 12,
    discount: 0,
    isNew: false,
    rating: 4.5,
    reviewCount: 230,
    createdAt: '2023-09-01'
  },
  {
    id: 7,
    name: 'Nike Air Max 90',
    brand: 'Nike',
    price: 140.00,
    category: 'Sport',
    description: 'Revolución del calzado con su unidad Air visible. Un diseño audaz y una comodidad excepcional que no pasa de moda, perfecto tanto para correr como para el estilo urbano.',
    images: [
      '/images/airmax90_white_1.webp'
    ],
    sizes: [7, 8, 9, 10, 11, 12],
    colors: ['#FFFFFF', '#9CA3AF'],
    stock: 25,
    discount: 20, // Gran oferta
    isNew: false,
    rating: 4.7,
    reviewCount: 560,
    createdAt: '2023-12-01'
  },
  {
    id: 8,
    name: 'Air Jordan 4 Retro Military Black',
    brand: 'Jordan',
    price: 210.00,
    category: 'Retro',
    description: 'La silueta con las alas de plástico que la hacen única. Un diseño robusto y un colorway clásico que todos desean, combinando durabilidad con un estilo agresivo.',
    images: [
      '/images/jordan4_military_1.webp'
    ],
    sizes: [9, 10, 11, 12],
    colors: ['#FFFFFF', '#000000', '#9CA3AF'],
    stock: 3, // Muy poco stock
    discount: 0,
    isNew: true,
    rating: 5.0,
    reviewCount: 85,
    createdAt: '2024-02-15'
  },
  {
    id: 9,
    name: 'Vans Old Skool',
    brand: 'Vans',
    price: 75.00,
    category: 'Skate',
    description: 'Las zapatillas de skate clásicas por excelencia. Con la icónica banda lateral y su suela waffle duradera, son perfectas para patinar o para un look relajado.',
    images: [
      '/images/vans_oldskool_1.webp'
    ],
    sizes: [6, 7, 8, 9, 10, 11],
    colors: ['#000000', '#FFFFFF'],
    stock: 40,
    discount: 5,
    isNew: false,
    rating: 4.8,
    reviewCount: 950,
    createdAt: '2023-06-20'
  },
  {
    id: 10,
    name: 'Adidas Forum Low',
    brand: 'Adidas',
    price: 100.00,
    category: 'Retro',
    description: 'Más que una zapatilla, es un símbolo. Nacida en las canchas de baloncesto del 84, esta versión de corte bajo mantiene la correa en el tobillo y el diseño en X característico.',
    images: [
      '/images/adidas_forum_1.webp'
    ],
    sizes: [7, 8, 9, 10, 11],
    colors: ['#FFFFFF', '#3B82F6'], // Blanco y Azul
    stock: 18,
    discount: 0,
    isNew: true,
    rating: 4.6,
    reviewCount: 180,
    createdAt: '2024-01-10'
  },
  {
    id: 11,
    name: 'New Balance 2002R Protection Pack',
    brand: 'New Balance',
    price: 160.00,
    category: 'Modern',
    description: 'Un estilo deconstruido que redefine el look retro. Capas de ante desgastado y malla se combinan con una suela de alto rendimiento para un confort superior.',
    images: [
      '/images/nb2002r_grey_1.webp'
    ],
    sizes: [8, 9, 10, 11],
    colors: ['#9CA3AF', '#D1D5DB'],
    stock: 0, // Agotado
    discount: 0,
    isNew: true,
    rating: 4.8,
    reviewCount: 95,
    createdAt: '2024-02-05'
  },
  {
    id: 12,
    name: 'Reebok Club C 85 Vintage',
    brand: 'Reebok',
    price: 90.00,
    category: 'Clásicos',
    description: 'Estilo de tenis minimalista. Cuero suave y flexible con logotipos clásicos para un look auténtico de los 80 que nunca pasa de moda.',
    images: [
      '/images/reebok_clubc_1.webp'
    ],
    sizes: [6, 7, 8, 9, 10, 11],
    colors: ['#FEF3C7', '#10B981'], // Cream y Verde
    stock: 22,
    discount: 0,
    isNew: false,
    rating: 4.7,
    reviewCount: 410,
    createdAt: '2023-08-15'
  }
];