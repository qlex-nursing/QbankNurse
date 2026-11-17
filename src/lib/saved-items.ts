export type SavedItemType =
  | "question"
  | "exam-flashcard"
  | "study-card"
  | "care-plan"
  | "study-topic";

export type SavedItem = {
  id: string;
  type: SavedItemType;
  title: string;
  description?: string;
  savedAt: string;
  href?: string;
  metadata?: Record<string, string>;
};

const STORAGE_KEY = "qbanknurse-saved-items";

const SAVED_ITEMS_EVENT = "qbanknurse:saved-items-updated";

function isBrowser() {
  return typeof window !== "undefined";
}

export function getSavedItems(): SavedItem[] {
  if (!isBrowser()) return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as SavedItem[]) : [];
  } catch {
    return [];
  }
}

function notifySavedItemsChanged() {
  if (isBrowser()) {
    window.dispatchEvent(new CustomEvent(SAVED_ITEMS_EVENT));
  }
}

function persistSavedItems(items: SavedItem[]) {
  if (!isBrowser()) return;

  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  notifySavedItemsChanged();
}

export function isItemSaved(id: string, type: SavedItemType): boolean {
  return getSavedItems().some(
    (item) => item.id === id && item.type === type,
  );
}

export function saveItem(
  item: Omit<SavedItem, "savedAt">,
): void {
  const items = getSavedItems();

  const alreadySaved = items.some(
    (saved) => saved.id === item.id && saved.type === item.type,
  );

  if (alreadySaved) return;

  persistSavedItems([
    {
      ...item,
      savedAt: new Date().toISOString(),
    },
    ...items,
  ]);
}

export function removeSavedItem(
  id: string,
  type: SavedItemType,
): void {
  const items = getSavedItems().filter(
    (item) => !(item.id === id && item.type === type),
  );

  persistSavedItems(items);
}

export function toggleSavedItem(
  item: Omit<SavedItem, "savedAt">,
): boolean {
  if (isItemSaved(item.id, item.type)) {
    removeSavedItem(item.id, item.type);
    return false;
  }

  saveItem(item);
  return true;
}

export function subscribeToSavedItems(
  callback: () => void,
): () => void {
  if (!isBrowser()) return () => {};

  window.addEventListener(SAVED_ITEMS_EVENT, callback);
  window.addEventListener("storage", callback);

  return () => {
    window.removeEventListener(SAVED_ITEMS_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}