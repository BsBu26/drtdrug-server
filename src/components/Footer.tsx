import React from 'react';
import { CENTER_INFO } from '../data/medicalServices';
import { MapPin, Phone, ShieldCheck, QrCode } from 'lucide-react';
import { Logo } from './Logo';

interface FooterProps {
  onOpenQrModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenQrModal }) => {
  return (
    <footer className="bg-white border-t border-slate-200/80 py-8 text-slate-600 text-xs">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Logo size="md" />
          <div>
            <h3 className="font-bold text-slate-900 text-sm">{CENTER_INFO.name}</h3>
            <div className="flex items-center gap-3 mt-1 text-slate-500">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-teal-600" />
                {CENTER_INFO.address}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-teal-600" />
                {CENTER_INFO.hotline}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={onOpenQrModal}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors cursor-pointer"
          >
            <QrCode className="w-3.5 h-3.5 text-teal-700" />
            <span>Mã QR In Ấn</span>
          </button>

          <span className="flex items-center gap-1 text-emerald-700 font-semibold">
            <ShieldCheck className="w-4 h-4" />
            Công Khai Minh Bạch 100%
          </span>
        </div>
      </div>
    </footer>
  );
};
