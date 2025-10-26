import React from 'react';
import { Card, Badge } from '@/components/common';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: string;
  trend: 'up' | 'down';
  change: number;
  color: 'blue' | 'green' | 'purple' | 'orange';
  subtitle?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon,
  trend,
  change,
  color,
  subtitle = 'vs last period',
}) => {
  // Color mappings for gradient backgrounds
  const colorMap = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600',
  };

  // Format value with commas if it's a number
  const formattedValue = typeof value === 'number' ? value.toLocaleString('en-US') : value;

  return (
    <Card variant="default" padding="md" hoverable>
      {/* Header: Icon + Badge */}
      <div className="flex items-center justify-between mb-4">
        <div
          className={`w-12 h-12 bg-gradient-to-br ${colorMap[color]} rounded-lg flex items-center justify-center text-white text-2xl shadow-sm`}
        >
          {icon}
        </div>
        <Badge
          variant={trend === 'up' ? 'success' : 'danger'}
          size="sm"
          rounded
          icon={trend === 'up' ? '↑' : '↓'}
        >
          {Math.abs(change)}%
        </Badge>
      </div>

      {/* Content */}
      <Card.Content>
        <h3 className="text-gray-600 text-sm font-medium mb-1">{title}</h3>
        <p className="text-2xl font-bold text-gray-900 mb-1">{formattedValue}</p>
        <p className="text-xs text-gray-500">{subtitle}</p>
      </Card.Content>

      {/* Progress bar */}
      <div className="mt-4 h-1 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${colorMap[color]} transition-all duration-1000 ease-out`}
          style={{ width: `${Math.min(Math.abs(change) * 5, 100)}%` }}
        />
      </div>
    </Card>
  );
};

export default MetricCard;
