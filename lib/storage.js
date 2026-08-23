const STORAGE_KEY = "mis-finanzas-data";

const defaultData = {
  accounts: [],
  savings: [],
};

export function getData() {
  if (typeof window === "undefined") {
    return defaultData;
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return defaultData;
    }

    return JSON.parse(stored);
  } catch (error) {
    console.error("Error leyendo localStorage:", error);
    return defaultData;
  }
}

export function saveData(data) {
  if (typeof window === "undefined") return;

  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function clearData() {
  if (typeof window === "undefined") return;

  localStorage.removeItem(STORAGE_KEY);
}