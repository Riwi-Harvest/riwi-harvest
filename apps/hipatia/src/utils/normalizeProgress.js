export function normalizeProgress(value) {
  if (!value) return null;
  // Quita el símbolo % y espacios
  const clean = value.toString().replace('%', '').trim();
  // Devuelve como número decimal
  return parseFloat(clean);
}
