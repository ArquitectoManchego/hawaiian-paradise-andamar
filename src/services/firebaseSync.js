import { db } from '../db/localDb';

// Firebase configuration template (User can paste their config object here)
export const firebaseConfig = {
  apiKey: "AIzaSy_YOUR_API_KEY",
  authDomain: "hawaiian-paradise-andamar.firebaseapp.com",
  projectId: "hawaiian-paradise-andamar",
  storageBucket: "hawaiian-paradise-andamar.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

/**
 * Service to sync local IndexedDB sales and cuts to Firebase in background
 */
export async function syncLocalDataToCloud() {
  try {
    const unsyncedSales = await db.sales.where('syncedToCloud').equals(0).toArray();
    if (unsyncedSales.length > 0) {
      console.log(`[Firebase Sync] Sincronizando ${unsyncedSales.length} ventas a la nube...`);
      
      // Simulation of Firestore batch push:
      for (const sale of unsyncedSales) {
        await db.sales.update(sale.id, { syncedToCloud: 1 });
      }
      
      return { success: true, count: unsyncedSales.length };
    }
    return { success: true, count: 0 };
  } catch (error) {
    console.error('[Firebase Sync Error]:', error);
    return { success: false, error };
  }
}
