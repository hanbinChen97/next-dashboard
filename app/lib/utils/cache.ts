
export function getCache(key: string, expirationMinutes: number): any | null {
  if (typeof window === 'undefined') return null; // Only run on client side

  try {
    const cachedItem = localStorage.getItem(key);
    if (!cachedItem) {
      return null;
    }

    const { timestamp, data } = JSON.parse(cachedItem);
    const now = new Date().getTime();
    const expirationTime = new Date(timestamp).getTime() + expirationMinutes * 60 * 1000;

    if (now > expirationTime) {
      localStorage.removeItem(key);
      return null;
    }

    return data;
  } catch (error) {
    console.error(`Error getting cache for key ${key}:`, error);
    return null;
  }
}

export function setCache(key: string, data: any): void {
  if (typeof window === 'undefined') return; // Only run on client side

  try {
    const item = {
      timestamp: new Date().toISOString(),
      data,
    };
    localStorage.setItem(key, JSON.stringify(item));
  } catch (error) {
    console.error(`Error setting cache for key ${key}:`, error);
  }
}

export function invalidateCache(key: string): void {
  if (typeof window === 'undefined') return; // Only run on client side

  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error invalidating cache for key ${key}:`, error);
  }
}
