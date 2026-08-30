export type Property = {
  item: number;
  code: string;
  name: string;
  region: string;
  category: "Apartamento" | "Casa" | "Comercial" | "Flat" | "Lote" | "Outro";
  typology: string;
  bedrooms: number | null;
  area: number | null;
  address: string;
  captor: string;
  appointment: string;
  phone: string;
  phoneDigits: string;
  price: number | null;
  condo: number | null;
  iptu: number | null;
  notes: string;
  acceptsFinancing: boolean;
  acceptsFgts: boolean;
  url: string;
  dataNote: string;
  sourcePage?: number;
  sourceRow?: number;
};

export type CatalogSnapshot = {
  id: string;
  schemaVersion: 1;
  source: "seed" | "pdf";
  sourceFileName: string;
  importedAt: string;
  sourceDate: string | null;
  contentHash: string;
  properties: Property[];
  summary: {
    total: number;
    regions: number;
    links: number;
    warnings: number;
  };
};

export type ImportStatus =
  | "new"
  | "updated"
  | "unchanged"
  | "missing"
  | "invalid";

export type ImportCandidate = {
  property: Property | null;
  status: ImportStatus;
  previous?: Property;
  warnings: string[];
  errors: string[];
};

export type ImportReview = {
  candidates: ImportCandidate[];
  newCount: number;
  updatedCount: number;
  unchangedCount: number;
  missingCount: number;
  invalidCount: number;
  warningCount: number;
  confidence: "Alta" | "Média" | "Baixa";
  blockingErrors: string[];
};
