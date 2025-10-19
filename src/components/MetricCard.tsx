import React from 'react';

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

  // Trend badge colors
  const trendColorMap = {
    up: 'bg-green-100 text-green-700',
    down: 'bg-red-100 text-red-700',
  };

  // Trend icons
  const trendIcon = trend === 'up' ? '↑' : '↓';

  // Format value with commas if it's a number
  const formattedValue = typeof value === 'number' ? value.toLocaleString('en-US') : value;

  // Format change percentage
  const formattedChange = `${trend === 'up' ? '+' : '-'}${Math.abs(change)}%`;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
      {/* Header: Icon + Badge */}
      <div className="flex items-center justify-between mb-4">
        <div
          className={`w-12 h-12 bg-gradient-to-br ${colorMap[color]} rounded-lg flex items-center justify-center text-white text-2xl shadow-sm`}
        >
          {icon}
        </div>
        <span
          className={`text-xs font-medium px-2.5 py-1 rounded-full ${trendColorMap[trend]} flex items-center gap-1`}
        >
          {trendIcon} {formattedChange}
        </span>
      </div>

      {/* Content */}
      <div>
        <h3 className="text-gray-600 text-sm font-medium mb-1">{title}</h3>
        <p className="text-2xl font-bold text-gray-900 mb-1">{formattedValue}</p>
        <p className="text-xs text-gray-500">{subtitle}</p>
      </div>

      {/* Progress bar (optional visual indicator) */}
      <div className="mt-4 h-1 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${colorMap[color]} transition-all duration-1000 ease-out`}
          style={{ width: `${Math.min(Math.abs(change) * 5, 100)}%` }}
        />
      </div>
    </div>
  );
};

export default MetricCard;
