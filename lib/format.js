export function formatMoney(value) {
  if (value === null || value === undefined || value === "") {
    return "";
  }

  const cleanValue = String(value).replace(/\D/g, "");

  if (!cleanValue) {
    return "";
  }

  return Number(cleanValue).toLocaleString("es-CO");
}

export function parseMoney(value) {
  if (!value) {
    return 0;
  }

  return Number(String(value).replace(/\D/g, ""));
}