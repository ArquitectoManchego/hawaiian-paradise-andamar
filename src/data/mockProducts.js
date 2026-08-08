// ============================================================
// DATOS REALES EXTRAÍDOS DE LOS MENÚS Y RECETARIOS OFICIALES
// Hawaiian Paradise - Menú Oficial de la Franquicia
// ============================================================

export const CATEGORIES = [
  { id: 'all',        name: 'Todo',           icon: 'Sparkles',    color: '#ff5252' },
  { id: 'raspados',   name: 'Raspados',       icon: 'IceCream',    color: '#00f2fe',  isFranchise: true },
  { id: 'smoothies',  name: 'Smoothies',      icon: 'CupSoda',     color: '#ffb703',  isFranchise: true },
  { id: 'aguas',      name: 'Aguas Frescas',  icon: 'GlassWater',  color: '#4facfe',  isFranchise: true },
  { id: 'cafe',       name: 'Café',           icon: 'Coffee',      color: '#a855f7',  isHibrid: true },
  { id: 'crepas',     name: 'Crepas',         icon: 'Utensils',    color: '#ff7b00',  isFranchiseBrand: true },
  { id: 'esquites',   name: 'Esquites',       icon: 'Flame',       color: '#10b981',  isOwnRecipe: true },
  { id: 'ramen',      name: 'Ramen Prep.',    icon: 'Soup',        color: '#ec4899',  isOwnRecipe: true },
  { id: 'marquesitas',name: 'Marquesitas',    icon: 'Cookie',      color: '#f59e0b',  isOwnRecipe: true },
];

// ============================================================
// PROMOCIONES OFICIALES HP EXTRAÍDAS DE LOS FLYERS
// ============================================================
export const PROMOTIONS = [
  {
    id: 'promo-2x1-rasp',
    name: '2x1 en Raspados Naturales',
    flyer: '/assets/publicidad/flyer2x1 hawaiian.jpg',
    type: '2x1',
    applicableCategory: 'raspados',
    description: 'Compra un raspado natural y llévate el segundo gratis (de igual o menor precio).'
  },
  {
    id: 'promo-2x56-smoothies',
    name: '2 Smoothies por $56',
    flyer: '/assets/publicidad/flyer2x56 smothies.jpg',
    type: 'FIXED_COMBO',
    fixedPrice: 56,
    applicableCategory: 'smoothies',
    description: 'Disfruta de 2 smoothies clásicos a un precio especial de $56.'
  },
  {
    id: 'promo-lun-mar',
    name: 'Promo Lunes y Martes',
    flyer: '/assets/publicidad/Flyer Promo Lun martes.jpg',
    type: 'DISCOUNT_PERCENT',
    discountPercent: 15,
    description: '15% de descuento en la compra de crepas saladas y smoothies de lunes a martes.'
  },
  {
    id: 'promo-mier-jue',
    name: 'Promo Miércoles y Jueves',
    flyer: '/assets/publicidad/Flyer promo Mier y Jueves.jpg',
    type: 'DISCOUNT_PERCENT',
    discountPercent: 20,
    description: '20% de descuento en el segundo raspado de leche o explosivo.'
  },
  {
    id: 'promo-gratis-chica',
    name: 'Gratis Raspado Chico',
    flyer: '/assets/publicidad/flyeGRATIS RASPA CHICA.jpg',
    type: 'FREE_ITEM',
    description: 'En la compra de $150 o más en crepas y frappés, llévate un raspado chico gratis.'
  },
  {
    id: 'promo-bermudas-21marzo',
    name: 'Especial 21 de Marzo (Bermudas)',
    flyer: '/assets/publicidad/flyer 21 MARZO BERMUDAS.jpg',
    type: 'DISCOUNT_PERCENT',
    discountPercent: 20,
    description: 'Ven en bermudas el 21 de marzo y recibe 20% de descuento en bebidas heladas.'
  },
  {
    id: 'promo-30abril-nino',
    name: 'Especial Día del Niño (30 Abril)',
    flyer: '/assets/publicidad/flyer30 ABRIL DIA DEL NIO.jpg',
    type: 'DISCOUNT_PERCENT',
    discountPercent: 25,
    description: '25% de descuento en raspados de Chicle Azul y smoothies para niños.'
  },
  {
    id: 'promo-10mayo-mama',
    name: 'Especial Día de las Madres (10 Mayo)',
    flyer: '/assets/publicidad/flyer10 deMAYO.jpg',
    type: 'FREE_ITEM',
    description: 'Gratis topping Boba/Tapioca en la bebida favorita de mamá.'
  },
  {
    id: 'promo-inauguracion',
    name: 'Gran Inauguración HP Andamar',
    flyer: '/assets/publicidad/flyerINAUGURACION.jpg',
    type: 'DISCOUNT_PERCENT',
    discountPercent: 20,
    description: '20% de descuento general por apertura del local en Plaza Andamar.'
  }
];

// ============================================================
// RASPADOS — Menú oficial HP extraído del PDF con imágenes reales
// ============================================================
const RASPADOS = [
  // NATURALES
  {
    id: 'rasp-nat-1', name: 'Raspado Fresa Natural', category: 'raspados',
    price: 45, isFranchise: true, badge: 'Natural',
    description: 'Jarabe de fresa natural Hawaiian Paradise con hielo granizado',
    image: '/assets/imagenes/FAMILIA HP.png',
    sizes: [{ name: 'Chico', price: 35 }, { name: 'Mediano', price: 45 }, { name: 'Grande', price: 55 }],
    options: ['¡Hazlo Boba! (+$10)', 'Combina dos sabores', 'Con Chamoy', 'Con Tajín']
  },
  {
    id: 'rasp-nat-2', name: 'Raspado Limón Natural', category: 'raspados',
    price: 45, isFranchise: true, badge: 'Natural',
    description: 'Jarabe de limón natural HP refrescante',
    image: '/assets/imagenes/FAMILIA HP.png',
    sizes: [{ name: 'Chico', price: 35 }, { name: 'Mediano', price: 45 }, { name: 'Grande', price: 55 }],
    options: ['¡Hazlo Boba! (+$10)', 'Con Chamoy', 'Con Tajín', 'Con Miguelito']
  },
  {
    id: 'rasp-nat-3', name: 'Raspado Mango Natural', category: 'raspados',
    price: 45, isFranchise: true, badge: 'Natural',
    description: 'Jarabe de mango natural HP con hielo granizado',
    image: '/assets/imagenes/FAMILIA HP.png',
    sizes: [{ name: 'Chico', price: 35 }, { name: 'Mediano', price: 45 }, { name: 'Grande', price: 55 }],
    options: ['¡Hazlo Boba! (+$10)', 'Con Chamoy', 'Con Tajín', 'Con Miguelito']
  },
  {
    id: 'rasp-nat-4', name: 'Raspado Tamarindo Natural', category: 'raspados',
    price: 45, isFranchise: true, badge: 'Natural',
    description: 'Jarabe de tamarindo natural HP',
    image: '/assets/imagenes/FAMILIA HP.png',
    sizes: [{ name: 'Chico', price: 35 }, { name: 'Mediano', price: 45 }, { name: 'Grande', price: 55 }],
    options: ['¡Hazlo Boba! (+$10)', 'Con Chamoy', 'Con Tajín']
  },
  {
    id: 'rasp-nat-5', name: 'Raspado Guayaba Natural', category: 'raspados',
    price: 45, isFranchise: true, badge: 'Natural',
    description: 'Jarabe de guayaba natural HP',
    image: '/assets/imagenes/FAMILIA HP.png',
    sizes: [{ name: 'Chico', price: 35 }, { name: 'Mediano', price: 45 }, { name: 'Grande', price: 55 }],
    options: ['¡Hazlo Boba! (+$10)', 'Con Chamoy', 'Con Tajín']
  },
  {
    id: 'rasp-nat-6', name: 'Raspado Tequila Natural', category: 'raspados',
    price: 45, isFranchise: true, badge: 'Natural',
    description: 'Sabor tequila HP — sin alcohol',
    image: '/assets/imagenes/FAMILIA HP.png',
    sizes: [{ name: 'Chico', price: 35 }, { name: 'Mediano', price: 45 }, { name: 'Grande', price: 55 }],
    options: ['¡Hazlo Boba! (+$10)', 'Con Chamoy']
  },
  // DE LECHE
  {
    id: 'rasp-lch-1', name: 'Raspado Vainilla de Leche', category: 'raspados',
    price: 50, isFranchise: true, badge: 'De Leche',
    description: 'Jarabe de vainilla HP con base de leche y hielo granizado',
    image: '/assets/imagenes/FAMILIA HP.png',
    sizes: [{ name: 'Chico', price: 40 }, { name: 'Mediano', price: 50 }, { name: 'Grande', price: 60 }],
    options: ['¡Hazlo Boba! (+$10)', 'Leche Condensada Extra']
  },
  {
    id: 'rasp-lch-2', name: 'Raspado Leche Quemada', category: 'raspados',
    price: 50, isFranchise: true, badge: 'De Leche',
    description: 'Sabor cajeta y leche quemada HP',
    image: '/assets/imagenes/FAMILIA HP.png',
    sizes: [{ name: 'Chico', price: 40 }, { name: 'Mediano', price: 50 }, { name: 'Grande', price: 60 }],
    options: ['¡Hazlo Boba! (+$10)', 'Leche Condensada Extra']
  },
  {
    id: 'rasp-lch-3', name: 'Raspado Piña Colada', category: 'raspados',
    price: 50, isFranchise: true, badge: 'De Leche',
    description: 'Piña con crema de coco HP',
    image: '/assets/imagenes/FAMILIA HP.png',
    sizes: [{ name: 'Chico', price: 40 }, { name: 'Mediano', price: 50 }, { name: 'Grande', price: 60 }],
    options: ['¡Hazlo Boba! (+$10)', 'Extra Crema de Coco']
  },
  {
    id: 'rasp-lch-4', name: 'Raspado Fresa Colada', category: 'raspados',
    price: 50, isFranchise: true, badge: 'De Leche',
    description: 'Fresa con crema de coco HP — sabor tropical',
    image: '/assets/imagenes/FAMILIA HP.png',
    sizes: [{ name: 'Chico', price: 40 }, { name: 'Mediano', price: 50 }, { name: 'Grande', price: 60 }],
    options: ['¡Hazlo Boba! (+$10)']
  },
  {
    id: 'rasp-lch-5', name: 'Raspado Rompope', category: 'raspados',
    price: 50, isFranchise: true, badge: 'De Leche',
    description: 'Jarabe sabor rompope HP',
    image: '/assets/imagenes/FAMILIA HP.png',
    sizes: [{ name: 'Chico', price: 40 }, { name: 'Mediano', price: 50 }, { name: 'Grande', price: 60 }],
    options: ['¡Hazlo Boba! (+$10)', 'Leche Condensada Extra']
  },
  {
    id: 'rasp-lch-6', name: 'Raspado Mango de Leche', category: 'raspados',
    price: 50, isFranchise: true, badge: 'De Leche',
    description: 'Mango HP con base de leche',
    image: '/assets/imagenes/FAMILIA HP.png',
    sizes: [{ name: 'Chico', price: 40 }, { name: 'Mediano', price: 50 }, { name: 'Grande', price: 60 }],
    options: ['¡Hazlo Boba! (+$10)', 'Con Chamoy']
  },
  {
    id: 'rasp-lch-7', name: 'Raspado Nuez', category: 'raspados',
    price: 50, isFranchise: true, badge: 'De Leche',
    description: 'Jarabe sabor nuez HP con leche',
    image: '/assets/imagenes/FAMILIA HP.png',
    sizes: [{ name: 'Chico', price: 40 }, { name: 'Mediano', price: 50 }, { name: 'Grande', price: 60 }],
    options: ['¡Hazlo Boba! (+$10)']
  },
  {
    id: 'rasp-lch-8', name: 'Raspado Chocolate de Leche', category: 'raspados',
    price: 50, isFranchise: true, badge: 'De Leche',
    description: 'Chocolate HP con base de leche',
    image: '/assets/imagenes/FAMILIA HP.png',
    sizes: [{ name: 'Chico', price: 40 }, { name: 'Mediano', price: 50 }, { name: 'Grande', price: 60 }],
    options: ['¡Hazlo Boba! (+$10)', 'Extra Crema Chantilly']
  },
  {
    id: 'rasp-lch-9', name: 'Raspado Coco de Leche', category: 'raspados',
    price: 50, isFranchise: true, badge: 'De Leche',
    description: 'Crema de coco HP con hielo granizado',
    image: '/assets/imagenes/FAMILIA HP.png',
    sizes: [{ name: 'Chico', price: 40 }, { name: 'Mediano', price: 50 }, { name: 'Grande', price: 60 }],
    options: ['¡Hazlo Boba! (+$10)']
  },
  // EXPLOSIVOS
  {
    id: 'rasp-exp-1', name: 'Súper Explosivo', category: 'raspados',
    price: 65, isFranchise: true, badge: '🔥 Especial',
    description: 'Raspado con cono HP, dulces alrededor, chamoy y chile en polvo. Receta oficial HP.',
    image: '/assets/imagenes/Explosivo.png',
    sizes: [{ name: 'Chico', price: 55 }, { name: 'Mediano', price: 65 }, { name: 'Grande', price: 75 }],
    options: ['Extra Dulces', 'Extra Chamoy', 'Extra Chile en Polvo']
  },
  {
    id: 'rasp-exp-2', name: 'Mangada', category: 'raspados',
    price: 65, isFranchise: true, badge: '🔥 Especial',
    description: 'Licuado de mango natural HP con chamoy, chilito y palito de tamarindo',
    image: '/assets/imagenes/Explosivo.png',
    sizes: [{ name: 'Chico', price: 55 }, { name: 'Mediano', price: 65 }, { name: 'Grande', price: 75 }],
    options: ['Extra Chamoy', 'Extra Chile', 'Palito de Tamarindo Extra']
  },
  {
    id: 'rasp-exp-3', name: 'Fresada', category: 'raspados',
    price: 65, isFranchise: true, badge: '🔥 Especial',
    description: 'Licuado de fresa natural HP con chamoy, chilito y palito de tamarindo',
    image: '/assets/imagenes/Explosivo.png',
    sizes: [{ name: 'Chico', price: 55 }, { name: 'Mediano', price: 65 }, { name: 'Grande', price: 75 }],
    options: ['Extra Chamoy', 'Extra Chile', 'Palito de Tamarindo Extra']
  },
  {
    id: 'rasp-exp-4', name: 'Frappe Nutella', category: 'raspados',
    price: 70, isFranchise: true, badge: '🔥 Especial',
    description: 'Hielo licuado con Nutella y capuccino clásico HP. Decorado con chocolate.',
    image: '/assets/imagenes/FrappeNutella.png',
    sizes: [{ name: 'Mediano', price: 60 }, { name: 'Grande', price: 70 }],
    options: ['Extra Nutella (+$15)', 'Extra Crema Chantilly']
  },
  // LIGHT
  {
    id: 'rasp-lgt-1', name: 'Raspado Chamoicano LIGHT', category: 'raspados',
    price: 45, isFranchise: true, badge: 'Light',
    description: 'Mezcla chamoy + chili + limón HP — versión light',
    image: '/assets/imagenes/FAMILIA HP.png',
    sizes: [{ name: 'Chico', price: 35 }, { name: 'Mediano', price: 45 }, { name: 'Grande', price: 55 }],
    options: ['¡Hazlo Boba! (+$10)', 'Con Tajín']
  },
  {
    id: 'rasp-lgt-2', name: 'Raspado T.N.T. LIGHT', category: 'raspados',
    price: 45, isFranchise: true, badge: 'Light',
    description: 'Sabor picante explosivo HP versión light',
    image: '/assets/imagenes/FAMILIA HP.png',
    sizes: [{ name: 'Chico', price: 35 }, { name: 'Mediano', price: 45 }, { name: 'Grande', price: 55 }],
    options: ['¡Hazlo Boba! (+$10)', 'Extra Chile']
  },
  // CONCENTRADOS
  {
    id: 'rasp-con-1', name: 'Raspado Chicle Azul', category: 'raspados',
    price: 45, isFranchise: true, badge: 'Concentrado',
    description: 'Sabor chicle azul HP — un clásico de los niños',
    image: '/assets/imagenes/FAMILIA HP.png',
    sizes: [{ name: 'Chico', price: 35 }, { name: 'Mediano', price: 45 }, { name: 'Grande', price: 55 }],
    options: ['¡Hazlo Boba! (+$10)', 'Leche Condensada']
  },
  {
    id: 'rasp-con-2', name: 'Raspado Durazno', category: 'raspados',
    price: 45, isFranchise: true, badge: 'Concentrado',
    description: 'Jarabe concentrado de durazno HP',
    image: '/assets/imagenes/FAMILIA HP.png',
    sizes: [{ name: 'Chico', price: 35 }, { name: 'Mediano', price: 45 }, { name: 'Grande', price: 55 }],
    options: ['¡Hazlo Boba! (+$10)']
  },
  {
    id: 'rasp-con-3', name: 'Raspado Grosella', category: 'raspados',
    price: 45, isFranchise: true, badge: 'Concentrado',
    description: 'Jarabe concentrado de grosella HP',
    image: '/assets/imagenes/FAMILIA HP.png',
    sizes: [{ name: 'Chico', price: 35 }, { name: 'Mediano', price: 45 }, { name: 'Grande', price: 55 }],
    options: ['¡Hazlo Boba! (+$10)']
  },
  {
    id: 'rasp-con-4', name: 'Raspado Uva', category: 'raspados',
    price: 45, isFranchise: true, badge: 'Concentrado',
    description: 'Jarabe concentrado de uva HP',
    image: '/assets/imagenes/FAMILIA HP.png',
    sizes: [{ name: 'Chico', price: 35 }, { name: 'Mediano', price: 45 }, { name: 'Grande', price: 55 }],
    options: ['¡Hazlo Boba! (+$10)']
  },
];

// ============================================================
// SMOOTHIES — Menú oficial HP
// ============================================================
const SMOOTHIES = [
  { id: 'sm-1', name: 'Smoothie Mango', category: 'smoothies', price: 70, isFranchise: true, badge: 'Franquicia HP', image: '/assets/imagenes/FAMILIA HP.png', description: 'Polvo o jarabe de Mango HP licuado con leche', options: ['Leche Entera', 'Leche Deslactosada', 'Leche Almendra (+$10)', '¡Hazlo Boba! (+$10)'] },
  { id: 'sm-2', name: 'Smoothie Fresa', category: 'smoothies', price: 70, isFranchise: true, badge: 'Franquicia HP', image: '/assets/imagenes/FAMILIA HP.png', description: 'Polvo de Fresa HP licuado con leche', options: ['Leche Entera', 'Leche Deslactosada', '¡Hazlo Boba! (+$10)'] },
  { id: 'sm-3', name: 'Smoothie Mazapán', category: 'smoothies', price: 75, isFranchise: true, badge: 'Favorito', image: '/assets/imagenes/FAMILIA HP.png', description: 'Polvo de Mazapán HP licuado con leche — sabor único', options: ['Leche Entera', 'Leche Deslactosada', '¡Hazlo Boba! (+$10)'] },
  { id: 'sm-4', name: 'Smoothie Chocolate Malt', category: 'smoothies', price: 75, isFranchise: true, badge: 'Franquicia HP', image: '/assets/imagenes/FAMILIA HP.png', description: 'Polvo de Chocolate Malt HP licuado con leche', options: ['Leche Entera', 'Leche Deslactosada', '¡Hazlo Boba! (+$10)'] },
  { id: 'sm-5', name: 'Smoothie Caramel Latté', category: 'smoothies', price: 75, isFranchise: true, badge: 'Franquicia HP', image: '/assets/imagenes/FAMILIA HP.png', description: 'Polvo de Caramel Latté HP licuado con leche', options: ['Leche Entera', 'Leche Deslactosada', '¡Hazlo Boba! (+$10)'] },
  { id: 'sm-6', name: 'Smoothie Mokaccino', category: 'smoothies', price: 75, isFranchise: true, badge: 'Franquicia HP', image: '/assets/imagenes/FAMILIA HP.png', description: 'Polvo Mokaccino HP — café y chocolate', options: ['Leche Entera', 'Leche Deslactosada', '¡Hazlo Boba! (+$10)'] },
  { id: 'sm-7', name: 'Smoothie Capuccino', category: 'smoothies', price: 70, isFranchise: true, badge: 'Franquicia HP', image: '/assets/imagenes/FAMILIA HP.png', description: 'Polvo de Capuccino HP licuado con leche', options: ['Leche Entera', 'Leche Deslactosada', '¡Hazlo Boba! (+$10)'] },
  { id: 'sm-8', name: 'Smoothie Taro', category: 'smoothies', price: 80, isFranchise: true, badge: '⭐ Recomendado', description: 'Polvo de Taro HP — sabor asiático muy popular', image: '/assets/imagenes/FAMILIA HP.png', options: ['Leche Entera', 'Leche Deslactosada', 'Crema Batida', '¡Hazlo Boba! (+$10)'] },
  { id: 'sm-9', name: 'Smoothie Chicle Rosa', category: 'smoothies', price: 75, isFranchise: true, badge: 'Franquicia HP', image: '/assets/imagenes/FAMILIA HP.png', description: 'Polvo de Chicle Rosa HP — sabor inconfundible', options: ['Leche Entera', 'Leche Deslactosada', '¡Hazlo Boba! (+$10)'] },
  { id: 'sm-10', name: 'Smoothie Matcha', category: 'smoothies', price: 80, isFranchise: true, badge: 'Premium', image: '/assets/imagenes/FAMILIA HP.png', description: 'Polvo de Matcha HP — té verde japonés', options: ['Leche Entera', 'Leche de Almendra (+$10)', '¡Hazlo Boba! (+$10)'] },
  { id: 'sm-11', name: 'Smoothie Chai Vainilla', category: 'smoothies', price: 80, isFranchise: true, badge: 'Premium', image: '/assets/imagenes/FAMILIA HP.png', description: 'Mezcla de especias Chai con vainilla HP', options: ['Leche Entera', 'Leche Deslactosada', '¡Hazlo Boba! (+$10)'] },
  { id: 'sm-12', name: 'Smoothie Chai Verde', category: 'smoothies', price: 80, isFranchise: true, badge: 'Premium', image: '/assets/imagenes/FAMILIA HP.png', description: 'Mezcla de especias Chai con matcha HP', options: ['Leche Entera', 'Leche de Almendra (+$10)', '¡Hazlo Boba! (+$10)'] },
  { id: 'sm-13', name: 'Smoothie Cookies and Cream', category: 'smoothies', price: 80, isFranchise: true, badge: '⭐ Recomendado', image: '/assets/imagenes/FAMILIA HP.png', description: 'Polvo de Cookies and Cream HP — galleta y crema', options: ['Leche Entera', 'Crema Batida', '¡Hazlo Boba! (+$10)'] },
  { id: 'sm-14', name: 'Smoothie Algodón de Azúcar', category: 'smoothies', price: 75, isFranchise: true, badge: 'Franquicia HP', image: '/assets/imagenes/FAMILIA HP.png', description: 'Polvo de Algodón de Azúcar HP', options: ['Leche Entera', 'Leche Deslactosada', '¡Hazlo Boba! (+$10)'] },
];

// ============================================================
// AGUAS FRESCAS — Menú oficial HP
// ============================================================
const AGUAS = [
  { id: 'ag-1', name: 'Agua Fresca Tamarindo', category: 'aguas', price: 40, isFranchise: true, badge: 'Franquicia HP', image: '/assets/imagenes/FAMILIA HP.png', description: 'Agua preparada con jarabe de Tamarindo HP', sizes: [{ name: 'Chico (500ml)', price: 40 }, { name: 'Grande (1L)', price: 65 }], options: ['Con Hielo Extra', 'Sin Hielo'] },
  { id: 'ag-2', name: 'Agua Fresca Guayaba', category: 'aguas', price: 40, isFranchise: true, badge: 'Franquicia HP', image: '/assets/imagenes/FAMILIA HP.png', description: 'Agua preparada con jarabe de Guayaba HP', sizes: [{ name: 'Chico (500ml)', price: 40 }, { name: 'Grande (1L)', price: 65 }], options: ['Con Hielo Extra', 'Sin Hielo'] },
  { id: 'ag-3', name: 'Agua Fresca Fresa', category: 'aguas', price: 40, isFranchise: true, badge: 'Franquicia HP', image: '/assets/imagenes/FAMILIA HP.png', description: 'Agua preparada con jarabe de Fresa HP', sizes: [{ name: 'Chico (500ml)', price: 40 }, { name: 'Grande (1L)', price: 65 }], options: ['Con Hielo Extra', 'Sin Hielo'] },
  { id: 'ag-4', name: 'Agua Fresca Mango', category: 'aguas', price: 40, isFranchise: true, badge: 'Franquicia HP', image: '/assets/imagenes/FAMILIA HP.png', description: 'Agua preparada con jarabe de Mango HP', sizes: [{ name: 'Chico (500ml)', price: 40 }, { name: 'Grande (1L)', price: 65 }], options: ['Con Chamoy', 'Con Hielo Extra'] },
  { id: 'ag-5', name: 'Agua Fresca Limón', category: 'aguas', price: 40, isFranchise: true, badge: 'Franquicia HP', image: '/assets/imagenes/FAMILIA HP.png', description: 'Agua preparada con jarabe de Limón HP', sizes: [{ name: 'Chico (500ml)', price: 40 }, { name: 'Grande (1L)', price: 65 }], options: ['Con Hielo Extra', 'Sin Hielo', 'Con Tajín'] },
];

// ============================================================
// CREPAS (CREPIZZA) — Menú oficial HP con imagen real Crepizza Pepperoni
// ============================================================
const CREPAS = [
  // DULCES
  { id: 'crep-d-1', name: 'Crepa Cajeta', category: 'crepas', price: 70, isFranchiseBrand: true, badge: 'Empaque Triangular HP', image: '/assets/imagenes/crepizza_colores.png', description: 'Crepa doblada con cajeta Coronado en cono triangular con branding HP', options: ['Queso Philadelphia (+$15)', 'Nuez (+$10)', 'Plátano (+$10)'] },
  { id: 'crep-d-2', name: 'Crepa Nutella', category: 'crepas', price: 75, isFranchiseBrand: true, badge: 'Empaque Triangular HP', image: '/assets/imagenes/crepizza_colores.png', description: 'Crepa con Nutella en cono triangular con branding HP', options: ['Nutella Extra (+$15)', 'Queso Philadelphia (+$15)', 'Plátano (+$10)', 'Nuez (+$10)'] },
  { id: 'crep-d-3', name: 'Crepa Chabacano', category: 'crepas', price: 70, isFranchiseBrand: true, badge: 'Empaque Triangular HP', image: '/assets/imagenes/crepizza_colores.png', description: 'Crepa con mermelada de chabacano HP', options: ['Queso Philadelphia (+$15)', 'Crema Batida (+$10)'] },
  { id: 'crep-d-4', name: 'Crepa Fresa', category: 'crepas', price: 70, isFranchiseBrand: true, badge: 'Empaque Triangular HP', image: '/assets/imagenes/crepizza_colores.png', description: 'Crepa con mermelada o fruta de fresa HP', options: ['Fresa Natural (+$15)', 'Crema Batida (+$10)', 'Queso Philadelphia (+$15)'] },
  { id: 'crep-d-5', name: 'Crepa Zarzamora', category: 'crepas', price: 70, isFranchiseBrand: true, badge: 'Empaque Triangular HP', image: '/assets/imagenes/crepizza_colores.png', description: 'Crepa con mermelada de zarzamora HP', options: ['Crema Batida (+$10)', 'Queso Philadelphia (+$15)'] },
  { id: 'crep-d-6', name: 'Crepa Durazno', category: 'crepas', price: 70, isFranchiseBrand: true, badge: 'Empaque Triangular HP', image: '/assets/imagenes/crepizza_colores.png', description: 'Crepa con mermelada de durazno HP', options: ['Crema Batida (+$10)', 'Queso Philadelphia (+$15)'] },
  // SALADAS
  { id: 'crep-s-1', name: 'Crepa Pepperoni / Queso', category: 'crepas', price: 85, isFranchiseBrand: true, badge: 'Salada', image: '/assets/imagenes/Crepizza Pepperoni.png', description: 'Pepperoni Camp Parma con queso mozzarella Sargento fundido', options: ['Queso Extra (+$15)', 'Salsa Hunt\'s (+$5)', 'Rajas (+$10)'] },
  { id: 'crep-s-2', name: 'Crepa Jamón / Queso', category: 'crepas', price: 80, isFranchiseBrand: true, badge: 'Salada', image: '/assets/imagenes/Crepizza Pepperoni.png', description: 'Jamón pavo FUD con queso mozzarella Sargento fundido', options: ['Queso Extra (+$15)', 'Salsa Hunt\'s (+$5)'] },
  { id: 'crep-s-3', name: 'Crepa Jamón / Queso / Huevo', category: 'crepas', price: 90, isFranchiseBrand: true, badge: 'Salada', image: '/assets/imagenes/Crepizza Pepperoni.png', description: 'Jamón pavo FUD con huevo y queso mozzarella Sargento fundido', options: ['Queso Extra (+$15)', 'Salsa Hunt\'s (+$5)', 'Tocino (+$15)'] },
  { id: 'crep-s-4', name: 'Crepa Rajas / Queso', category: 'crepas', price: 80, isFranchiseBrand: true, badge: 'Salada', image: '/assets/imagenes/Crepizza Pepperoni.png', description: 'Rajas con queso mozzarella Sargento fundido', options: ['Queso Extra (+$15)', 'Crema (+$5)'] },
  { id: 'crep-s-5', name: 'Crepa Champiñón / Queso', category: 'crepas', price: 85, isFranchiseBrand: true, badge: 'Salada', image: '/assets/imagenes/Crepizza Pepperoni.png', description: 'Champiñones con queso mozzarella Sargento fundido', options: ['Queso Extra (+$15)', 'Salsa Hunt\'s (+$5)'] },
  // ESPECIALIDADES
  { id: 'crep-esp-1', name: 'Crepizza Hawaiiana', category: 'crepas', price: 95, isFranchiseBrand: true, badge: '⭐ Especialidad', image: '/assets/imagenes/Crepizza Pepperoni.png', description: 'Queso mozzarella, jamón y piña — la especialidad hawaiiana', options: ['Queso Extra (+$15)', 'Salsa Hunt\'s (+$5)', 'Piña Extra (+$10)'] },
  { id: 'crep-esp-2', name: 'Crepizza Bandido', category: 'crepas', price: 100, isFranchiseBrand: true, badge: '⭐ Especialidad', image: '/assets/imagenes/Crepizza Pepperoni.png', description: 'Pepperoni, jamón, queso mozzarella y tocino — la más completa', options: ['Queso Extra (+$15)', 'Salsa Hunt\'s (+$5)', 'Extra Tocino (+$15)'] },
  { id: 'crep-esp-3', name: 'Crepizza Frepizza', category: 'crepas', price: 85, isFranchiseBrand: true, badge: '⭐ Especialidad', image: '/assets/imagenes/crepizza_colores.png', description: 'Fresa natural, lechera y canela — una combinación dulce única', options: ['Lechera Extra (+$10)', 'Crema Batida (+$10)'] },
  { id: 'crep-esp-4', name: 'Crepizza Plátano Nuez', category: 'crepas', price: 85, isFranchiseBrand: true, badge: '⭐ Especialidad', image: '/assets/imagenes/crepizza_colores.png', description: 'Plátano, nuez y a elegir: cajeta o Nutella', options: ['Con Cajeta', 'Con Nutella', 'Nuez Extra (+$10)'] },
  { id: 'crep-esp-5', name: 'Crepa de Colores', category: 'crepas', price: 70, isFranchiseBrand: true, badge: 'Sorpresa', image: '/assets/imagenes/crepizza_colores.png', description: 'Pide tu crepa de color sin costo extra — elige tu relleno favorito', options: ['Cajeta', 'Nutella', 'Jamón / Queso', 'Fresa', 'Zarzamora'] },
];

// ============================================================
// CAFÉ — Franquicia HP + Selección Propia
// ============================================================
const CAFES = [
  { id: 'cafe-1', name: 'Café Americano', category: 'cafe', price: 38, isHibrid: true, badge: 'Grano Selección', image: '/assets/imagenes/FAMILIA HP.png', description: 'Extracción al momento de café de especialidad', options: ['Caliente', 'Con Hielo (Iced)', 'Carga Extra Espresso (+$12)'] },
  { id: 'cafe-2', name: 'Espresso', category: 'cafe', price: 35, isHibrid: true, badge: 'Grano Selección', image: '/assets/imagenes/FAMILIA HP.png', description: 'Espresso concentrado doble extracción', options: ['Simple', 'Doble (+$10)'] },
  { id: 'cafe-3', name: 'Cappuccino', category: 'cafe', price: 52, isHibrid: true, badge: 'Grano Selección', image: '/assets/imagenes/FAMILIA HP.png', description: 'Espresso con leche espumada caliente', options: ['Caliente', 'Con Canela', 'Leche Deslactosada'] },
  { id: 'cafe-4', name: 'Latte', category: 'cafe', price: 55, isHibrid: true, badge: 'Grano Selección', image: '/assets/imagenes/FAMILIA HP.png', description: 'Espresso con leche al vapor', options: ['Caliente', 'Frío (Iced)', 'Vainilla HP (+$8)', 'Leche Deslactosada'] },
  { id: 'cafe-5', name: 'Capuccino Hawaiian Vanilla', category: 'cafe', price: 60, isFranchise: true, badge: 'Franquicia HP', image: '/assets/imagenes/FAMILIA HP.png', description: 'Espresso con leche espumada y jarabe de Vainilla Hawaiian Paradise', options: ['Caliente', 'Frío', 'Con Canela en Polvo', 'Leche Deslactosada'] },
  { id: 'cafe-6', name: 'Smoothie Capuccino HP', category: 'cafe', price: 70, isFranchise: true, badge: 'Franquicia HP', image: '/assets/imagenes/FAMILIA HP.png', description: 'Polvo de Capuccino HP licuado con leche fría y hielo', options: ['Leche Entera', 'Leche Deslactosada', '¡Hazlo Boba! (+$10)'] },
  { id: 'cafe-7', name: 'Café Frappe de Hielo', category: 'cafe', price: 65, isHibrid: true, badge: 'Grano Selección', image: '/assets/imagenes/FrappeNutella.png', description: 'Espresso frío licuado con hielo y leche', options: ['Caramelo (+$8)', 'Nutella (+$15)', 'Chantilly (+$8)'] },
];

// ============================================================
// ESQUITES — Receta Propia de la Casa
// ============================================================
const ESQUITES = [
  {
    id: 'esq-1', name: 'Esquite Tradicional de la Casa', category: 'esquites',
    price: 45, isOwnRecipe: true, badge: 'Receta Secreta',
    description: 'Elote tierno hervido con epazote, mayonesa cremosa, queso cotija y chile en polvo a tu gusto',
    sizes: [{ name: 'Chico', price: 35 }, { name: 'Grande', price: 45 }],
    options: ['Chile del que Pica', 'Chile del que NO Pica', 'Mucho Queso (+$5)', 'Extra Mayonesa (+$5)', 'Con Limon']
  },
];

// ============================================================
// RAMEN PREPARADO — Receta Propia de la Casa
// ============================================================
const RAMEN = [
  {
    id: 'ram-1', name: 'Maruchan con Esquite y Queso', category: 'ramen',
    price: 60, isOwnRecipe: true, badge: 'Favorito del Pasillo',
    description: 'Sopa Maruchan a elegir coronada con nuestro esquite caliente, mayonesa, queso y chile',
    options: ['Sopa Res', 'Sopa Pollo', 'Sopa Camarón Habanero', 'Sopa Limon', 'Salsa Valentina', 'Sin Esquite', 'Extra Queso (+$8)', 'Extra Mayonesa (+$5)']
  },
];

// ============================================================
// MARQUESITAS — Equipo Crepera / Receta Propia
// ============================================================
const MARQUESITAS = [
  {
    id: 'marq-1', name: 'Marquesita Queso de Bola + Nutella', category: 'marquesitas',
    price: 70, isOwnRecipe: true, badge: 'Crujiente',
    image: '/assets/imagenes/crepizza_colores.png',
    description: 'Rollito crujiente de crepera con queso de bola Edam importado y Nutella',
    options: ['Queso de Bola Extra (+$20)', 'Cajeta en vez de Nutella', 'Solo Queso de Bola']
  },
  {
    id: 'marq-2', name: 'Marquesita Cajeta + Queso de Bola', category: 'marquesitas',
    price: 70, isOwnRecipe: true, badge: 'Clásica',
    image: '/assets/imagenes/crepizza_colores.png',
    description: 'Rollito crujiente con cajeta Coronado y queso de bola Edam',
    options: ['Queso de Bola Extra (+$20)', 'Doble Cajeta (+$10)']
  },
  {
    id: 'marq-3', name: 'Marquesita Crema y Queso', category: 'marquesitas',
    price: 65, isOwnRecipe: true, badge: 'Crujiente',
    image: '/assets/imagenes/crepizza_colores.png',
    description: 'Rollito crujiente con crema y queso de bola Edam fundido',
    options: ['Queso de Bola Extra (+$20)', 'Crema Extra (+$8)']
  },
];

// ============================================================
// EXPORT COMBINADO
// ============================================================
export const PRODUCTS = [
  ...RASPADOS,
  ...SMOOTHIES,
  ...AGUAS,
  ...CREPAS,
  ...CAFES,
  ...ESQUITES,
  ...RAMEN,
  ...MARQUESITAS,
];
