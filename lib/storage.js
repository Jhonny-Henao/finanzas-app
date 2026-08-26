const STORAGE_KEY = "mis-finanzas-data";

const createDefaultData = () => ({
  accounts: [],
  savings: [],
});

function isValidData(data) {
  return (
    data &&
    typeof data === "object" &&
    Array.isArray(data.accounts) &&
    Array.isArray(data.savings)
  );
}

export function getData() {
  if (typeof window === "undefined") {
    return createDefaultData();
  }

  try {
    const stored = window.localStorage.getItem(
      STORAGE_KEY
    );

    if (!stored) {
      return createDefaultData();
    }

    const parsed = JSON.parse(stored);

    if (!isValidData(parsed)) {
      console.warn(
        "Los datos guardados no tienen un formato válido."
      );

      return createDefaultData();
    }

    return {
      accounts: parsed.accounts,
      savings: parsed.savings,
    };
  } catch (error) {
    console.error(
      "Error leyendo localStorage:",
      error
    );

    return createDefaultData();
  }
}

export function saveData(data) {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    if (!isValidData(data)) {
      console.error(
        "Intento de guardar datos inválidos:",
        data
      );

      return false;
    }

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(data)
    );

    console.log(
      "Finanzas guardadas correctamente"
    );

    return true;
  } catch (error) {
    console.error(
      "Error guardando datos:",
      error
    );

    return false;
  }
}

export function clearData() {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    window.localStorage.removeItem(
      STORAGE_KEY
    );

    return true;
  } catch (error) {
    console.error(
      "Error eliminando datos:",
      error
    );

    return false;
  }
}