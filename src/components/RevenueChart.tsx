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

// Props interface
interface RevenueChartProps {
  data?: ChartDataPoint[];
  timeRange?: 'week' | 'month' | 'year';
  onTimeRangeChange?: (range: 'week' | 'month' | 'year') => void;
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
  const [activeRange, setActiveRange] = useState<'week' | 'month' | 'year'>(timeRange);

  // Sample data if none provided
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

  // Handle time range change
  const handleRangeChange = (range: 'week' | 'month' | 'year') => {
    setActiveRange(range);
    onTimeRangeChange?.(range);
  };

  // Time range buttons
  const timeRanges: Array<{ id: 'week' | 'month' | 'year'; label: string }> = [
    { id: 'week', label: 'Week' },
    { id: 'month', label: 'Month' },
    { id: 'year', label: 'Year' },
  ];

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white px-4 py-3 rounded-lg shadow-lg border border-gray-200">
          <p className="text-sm font-semibold text-gray-900">
            {payload[0].payload.label || payload[0].payload.date}
          </p>
          <p className="text-lg font-bold text-blue-600">
            ${payload[0].value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
        </div>
      );
    }
    return null;
  };

  // Format Y-axis ticks
  const formatYAxis = (value: number) => {
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}k`;
    }
    return `$${value}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 transition-all duration-300 hover:shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Revenue Overview</h3>
          <p className="text-sm text-gray-500 mt-1">Track your revenue trends over time</p>
        </div>

        {/* Time Range Toggle */}
        <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
          {timeRanges.map((range) => (
            <button
              key={range.id}
              onClick={() => handleRangeChange(range.id)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                activeRange === range.id
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
              </linearGradient>
            </defs>

            {/* Grid */}
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />

            {/* X Axis */}
            <XAxis
              dataKey="date"
              stroke="#6B7280"
              style={{ fontSize: '12px' }}
              tickLine={false}
              axisLine={false}
            />

            {/* Y Axis */}
            <YAxis
              stroke="#6B7280"
              style={{ fontSize: '12px' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={formatYAxis}
            />

            {/* Tooltip */}
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#3B82F6', strokeWidth: 1 }} />

            {/* Area */}
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
    </div>
  );
};

export default RevenueChart;
