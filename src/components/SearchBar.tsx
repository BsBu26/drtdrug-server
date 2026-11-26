import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  totalFiltered: number;
  onClearFilters: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  setSearchTerm,
  totalFiltered,
  onClearFilters,
}) => {
  return (
    <div className="bg-white rounded-2xl p-3 sm:p-4 border border-slate-200/80 shadow-xs mb-5 flex flex-col sm:flex-row gap-3 items-center justify-between">
      {/* Search Input Box */}
      <div className="relative w-full sm:flex-1">
        <Search className="w-4 h-4 text-teal-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Nhập tên dịch vụ y tế cần tra cứu (ví dụ: Công thức máu, Siêu âm, X-quang)..."
          className="w-full pl-9 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-all"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Clear Filter & Total Count */}
      <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end">
        <span className="text-xs text-slate-500 font-semibold bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200/60">
          Hiển thị {totalFiltered} dịch vụ
        </span>

        {searchTerm && (
          <button
            onClick={onClearFilters}
            className="text-xs text-teal-700 hover:text-teal-900 font-semibold underline ml-1 cursor-pointer"
          >
            Xóa tìm kiếm
          </button>
        )}
      </div>
    </div>
  );
};
