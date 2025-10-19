import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

// USAGE IN DASHBOARD.TSX:
//
// import CategoryPieChart from '../components/CategoryPieChart';
//
// // In Dashboard component:
// const categoryData = [
//   { name: 'Electronics', value: 45000, color: '#3B82F6' },
//   { name: 'Clothing', value: 32000, color: '#10B981' },
//   { name: 'Food & Beverage', value: 28000, color: '#F59E0B' },
//   { name: 'Home & Garden', value: 21000, color: '#8B5CF6' },
//   { name: 'Sports', value: 15000, color: '#EC4899' },
// ];
//
// // In Charts Section (already has lg:grid-cols-3):
// <div className="lg:col-span-1">
//   <CategoryPieChart data={categoryData} title="Sales by Category" />
// </div>

interface CategoryData {
  name: string;
  value: number;
  color: string;
  [key: string]: any; // Index signature for Recharts compatibility
}

interface CategoryPieChartProps {
  data?: CategoryData[];
  title?: string;
}

const CategoryPieChart: React.FC<CategoryPieChartProps> = ({
  data = [
    { name: 'Electronics', value: 45000, color: '#3B82F6' },
    { name: 'Clothing', value: 32000, color: '#10B981' },
    { name: 'Food & Beverage', value: 28000, color: '#F59E0B' },
    { name: 'Home & Garden', value: 21000, color: '#8B5CF6' },
    { name: 'Sports', value: 15000, color: '#EC4899' },
  ],
  title = 'Sales by Category',
}) => {
  // Calculate total and percentages
  const total = data.reduce((sum, item) => sum + item.value, 0);

  // Custom label renderer for pie slices
  const renderLabel = (entry: any) => {
    const percent = ((entry.value / total) * 100).toFixed(1);
    return `${percent}%`;
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const percent = ((data.value / total) * 100).toFixed(1);

      return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
          <p className="text-sm font-semibold text-gray-900">{data.name}</p>
          <p className="text-lg font-bold text-blue-600">${data.value.toLocaleString('en-US')}</p>
          <p className="text-xs text-gray-500">{percent}% of total</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <div className="text-sm text-gray-500">
          Total:{' '}
          <span className="font-semibold text-gray-900">${total.toLocaleString('en-US')}</span>
        </div>
      </div>

      {/* Pie Chart */}
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderLabel}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              animationBegin={0}
              animationDuration={800}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value, entry: any) => (
                <span className="text-sm text-gray-700">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Category List with Values */}
      <div className="mt-6 space-y-3">
        {data.map((category, index) => {
          const percent = ((category.value / total) * 100).toFixed(1);
          return (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }} />
                <span className="text-sm text-gray-700">{category.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-gray-900">
                  ${category.value.toLocaleString('en-US')}
                </span>
                <span className="text-xs text-gray-500 w-12 text-right">{percent}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryPieChart;
