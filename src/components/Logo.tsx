import React from 'react';
import logoImg from '../assets/logo.png';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-11 h-11 sm:w-12 sm:h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 rounded-full bg-white shadow-2xs overflow-hidden ${sizeClasses[size]} ${className}`}
      title="Logo Trung Tâm Y Tế Khu Vực Mộc Hóa"
    >
      <img
        src={logoImg}
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src = '/logo.png';
        }}
        alt="Logo Trung Tâm Y Tế Khu Vực Mộc Hóa"
        className="w-full h-full object-contain"
        loading="eager"
        referrerPolicy="no-referrer"
      />
    </div>
  );
};
