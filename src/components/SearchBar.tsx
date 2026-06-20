import { Search, X, Filter } from 'lucide-react';
import { CATEGORIES, READING_STATUS_LABELS } from '@/types';
import type { ReadingStatus } from '@/types';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedStatus: ReadingStatus | '';
  onStatusChange: (status: ReadingStatus | '') => void;
  totalBooks: number;
  filteredBooks: number;
}

export default function SearchBar({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedStatus,
  onStatusChange,
  totalBooks,
  filteredBooks
}: SearchBarProps) {
  const hasFilters = searchQuery || selectedCategory || selectedStatus;

  const clearFilters = () => {
    onSearchChange('');
    onCategoryChange('');
    onStatusChange('');
  };

  return (
    <div className="mb-6 animate-fade-in">
      <div className="flex flex-col lg:flex-row gap-4 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brown-400" />
          <input
            type="text"
            placeholder="搜索书名或作者..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="input-field pl-12"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brown-400 hover:text-brown-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex gap-3">
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="input-field min-w-[140px] appearance-none bg-no-repeat bg-right cursor-pointer"
            style={{
              backgroundImage:
                'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%23A67B5B\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\' /%3E%3C/svg%3E")',
              backgroundSize: '20px',
              backgroundPosition: 'right 10px center',
              paddingRight: '40px'
            }}
          >
            <option value="">全部分类</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value as ReadingStatus | '')}
            className="input-field min-w-[120px] appearance-none bg-no-repeat bg-right cursor-pointer"
            style={{
              backgroundImage:
                'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%23A67B5B\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\' /%3E%3C/svg%3E")',
              backgroundSize: '20px',
              backgroundPosition: 'right 10px center',
              paddingRight: '40px'
            }}
          >
            <option value="">全部状态</option>
            {(Object.keys(READING_STATUS_LABELS) as ReadingStatus[]).map((status) => (
              <option key={status} value={status}>
                {READING_STATUS_LABELS[status]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-brown-600">
          <Filter className="w-4 h-4" />
          <span className="text-sm">
            共 <span className="font-semibold text-brown-800">{totalBooks}</span> 本图书
            {hasFilters && (
              <>
                {' '}
                · 筛选后{' '}
                <span className="font-semibold text-forest-600">{filteredBooks}</span> 本
              </>
            )}
          </span>
        </div>

        {hasFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-terracotta-600 hover:text-terracotta-700 font-medium flex items-center gap-1 transition-colors"
          >
            <X className="w-3 h-3" />
            清除筛选
          </button>
        )}
      </div>
    </div>
  );
}
