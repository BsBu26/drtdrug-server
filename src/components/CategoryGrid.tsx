import React from 'react';
import { CategoryType, MedicalService } from '../types';
import { CATEGORIES_CONFIG } from '../data/medicalServices';

interface CategoryGridProps {
  selectedCategory: CategoryType;
  onSelectCategory: (cat: CategoryType) => void;
  services: MedicalService[];
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({
  selectedCategory,
  onSelectCategory,
  services,
}) => {
  const getCategoryCount = (catId: CategoryType) => {
    if (catId === 'all') return services.length;
    return services.filter((s) => s.category === catId).length;
  };

  return (
    <div className="mb-5 overflow-x-auto pb-1 scrollbar-none">
      <div className="flex items-center gap-2 min-w-max">
        {CATEGORIES_CONFIG.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          const count = getCategoryCount(cat.id as CategoryType);

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id as CategoryType)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                isSelected
                  ? 'bg-teal-700 text-white border-teal-700 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-teal-300 hover:bg-slate-50'
              }`}
            >
              <span>{cat.name}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                  isSelected
                    ? 'bg-teal-800 text-teal-100'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
