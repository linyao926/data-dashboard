import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  Info,
} from 'lucide-react';
import { Card, Badge } from '@/components/common';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: typeof DollarSign | typeof ShoppingCart | typeof TrendingUp | typeof Users;
  trend: 'up' | 'down';
  change: number;
  color: 'blue' | 'green' | 'purple' | 'orange';
  subtitle?: string;
  description?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon: Icon, 
  trend,
  change,
  color,
  subtitle = 'vs last period',
  description,
}) => {
  const colorMap = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600',
  };

  const formattedValue = typeof value === 'number' ? value.toLocaleString('en-US') : value;

  return (
    <Card variant="default" padding="md" hoverable>
      {/* Header: Icon + Badge */}
      <div className="flex items-center justify-between mb-4">
        <div
          className={`w-12 h-12 bg-gradient-to-br ${colorMap[color]} rounded-lg flex items-center justify-center text-white shadow-sm`}
        >
          <Icon size={24} />
        </div>
        <Badge
          variant={trend === 'up' ? 'success' : 'danger'}
          size="sm"
          rounded
          icon={trend === 'up' ? <TrendingUp/> : <TrendingDown/>}
        >
          {change.toFixed(2)}%
        </Badge>
      </div>

      {/* Content */}
      <Card.Content>
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-gray-600 text-sm font-medium">{title}</h3>
          
          {/* Tooltip for additional info */}
          {description && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="text-gray-400 hover:text-gray-600 transition-colors">
                    <Info size={14} />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs text-sm">{description}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        
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

export default React.memo(MetricCard);