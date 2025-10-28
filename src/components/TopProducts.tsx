import React, { useMemo } from 'react';
import { Card, Badge } from '@/components/common';
import { useTheme } from '@/contexts/ThemeContext';
import type { SaleRecord } from '@/types';

interface TopProductsProps {
  data: SaleRecord[];
  limit?: number;
}

interface ProductStats {
  product: string;
  totalRevenue: number;
  totalSold: number;
  category: string;
}

const TopProducts: React.FC<TopProductsProps> = ({ data, limit = 5 }) => {
  const { theme } = useTheme();

  // Calculate top products
  const topProducts = useMemo(() => {
    const productMap: Record<string, ProductStats> = {};

    data.forEach((sale) => {
      if (!productMap[sale.product]) {
        productMap[sale.product] = {
          product: sale.product,
          totalRevenue: 0,
          totalSold: 0,
          category: sale.category,
        };
      }
      productMap[sale.product].totalRevenue += sale.amount;
      productMap[sale.product].totalSold += sale.quantity;
    });

    return Object.values(productMap)
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, limit);
  }, [data, limit]);

  // Category color mapping
  const getCategoryColor = (category: string): string => {
    const colors: Record<string, string> = {
      Electronics: 'primary',
      Clothing: 'success',
      'Food & Beverage': 'warning',
      'Home & Garden': 'info',
      Sports: 'danger',
    };
    return colors[category] || 'gray';
  };

  // Rank medal
  const getRankIcon = (index: number): string => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `#${index + 1}`;
  };

  return (
    <Card variant="default" padding="md">
      <Card.Header className="pb-4">
        <Card.Title>Top Products</Card.Title>
        <Card.Description>Best sellers this month</Card.Description>
      </Card.Header>

      <Card.Content className="space-y-3">
        {topProducts.length === 0 ? (
          <div className="text-center py-8">
            <p className={theme.text.tertiary}>No product data available</p>
          </div>
        ) : (
          topProducts.map((product, index) => (
            <div
              key={product.product}
              className={`flex items-center gap-3 p-3 rounded-lg ${theme.hover.bg} transition-colors`}
            >
              {/* Rank */}
              <div className="flex-shrink-0 w-8 text-center text-xl">{getRankIcon(index)}</div>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <p className={`font-medium ${theme.text.primary} truncate`}>{product.product}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={getCategoryColor(product.category) as any} size="sm">
                    {product.category}
                  </Badge>
                  <span className={`text-xs ${theme.text.tertiary}`}>{product.totalSold} sold</span>
                </div>
              </div>

              {/* Revenue */}
              <div className="flex-shrink-0 text-right">
                <p className={`font-bold ${theme.text.primary}`}>
                  $
                  {product.totalRevenue.toLocaleString('en-US', {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}
                </p>
              </div>
            </div>
          ))
        )}
      </Card.Content>

      {/* Footer */}
      {topProducts.length > 0 && (
        <Card.Footer className="pt-4">
          <button className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
            View all products →
          </button>
        </Card.Footer>
      )}
    </Card>
  );
};

export default React.memo(TopProducts);

/* 
USAGE:

<TopProducts data={salesData} limit={5} />

FEATURES:
- Shows top 5 products by revenue
- Rank medals (🥇🥈🥉)
- Category badges
- Total quantity sold
- Formatted revenue
- Hover effects
- Dark theme support
- Empty state

CALCULATION:
- Groups sales by product name
- Sums total revenue per product
- Counts total quantity sold
- Sorts by revenue (highest first)
*/
