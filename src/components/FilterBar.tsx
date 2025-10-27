import React, { useState } from 'react';
import { Card, Button, Badge, Input } from '@/components/common';

export interface FilterState {
  searchQuery: string;
  category: string;
  dateFrom: string;
  dateTo: string;
}

interface FilterBarProps {
  onFilterChange?: (filters: FilterState) => void;
  categories?: string[];
}

const FilterBar: React.FC<FilterBarProps> = ({
  onFilterChange,
  categories = ['All', 'Electronics', 'Clothing', 'Food & Beverage', 'Home & Garden', 'Sports'],
}) => {
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    category: 'All',
    dateFrom: '',
    dateTo: '',
  });

  // Count active filters
  const activeFilterCount = [
    filters.searchQuery,
    filters.category !== 'All' ? filters.category : '',
    filters.dateFrom,
    filters.dateTo,
  ].filter(Boolean).length;

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters: FilterState = {
      searchQuery: '',
      category: 'All',
      dateFrom: '',
      dateTo: '',
    };
    setFilters(clearedFilters);
    onFilterChange?.(clearedFilters);
  };

  return (
    <Card variant="default" padding="md" className="mb-6">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1">
          <Input
            label="Search"
            type="text"
            placeholder="Search products, categories, customers..."
            value={filters.searchQuery}
            onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
            leftIcon={<span className="text-gray-400">🔍</span>}
            fullWidth
          />
        </div>

        {/* Category Dropdown */}
        <div className="w-full lg:w-48">
          <Input.Select
            label="Category"
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            options={categories.map((cat) => ({ value: cat, label: cat }))}
            fullWidth
          />
        </div>

        {/* Date From */}
        <div className="w-full lg:w-44">
          <Input
            label="From Date"
            type="date"
            value={filters.dateFrom}
            onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
            fullWidth
          />
        </div>

        {/* Date To */}
        <div className="w-full lg:w-44">
          <Input
            label="To Date"
            type="date"
            value={filters.dateTo}
            onChange={(e) => handleFilterChange('dateTo', e.target.value)}
            fullWidth
          />
        </div>

        {/* Clear Filters Button */}
        <div className="flex items-end">
          <Button
            variant="secondary"
            size="md"
            onClick={handleClearFilters}
            disabled={activeFilterCount === 0}
            leftIcon={<span>✖️</span>}
            rightIcon={
              activeFilterCount > 0 ? (
                <Badge.Count count={activeFilterCount} variant="primary" />
              ) : undefined
            }
          >
            Clear
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default React.memo(FilterBar);
