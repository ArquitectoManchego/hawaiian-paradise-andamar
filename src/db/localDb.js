import Dexie from 'dexie';

export const db = new Dexie('HawaiianParadiseAndamarDB');

db.version(1).stores({
  sales:     '++id, timestamp, total, paymentMethod, syncedToCloud',
  inventory: 'id, name, category, stockQuantity, unit, isFranchiseItem',
  purchases: '++id, date, storeName, totalCost',
  cashCuts:  '++id, timestamp, status'
});

// Inventario real extraído del Excel: 02 EXISTENCIA FRANQUICIA BASICO EJEMPLO.xlsx
// y LISTA DE PRODUCTOS NECESARIOS BASICA.xlsx
export async function initDatabase() {
  const count = await db.inventory.count();
  if (count === 0) {
    await db.inventory.bulkAdd([

      // ============================================================
      // JARABES — Franquicia HP (según FORMATO SOLICITUD JARABES)
      // ============================================================
      // NATURALES
      { id: 'j-nat-fresa',    name: 'Jarabe Fresa Natural HP',    category: 'Jarabes Naturales',  stockQuantity: 1, unit: 'botellas', isFranchiseItem: true, minStockAlert: 2 },
      { id: 'j-nat-limon',    name: 'Jarabe Limón Natural HP',    category: 'Jarabes Naturales',  stockQuantity: 1, unit: 'botellas', isFranchiseItem: true, minStockAlert: 2 },
      { id: 'j-nat-mango',    name: 'Jarabe Mango Natural HP',    category: 'Jarabes Naturales',  stockQuantity: 1, unit: 'botellas', isFranchiseItem: true, minStockAlert: 2 },
      { id: 'j-nat-tamarindo',name: 'Jarabe Tamarindo Natural HP',category: 'Jarabes Naturales',  stockQuantity: 1, unit: 'botellas', isFranchiseItem: true, minStockAlert: 2 },
      { id: 'j-nat-guayaba',  name: 'Jarabe Guayaba Natural HP', category: 'Jarabes Naturales',  stockQuantity: 1, unit: 'botellas', isFranchiseItem: true, minStockAlert: 1 },
      { id: 'j-nat-tequila',  name: 'Jarabe Tequila Natural HP', category: 'Jarabes Naturales',  stockQuantity: 1, unit: 'botellas', isFranchiseItem: true, minStockAlert: 1 },
      { id: 'j-nat-guanabana',name: 'Jarabe Guanábana Natural HP',category: 'Jarabes Naturales', stockQuantity: 0, unit: 'botellas', isFranchiseItem: true, minStockAlert: 1 },
      // EXPLOSIVOS
      { id: 'j-exp-chamoicano',name: 'Jarabe Chamoicano Explosivo HP', category: 'Jarabes Explosivos', stockQuantity: 1, unit: 'botellas', isFranchiseItem: true, minStockAlert: 2 },
      { id: 'j-exp-tnt',       name: 'Jarabe T.N.T. Explosivo HP',    category: 'Jarabes Explosivos', stockQuantity: 1, unit: 'botellas', isFranchiseItem: true, minStockAlert: 2 },
      { id: 'j-exp-bomba',     name: 'Jarabe Bomba Explosivo HP',      category: 'Jarabes Explosivos', stockQuantity: 1, unit: 'botellas', isFranchiseItem: true, minStockAlert: 1 },
      { id: 'j-exp-picamango', name: 'Jarabe Picamango Explosivo HP',  category: 'Jarabes Explosivos', stockQuantity: 1, unit: 'botellas', isFranchiseItem: true, minStockAlert: 1 },
      // DE LECHE
      { id: 'j-lch-vainilla',  name: 'Jarabe Vainilla de Leche HP',   category: 'Jarabes De Leche', stockQuantity: 1, unit: 'botellas', isFranchiseItem: true, minStockAlert: 2 },
      { id: 'j-lch-quemada',   name: 'Jarabe Leche Quemada HP',       category: 'Jarabes De Leche', stockQuantity: 1, unit: 'botellas', isFranchiseItem: true, minStockAlert: 2 },
      { id: 'j-lch-pinacol',   name: 'Jarabe Piña Colada HP',         category: 'Jarabes De Leche', stockQuantity: 2, unit: 'botellas', isFranchiseItem: true, minStockAlert: 1 },
      { id: 'j-lch-fresacol',  name: 'Jarabe Fresa Colada HP',        category: 'Jarabes De Leche', stockQuantity: 1, unit: 'botellas', isFranchiseItem: true, minStockAlert: 1 },
      { id: 'j-lch-rompope',   name: 'Jarabe Rompope HP',             category: 'Jarabes De Leche', stockQuantity: 1, unit: 'botellas', isFranchiseItem: true, minStockAlert: 1 },
      { id: 'j-lch-mangolch',  name: 'Jarabe Mango de Leche HP',      category: 'Jarabes De Leche', stockQuantity: 1, unit: 'botellas', isFranchiseItem: true, minStockAlert: 1 },
      { id: 'j-lch-nuez',      name: 'Jarabe Nuez HP',                category: 'Jarabes De Leche', stockQuantity: 1, unit: 'botellas', isFranchiseItem: true, minStockAlert: 1 },
      { id: 'j-lch-chocolate', name: 'Jarabe Chocolate HP',           category: 'Jarabes De Leche', stockQuantity: 1, unit: 'botellas', isFranchiseItem: true, minStockAlert: 1 },
      { id: 'j-lch-coco',      name: 'Jarabe Coco HP',                category: 'Jarabes De Leche', stockQuantity: 1, unit: 'botellas', isFranchiseItem: true, minStockAlert: 1 },
      // CONCENTRADOS
      { id: 'j-con-chicleazul',name: 'Jarabe Chicle Azul HP', category: 'Jarabes Concentrados', stockQuantity: 1, unit: 'botellas', isFranchiseItem: true, minStockAlert: 1 },
      { id: 'j-con-durazno',   name: 'Jarabe Durazno HP',    category: 'Jarabes Concentrados', stockQuantity: 1, unit: 'botellas', isFranchiseItem: true, minStockAlert: 1 },
      { id: 'j-con-grosella',  name: 'Jarabe Grosella HP',  category: 'Jarabes Concentrados', stockQuantity: 1, unit: 'botellas', isFranchiseItem: true, minStockAlert: 1 },
      { id: 'j-con-uva',       name: 'Jarabe Uva HP',       category: 'Jarabes Concentrados', stockQuantity: 0, unit: 'botellas', isFranchiseItem: true, minStockAlert: 1 },
      // LIGHT
      { id: 'j-lgt-chamoicano',name: 'Jarabe Chamoicano Light HP', category: 'Jarabes Light', stockQuantity: 1, unit: 'botellas', isFranchiseItem: true, minStockAlert: 1 },
      { id: 'j-lgt-tnt',       name: 'Jarabe T.N.T. Light HP',    category: 'Jarabes Light', stockQuantity: 1, unit: 'botellas', isFranchiseItem: true, minStockAlert: 1 },
      // CHAMOY
      { id: 'j-chamoy',        name: 'Pulpa de Chamoy HP', category: 'Jarabes Especiales', stockQuantity: 1, unit: 'botellas', isFranchiseItem: true, minStockAlert: 2 },

      // ============================================================
      // POLVOS SMOOTHIES — Franquicia HP (Libro de Corte)
      // ============================================================
      { id: 'sm-fresa',      name: 'Polvo Smoothie Fresa HP',            category: 'Polvos Smoothies', stockQuantity: 8, unit: 'bolsas', isFranchiseItem: true, minStockAlert: 2 },
      { id: 'sm-mango',      name: 'Polvo Smoothie Mango HP',            category: 'Polvos Smoothies', stockQuantity: 8, unit: 'bolsas', isFranchiseItem: true, minStockAlert: 2 },
      { id: 'sm-chocolmalt',  name: 'Polvo Smoothie Chocolate Malt HP',  category: 'Polvos Smoothies', stockQuantity: 5, unit: 'bolsas', isFranchiseItem: true, minStockAlert: 2 },
      { id: 'sm-caramel',    name: 'Polvo Smoothie Caramel Latté HP',    category: 'Polvos Smoothies', stockQuantity: 5, unit: 'bolsas', isFranchiseItem: true, minStockAlert: 2 },
      { id: 'sm-mazapan',    name: 'Polvo Smoothie Mazapán HP',          category: 'Polvos Smoothies', stockQuantity: 6, unit: 'bolsas', isFranchiseItem: true, minStockAlert: 2 },
      { id: 'sm-taro',       name: 'Polvo Smoothie Taro HP',             category: 'Polvos Smoothies', stockQuantity: 6, unit: 'bolsas', isFranchiseItem: true, minStockAlert: 2 },
      { id: 'sm-algodon',    name: 'Polvo Smoothie Algodón Azúcar HP',   category: 'Polvos Smoothies', stockQuantity: 6, unit: 'bolsas', isFranchiseItem: true, minStockAlert: 2 },
      { id: 'sm-chiclerosa', name: 'Polvo Smoothie Chicle Rosa HP',      category: 'Polvos Smoothies', stockQuantity: 6, unit: 'bolsas', isFranchiseItem: true, minStockAlert: 2 },
      { id: 'sm-cookies',    name: 'Polvo Smoothie Cookies and Cream HP',category: 'Polvos Smoothies', stockQuantity: 6, unit: 'bolsas', isFranchiseItem: true, minStockAlert: 2 },
      { id: 'sm-matcha',     name: 'Polvo Smoothie Matcha HP',           category: 'Polvos Smoothies', stockQuantity: 4, unit: 'bolsas', isFranchiseItem: true, minStockAlert: 2 },
      { id: 'sm-chaivainilla',name:'Polvo Smoothie Chai Vainilla HP',    category: 'Polvos Smoothies', stockQuantity: 10, unit: 'bolsas', isFranchiseItem: true, minStockAlert: 2 },
      { id: 'sm-chaioriginal',name:'Polvo Smoothie Chai Original HP',    category: 'Polvos Smoothies', stockQuantity: 10, unit: 'bolsas', isFranchiseItem: true, minStockAlert: 2 },
      { id: 'sm-nutellafrp', name: 'Polvo Frappe Nutella HP',            category: 'Polvos Smoothies', stockQuantity: 10, unit: 'bolsas', isFranchiseItem: true, minStockAlert: 2 },
      { id: 'sm-mokachino',  name: 'Polvo Mokacchino HP',                category: 'Polvos Smoothies', stockQuantity: 8, unit: 'bolsas', isFranchiseItem: true, minStockAlert: 2 },
      { id: 'sm-frapuchino', name: 'Polvo Frapucchino HP',               category: 'Polvos Smoothies', stockQuantity: 10, unit: 'bolsas', isFranchiseItem: true, minStockAlert: 2 },

      // ============================================================
      // VASOS Y ENVASES — Franquicia HP (OBLIGATORIO comprar a HP)
      // ============================================================
      { id: 'vaso-4oz',   name: 'Vaso Polipro 4 oz Chico HP (paq. 50)',   category: 'Envases Franquicia', stockQuantity: 3, unit: 'paquetes', isFranchiseItem: true, minStockAlert: 1 },
      { id: 'vaso-8oz',   name: 'Vaso Polipro 8 oz Mediano HP (paq. 50)', category: 'Envases Franquicia', stockQuantity: 3, unit: 'paquetes', isFranchiseItem: true, minStockAlert: 1 },
      { id: 'vaso-12oz',  name: 'Vaso Polipro 12 oz Grande HP (paq. 50)', category: 'Envases Franquicia', stockQuantity: 3, unit: 'paquetes', isFranchiseItem: true, minStockAlert: 1 },
      { id: 'vaso-14oz',  name: 'Vaso Cristal 14 oz Regular HP (paq. 50)',category: 'Envases Franquicia', stockQuantity: 2, unit: 'paquetes', isFranchiseItem: true, minStockAlert: 1 },
      { id: 'portacrepa', name: 'Portacrepa / Empaque Triangular HP',     category: 'Envases Franquicia', stockQuantity: 35, unit: 'pzas',    isFranchiseItem: true, minStockAlert: 10 },
      { id: 'rec-crepa',  name: 'Receta (Mezcla) para Crepas HP',         category: 'Insumos Franquicia', stockQuantity: 4, unit: 'litros',   isFranchiseItem: true, minStockAlert: 1 },
      { id: 'agua-hp',    name: 'Agua Hawaiian Paradise (garrafón)',       category: 'Insumos Franquicia', stockQuantity: 22, unit: 'garrafones', isFranchiseItem: true, minStockAlert: 5 },
      { id: 'tapioca',    name: 'Perlas de Tapioca HP (250g)',             category: 'Insumos Franquicia', stockQuantity: 5, unit: 'bolsas',   isFranchiseItem: true, minStockAlert: 2 },

      // ============================================================
      // INSUMOS LIBRES — Compras en Costco / Walmart / Chedraui / Mercado
      // ============================================================
      { id: 'leche-entera',     name: 'Leche Entera (litros)',                 category: 'Lácteos y Frescos', stockQuantity: 20, unit: 'litros',  isFranchiseItem: false, minStockAlert: 8 },
      { id: 'leche-deslact',    name: 'Leche Deslactosada (litros)',           category: 'Lácteos y Frescos', stockQuantity: 10, unit: 'litros',  isFranchiseItem: false, minStockAlert: 4 },
      { id: 'queso-mozz',       name: 'Queso Mozzarella Sargento (kg)',        category: 'Lácteos y Frescos', stockQuantity: 4, unit: 'kg',       isFranchiseItem: false, minStockAlert: 2 },
      { id: 'queso-bola',       name: 'Queso de Bola Edam Importado (kg)',     category: 'Lácteos y Frescos', stockQuantity: 2, unit: 'kg',       isFranchiseItem: false, minStockAlert: 1 },
      { id: 'queso-phila',      name: 'Queso Philadelphia (kg)',               category: 'Lácteos y Frescos', stockQuantity: 1, unit: 'kg',       isFranchiseItem: false, minStockAlert: 0.5 },
      { id: 'crema',            name: 'Crema (kg)',                            category: 'Lácteos y Frescos', stockQuantity: 2, unit: 'kg',       isFranchiseItem: false, minStockAlert: 1 },
      { id: 'mantequilla',      name: 'Mantequilla Primavera (kg)',            category: 'Lácteos y Frescos', stockQuantity: 1, unit: 'kg',       isFranchiseItem: false, minStockAlert: 0.5 },
      { id: 'jamon-fud',        name: 'Jamón Pavo Cerdo FUD (kg)',             category: 'Cárnicos',          stockQuantity: 3, unit: 'kg',       isFranchiseItem: false, minStockAlert: 1 },
      { id: 'pepperoni',        name: 'Pepperoni Camp Parma (kg)',             category: 'Cárnicos',          stockQuantity: 2, unit: 'kg',       isFranchiseItem: false, minStockAlert: 1 },
      { id: 'huevo',            name: 'Huevo (pzas)',                          category: 'Frescos',           stockQuantity: 12, unit: 'pzas',    isFranchiseItem: false, minStockAlert: 6 },
      { id: 'nutella',          name: 'Nutella (kg)',                          category: 'Repostería',        stockQuantity: 1, unit: 'kg',       isFranchiseItem: false, minStockAlert: 0.5 },
      { id: 'cajeta',           name: 'Cajeta Coronado (kg)',                  category: 'Repostería',        stockQuantity: 0.5, unit: 'kg',     isFranchiseItem: false, minStockAlert: 0.5 },
      { id: 'nuez',             name: 'Nuez (kg)',                             category: 'Repostería',        stockQuantity: 3, unit: 'kg',       isFranchiseItem: false, minStockAlert: 1 },
      { id: 'fresa-fruta',      name: 'Fresa Natural (kg)',                    category: 'Frutas Frescas',    stockQuantity: 1, unit: 'kg',       isFranchiseItem: false, minStockAlert: 1 },
      { id: 'platano',          name: 'Plátano (pzas)',                        category: 'Frutas Frescas',    stockQuantity: 6, unit: 'pzas',     isFranchiseItem: false, minStockAlert: 3 },
      { id: 'champiñones',      name: 'Champiñones (kg)',                      category: 'Verduras',          stockQuantity: 3, unit: 'kg',       isFranchiseItem: false, minStockAlert: 1 },
      { id: 'rajas',            name: 'Rajas de Chile Poblano (kg)',           category: 'Verduras',          stockQuantity: 5, unit: 'kg',       isFranchiseItem: false, minStockAlert: 1 },
      { id: 'piña-fruta',       name: 'Piña natural (pzas)',                   category: 'Frutas Frescas',    stockQuantity: 2, unit: 'pzas',     isFranchiseItem: false, minStockAlert: 1 },
      { id: 'elote',            name: 'Elote Tierno Hervido (kg)',             category: 'Verduras',          stockQuantity: 10, unit: 'kg',      isFranchiseItem: false, minStockAlert: 3 },
      { id: 'mayonesa',         name: 'Mayonesa Cremosa (kg)',                 category: 'Abarrotes',         stockQuantity: 5, unit: 'kg',       isFranchiseItem: false, minStockAlert: 2 },
      { id: 'salsa-hunts',      name: 'Salsa Hunt\'s Tradicional (latas)',    category: 'Abarrotes',         stockQuantity: 3, unit: 'latas',    isFranchiseItem: false, minStockAlert: 1 },
      { id: 'ramen-res',        name: 'Maruchan Sabor Res (pzas)',            category: 'Abarrotes',         stockQuantity: 24, unit: 'pzas',    isFranchiseItem: false, minStockAlert: 6 },
      { id: 'ramen-pollo',      name: 'Maruchan Sabor Pollo (pzas)',          category: 'Abarrotes',         stockQuantity: 24, unit: 'pzas',    isFranchiseItem: false, minStockAlert: 6 },
      { id: 'ramen-camaron',    name: 'Maruchan Camarón Habanero (pzas)',     category: 'Abarrotes',         stockQuantity: 12, unit: 'pzas',    isFranchiseItem: false, minStockAlert: 6 },
      { id: 'leche-cond',       name: 'Leche Condensada (latas)',             category: 'Lácteos y Frescos', stockQuantity: 5, unit: 'latas',    isFranchiseItem: false, minStockAlert: 2 },
      { id: 'crem-chantilly',   name: 'Crema Chantilly (litros)',             category: 'Lácteos y Frescos', stockQuantity: 2, unit: 'litros',   isFranchiseItem: false, minStockAlert: 1 },
      { id: 'azucar-glass',     name: 'Azúcar Glass (kg)',                    category: 'Repostería',        stockQuantity: 1, unit: 'kg',       isFranchiseItem: false, minStockAlert: 0.5 },
      { id: 'hielo',            name: 'Bolsas de Hielo (10kg)',               category: 'Insumos Operación', stockQuantity: 4, unit: 'bolsas',   isFranchiseItem: false, minStockAlert: 2 },
    ]);
  }
}
