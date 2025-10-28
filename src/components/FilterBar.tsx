import React, { useState } from 'react';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Card, Button, Badge, Input } from '@/components/common';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

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

  // Date states for Calendar
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();

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

  // Handle date from calendar
  const handleDateFromChange = (date: Date | undefined) => {
    setDateFrom(date);
    const dateString = date ? format(date, 'yyyy-MM-dd') : '';
    handleFilterChange('dateFrom', dateString);
  };

  const handleDateToChange = (date: Date | undefined) => {
    setDateTo(date);
    const dateString = date ? format(date, 'yyyy-MM-dd') : '';
    handleFilterChange('dateTo', dateString);
  };

  const handleClearFilters = () => {
    const clearedFilters: FilterState = {
      searchQuery: '',
      category: 'All',
      dateFrom: '',
      dateTo: '',
    };
    setFilters(clearedFilters);
    setDateFrom(undefined);
    setDateTo(undefined);
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

        {/* Date From - Calendar Popover */}
        <div className="w-full lg:w-44">
          <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateFrom ? format(dateFrom, 'MMM dd, yyyy') : 'Pick a date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dateFrom}
                onSelect={handleDateFromChange}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Date To - Calendar Popover */}
        <div className="w-full lg:w-44">
          <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateTo ? format(dateTo, 'MMM dd, yyyy') : 'Pick a date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dateTo}
                onSelect={handleDateToChange}
                initialFocus
                disabled={(date) => (dateFrom ? date < dateFrom : false)}
              />
            </PopoverContent>
          </Popover>
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

export default FilterBar;
