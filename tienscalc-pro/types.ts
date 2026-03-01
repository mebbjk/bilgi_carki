export interface TierValues {
  price: number;
  pv: number;
  bv: number;
}

export interface Membership {
  id: string;
  name: string;
  color: string;
}

export interface Product {
  id: string;
  category: string;
  name: string;
  image?: string;
  retailPrice: number; // Satış Fiyatı
  tiers: Record<string, TierValues>; // key is membershipId
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface CalculationResult {
  membershipId: string;
  totalPrice: number;
  totalPV: number;
  totalBV: number;
  retailTotal: number;
  savings: number;
}

export interface NetworkNode {
  id: string;
  name: string;
  membershipId: string;
  memberId?: string;    // Yeni: Üye ID
  personalPV?: number;  // Yeni: Kişisel PV
  personalBV?: number;  // Yeni: Kişisel BV
  note?: string;        // Yeni: Not alanı
  children: NetworkNode[];
}

export interface DiseaseCategory {
  id: string;
  name: string;
}

export interface Experience {
  id: string;
  originalProblem: string;
  originalProduct: string;
  categoryIds: string[];
  productIds: string[];
  status: 'uncategorized' | 'approved';
}