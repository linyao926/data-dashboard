import React from 'react';
import { Card } from '@/components/common';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useTheme } from '@/contexts/ThemeContext';
import type { SaleRecord } from '@/types';

interface RecentSalesProps {
  data: SaleRecord[];
  limit?: number;
}

const RecentSales: React.FC<RecentSalesProps> = ({ data, limit = 5 }) => {
  const { theme } = useTheme();

  const recentSales = data
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);

  const getTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <Card variant="default" padding="md">
      <Card.Header className="pb-4">
        <Card.Title>Recent Sales</Card.Title>
        <Card.Description>Latest transactions from your store</Card.Description>
      </Card.Header>

      <Card.Content className="space-y-4">
        {recentSales.length === 0 ? (
          <div className="text-center py-8">
            <p className={theme.text.tertiary}>No recent sales</p>
          </div>
        ) : (
          recentSales.map((sale) => (
            <div
              key={sale.id}
              className={`flex items-center justify-between p-3 rounded-lg ${theme.hover.bg} transition-colors`}
            >
              {/* Left: Avatar + Info */}
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage
                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${sale.customer}`}
                  />
                  <AvatarFallback>{sale.customer?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                </Avatar>

                {/* Info */}
                <div className="min-w-0">
                  <p className={`font-medium ${theme.text.primary} truncate`}>
                    {sale.customer || 'Unknown Customer'}
                  </p>
                  <p className={`text-sm ${theme.text.tertiary} truncate`}>{sale.product}</p>
                </div>
              </div>

              {/* Right: Amount + Time */}
              <div className="text-right flex-shrink-0 ml-4">
                <p className={`font-semibold ${theme.text.primary}`}>
                  $
                  {sale.amount.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                  })}
                </p>
                <p className={`text-xs ${theme.text.tertiary}`}>{getTimeAgo(sale.date)}</p>
              </div>
            </div>
          ))
        )}
      </Card.Content>

      {recentSales.length > 0 && (
        <Card.Footer className="pt-4">
          <button
            className={`text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors`}
          >
            View all transactions →
          </button>
        </Card.Footer>
      )}
    </Card>
  );
};

export default React.memo(RecentSales);