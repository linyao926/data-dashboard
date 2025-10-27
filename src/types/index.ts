export interface SaleRecord {
  id: string;
  product: string;
  category: string;
  date: string;
  quantity: number;
  price: number;
  amount: number;
  customer: string;
  revenue?: number;
  region?: string;
  paymentMethod?: string;
};

export interface MetricData {
  label: string;
  value: string | number;
  change: number;
  trend: 'up' | 'down';
  icon?: string;
}

export interface ChartDataPoint {
  date: string;
  revenue: number;
  label?: string;
}

export interface CategoryData {
  name: string;
  value: number;
  percentage: number;
}

export interface FilterState {
  dateRange: {
    start: string;
    end: string;
  };
  category: string;
  region: string;
  searchQuery: string;
}

export type SortDirection = 'asc' | 'desc';

export interface SortState {
  field: keyof SaleRecord | null;
  direction: SortDirection;
}
