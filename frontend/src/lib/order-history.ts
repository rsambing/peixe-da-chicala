const KEY = "peixe-da-chicala.order-history.v1";

export interface LocalOrderEntry {
  trackingCode: string;
  customerName: string;
  createdAt: string;
}

export function getLocalOrders(): LocalOrderEntry[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function addLocalOrder(entry: LocalOrderEntry) {
  const current = getLocalOrders();
  const next = [entry, ...current.filter((o) => o.trackingCode !== entry.trackingCode)].slice(0, 30);
  localStorage.setItem(KEY, JSON.stringify(next));
}

export function removeLocalOrder(trackingCode: string) {
  const next = getLocalOrders().filter((o) => o.trackingCode !== trackingCode);
  localStorage.setItem(KEY, JSON.stringify(next));
}

export function clearLocalOrders() {
  localStorage.removeItem(KEY);
}
