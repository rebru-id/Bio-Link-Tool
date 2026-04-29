// src/types/product.ts
// Identik dengan src/types/product.ts di website Rebru
// Sprint 4: saat Supabase live, kedua project fetch dari DB yang sama

export interface ProductVariant {
  label: string;
  price: number;
}

export interface ProductSpecs {
  beratBersih?: string;
  bahan?: string;
  varian?: string;
  fitur?: string[];
  [key: string]: string | string[] | undefined;
}

export interface ProductImpact {
  waste_saved?: string;
  co2_locked?: string;
  description?: string;
  stat?: string;
  value?: string;
  icon: string;
}

export interface UIProduct {
  id: string;
  name: string;
  tagline: string;
  category?: string;
  price: number | null;
  unit: string | null;
  variants: ProductVariant[];
  icon?: string;
  accent: string;
  accentBg?: string;
  accentBorder?: string;
  badge: string | null;
  isFeatured?: boolean;
  specs?: ProductSpecs;
  impact?: ProductImpact;
}
