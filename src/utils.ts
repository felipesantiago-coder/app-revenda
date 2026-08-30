export function normalizeSearch(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR")
    .trim();
}

export function parseBrazilianCurrency(text: string): number | null {
  if (!text || typeof text !== "string") {
    return null;
  }
  
  let cleaned = text.trim();
  
  // Remove R$ symbol, NBSP, and regular spaces
  cleaned = cleaned.replace(/R\$/g, "").replace(/\u00a0/g, " ").replace(/\s+/g, "");
  
  // Check if it's empty after cleaning
  if (!cleaned) {
    return null;
  }
  
  // Remove thousand separators (dots)
  cleaned = cleaned.replace(/\./g, "");
  
  // Convert decimal comma to dot
  cleaned = cleaned.replace(",", ".");
  
  const value = parseFloat(cleaned);
  
  if (isNaN(value)) {
    return null;
  }
  
  return value;
}

export function parseArea(text: string): { value: number | null; warning?: string } {
  if (!text || typeof text !== "string") {
    return { value: null };
  }
  
  let cleaned = text.trim();
  let warning: string | undefined;
  
  // Check for suspicious unit m³
  if (cleaned.includes("m³") || cleaned.includes("m3")) {
    warning = "Unidade de área suspeita (m³ em vez de m²)";
  }
  
  // Remove unit
  cleaned = cleaned.replace(/m[²23]?/gi, "").trim();
  
  // Remove R$ if present
  cleaned = cleaned.replace(/R\$/g, "").trim();
  
  // Remove thousand separators
  cleaned = cleaned.replace(/\./g, "");
  
  // Convert decimal comma to dot
  cleaned = cleaned.replace(",", ".");
  
  const value = parseFloat(cleaned);
  
  if (isNaN(value)) {
    return { value: null, warning };
  }
  
  return { value, warning };
}

export function extractBedrooms(typology: string): number | null {
  if (!typology) {
    return null;
  }
  
  const upper = typology.toUpperCase();
  
  // Match patterns like "1 QUARTO", "2 QUARTOS", "3Q", etc.
  const match = upper.match(/(\d+)\s*(?:QUARTO|QUARTOS|Q)/i);
  if (match) {
    return parseInt(match[1], 10);
  }
  
  return null;
}

export function normalizePhoneDigits(phone: string): string {
  if (!phone) {
    return "";
  }
  
  // Extract only digits
  const digits = phone.replace(/\D/g, "");
  
  // If starts with 55, keep it; otherwise add 55 for Brazil
  if (digits.startsWith("55") && digits.length >= 12) {
    return digits;
  }
  
  // Assume Brazilian number
  if (digits.length === 10 || digits.length === 11) {
    return "55" + digits;
  }
  
  if (digits.length === 8) {
    return "5561" + digits; // Default to Brasília area code
  }
  
  return digits;
}

export function categorizeProperty(typology: string, name: string, url: string): "Apartamento" | "Casa" | "Comercial" | "Flat" | "Lote" | "Outro" {
  const typoUpper = typology.toUpperCase();
  const nameUpper = name.toUpperCase();
  const urlLower = url.toLowerCase();
  
  // Check for LOTE first
  if (typoUpper.includes("LOTE") || typoUpper.includes("TERRENO") || urlLower.includes("/lote")) {
    return "Lote";
  }
  
  // Check for COMERCIAL
  if (typoUpper.includes("SALA") || typoUpper.includes("LOJA") || typoUpper.includes("COMERCIAL") || typoUpper.includes("GALPÃO")) {
    return "Comercial";
  }
  
  // Check for FLAT
  if (nameUpper.includes("HOTEL-FLAT") || nameUpper.includes("APART-HOTEL") || nameUpper.includes("FLAT") || urlLower.includes("flat")) {
    return "Flat";
  }
  
  // Check for CASA
  if (typoUpper.includes("CASA") || typoUpper.includes("SOBRADO") || typoUpper.includes("RESIDÊNCIA") || nameUpper.includes("CASA")) {
    return "Casa";
  }
  
  // Check for APARTAMENTO
  if (typoUpper.includes("APARTAMENTO") || typoUpper.includes("STUDIO") || typoUpper.includes("KITNET") || 
      typoUpper.includes("1 QUARTO") || typoUpper.includes("2 QUARTOS") || typoUpper.includes("3 QUARTOS") ||
      typoUpper.includes("4 QUARTOS") || typoUpper.includes("5 QUARTOS")) {
    return "Apartamento";
  }
  
  return "Outro";
}

export function checkAcceptsFinancing(notes: string): boolean {
  if (!notes) {
    return false;
  }
  
  const lower = notes.toLowerCase();
  
  // Check for explicit negation first
  if (lower.includes("não aceita financiamento") || lower.includes("nao aceita financiamento")) {
    return false;
  }
  
  // Check for positive indication
  return lower.includes("aceita financiamento") || lower.includes("aceita financ");
}

export function checkAcceptsFgts(notes: string): boolean {
  if (!notes) {
    return false;
  }
  
  const lower = notes.toLowerCase();
  
  // Check for explicit negation first
  if (lower.includes("não aceita fgts") || lower.includes("nao aceita fgts")) {
    return false;
  }
  
  // Check for positive indication
  return lower.includes("aceita fgts");
}

export function isValidUrl(url: string): boolean {
  if (!url) {
    return false;
  }
  
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}
