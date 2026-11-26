import React from 'react';
import { QrCode, Calculator, PhoneCall, Settings } from 'lucide-react';
import { CENTER_INFO } from '../data/medicalServices';
import { Logo } from './Logo';

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenQrModal: () => void;
  onOpenAdminModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  onOpenCart,
  onOpenQrModal,
  onOpenAdminModal,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      {/* Top emergency strip */}
      <div className="bg-teal-800 text-white py-1 px-3 sm:px-4">
        <div className="max-w-6xl mx-auto flex flex-wrap sm:flex-nowrap justify-between items-center gap-x-2 gap-y-0.5">
          <span className="font-semibold text-teal-100 text-[10px] sm:text-xs whitespace-nowrap">
            {CENTER_INFO.name}
          </span>
          <a
            href={`tel:${CENTER_INFO.emergency}`}
            className="flex items-center gap-1 text-amber-300 font-semibold hover:underline text-[10px] sm:text-xs whitespace-nowrap ml-auto"
          >
            <PhoneCall className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span>Cấp cứu 24/7: {CENTER_INFO.emergency}</span>
          </a>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-6xl mx-auto px-4 py-3.5 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={onOpenQrModal}>
          <Logo size="md" />
          <div>
            <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
              QR Y TẾ MỘC HÓA
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Tra cứu dịch vụ cận lâm sàng
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenQrModal}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            <QrCode className="w-4 h-4 text-teal-700" />
            <span>Mã QR Tra Cứu</span>
          </button>

          <button
            onClick={onOpenCart}
            className="relative flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-xl shadow-sm transition-all"
          >
            <Calculator className="w-4 h-4" />
            <span>Dự toán giá</span>
            {cartCount > 0 && (
              <span className="bg-emerald-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full ml-0.5">
                {cartCount}
              </span>
            )}
          </button>

          <button
            onClick={onOpenAdminModal}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
            title="Cập nhật bảng giá"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
