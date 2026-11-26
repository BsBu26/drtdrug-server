import * as XLSX from 'xlsx';
import { CategoryType, MedicalService } from '../types';
import { CATEGORIES_CONFIG } from '../data/medicalServices';

// Helper to normalize strings for comparison
const normalizeStr = (str: string = '') =>
  str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .trim();

// Map text category to CategoryType
export const mapToCategoryType = (categoryText: string, serviceName: string = ''): { category: CategoryType; categoryName: string } => {
  const normCat = normalizeStr(categoryText);
  const normName = normalizeStr(serviceName);
  const combined = `${normCat} ${normName}`;

  if (normCat.includes('xet nghiem') || normCat.includes('xn') || normCat.includes('sinh hoa') || normCat.includes('huyet hoc') || normCat.includes('vi sinh') || (!categoryText && (normName.includes('xet nghiem') || normName.includes('dinh luong') || normName.includes('mau') || normName.includes('nuoc tieu')))) {
    return { category: 'xat-nghiem', categoryName: 'Xét nghiệm' };
  }

  if (normCat.includes('chan doan hinh anh') || normCat.includes('cdha') || normCat.includes('sieu am') || normCat.includes('x-quang') || normCat.includes('xquang') || normCat.includes('ct') || (!categoryText && (normName.includes('sieu am') || normName.includes('chup x-quang') || normName.includes('chup xquang') || normName.includes('chup ct')))) {
    return { category: 'chan-doan-hinh-anh', categoryName: 'Chẩn đoán hình ảnh' };
  }

  if (normCat.includes('tham do chuc nang') || normCat.includes('tdcn') || normCat.includes('dien tim') || normCat.includes('noi soi') || (!categoryText && (normName.includes('dien tim') || normName.includes('ecg') || normName.includes('dien nao') || normName.includes('noi soi')))) {
    return { category: 'tham-do-chuc-nang', categoryName: 'Thăm dò chức năng' };
  }

  if (normCat.includes('phau thuat') || normCat.includes('thu thuat') || normCat.includes('pttt') || normCat.includes('tieu phau') || (!categoryText && (normName.includes('phau thuat') || normName.includes('thu thuat') || normName.includes('khau vet thuong') || normName.includes('bo bot')))) {
    return { category: 'phau-thuat-thu-thuat', categoryName: 'Phẫu thuật - Thủ thuật' };
  }

  if (normCat.includes('kham') || normCat.includes('kham benh') || (!categoryText && normName.includes('kham'))) {
    return { category: 'kham-benh', categoryName: 'Khám bệnh' };
  }

  // Default to CDHA if ambiguous
  return { category: 'chan-doan-hinh-anh', categoryName: 'Chẩn đoán hình ảnh' };
};

// Parse numeric price from any format (45.000, 45,000, 45000, "45.000 đ")
export const parsePrice = (val: any): number => {
  if (typeof val === 'number') return Math.max(0, Math.round(val));
  if (!val) return 0;
  const str = String(val)
    .replace(/[^\d.,]/g, '')
    .replace(/\./g, '')
    .replace(/,/g, '');
  const num = parseInt(str, 10);
  return isNaN(num) ? 0 : Math.max(0, num);
};

// Parse Excel file from ArrayBuffer
export const parseExcelFile = async (file: File): Promise<{ services: MedicalService[]; errors: string[] }> => {
  const data = await file.arrayBuffer();
  const workbook = XLSX.read(data, { type: 'array' });
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];

  // Convert to JSON array of objects
  const rawRows: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
  const parsedServices: MedicalService[] = [];
  const errors: string[] = [];

  if (rawRows.length === 0) {
    errors.push('Tệp Excel không có dữ liệu dòng nào.');
    return { services: [], errors };
  }

  rawRows.forEach((row, index) => {
    const rowNum = index + 2; // considering 1-based and header row

    // Find keys flexibly
    const keys = Object.keys(row);
    const getVal = (...keywords: string[]) => {
      for (const kw of keywords) {
        const normKw = normalizeStr(kw);
        for (const k of keys) {
          if (normalizeStr(k).includes(normKw)) {
            return String(row[k]).trim();
          }
        }
      }
      return '';
    };

    const name = getVal('ten dich vu', 'ten dv', 'ten ky thuat', 'dich vu', 'ten');
    if (!name) {
      // Skip empty row or row without service name
      return;
    }

    const rawCode = getVal('ma dich vu', 'ma dv', 'ma so', 'ma tuong duong', 'code', 'ma');
    const code = rawCode || `MH-${Math.floor(1000 + Math.random() * 9000)}`;

    const rawCategory = getVal('nhom', 'phan loai', 'chuyen khoa', 'loai', 'category');
    const { category, categoryName } = mapToCategoryType(rawCategory, name);

    const priceServiceRaw = getVal('gia vien phi', 'gia dich vu', 'don gia', 'gia thu', 'gia');
    const priceService = parsePrice(priceServiceRaw) || 50000;

    const priceBHYTRaw = getVal('gia bhyt', 'bao hiem', 'bhyt');
    const priceBHYT = priceBHYTRaw ? parsePrice(priceBHYTRaw) : priceService;

    const room = getVal('phong', 'noi thuc hien', 'dia diem', 'phong thuc hien') || 'Khu khám bệnh & Cận lâm sàng';
    const estimatedTime = getVal('thoi gian', 'uoc tinh', 'thoi gian thuc hien') || '15 - 30 phút';
    const prepInstructions = getVal('luu y', 'chuan bi', 'huong dan', 'ghi chu') || undefined;
    const description = getVal('mo ta', 'chi tiet', 'dien giai') || undefined;

    parsedServices.push({
      id: `imp-${Date.now()}-${index}`,
      code,
      name,
      category,
      categoryName,
      priceBHYT,
      priceService,
      bhytCoveragePercent: 80,
      room,
      estimatedTime,
      prepInstructions,
      description,
      isPopular: false,
    });
  });

  if (parsedServices.length === 0) {
    errors.push('Không tìm thấy cột "Tên dịch vụ" hợp lệ trong tệp Excel. Vui lòng kiểm tra lại tiêu đề cột.');
  }

  return { services: parsedServices, errors };
};

// Export services to Excel
export const exportServicesToExcel = (services: MedicalService[], fileName = 'Bang_Gia_Dich_Vu_TTYTMocHoa.xlsx') => {
  const exportData = services.map((s, idx) => ({
    'STT': idx + 1,
    'Mã dịch vụ': s.code || '',
    'Tên dịch vụ kỹ thuật': s.name,
    'Nhóm / Phân loại': s.categoryName,
    'Giá viện phí / Dịch vụ (VNĐ)': s.priceService,
    'Giá BHYT chi trả (VNĐ)': s.priceBHYT,
    'Phòng thực hiện': s.room || '',
    'Thời gian ước tính': s.estimatedTime || '',
    'Lưu ý chuẩn bị bệnh nhân': s.prepInstructions || '',
    'Mô tả chi tiết': s.description || '',
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  
  // Set custom column widths
  worksheet['!cols'] = [
    { wch: 6 },  // STT
    { wch: 14 }, // Mã
    { wch: 45 }, // Tên
    { wch: 22 }, // Nhóm
    { wch: 20 }, // Giá VP
    { wch: 20 }, // Giá BHYT
    { wch: 28 }, // Phòng
    { wch: 18 }, // Thời gian
    { wch: 40 }, // Lưu ý
    { wch: 35 }, // Mô tả
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Bảng Giá Dịch Vụ');
  XLSX.writeFile(workbook, fileName);
};

// Download Sample Template for Staff
export const downloadSampleExcelTemplate = () => {
  const sampleData = [
    {
      'STT': 1,
      'Mã dịch vụ': '37.101',
      'Tên dịch vụ kỹ thuật': 'Tổng phân tích tế bào máu ngoại vi (bằng máy đếm laser - 32 thông số)',
      'Nhóm / Phân loại': 'Xét nghiệm',
      'Giá viện phí / Dịch vụ (VNĐ)': 65000,
      'Giá BHYT chi trả (VNĐ)': 45200,
      'Phòng thực hiện': 'Phòng Xét Nghiệm - Tầng 1 (Khu A)',
      'Thời gian ước tính': '30 - 45 phút',
      'Lưu ý chuẩn bị bệnh nhân': 'Nên nhịn ăn sáng trước khi lấy máu để kết quả chính xác nhất.',
      'Mô tả chi tiết': 'Đánh giá số lượng hồng cầu, bạch cầu, tiểu cầu, tầm soát thiếu máu.',
    },
    {
      'STT': 2,
      'Mã dịch vụ': '38.201',
      'Tên dịch vụ kỹ thuật': 'Siêu âm ổ bụng tổng quát (gan, mật, tụy, lách, thận, bàng quang)',
      'Nhóm / Phân loại': 'Chẩn đoán hình ảnh',
      'Giá viện phí / Dịch vụ (VNĐ)': 90000,
      'Giá BHYT chi trả (VNĐ)': 49300,
      'Phòng thực hiện': 'Phòng Siêu Âm 01 - Tầng 1 (Khu B)',
      'Thời gian ước tính': '15 - 20 phút',
      'Lưu ý chuẩn bị bệnh nhân': 'Nên nhịn tiểu để bàng quang căng đầy; nhịn ăn ít nhất 4 tiếng.',
      'Mô tả chi tiết': 'Khảo sát tổng thể cấu trúc các cơ quan nội tạng trong ổ bụng.',
    },
    {
      'STT': 3,
      'Mã dịch vụ': '39.102',
      'Tên dịch vụ kỹ thuật': 'Ghi điện tim đồ (ECG 12 chuyển đạo)',
      'Nhóm / Phân loại': 'Thăm dò chức năng',
      'Giá viện phí / Dịch vụ (VNĐ)': 55000,
      'Giá BHYT chi trả (VNĐ)': 34800,
      'Phòng thực hiện': 'Phòng Điện Tim & Thăm Dò Chức Năng',
      'Thời gian ước tính': '10 - 15 phút',
      'Lưu ý chuẩn bị bệnh nhân': 'Nghỉ ngơi yên tĩnh 10-15 phút trước khi đo, mặc áo rộng rãi.',
      'Mô tả chi tiết': 'Đánh giá nhịp tim, tầm soát thiếu máu cơ tim, rối loạn nhịp.',
    },
    {
      'STT': 4,
      'Mã dịch vụ': '40.050',
      'Tên dịch vụ kỹ thuật': 'Khâu vết thương phần mềm dưới 10cm',
      'Nhóm / Phân loại': 'Phẫu thuật - Thủ thuật',
      'Giá viện phí / Dịch vụ (VNĐ)': 120000,
      'Giá BHYT chi trả (VNĐ)': 85000,
      'Phòng thực hiện': 'Phòng Tiểu Phẫu - Tầng 1',
      'Thời gian ước tính': '20 - 30 phút',
      'Lưu ý chuẩn bị bệnh nhân': 'Vệ sinh sạch vùng tổn thương, báo trước nếu có tiền sử dị ứng thuốc tê.',
      'Mô tả chi tiết': 'Xử trí và khâu phục hồi vết thương hở an toàn vô khuẩn.',
    },
  ];

  const worksheet = XLSX.utils.json_to_sheet(sampleData);
  worksheet['!cols'] = [
    { wch: 6 },
    { wch: 14 },
    { wch: 45 },
    { wch: 22 },
    { wch: 22 },
    { wch: 22 },
    { wch: 30 },
    { wch: 20 },
    { wch: 45 },
    { wch: 40 },
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Mẫu Bảng Giá Y Tế');
  XLSX.writeFile(workbook, 'Mau_Nhap_Bang_Gia_TTYTMocHoa.xlsx');
};
