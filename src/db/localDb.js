import Dexie from 'dexie';

export const db = new Dexie('HawaiianParadiseAndamarDB');

// Define database schema
db.version(1).stores({
  sales: '++id, timestamp, total, paymentMethod, syncedToCloud',
  inventory: 'id, name, category, stockQuantity, unit, isFranchiseItem',
  purchases: '++id, date, storeName, totalCost',
  cashCuts: '++id, timestamp, status'
});

// Seed initial inventory items if database is empty
export async function initDatabase() {
  const count = await db.inventory.count();
  if (count === 0) {
    await db.inventory.bulkAdd([
      // Insumos Franquicia
      { id: 'inv-1', name: 'Jarabe Hawaiian Blue (Liters)', category: 'Franquicia', stockQuantity: 15, unit: 'Liters', isFranchiseItem: true, minStockAlert: 3 },
      { id: 'inv-2', name: 'Jarabe Mango HP (Liters)', category: 'Franquicia', stockQuantity: 20, unit: 'Liters', isFranchiseItem: true, minStockAlert: 5 },
      { id: 'inv-3', name: 'Polvo Taro HP (Kg)', category: 'Franquicia', stockQuantity: 8, unit: 'Kg', isFranchiseItem: true, minStockAlert: 2 },
      { id: 'inv-4', name: 'Vasos Desechables HP Mediano', category: 'Franquicia', stockQuantity: 450, unit: 'Pzs', isFranchiseItem: true, minStockAlert: 100 },
      { id: 'inv-5', name: 'Envoltorios Triangulares Crepa HP', category: 'Franquicia', stockQuantity: 300, unit: 'Pzs', isFranchiseItem: true, minStockAlert: 50 },
      
      // Insumos Libres / Compras Locales (Costco, Walmart, Chedraui)
      { id: 'inv-6', name: 'Leche Entera (Liters)', category: 'Compras Locales', stockQuantity: 30, unit: 'Liters', isFranchiseItem: false, minStockAlert: 10 },
      { id: 'inv-7', name: 'Leche Deslactosada (Liters)', category: 'Compras Locales', stockQuantity: 24, unit: 'Liters', isFranchiseItem: false, minStockAlert: 8 },
      { id: 'inv-8', name: 'Queso de Bola Edam (Kg)', category: 'Compras Locales', stockQuantity: 4.5, unit: 'Kg', isFranchiseItem: false, minStockAlert: 1.5 },
      { id: 'inv-9', name: 'Nutella 3Kg', category: 'Compras Locales', stockQuantity: 2, unit: 'Frascos', isFranchiseItem: false, minStockAlert: 1 },
      { id: 'inv-10', name: 'Elote Tierno hervido (Kg)', category: 'Compras Locales', stockQuantity: 12, unit: 'Kg', isFranchiseItem: false, minStockAlert: 3 },
      { id: 'inv-11', name: 'Mayonesa Cremosa (Kg)', category: 'Compras Locales', stockQuantity: 5, unit: 'Kg', isFranchiseItem: false, minStockAlert: 1 }
    ]);
  }
}
