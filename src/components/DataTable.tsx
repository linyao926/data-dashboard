import React, { useState, useMemo } from 'react';
import { Card, Badge, Button, Input } from '@/components/common';

// Types
interface SaleRecord {
  id: string;
  product: string;
  category: string;
  date: string;
  quantity: number;
  price: number;
  amount: number;
  customer?: string;
}

type SortField = keyof SaleRecord;
type SortDirection = 'asc' | 'desc';

interface DataTableProps {
  data?: SaleRecord[];
  onSort?: (field: SortField, direction: SortDirection) => void;
  onRowClick?: (record: SaleRecord) => void;
}

const DataTable: React.FC<DataTableProps> = ({ data = [], onSort, onRowClick }) => {
  // State
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Sorted data
  const sortedData = useMemo(() => {
    const sorted = [...data].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];

      // Handle different types
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }

      return 0;
    });

    return sorted;
  }, [data, sortField, sortDirection]);

  // Paginated data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return sortedData.slice(startIndex, endIndex);
  }, [sortedData, currentPage, rowsPerPage]);

  // Calculate total pages
  const totalPages = Math.ceil(sortedData.length / rowsPerPage);

  // Handle sort
  const handleSort = (field: SortField) => {
    const newDirection = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';

    setSortField(field);
    setSortDirection(newDirection);
    onSort?.(field, newDirection);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  // Handle rows per page change
  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  // Column definitions
  const columns: Array<{
    field: SortField;
    label: string;
    format?: (value: any) => string;
    align?: 'left' | 'right' | 'center';
  }> = [
    { field: 'product', label: 'Product', align: 'left' },
    { field: 'category', label: 'Category', align: 'left' },
    {
      field: 'date',
      label: 'Date',
      align: 'left',
      format: (val) =>
        new Date(val).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
    },
    { field: 'quantity', label: 'Qty', align: 'right' },
    {
      field: 'price',
      label: 'Price',
      align: 'right',
      format: (val) => `$${val.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
    },
    {
      field: 'amount',
      label: 'Total',
      align: 'right',
      format: (val) => `$${val.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
    },
  ];

  // Render sort icon
  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <span className="text-gray-400 text-xs">↕</span>;
    }
    return sortDirection === 'asc' ? (
      <span className="text-blue-600 text-xs">↑</span>
    ) : (
      <span className="text-blue-600 text-xs">↓</span>
    );
  };

  return (
    <Card variant="default" padding="none">
      {/* Header */}
      <Card.Header className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <Card.Title>Sales Records</Card.Title>
            <Card.Description>{sortedData.length} total transactions</Card.Description>
          </div>

          {/* Rows per page */}
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Show:</label>
            <Input.Select
              value={rowsPerPage}
              onChange={handleRowsPerPageChange}
              options={[
                { value: '10', label: '10' },
                { value: '25', label: '25' },
                { value: '50', label: '50' },
                { value: '100', label: '100' },
              ]}
              className="w-20"
            />
          </div>
        </div>
      </Card.Header>

      {/* Table */}
      <Card.Content className="overflow-x-auto p-0">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.field}
                  onClick={() => handleSort(col.field)}
                  className={`px-6 py-3 text-${col.align || 'left'} text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors select-none`}
                >
                  <div
                    className={`flex items-center gap-2 ${col.align === 'right' ? 'justify-end' : col.align === 'center' ? 'justify-center' : 'justify-start'}`}
                  >
                    <span>{col.label}</span>
                    {renderSortIcon(col.field)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center">
                  <div className="text-gray-400">
                    <p className="text-4xl mb-2">📊</p>
                    <p className="text-sm">No sales data available</p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedData.map((row, index) => (
                <tr
                  key={row.id}
                  onClick={() => onRowClick?.(row)}
                  className={`
                    ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                    hover:bg-blue-50 transition-colors
                    ${onRowClick ? 'cursor-pointer' : ''}
                  `}
                >
                  {columns.map((col) => {
                    const value = row[col.field];
                    const displayValue = col.format ? col.format(value) : value;

                    return (
                      <td
                        key={col.field}
                        className={`px-6 py-4 whitespace-nowrap text-sm text-${col.align === 'right' ? 'right' : 'left'}`}
                      >
                        {col.field === 'product' ? (
                          <div className="font-medium text-gray-900">{displayValue}</div>
                        ) : col.field === 'category' ? (
                          <Badge variant="primary" size="sm">
                            {displayValue}
                          </Badge>
                        ) : (
                          <span className="text-gray-600">{displayValue}</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card.Content>

      {/* Pagination */}
      {totalPages > 1 && (
        <Card.Footer className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {(currentPage - 1) * rowsPerPage + 1} to{' '}
            {Math.min(currentPage * rowsPerPage, sortedData.length)} of {sortedData.length} results
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => handlePageChange(pageNum)}
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </Card.Footer>
      )}
    </Card>
  );
};

export default React.memo(DataTable);