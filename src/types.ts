export type CategoryType = 'all' | 'xat-nghiem' | 'chan-doan-hinh-anh' | 'tham-do-chuc-nang' | 'phau-thuat-thu-thuat' | 'kham-benh';

export interface MedicalService {
  id: string;
  code: string;
  name: string;
  category: CategoryType;
  categoryName: string;
  priceBHYT: number; // Price with Health Insurance
  priceService: number; // Full Service Price
  bhytCoveragePercent: number; // e.g. 80, 100, 0
  room: string; // e.g. "Phòng 102 - Tầng 1"
  estimatedTime: string; // e.g. "15-30 phút"
  prepInstructions?: string; // e.g. "Nhịn ăn sáng ít nhất 6 tiếng", "Uống nhiều nước, nhịn tiểu"
  description?: string;
  isPopular?: boolean;
}

export interface SelectedServiceItem {
  service: MedicalService;
  quantity: number;
  hasBHYT: boolean;
}
