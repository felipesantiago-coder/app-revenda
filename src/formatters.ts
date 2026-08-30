const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

const decimal = new Intl.NumberFormat("pt-BR", {
  maximumFractionDigits: 2,
});

export function formatCurrency(value: number | null): string {
  if (value === null || value === undefined) {
    return "Valor sob consulta";
  }
  return currency.format(value);
}

export function formatArea(value: number | null): string {
  if (value === null || value === undefined) {
    return "Área não informada";
  }
  return `${decimal.format(value)} m²`;
}

export function formatOptionalNumber(value: number | null): string {
  if (value === null || value === undefined) {
    return "Não informado";
  }
  return currency.format(value);
}

export function formatPricePerSqm(price: number | null, area: number | null): string {
  if (!price || !area || price <= 0 || area <= 0) {
    return "—";
  }
  return currency.format(price / area);
}
