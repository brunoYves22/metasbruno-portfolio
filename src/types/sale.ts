export interface Sale {
  id: string;
  date: string;
  product: string;
  client: string;
  commission: number;
  recognized: boolean;
}

export type CommissionCategory = 'high' | 'low' | 'none';

export interface CommissionResult {
  value: number;
  category: CommissionCategory;
  recognized: boolean;
}
