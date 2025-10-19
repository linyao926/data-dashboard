import React, { useState, useMemo } from 'react';
import MetricCard from '../components/MetricCard';
import RevenueChart from '../components/RevenueChart';
import CategoryPieChart from '../components/CategoryPieChart';
import DataTable from '../components/DataTable';
import FilterBar from '../components/FilterBar';
import type { FilterState } from '../components/FilterBar';

const Dashboard: React.FC = () => {
  // Metric data array (will come from state in Step 9)
  const metricsData = [
    {
      id: 'revenue',
      title: 'Total Revenue',
      value: '$45,231.89',
      icon: '💰',
      trend: 'up' as const,
      change: 12.5,
      color: 'blue' as const,
      subtitle: 'vs last month',
    },
    {
      id: 'orders',
      title: 'Total Orders',
      value: '1,234',
      icon: '🛒',
      trend: 'up' as const,
      change: 8.2,
      color: 'green' as const,
      subtitle: 'vs last month',
    },
    {
      id: 'avg-order',
      title: 'Avg Order Value',
      value: '$36.67',
      icon: '📊',
      trend: 'down' as const,
      change: 3.1,
      color: 'purple' as const,
      subtitle: 'vs last month',
    },
    {
      id: 'customers',
      title: 'Customer Count',
      value: '892',
      icon: '👥',
      trend: 'up' as const,
      change: 15.3,
      color: 'orange' as const,
      subtitle: 'vs last month',
    },
  ];

  const revenueChartData = [
    { date: 'Mon', revenue: 4500 },
    { date: 'Tue', revenue: 5200 },
    { date: 'Wed', revenue: 4800 },
    { date: 'Thu', revenue: 6100 },
    { date: 'Fri', revenue: 7300 },
    { date: 'Sat', revenue: 8900 },
    { date: 'Sun', revenue: 6700 },
  ];

  const categoryData = [
    { name: 'Electronics', value: 45000, color: '#3B82F6' },
    { name: 'Clothing', value: 32000, color: '#10B981' },
    { name: 'Food & Beverage', value: 28000, color: '#F59E0B' },
    { name: 'Home & Garden', value: 21000, color: '#8B5CF6' },
    { name: 'Sports', value: 15000, color: '#EC4899' },
  ];

  // Sample sales data
  const sampleSalesData = [
    {
      id: '1',
      product: 'iPhone 14 Pro',
      category: 'Electronics',
      date: '2025-10-15',
      quantity: 2,
      price: 999.99,
      amount: 1999.98,
      customer: 'John Doe',
    },
    {
      id: '2',
      product: 'Nike Air Max',
      category: 'Clothing',
      date: '2025-10-14',
      quantity: 1,
      price: 129.99,
      amount: 129.99,
      customer: 'Jane Smith',
    },
    {
      id: '3',
      product: 'Coffee Beans 1kg',
      category: 'Food & Beverage',
      date: '2025-10-14',
      quantity: 5,
      price: 24.99,
      amount: 124.95,
      customer: 'Bob Wilson',
    },
    {
      id: '4',
      product: 'Garden Hose',
      category: 'Home & Garden',
      date: '2025-10-13',
      quantity: 3,
      price: 34.99,
      amount: 104.97,
      customer: 'Alice Brown',
    },
    {
      id: '5',
      product: 'Basketball',
      category: 'Sports',
      date: '2025-10-13',
      quantity: 2,
      price: 49.99,
      amount: 99.98,
      customer: 'Charlie Davis',
    },
    {
      id: '6',
      product: 'MacBook Air M2',
      category: 'Electronics',
      date: '2025-10-12',
      quantity: 1,
      price: 1299.99,
      amount: 1299.99,
      customer: 'David Lee',
    },
    {
      id: '7',
      product: 'Adidas Sneakers',
      category: 'Clothing',
      date: '2025-10-12',
      quantity: 2,
      price: 89.99,
      amount: 179.98,
      customer: 'Emma White',
    },
    {
      id: '8',
      product: 'Organic Tea Set',
      category: 'Food & Beverage',
      date: '2025-10-11',
      quantity: 3,
      price: 19.99,
      amount: 59.97,
      customer: 'Frank Miller',
    },
    {
      id: '9',
      product: 'LED Desk Lamp',
      category: 'Home & Garden',
      date: '2025-10-11',
      quantity: 4,
      price: 39.99,
      amount: 159.96,
      customer: 'Grace Taylor',
    },
    {
      id: '10',
      product: 'Yoga Mat',
      category: 'Sports',
      date: '2025-10-10',
      quantity: 1,
      price: 29.99,
      amount: 29.99,
      customer: 'Henry Anderson',
    },
    {
      id: '11',
      product: 'Samsung Galaxy S23',
      category: 'Electronics',
      date: '2025-10-10',
      quantity: 1,
      price: 899.99,
      amount: 899.99,
      customer: 'Isabel Garcia',
    },
    {
      id: '12',
      product: 'Denim Jacket',
      category: 'Clothing',
      date: '2025-10-09',
      quantity: 1,
      price: 79.99,
      amount: 79.99,
      customer: 'Jack Martinez',
    },
  ];

  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    category: 'All',
    dateFrom: '',
    dateTo: '',
  });

  const handleTimeRangeChange = (range: 'week' | 'month' | 'year') => {
    console.log('Time range changed:', range);
    // TODO: Fetch data for selected time range in Step 9
  };

  const handleSort = (field: any, direction: 'asc' | 'desc') => {
    console.log(`Sorting by ${field} ${direction}`);
    // TODO: Will implement in Step 9
  };

  const handleRowClick = (record: any) => {
    console.log('Row clicked:', record);
    // TODO: Will implement in Step 9 (show detail modal)
  };

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    console.log('Filters changed:', newFilters);
    // TODO: Will implement filtering logic in Step 9
  };

  const filteredSalesData = useMemo(() => {
    return sampleSalesData.filter((record) => {
      // Search filter
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const matchesSearch =
          record.product.toLowerCase().includes(query) ||
          record.category.toLowerCase().includes(query) ||
          (record.customer && record.customer.toLowerCase().includes(query));

        if (!matchesSearch) return false;
      }

      // Category filter
      if (filters.category !== 'All' && record.category !== filters.category) {
        return false;
      }

      // Date range filter
      if (filters.dateFrom) {
        const recordDate = new Date(record.date);
        const fromDate = new Date(filters.dateFrom);
        if (recordDate < fromDate) return false;
      }

      if (filters.dateTo) {
        const recordDate = new Date(record.date);
        const toDate = new Date(filters.dateTo);
        if (recordDate > toDate) return false;
      }

      return true;
    });
  }, [sampleSalesData, filters]);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <section className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sales Dashboard</h1>
          <p className="text-gray-600 mt-1">Track your sales performance and analytics</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            📅 Last 30 Days
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            📥 Export
          </button>
        </div>
      </section>

      {/* Metrics Grid */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Key Metrics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {metricsData.map((metric) => (
            <MetricCard
              key={metric.id}
              title={metric.title}
              value={metric.value}
              icon={metric.icon}
              trend={metric.trend}
              change={metric.change}
              color={metric.color}
              subtitle={metric.subtitle}
            />
          ))}
        </div>
      </section>

      {/* Charts Section */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Analytics</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Chart - Takes 2 columns */}
          <div className="lg:col-span-2">
            <RevenueChart
              data={revenueChartData}
              timeRange="week"
              onTimeRangeChange={handleTimeRangeChange}
            />
          </div>

          {/* Pie Chart Placeholder - Takes 1 column */}
          <div className="lg:col-span-1">
            <CategoryPieChart data={categoryData} />
          </div>
        </div>
      </section>

      {/* Data Table Section */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Sales Data</h2>
        {/* NEW: Add FilterBar */}
        <FilterBar
          onFilterChange={handleFilterChange}
          categories={[
            'All',
            'Electronics',
            'Clothing',
            'Food & Beverage',
            'Home & Garden',
            'Sports',
          ]}
        />

        {/* Update DataTable to use filtered data */}
        <DataTable data={filteredSalesData} onSort={handleSort} onRowClick={handleRowClick} />
      </section>
    </div>
  );
};

export default Dashboard;
