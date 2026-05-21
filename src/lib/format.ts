export function formatCurrency(value?: number | null): string {
  if (value === undefined || value === null || !Number.isFinite(value)) {
    return "—";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: value >= 100 ? 0 : 2,
  }).format(value);
}

export function formatPercentPrice(value?: number | null): string {
  if (value === undefined || value === null || !Number.isFinite(value)) {
    return "—";
  }

  return `${(value * 100).toFixed(1)}¢`;
}

export function formatNumber(value?: number | null): string {
  if (value === undefined || value === null || !Number.isFinite(value)) {
    return "—";
  }

  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatDate(value?: string | null): string {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
  }).format(date);
}
