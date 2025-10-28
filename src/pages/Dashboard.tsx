import React, { useState, useMemo, useEffect, useCallback, useTransition, lazy, Suspense } from 'react';
import { DollarSign, ShoppingCart, TrendingUp, Users, Calendar, Download } from 'lucide-react';
import { fetchSalesData, getCategories, cancelFetch } from '../services/api';
import type { SaleRecord } from '../types';
import { useDebounce } from '../hooks/useDebounce';
import { groupByWeek, groupByMonth, groupByQuarter } from '../utils/chartUtils';
import { useTheme } from '../contexts/ThemeContext';
import MetricCard from '../components/MetricCard';
import DataTable from '../components/DataTable';
import FilterBar from '../components/FilterBar';
import RecentSales from '../components/RecentSales';
import TopProducts from '../components/TopProducts';
import type { FilterState } from '../components/FilterBar';

const RevenueChart = lazy(() => import('../components/RevenueChart'));
const CategoryPieChart = lazy(() => import('../components/CategoryPieChart'));

const Dashboard: React.FC = () => {
  const { theme } = useTheme();
  
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    category: 'All',
    dateFrom: '',
    dateTo: '',
  });

  const [salesData, setSalesData] = useState<SaleRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter'>('week');
  const [loadingStage, setLoadingStage] = useState<string>('Initializing...');
  const [loadingProgress, setLoadingProgress] = useState<number>(0);

  const debouncedSearchQuery = useDebounce(filters.searchQuery, 300);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      setLoadingProgress(0);

      try {
        const data = await fetchSalesData((stage, message, progress) => {
          setLoadingStage(message);
          if (progress) {
            setLoadingProgress(progress);
          }
        });

        setSalesData(data);
        const cats = getCategories(data);
        setCategories(cats);

        console.log(`✅ Loaded ${data.length} sales records`);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
        console.error('❌ Error loading data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();

    return () => {
      cancelFetch();
    };
  }, []);

  const handleTimeRangeChange = useCallback((range: 'week' | 'month' | 'quarter') => {
    setTimeRange(range);
  }, []);

  const handleSort = useCallback((field: any, direction: 'asc' | 'desc') => {
    console.log(`Sorting by ${field} ${direction}`);
  }, []);

  const handleRowClick = useCallback((record: any) => {
    console.log('Row clicked:', record);
  }, []);

  const handleFilterChange = useCallback((newFilters: FilterState) => {
    startTransition(() => {
      setFilters(newFilters);
    });
  }, []);

  const filteredSalesData = useMemo(() => {
    return salesData.filter((record) => {
      if (debouncedSearchQuery) {
        const query = debouncedSearchQuery.toLowerCase();
        const matchesSearch =
          record.product.toLowerCase().includes(query) ||
          record.category.toLowerCase().includes(query) ||
          (record.customer && record.customer.toLowerCase().includes(query));

        if (!matchesSearch) return false;
      }

      if (filters.category !== 'All' && record.category !== filters.category) {
        return false;
      }

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
  }, [salesData, debouncedSearchQuery, filters.category, filters.dateFrom, filters.dateTo]);

  // ✅ Helper function for trend direction
  const getTrend = (change: number): 'up' | 'down' => (change >= 0 ? 'up' : 'down');

  const metricsData = useMemo(() => {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    const currentPeriod = filteredSalesData.filter(r => {
      const date = new Date(r.date);
      return date >= thirtyDaysAgo && date <= now;
    });

    const previousPeriod = filteredSalesData.filter(r => {
      const date = new Date(r.date);
      return date >= sixtyDaysAgo && date < thirtyDaysAgo;
    });

    const currentRevenue = currentPeriod.reduce((sum, r) => sum + r.amount, 0);
    const previousRevenue = previousPeriod.reduce((sum, r) => sum + r.amount, 0);
    const revenueChange = previousRevenue > 0 
      ? ((currentRevenue - previousRevenue) / previousRevenue) * 100 
      : 0;

    const currentOrders = currentPeriod.length;
    const previousOrders = previousPeriod.length;
    const ordersChange = previousOrders > 0
      ? ((currentOrders - previousOrders) / previousOrders) * 100
      : 0;

    const currentAvgOrder = currentOrders > 0 ? currentRevenue / currentOrders : 0;
    const previousAvgOrder = previousOrders > 0 
      ? previousPeriod.reduce((sum, r) => sum + r.amount, 0) / previousOrders 
      : 0;
    const avgOrderChange = previousAvgOrder > 0
      ? ((currentAvgOrder - previousAvgOrder) / previousAvgOrder) * 100
      : 0;

    const currentCustomers = new Set(currentPeriod.map(r => r.customer).filter(Boolean)).size;
    const previousCustomers = new Set(previousPeriod.map(r => r.customer).filter(Boolean)).size;
    const customersChange = previousCustomers > 0
      ? ((currentCustomers - previousCustomers) / previousCustomers) * 100
      : 0;

    return [
      {
        id: 'revenue',
        title: 'Total Revenue',
        value: `$${currentRevenue.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`,
        icon: DollarSign,
        trend: getTrend(revenueChange),
        change: Math.abs(revenueChange),
        color: 'blue' as const,
        subtitle: 'vs last 30 days',
      },
      {
        id: 'orders',
        title: 'Total Orders',
        value: currentOrders.toLocaleString('en-US'),
        icon: ShoppingCart,
        trend: getTrend(ordersChange),
        change: Math.abs(ordersChange),
        color: 'green' as const,
        subtitle: 'vs last 30 days',
      },
      {
        id: 'avg-order',
        title: 'Avg Order Value',
        value: `$${currentAvgOrder.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`,
        icon: TrendingUp,
        trend: getTrend(avgOrderChange),
        change: Math.abs(avgOrderChange),
        color: 'purple' as const,
        subtitle: 'vs last 30 days',
      },
      {
        id: 'customers',
        title: 'Total Customers',
        value: currentCustomers.toLocaleString('en-US'),
        icon: Users,
        trend: getTrend(customersChange),
        change: Math.abs(customersChange),
        color: 'orange' as const,
        subtitle: 'vs last 30 days',
      },
    ];
  }, [filteredSalesData]);

  const categoryData = useMemo(() => {
    const grouped = filteredSalesData.reduce(
      (acc, sale) => {
        if (!acc[sale.category]) {
          acc[sale.category] = 0;
        }
        acc[sale.category] += sale.amount;
        return acc;
      },
      {} as Record<string, number>
    );

    const colorMap: Record<string, string> = {
      Electronics: '#3B82F6',
      Clothing: '#10B981',
      'Food & Beverage': '#F59E0B',
      'Home & Garden': '#8B5CF6',
      Sports: '#EC4899',
    };

    return Object.entries(grouped)
      .map(([name, value]) => ({
        name,
        value,
        color: colorMap[name] || '#6B7280',
      }))
      .sort((a, b) => b.value - a.value);
  }, [filteredSalesData]);

  const revenueChartData = useMemo(() => {
    switch (timeRange) {
      case 'week':
        return groupByWeek(filteredSalesData);
      case 'month':
        return groupByMonth(filteredSalesData);
      case 'quarter':
        return groupByQuarter(filteredSalesData);
      default:
        return [];
    }
  }, [filteredSalesData, timeRange]);

  return (
    <>
      {isLoading && (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center max-w-md">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto mb-4"></div>
            <p className={`text-lg font-semibold ${theme.text.primary} mb-2`}>{loadingStage}</p>
            <div className={`w-full ${theme.bg.tertiary} rounded-full h-3 overflow-hidden`}>
              <div
                className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>
            {loadingProgress > 0 && (
              <p className={`text-sm ${theme.text.tertiary} mt-2`}>{loadingProgress}% complete</p>
            )}
          </div>
        </div>
      )}

      {error && !isLoading && (
        <div className="flex items-center justify-center min-h-screen">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">❌</span>
              <h3 className="text-lg font-semibold text-red-900">Error Loading Data</h3>
            </div>
            <p className="text-sm text-red-700 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              🔄 Retry
            </button>
          </div>
        </div>
      )}

      {!isLoading && !error && (
        <div className="space-y-8">
          {isPending && (
            <div className="fixed top-20 right-4 z-50 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-slide-down">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              <span className="text-sm font-medium">Updating...</span>
            </div>
          )}

          {/* Page Header */}
          <section className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className={`text-3xl font-bold ${theme.text.primary}`}>Sales Dashboard</h1>
              <p className={`${theme.text.secondary} mt-1`}>Track your sales performance and analytics</p>
            </div>
            <div className="flex gap-3">
              <button className={`flex items-center gap-2 px-4 py-2 border ${theme.border.primary} rounded-lg ${theme.hover.bg} transition-colors`}>
                <Calendar size={16} />
                Last 30 Days
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Download size={16} />
                Export
              </button>
            </div>
          </section>

          {/* Metrics Grid */}
          <section>
            <h2 className={`text-xl font-semibold ${theme.text.primary} mb-4`}>Key Metrics</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {metricsData.map((metric) => (
                <MetricCard key={metric.id} {...metric} />
              ))}
            </div>
          </section>

          {/* Charts Section */}
          <section>
            <h2 className={`text-xl font-semibold ${theme.text.primary} mb-6`}>Analytics</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Suspense fallback={<ChartSkeleton theme={theme} />}>
                  <RevenueChart
                    data={revenueChartData}
                    timeRange={timeRange}
                    onTimeRangeChange={handleTimeRangeChange}
                  />
                </Suspense>
              </div>
              <div className="lg:col-span-1">
                <Suspense fallback={<ChartSkeleton theme={theme} />}>
                  <CategoryPieChart data={categoryData} />
                </Suspense>
              </div>
            </div>
          </section>

          {/* Sales Data Section */}
          <section>
            <h2 className={`text-xl font-semibold ${theme.text.primary} mb-6`}>Sales Data</h2>
            <p className={`text-sm ${theme.text.tertiary} mb-4`}>Filter and search sales records</p>
            <div className="space-y-4">
              <FilterBar onFilterChange={handleFilterChange} categories={categories} />
              <DataTable data={filteredSalesData} onSort={handleSort} onRowClick={handleRowClick} />
            </div>
          </section>

          {/* Recent Sales & Top Products */}
          <section>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RecentSales data={filteredSalesData} limit={5} />
              <TopProducts data={filteredSalesData} limit={5} />
            </div>
          </section>
        </div>
      )}
    </>
  );
};

const ChartSkeleton = ({ theme }: { theme: any }) => (
  <div className={`${theme.bg.card} rounded-lg shadow-sm border ${theme.border.primary} p-6 h-96 animate-pulse`}>
    <div className={`h-4 ${theme.bg.tertiary} rounded w-1/3 mb-4`}></div>
    <div className={`h-full ${theme.bg.secondary} rounded`}></div>
  </div>
);

export default Dashboard;
