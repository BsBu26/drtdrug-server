import React from 'react';
import { SelectedServiceItem } from '../types';
import { X, Trash2, Plus, Minus, Calculator } from 'lucide-react';
import { CENTER_INFO } from '../data/medicalServices';

interface CostEstimatorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: SelectedServiceItem[];
  onRemoveFromCart: (id: string) => void;
  onUpdateQuantity: (id: string, qty: number) => void;
  onClearCart: () => void;
}

export const CostEstimatorDrawer: React.FC<CostEstimatorDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onRemoveFromCart,
  onUpdateQuantity,
  onClearCart,
}) => {
  if (!isOpen) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const grandTotal = cartItems.reduce(
    (acc, item) => acc + item.service.priceService * item.quantity,
    0
  );

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md h-full flex flex-col shadow-2xl relative border-l border-slate-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-teal-800 text-white">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/10 rounded-xl">
              <Calculator className="w-5 h-5 text-teal-200" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">Dự Toán Chi Phí</h3>
              <p className="text-xs text-teal-200">
                {cartItems.length} dịch vụ đã chọn
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-teal-200 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Item List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <Calculator className="w-12 h-12 stroke-1 mb-3 text-slate-300" />
              <p className="text-slate-700 font-bold text-sm">Chưa có dịch vụ nào</p>
              <p className="text-xs text-slate-400 mt-1">
                Bấm "Dự toán" hoặc "Thêm dự toán" ở danh sách dịch vụ để tính tổng chi phí dự kiến.
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-xs">
                <span className="font-semibold text-slate-500">Danh sách dịch vụ chọn</span>
                <button
                  onClick={onClearCart}
                  className="text-red-600 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Xóa tất cả
                </button>
              </div>

              {cartItems.map((item) => {
                const itemTotal = item.service.priceService * item.quantity;

                return (
                  <div
                    key={item.service.id}
                    className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-bold text-slate-900 text-xs leading-snug">
                        {item.service.name}
                      </h4>
                      <button
                        onClick={() => onRemoveFromCart(item.service.id)}
                        className="text-slate-400 hover:text-red-600 p-1"
                        title="Bỏ chọn"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      {/* Quantity Controller */}
                      <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-0.5">
                        <button
                          onClick={() => onUpdateQuantity(item.service.id, item.quantity - 1)}
                          className="p-1 text-slate-500 hover:bg-slate-100 rounded-md"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-bold text-slate-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.service.id, item.quantity + 1)}
                          className="p-1 text-slate-500 hover:bg-slate-100 rounded-md"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Item Total */}
                      <div className="text-right">
                        <span className="font-extrabold text-teal-800 text-sm">
                          {formatCurrency(itemTotal)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>

        {/* Total Summary Footer */}
        {cartItems.length > 0 && (
          <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-3">
            <div className="p-3.5 bg-teal-900 text-white rounded-2xl flex items-center justify-between shadow-xs">
              <div>
                <span className="text-[11px] text-teal-200 uppercase font-bold tracking-wider block">
                  Tổng chi phí dự kiến
                </span>
                <span className="text-xs text-teal-300">({cartItems.length} dịch vụ)</span>
              </div>
              <span className="text-xl font-black text-white">{formatCurrency(grandTotal)}</span>
            </div>

            <p className="text-[10px] text-slate-500 text-center italic">
              * Bảng dự toán dùng để tham khảo chi phí. {CENTER_INFO.name}.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
