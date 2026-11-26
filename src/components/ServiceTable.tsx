import React from 'react';
import { MedicalService } from '../types';
import { Info, Plus, Check, Sparkles } from 'lucide-react';

interface ServiceTableProps {
  services: MedicalService[];
  onSelectService: (service: MedicalService) => void;
  onAddToCart: (service: MedicalService) => void;
  onOpenQrForService?: (service: MedicalService) => void;
  cartServiceIds: string[];
}

export const ServiceTable: React.FC<ServiceTableProps> = ({
  services,
  onSelectService,
  onAddToCart,
  onOpenQrForService,
  cartServiceIds,
}) => {
  const formatCurrency = (amount: number) => {
    if (amount === 0) return 'Miễn phí';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  if (services.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-10 text-center border border-slate-200 my-6 shadow-xs">
        <div className="w-12 h-12 bg-teal-50 text-teal-700 rounded-full flex items-center justify-center mx-auto mb-3">
          <Sparkles className="w-6 h-6" />
        </div>
        <p className="text-slate-800 font-bold text-base">Không tìm thấy dịch vụ y tế phù hợp</p>
        <p className="text-slate-500 text-xs mt-1">
          Vui lòng thử từ khóa khác hoặc bấm chọn danh mục khác.
        </p>
      </div>
    );
  }

  // Card Grid View
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      {services.map((service) => {
        const isInCart = cartServiceIds.includes(service.id);

        return (
          <div
            key={service.id}
            className="bg-white rounded-2xl border border-slate-200/90 p-5 flex flex-col justify-between hover:border-teal-400 hover:shadow-md transition-all duration-200 group relative"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[11px] font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-100">
                  {service.categoryName}
                </span>
              </div>

              <h3
                onClick={() => onSelectService(service)}
                className="font-bold text-slate-900 text-base group-hover:text-teal-700 cursor-pointer transition-colors leading-snug line-clamp-2"
              >
                {service.name}
              </h3>

              {service.prepInstructions && (
                <div className="mt-3 text-xs text-amber-900 bg-amber-50/90 p-2.5 rounded-xl border border-amber-200/60 leading-relaxed">
                  <span className="font-bold text-amber-900">Lưu ý chuẩn bị:</span> {service.prepInstructions}
                </div>
              )}
            </div>

            {/* Price & Action Footer */}
            <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-2">
              <div>
                <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-400 block">
                  Đơn giá dịch vụ
                </span>
                <span className="font-extrabold text-teal-800 text-base">
                  {formatCurrency(service.priceService)}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onSelectService(service)}
                  className="p-2 text-slate-400 hover:text-teal-700 hover:bg-teal-50 rounded-xl transition-colors cursor-pointer"
                  title="Chi tiết"
                >
                  <Info className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onAddToCart(service)}
                  className={`flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl transition-all cursor-pointer ${
                    isInCart
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200/60'
                  }`}
                >
                  {isInCart ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                  <span>{isInCart ? 'Đã chọn' : 'Thêm dự toán'}</span>
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
