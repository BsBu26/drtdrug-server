import React from 'react';
import { MedicalService } from '../types';
import { X, Plus, Check, FileText, AlertCircle } from 'lucide-react';

interface ServiceDetailModalProps {
  service: MedicalService | null;
  onClose: () => void;
  onAddToCart: (service: MedicalService) => void;
  isInCart: boolean;
}

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({
  service,
  onClose,
  onAddToCart,
  isInCart,
}) => {
  if (!service) return null;

  const formatCurrency = (amount: number) => {
    if (amount === 0) return 'Miễn phí';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const qrValue = encodeURIComponent(
    `https://y-te.mochoa.gov.vn/dich-vu/${service.id}`
  );
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${qrValue}&color=0f766e`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 relative overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <span className="text-xs font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-100 inline-block mb-1">
              {service.categoryName}
            </span>
            <h2 className="text-lg font-bold text-slate-900 leading-snug">
              {service.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="py-4 space-y-4 overflow-y-auto flex-1 pr-1">
          {/* Price Box */}
          <div className="bg-gradient-to-r from-teal-700 to-teal-800 text-white rounded-2xl p-4 shadow-sm flex items-center justify-between gap-3">
            <div className="min-w-0">
              <span className="text-xs text-teal-100 uppercase font-bold tracking-wider block">
                Đơn giá dịch vụ
              </span>
              <span className="text-xl sm:text-2xl font-black">{formatCurrency(service.priceService)}</span>
            </div>
            <div className="text-right shrink-0">
              <span className="text-[11px] sm:text-xs bg-white/20 text-white px-2.5 py-1 rounded-full font-semibold whitespace-nowrap inline-block">
                Niêm yết công khai
              </span>
            </div>
          </div>

          {/* Prep Instructions */}
          {service.prepInstructions && (
            <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200/60">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wider mb-1">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Hướng dẫn chuẩn bị cho bệnh nhân</span>
              </div>
              <p className="text-sm text-amber-950 font-medium leading-relaxed pl-6">
                {service.prepInstructions}
              </p>
            </div>
          )}

          {/* Service Description */}
          {service.description && (
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/60">
              <div className="flex items-center gap-2 text-slate-700 font-bold text-xs uppercase tracking-wider mb-1">
                <FileText className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Thông tin mô tả dịch vụ</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed pl-6">
                {service.description}
              </p>
            </div>
          )}

          {/* QR Code Section */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/60 flex items-center gap-4">
            <img
              src={qrImageUrl}
              alt="Mã QR tra cứu"
              className="w-20 h-20 rounded-xl border border-slate-200 bg-white p-1"
            />
            <div>
              <h4 className="font-bold text-xs text-slate-900">Mã QR Tra Cứu Nhanh</h4>
              <p className="text-[11px] text-slate-500 mt-1">
                Quét mã để lưu lại hoặc chia sẻ thông tin giá dịch vụ này trên thiết bị di động.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            Đóng
          </button>
          <button
            onClick={() => {
              onAddToCart(service);
            }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              isInCart
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-teal-700 hover:bg-teal-800 text-white shadow-xs'
            }`}
          >
            {isInCart ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            <span>{isInCart ? 'Đã thêm vào bảng dự toán' : 'Thêm vào dự toán chi phí'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
