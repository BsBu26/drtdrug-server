import React from 'react';
import { X, QrCode, Printer, Share2, Check } from 'lucide-react';
import { CENTER_INFO } from '../data/medicalServices';
import { Logo } from './Logo';

interface QrCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QrCodeModal: React.FC<QrCodeModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const currentAppUrl = window.location.href;
  const qrPosterUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
    currentAppUrl
  )}`;

  const handlePrintPoster = () => {
    window.print();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentAppUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-900 to-emerald-800 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-emerald-300" />
            <h2 className="font-bold text-base sm:text-lg">Mã QR Y Tế Điện Tử Mộc Hóa</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-teal-200 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Poster Design Card */}
        <div className="p-6 text-center space-y-4">
          <div className="border-2 border-dashed border-teal-300 bg-teal-50/50 p-6 rounded-3xl shadow-inner inline-block max-w-sm w-full mx-auto">
            
            <div className="flex items-center justify-center gap-2 mb-2 text-teal-900 font-extrabold text-xs uppercase tracking-wider">
              <Logo size="sm" />
              <span>{CENTER_INFO.name}</span>
            </div>

            <h3 className="font-black text-slate-900 text-xs sm:text-sm md:text-base leading-snug uppercase tracking-tight whitespace-normal sm:whitespace-nowrap">
              MÃ QR TRA CỨU DỊCH VỤ CẬN LÂM SÀNG
            </h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              Quét bằng Zalo hoặc Camera điện thoại để tra cứu ngay
            </p>

            <div className="bg-white p-4 rounded-2xl shadow-md border border-slate-200 inline-block my-1">
              <img
                src={qrPosterUrl}
                alt="Medical QR Code"
                className="w-52 h-52 mx-auto object-contain"
              />
            </div>

          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl border border-slate-300 transition-all"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
              <span>{copied ? 'Đã chép link' : 'Sao chép link'}</span>
            </button>

            <button
              onClick={handlePrintPoster}
              className="flex items-center gap-1.5 py-2.5 px-5 bg-teal-800 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-md transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>In Poster QR</span>
            </button>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 text-center">
          <button
            onClick={onClose}
            className="text-xs text-slate-500 hover:text-slate-800 font-semibold"
          >
            Đóng cửa sổ
          </button>
        </div>

      </div>
    </div>
  );
};
