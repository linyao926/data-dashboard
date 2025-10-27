import type { SaleRecord } from '../types';

interface ChartDataPoint {
  date: string;
  revenue: number;
  label: string;
}

// Get week number of year (ISO 8601)
const getWeekNumber = (date: Date): number => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
};

// Get quarter from date
const getQuarter = (date: Date): string => {
  const month = date.getMonth(); // 0-11
  const quarter = Math.floor(month / 3) + 1; // 1-4
  return `Q${quarter} ${date.getFullYear()}`;
};

// Group by Week (7 days, starting Sunday)
export const groupByWeek = (data: SaleRecord[]): ChartDataPoint[] => {
  const grouped: Record<string, { revenue: number; startDate: Date }> = {};

  data.forEach((sale) => {
    const date = new Date(sale.date);

    // Get week start (Sunday)
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay());
    weekStart.setHours(0, 0, 0, 0);

    // Use week start as key
    const key = weekStart.toISOString().split('T')[0];

    if (!grouped[key]) {
      grouped[key] = { revenue: 0, startDate: weekStart };
    }
    grouped[key].revenue += sale.amount;
  });

  // Convert to array and sort
  return Object.entries(grouped)
    .map(([key, { revenue, startDate }]) => ({
      date: startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      revenue,
      label: `Week of ${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
    }))
    .sort((a, b) => {
      // Sort by actual date
      const dateA = new Date(a.label.replace('Week of ', ''));
      const dateB = new Date(b.label.replace('Week of ', ''));
      return dateA.getTime() - dateB.getTime();
    });
};

// Group by Month (all 12 months, even if 0)
export const groupByMonth = (data: SaleRecord[]): ChartDataPoint[] => {
  const grouped: Record<string, number> = {};

  // Get date range from data
  const dates = data.map((r) => new Date(r.date).getTime());
  const minDate = new Date(Math.min(...dates));
  const maxDate = new Date(Math.max(...dates));

  // Initialize all months in range with 0
  const current = new Date(minDate.getFullYear(), minDate.getMonth(), 1);
  const end = new Date(maxDate.getFullYear(), maxDate.getMonth(), 1);

  while (current <= end) {
    const key = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}`;
    grouped[key] = 0;
    current.setMonth(current.getMonth() + 1);
  }

  // Add actual revenue
  data.forEach((sale) => {
    const date = new Date(sale.date);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

    if (grouped[key] !== undefined) {
      grouped[key] += sale.amount;
    }
  });

  // Convert to array
  return Object.entries(grouped)
    .map(([key, revenue]) => {
      const [year, month] = key.split('-');
      const date = new Date(parseInt(year), parseInt(month) - 1, 1);

      return {
        date: date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' }),
        revenue,
        label: date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' }),
      };
    })
    .sort((a, b) => {
      const dateA = new Date(a.label);
      const dateB = new Date(b.label);
      return dateA.getTime() - dateB.getTime();
    });
};

// Group by Quarter (Q1, Q2, Q3, Q4)
export const groupByQuarter = (data: SaleRecord[]): ChartDataPoint[] => {
  const grouped: Record<string, number> = {};

  data.forEach((sale) => {
    const date = new Date(sale.date);
    const key = getQuarter(date);

    if (!grouped[key]) {
      grouped[key] = 0;
    }
    grouped[key] += sale.amount;
  });

  // Convert to array and sort
  return Object.entries(grouped)
    .map(([key, revenue]) => ({
      date: key,
      revenue,
      label: key,
    }))
    .sort((a, b) => {
      // Sort by year then quarter
      const [qA, yearA] = a.date.split(' ');
      const [qB, yearB] = b.date.split(' ');

      if (yearA !== yearB) {
        return parseInt(yearA) - parseInt(yearB);
      }

      return qA.localeCompare(qB);
    });
};