import type { ItineraryResponse } from '../types';

const DB_NAME = 'SafeTrailOfflineDB';
const DB_VERSION = 1;
const STORE_TRIPS = 'trips';
const STORE_MAP = 'map_layers';
const STORE_USER = 'user_session';

const STORAGE_KEY_ITINERARY = 'safetrail_active_itinerary';
const STORAGE_KEY_USER_PROFILE = 'safetrail_user_session';
const STORAGE_KEY_OFFLINE_TIMESTAMP = 'safetrail_cached_at';

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_TRIPS)) {
        db.createObjectStore(STORE_TRIPS, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORE_MAP)) {
        db.createObjectStore(STORE_MAP, { keyPath: 'destinationId' });
      }
      if (!db.objectStoreNames.contains(STORE_USER)) {
        db.createObjectStore(STORE_USER, { keyPath: 'key' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export class OfflineCacheService {
  /**
   * Saves the active itinerary and trail coordinates to IndexedDB and LocalStorage fallback.
   */
  static async saveActiveTrip(itinerary: ItineraryResponse): Promise<void> {
    const timestamp = new Date().toISOString();
    
    // 1. Save to LocalStorage fallback
    try {
      localStorage.setItem(STORAGE_KEY_ITINERARY, JSON.stringify(itinerary));
      localStorage.setItem(STORAGE_KEY_OFFLINE_TIMESTAMP, timestamp);
    } catch (e) {
      console.warn('[OfflineCache] LocalStorage save warning:', e);
    }

    // 2. Save to IndexedDB
    try {
      const db = await openDatabase();
      const tx = db.transaction([STORE_TRIPS, STORE_MAP], 'readwrite');
      
      const tripStore = tx.objectStore(STORE_TRIPS);
      tripStore.put({
        id: 'active_trip',
        destination: itinerary.destination,
        data: itinerary,
        cachedAt: timestamp,
      });

      const mapStore = tx.objectStore(STORE_MAP);
      mapStore.put({
        destinationId: itinerary.destination_id || itinerary.destination,
        trailCoords: itinerary.trail_coords || [],
        bypassCoords: itinerary.bypass_coords || [],
        hazardZones: itinerary.hazard_zones || [],
        shelters: itinerary.shelters || [],
        cachedAt: timestamp,
      });

      console.log('[OfflineCache:IndexedDB] Stored active itinerary & map geometries:', itinerary.destination);
    } catch (e) {
      console.warn('[OfflineCache:IndexedDB] IndexedDB error, using LocalStorage:', e);
    }
  }

  /**
   * Loads the last active itinerary from IndexedDB or LocalStorage fallback.
   */
  static async getCachedTrip(): Promise<{ itinerary: ItineraryResponse | null; cachedAt: string | null }> {
    try {
      const db = await openDatabase();
      return new Promise((resolve) => {
        const tx = db.transaction(STORE_TRIPS, 'readonly');
        const store = tx.objectStore(STORE_TRIPS);
        const req = store.get('active_trip');

        req.onsuccess = () => {
          if (req.result && req.result.data) {
            resolve({
              itinerary: req.result.data,
              cachedAt: req.result.cachedAt,
            });
            return;
          }
          resolve(OfflineCacheService.getCachedTripSync());
        };

        req.onerror = () => {
          resolve(OfflineCacheService.getCachedTripSync());
        };
      });
    } catch {
      return OfflineCacheService.getCachedTripSync();
    }
  }

  /**
   * Synchronous fallback reader for LocalStorage.
   */
  static getCachedTripSync(): { itinerary: ItineraryResponse | null; cachedAt: string | null } {
    try {
      const data = localStorage.getItem(STORAGE_KEY_ITINERARY);
      const cachedAt = localStorage.getItem(STORAGE_KEY_OFFLINE_TIMESTAMP);
      if (data) {
        return {
          itinerary: JSON.parse(data),
          cachedAt,
        };
      }
    } catch (e) {
      console.error('[OfflineCache] LocalStorage read error:', e);
    }
    return { itinerary: null, cachedAt: null };
  }

  /**
   * Saves current user auth profile.
   */
  static saveUserSession(user: any): void {
    try {
      localStorage.setItem(STORAGE_KEY_USER_PROFILE, JSON.stringify(user));
    } catch (e) {
      console.warn('[OfflineCache] Session save warning:', e);
    }
  }

  /**
   * Retrieves current user auth profile.
   */
  static getUserSession(): any {
    try {
      const u = localStorage.getItem(STORAGE_KEY_USER_PROFILE);
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  }
}
