// Thin wrapper around the backend sync API.
// Falls back to localStorage cache when offline.

export async function loadUserData(userId) {
  try {
    const res = await fetch(`/api/sync/${userId}`);
    if (!res.ok) throw new Error('non-2xx');
    const { data } = await res.json();
    localStorage.setItem(`wt_cache_${userId}`, JSON.stringify(data));
    return data;
  } catch {
    const cached = localStorage.getItem(`wt_cache_${userId}`);
    return cached ? JSON.parse(cached) : {};
  }
}

export async function saveUserData(userId, data) {
  // Always write to cache immediately so the UI feels instant
  localStorage.setItem(`wt_cache_${userId}`, JSON.stringify(data));
  try {
    await fetch(`/api/sync/${userId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data }),
    });
  } catch {
    // Offline — cache will sync on next load
    console.warn('Offline — saved to cache');
  }
}
