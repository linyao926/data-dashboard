import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import { Card, Button } from '@/components/common';

interface RevenueChartProps {
  data?: ChartDataPoint[];
  timeRange?: 'week' | 'month' | 'quarter';
  onTimeRangeChange?: (range: 'week' | 'month' | 'quarter') => void;
}

interface ChartDataPoint {
  date: string;
  revenue: number;
  label?: string;
}

const RevenueChart: React.FC<RevenueChartProps> = ({
  data = [],
  timeRange = 'week',
  onTimeRangeChange,
}) => {
  const [activeRange, setActiveRange] = useState<'week' | 'month' | 'quarter'>(timeRange);

  const sampleData: ChartDataPoint[] = [
    { date: 'Mon', revenue: 4500, label: 'Monday' },
    { date: 'Tue', revenue: 5200, label: 'Tuesday' },
    { date: 'Wed', revenue: 4800, label: 'Wednesday' },
    { date: 'Thu', revenue: 6100, label: 'Thursday' },
    { date: 'Fri', revenue: 7300, label: 'Friday' },
    { date: 'Sat', revenue: 8900, label: 'Saturday' },
    { date: 'Sun', revenue: 6700, label: 'Sunday' },
  ];

  const chartData = data.length > 0 ? data : sampleData;

  const handleRangeChange = (range: 'week' | 'month' | 'quarter') => {
    setActiveRange(range);
    onTimeRangeChange?.(range);
  };

  const timeRanges: Array<{ id: 'week' | 'month' | 'quarter'; label: string }> = [
    { id: 'week', label: 'Week' },
    { id: 'month', label: 'Month' },
    { id: 'quarter', label: 'Quarter' },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <Card padding="sm">
          <p className="text-sm font-semibold text-gray-900">
            {payload[0].payload.label || payload[0].payload.date}
          </p>
          <p className="text-lg font-bold text-blue-600">
            ${payload[0].value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
        </Card>
      );
    }
    return null;
  };

  const formatYAxis = (value: number) => {
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}k`;
    }
    return `$${value}`;
  };

  return (
    <Card variant="default" padding="md" hoverable>
      <Card.Header className="flex items-center justify-between mb-6">
        <div>
          <Card.Title>Revenue Overview</Card.Title>
          <Card.Description>Track your revenue trends over time</Card.Description>
        </div>

        {/* Time Range Toggle */}
        <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
          {timeRanges.map((range) => (
            <Button
              key={range.id}
              variant={activeRange === range.id ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => handleRangeChange(range.id)}
              className={activeRange === range.id ? 'bg-white shadow-sm' : ''}
            >
              {range.label}
            </Button>
          ))}
        </div>
      </Card.Header>

      <Card.Content>
        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />

              <XAxis
                dataKey="date"
                stroke="#6B7280"
                style={{ fontSize: '12px' }}
                tickLine={false}
                axisLine={false}
              />

              <YAxis
                stroke="#6B7280"
                style={{ fontSize: '12px' }}
                tickLine={false}
                axisLine={false}
                tickFormatter={formatYAxis}
              />

              <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#3B82F6', strokeWidth: 1 }} />

              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#3B82F6"
                strokeWidth={3}
                fill="url(#colorRevenue)"
                activeDot={{ r: 6, fill: '#3B82F6' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Highest</p>
            <p className="text-lg font-bold text-gray-900 mt-1">
              ${Math.max(...chartData.map((d) => d.revenue)).toLocaleString('en-US')}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Average</p>
            <p className="text-lg font-bold text-gray-900 mt-1">
              $
              {(chartData.reduce((sum, d) => sum + d.revenue, 0) / chartData.length).toLocaleString(
                'en-US',
                { maximumFractionDigits: 0 }
              )}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Total</p>
            <p className="text-lg font-bold text-gray-900 mt-1">
              ${chartData.reduce((sum, d) => sum + d.revenue, 0).toLocaleString('en-US')}
            </p>
          </div>
        </div>
      </Card.Content>
    </Card>
  );
};

export default React.memo(RevenueChart);
