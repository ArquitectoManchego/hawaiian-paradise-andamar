export const CATEGORIES = [
  { id: 'all', name: 'Todos', icon: 'Sparkles', color: '#ff5252' },
  { id: 'raspados', name: 'Raspados', icon: 'IceCream', color: '#00f2fe', isFranchise: true },
  { id: 'aguas', name: 'Aguas Frescas', icon: 'GlassWater', color: '#4facfe', isFranchise: true },
  { id: 'smoothies', name: 'Smoothies', icon: 'CupSoda', color: '#ffb703', isFranchise: true },
  { id: 'cafe', name: 'Café Caliente/Frío', icon: 'Coffee', color: '#a855f7', isHibrid: true },
  { id: 'crepas', name: 'Crepas', icon: 'Utensils', color: '#ff7b00', isFranchiseBrand: true },
  { id: 'esquites', name: 'Esquites', icon: 'Flame', color: '#10b981', isOwnRecipe: true },
  { id: 'ramen', name: 'Ramen Preparado', icon: 'Soup', color: '#ec4899', isOwnRecipe: true },
  { id: 'marquesitas', name: 'Marquesitas', icon: 'Cookie', color: '#f59e0b', isOwnRecipe: true }
];

export const PRODUCTS = [
  // RASPADOS (Franquicia)
  {
    id: 'rasp-1',
    name: 'Raspado Hawaiian Blue',
    category: 'raspados',
    price: 45,
    isFranchise: true,
    badge: 'Franquicia HP',
    description: 'Sabor característico Hawaiian Paradise con toque de mora azul',
    sizes: [{ name: 'Chico', price: 45 }, { name: 'Mediano', price: 55 }, { name: 'Grande', price: 65 }],
    options: ['Con Chamoy', 'Con Tajín', 'Con Miguelito', 'Leche Condensada']
  },
  {
    id: 'rasp-2',
    name: 'Raspado Chamoyada Mango',
    category: 'raspados',
    price: 50,
    isFranchise: true,
    badge: 'Top Ventas',
    description: 'Jarabe de Mango HP, chamoy casero, limón y banderilla de tamarindo',
    sizes: [{ name: 'Chico', price: 50 }, { name: 'Mediano', price: 60 }, { name: 'Grande', price: 70 }],
    options: ['Extra Chamoy', 'Extra Limón', 'Sin Banderilla']
  },

  // AGUAS FRESCAS (Franquicia)
  {
    id: 'agua-1',
    name: 'Agua de Horchata Fresa HP',
    category: 'aguas',
    price: 40,
    isFranchise: true,
    badge: 'Franquicia HP',
    description: 'Preparada con polvos exclusivos de la marca y trozos de fresa',
    sizes: [{ name: 'Mediano (500ml)', price: 40 }, { name: 'Litro (1000ml)', price: 65 }]
  },
  {
    id: 'agua-2',
    name: 'Agua de Maracuyá Tropical',
    category: 'aguas',
    price: 42,
    isFranchise: true,
    badge: 'Refrescante',
    description: 'Jarabe concentrado de Maracuyá HP con hielo frappeado',
    sizes: [{ name: 'Mediano (500ml)', price: 42 }, { name: 'Litro (1000ml)', price: 68 }]
  },

  // SMOOTHIES (Franquicia)
  {
    id: 'sm-1',
    name: 'Smoothie Piña Colada',
    category: 'smoothies',
    price: 65,
    isFranchise: true,
    badge: 'Envase HP',
    description: 'Base de crema de coco y piña HP, licuado con leche de tu elección',
    options: ['Leche Entera', 'Leche Deslactosada', 'Leche de Almendra (+ $10)']
  },
  {
    id: 'sm-2',
    name: 'Smoothie Taro Cream',
    category: 'smoothies',
    price: 70,
    isFranchise: true,
    badge: 'Recomendado',
    description: 'Polvo Taro HP con perlas opcionales y crema batida',
    options: ['Con Crema Batida', 'Sin Crema Batida', 'Leche Deslactosada']
  },

  // CAFÉ (Híbrido)
  {
    id: 'cafe-1',
    name: 'Café Americano Gourmet',
    category: 'cafe',
    price: 38,
    isHibrid: true,
    badge: 'Grano Selección',
    description: 'Extracción al momento de café de especialidad de nuestra selección',
    options: ['Caliente', 'Con Hielo (Iced)', 'Carga Extra Espresso (+ $12)']
  },
  {
    id: 'cafe-2',
    name: 'Capuccino Hawaiian Vanilla',
    category: 'cafe',
    price: 55,
    isHibrid: true,
    badge: 'Exclusivo',
    description: 'Espresso con leche espumada y jarabe de Vainilla Hawaiian Paradise',
    options: ['Caliente', 'Frío', 'Canela en Polvo', 'Leche Deslactosada']
  },

  // CREPAS (Insumos propios + Branding empaque triangular Franquicia)
  {
    id: 'crepa-1',
    name: 'Crepa Nutella Fresa & Plátano',
    category: 'crepas',
    price: 75,
    isFranchiseBrand: true,
    badge: 'Empaque Triangular HP',
    description: 'Preparada en crepera especial, servida en cono de cartón con marca HP',
    options: ['Nutella Extra (+ $15)', 'Sin Plátano', 'Nuez Picada (+ $10)']
  },
  {
    id: 'crepa-2',
    name: 'Crepa Salada Jamón y Queso Gouda',
    category: 'crepas',
    price: 80,
    isFranchiseBrand: true,
    badge: 'Empaque Triangular HP',
    description: 'Mezcla de queso gouda fundido, jamón de pavo y aderezo especial',
    options: ['Queso Extra (+ $15)', 'Champiñones (+ $12)', 'Salsa Chipotle']
  },

  // ESQUITES (Receta Propia)
  {
    id: 'esq-1',
    name: 'Esquite Tradicional de la Casa',
    category: 'esquites',
    price: 45,
    isOwnRecipe: true,
    badge: 'Receta Secreta',
    description: 'Elote tierno hervido con epazote, mayonesa cremosa, queso cotija y chile',
    options: ['Chile del que Pica', 'Chile del que No Pica', 'Mucho Queso', 'Extra Mayonesa']
  },

  // RAMEN PREPARADO (Propio + Esquite)
  {
    id: 'ram-1',
    name: 'Maruchan con Esquite y Queso',
    category: 'ramen',
    price: 60,
    isOwnRecipe: true,
    badge: 'Favorito del Pasillo',
    description: 'Sopa Maruchan a elegir coronada con nuestro esquite caliente, mayo y queso',
    options: ['Sopa Res', 'Sopa Pollo', 'Sopa Camarón Habanero', 'Salsa Valentina']
  },

  // MARQUESITAS (Receta Propia / Equipo Crepera)
  {
    id: 'marq-1',
    name: 'Marquesita Queso de Bola + Nutella',
    category: 'marquesitas',
    price: 70,
    isOwnRecipe: true,
    badge: 'Crujiente',
    description: 'Rollito crujiente relleno de generoso queso de bola edam importado y Nutella',
    options: ['Queso de Bola Extra (+ $20)', 'Cajeta en vez de Nutella']
  }
];
