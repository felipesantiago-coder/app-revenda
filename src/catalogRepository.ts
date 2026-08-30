import { Property, CatalogSnapshot } from './types';

const DB_NAME = 'QuadraimobCatalogDB';
const DB_VERSION = 1;
const SNAPSHOTS_STORE = 'catalogSnapshots';
const STATE_STORE = 'catalogState';

export interface CatalogState {
  activeSnapshotId: string | null;
  previousSnapshotId: string | null;
}

async function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      if (!db.objectStoreNames.contains(SNAPSHOTS_STORE)) {
        db.createObjectStore(SNAPSHOTS_STORE, { keyPath: 'id' });
      }
      
      if (!db.objectStoreNames.contains(STATE_STORE)) {
        db.createObjectStore(STATE_STORE, { keyPath: 'id' });
      }
    };
  });
}

export async function getActiveSnapshot(): Promise<CatalogSnapshot | null> {
  try {
    const db = await openDB();
    const stateTx = db.transaction(STATE_STORE, 'readonly');
    const stateStore = stateTx.objectStore(STATE_STORE);
    
    return new Promise((resolve, reject) => {
      const request = stateStore.get('current');
      request.onerror = () => reject(request.error);
      request.onsuccess = async () => {
        const state = request.result as CatalogState | undefined;
        if (!state?.activeSnapshotId) {
          resolve(null);
          return;
        }
        
        const snapshotTx = db.transaction(SNAPSHOTS_STORE, 'readonly');
        const snapshotStore = snapshotTx.objectStore(SNAPSHOTS_STORE);
        const snapshotRequest = snapshotStore.get(state.activeSnapshotId);
        
        snapshotRequest.onerror = () => reject(snapshotRequest.error);
        snapshotRequest.onsuccess = () => resolve(snapshotRequest.result as CatalogSnapshot | null);
      };
    });
  } catch (e) {
    console.error('Failed to get active snapshot:', e);
    return null;
  }
}

export async function saveSnapshot(snapshot: CatalogSnapshot): Promise<void> {
  const db = await openDB();
  const tx = db.transaction(SNAPSHOTS_STORE, 'readwrite');
  const store = tx.objectStore(SNAPSHOTS_STORE);
  
  return new Promise((resolve, reject) => {
    const request = store.put(snapshot);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

export async function activateSnapshot(snapshotId: string, previousSnapshotId: string | null): Promise<void> {
  const db = await openDB();
  const tx = db.transaction(STATE_STORE, 'readwrite');
  const store = tx.objectStore(STATE_STORE);
  
  const state: CatalogState = {
    activeSnapshotId: snapshotId,
    previousSnapshotId
  };
  
  return new Promise((resolve, reject) => {
    const request = store.put(state, 'current');
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

export async function getPreviousSnapshot(): Promise<CatalogSnapshot | null> {
  try {
    const db = await openDB();
    const stateTx = db.transaction(STATE_STORE, 'readonly');
    const stateStore = stateTx.objectStore(STATE_STORE);
    
    return new Promise((resolve, reject) => {
      const request = stateStore.get('current');
      request.onerror = () => reject(request.error);
      request.onsuccess = async () => {
        const state = request.result as CatalogState | undefined;
        if (!state?.previousSnapshotId) {
          resolve(null);
          return;
        }
        
        const snapshotTx = db.transaction(SNAPSHOTS_STORE, 'readonly');
        const snapshotStore = snapshotTx.objectStore(SNAPSHOTS_STORE);
        const snapshotRequest = snapshotStore.get(state.previousSnapshotId);
        
        snapshotRequest.onerror = () => reject(snapshotRequest.error);
        snapshotRequest.onsuccess = () => resolve(snapshotRequest.result as CatalogSnapshot | null);
      };
    });
  } catch (e) {
    console.error('Failed to get previous snapshot:', e);
    return null;
  }
}

export async function deleteSnapshot(snapshotId: string): Promise<void> {
  const db = await openDB();
  const tx = db.transaction(SNAPSHOTS_STORE, 'readwrite');
  const store = tx.objectStore(SNAPSHOTS_STORE);
  
  return new Promise((resolve, reject) => {
    const request = store.delete(snapshotId);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}
