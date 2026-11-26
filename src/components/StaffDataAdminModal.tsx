import React, { useState, useRef } from 'react';
import { CategoryType, MedicalService } from '../types';
import { CATEGORIES_CONFIG } from '../data/medicalServices';
import {
  X,
  Plus,
  Trash2,
  Edit2,
  RotateCcw,
  Save,
  Lock,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  ShieldAlert,
  Key,
  FileSpreadsheet,
  Upload,
  Download,
  FileDown,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';
import {
  parseExcelFile,
  exportServicesToExcel,
  downloadSampleExcelTemplate,
} from '../utils/excelHelper';

interface StaffDataAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  services: MedicalService[];
  adminPin: string | null;
  onVerifyPin: (pin: string) => Promise<boolean>;
  onChangePin: (oldPin: string, newPin: string) => Promise<{ success: boolean; message?: string }>;
  onAddService: (service: MedicalService) => Promise<void>;
  onUpdateService: (service: MedicalService) => Promise<void>;
  onDeleteService: (id: string) => Promise<void>;
  onBulkImportServices?: (services: MedicalService[], mode: 'replace' | 'append') => Promise<void>;
  onResetData: () => Promise<void>;
}

export const StaffDataAdminModal: React.FC<StaffDataAdminModalProps> = ({
  isOpen,
  onClose,
  services,
  adminPin,
  onVerifyPin,
  onChangePin,
  onAddService,
  onUpdateService,
  onDeleteService,
  onBulkImportServices,
  onResetData,
}) => {
  if (!isOpen) return null;

  // Tab View State: 'services' | 'excel' | 'pin'
  const [activeTab, setActiveTab] = useState<'services' | 'excel'>('services');

  // PIN Login State
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // Change PIN State
  const [showChangePin, setShowChangePin] = useState(false);
  const [oldPinInput, setOldPinInput] = useState('');
  const [newPinInput, setNewPinInput] = useState('');
  const [changePinMsg, setChangePinMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Service CRUD State
  const [editingService, setEditingService] = useState<MedicalService | null>(null);
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false);

  // Form fields
  const [formData, setFormData] = useState({
    name: '',
    category: 'xat-nghiem' as CategoryType,
    priceService: 0,
    prepInstructions: '',
    description: '',
  });

  // Excel Import State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isParsingExcel, setIsParsingExcel] = useState(false);
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [parsedServices, setParsedServices] = useState<MedicalService[]>([]);
  const [excelErrors, setExcelErrors] = useState<string[]>([]);
  const [importMode, setImportMode] = useState<'replace' | 'append'>('replace');
  const [isImporting, setIsImporting] = useState(false);
  const [importSuccessMsg, setImportSuccessMsg] = useState<string | null>(null);

  // Handle Login with PIN
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPinError('');
    setIsVerifying(true);
    try {
      const ok = await onVerifyPin(pinInput.trim());
      if (!ok) {
        setPinError('Mã PIN không đúng. Vui lòng thử lại!');
      } else {
        setPinInput('');
      }
    } catch {
      setPinError('Không thể kết nối máy chủ xác thực.');
    } finally {
      setIsVerifying(false);
    }
  };

  // Handle Change PIN
  const handleChangePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setChangePinMsg(null);
    if (!newPinInput || newPinInput.trim().length < 4) {
      setChangePinMsg({ type: 'error', text: 'Mã PIN mới phải từ 4 chữ số trở lên.' });
      return;
    }
    const res = await onChangePin(oldPinInput.trim(), newPinInput.trim());
    if (res.success) {
      setChangePinMsg({ type: 'success', text: 'Cập nhật mã PIN cán bộ thành công!' });
      setOldPinInput('');
      setNewPinInput('');
      setTimeout(() => setShowChangePin(false), 1500);
    } else {
      setChangePinMsg({ type: 'error', text: res.message || 'Thay đổi PIN thất bại.' });
    }
  };

  const handleStartAdd = () => {
    setIsAddingNew(true);
    setEditingService(null);
    setFormData({
      name: '',
      category: 'xat-nghiem',
      priceService: 50000,
      prepInstructions: '',
      description: '',
    });
  };

  const handleStartEdit = (service: MedicalService) => {
    setEditingService(service);
    setIsAddingNew(false);
    setFormData({
      name: service.name,
      category: service.category,
      priceService: service.priceService,
      prepInstructions: service.prepInstructions || '',
      description: service.description || '',
    });
  };

  const handleCancelForm = () => {
    setIsAddingNew(false);
    setEditingService(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const catConfig = CATEGORIES_CONFIG.find((c) => c.id === formData.category);
    const categoryName = catConfig ? catConfig.name : 'Chẩn đoán hình ảnh';

    if (isAddingNew) {
      const newService: MedicalService = {
        id: 'custom-' + Date.now(),
        code: 'MH-' + Math.floor(1000 + Math.random() * 9000),
        name: formData.name.trim(),
        category: formData.category,
        categoryName: categoryName,
        priceBHYT: formData.priceService,
        priceService: Number(formData.priceService),
        bhytCoveragePercent: 80,
        room: 'Khu khám chữa bệnh',
        estimatedTime: '15 - 30 phút',
        prepInstructions: formData.prepInstructions.trim() || undefined,
        description: formData.description.trim() || undefined,
      };
      await onAddService(newService);
    } else if (editingService) {
      const numericPrice = Math.max(0, Number(formData.priceService) || 0);
      const updated: MedicalService = {
        ...editingService,
        name: formData.name.trim(),
        category: formData.category,
        categoryName: categoryName,
        priceService: numericPrice,
        priceBHYT: numericPrice,
        prepInstructions: formData.prepInstructions.trim() || undefined,
        description: formData.description.trim() || undefined,
      };
      await onUpdateService(updated);
    }

    handleCancelForm();
  };

  // Handle Excel File Selection
  const handleExcelFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setExcelFile(file);
    setIsParsingExcel(true);
    setExcelErrors([]);
    setImportSuccessMsg(null);

    try {
      const { services: parsed, errors } = await parseExcelFile(file);
      setParsedServices(parsed);
      setExcelErrors(errors);
    } catch (err: any) {
      setExcelErrors([err?.message || 'Không thể đọc tệp Excel này. Vui lòng kiểm tra định dạng.']);
    } finally {
      setIsParsingExcel(false);
    }
  };

  // Handle Execute Bulk Import
  const handleExecuteImport = async () => {
    if (parsedServices.length === 0) return;
    setIsImporting(true);
    try {
      if (onBulkImportServices) {
        await onBulkImportServices(parsedServices, importMode);
      } else {
        // Fallback sequentially
        for (const s of parsedServices) {
          await onAddService(s);
        }
      }
      setImportSuccessMsg(
        `Đã nhập thành công ${parsedServices.length} dịch vụ kỹ thuật vào hệ thống!`
      );
      setParsedServices([]);
      setExcelFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      setExcelErrors(['Quá trình lưu dữ liệu gặp sự cố. Vui lòng thử lại.']);
    } finally {
      setIsImporting(false);
    }
  };

  // IF NOT AUTHENTICATED -> Render PIN Login Screen
  if (!adminPin) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
        <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 relative overflow-hidden text-center">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-12 h-12 bg-teal-50 text-teal-700 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-xs">
            <Lock className="w-6 h-6" />
          </div>

          <h2 className="text-base font-bold text-slate-900">Xác Thực Cán Bộ Y Tế</h2>
          <p className="text-xs text-slate-500 mt-1 mb-4">
            Nhập mã PIN mật khẩu để mở quyền quản lý & cập nhật bảng giá chính thức.
          </p>

          <form onSubmit={handleLoginSubmit} className="space-y-3">
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Nhập mã PIN..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono text-center tracking-widest text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white"
              />
            </div>

            {pinError && (
              <div className="flex items-center gap-1.5 justify-center text-xs text-red-600 font-medium">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{pinError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isVerifying}
              className="w-full py-2.5 bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50"
            >
              {isVerifying ? 'Đang xác thực...' : 'Đăng Nhập Quản Lý'}
            </button>
          </form>

          <p className="text-[11px] text-slate-400 mt-4 border-t border-slate-100 pt-3 italic">
            * Bệnh nhân quét mã QR chỉ xem được giá, không thể truy cập cửa sổ này.
          </p>
        </div>
      </div>
    );
  }

  // AUTHENTICATED -> Render Full Admin Dashboard
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-4 sm:p-6 shadow-2xl border border-slate-200 relative overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-md border border-teal-100">
                Đã đăng nhập Cán Bộ Y Tế
              </span>
              <button
                onClick={() => setShowChangePin(!showChangePin)}
                className="text-[11px] text-slate-500 hover:text-teal-700 font-semibold underline flex items-center gap-1 cursor-pointer"
              >
                <Key className="w-3 h-3" />
                <span>Đổi mã PIN</span>
              </button>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
              Quản Lý Bảng Giá & Cập Nhật Hệ Thống
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Change PIN Form Popover */}
        {showChangePin && (
          <form onSubmit={handleChangePinSubmit} className="bg-slate-800 text-white p-4 rounded-2xl my-3 space-y-3 animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-xs flex items-center gap-1.5 text-teal-300">
                <KeyRound className="w-4 h-4" />
                Đổi Mã PIN Đăng Nhập Cán Bộ
              </h4>
              <button type="button" onClick={() => setShowChangePin(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="password"
                required
                placeholder="Mã PIN hiện tại"
                value={oldPinInput}
                onChange={(e) => setOldPinInput(e.target.value)}
                className="px-3 py-1.5 bg-slate-700 border border-slate-600 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none"
              />
              <input
                type="password"
                required
                placeholder="Mã PIN mới (≥ 4 số)"
                value={newPinInput}
                onChange={(e) => setNewPinInput(e.target.value)}
                className="px-3 py-1.5 bg-slate-700 border border-slate-600 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none"
              />
            </div>

            {changePinMsg && (
              <p className={`text-xs font-semibold ${changePinMsg.type === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>
                {changePinMsg.text}
              </p>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-1.5 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Cập nhật PIN mới
              </button>
            </div>
          </form>
        )}

        {/* Navigation Tabs: Quản lý danh sách vs Nhập Excel */}
        <div className="flex items-center gap-2 pt-3 border-b border-slate-100">
          <button
            onClick={() => setActiveTab('services')}
            className={`pb-2 px-3 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'services'
                ? 'border-teal-700 text-teal-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Danh sách dịch vụ ({services.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('excel')}
            className={`pb-2 px-3 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'excel'
                ? 'border-teal-700 text-teal-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Nhập dữ liệu bằng Excel</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="py-3 overflow-y-auto flex-1 space-y-4 pr-1">
          {/* TAB 1: SERVICES LIST & INDIVIDUAL EDIT */}
          {activeTab === 'services' && (
            <>
              {/* Form when adding or editing */}
              {(isAddingNew || editingService) && (
                <form onSubmit={handleSave} className="bg-slate-50 p-4 rounded-2xl border border-teal-200 space-y-3 animate-in fade-in">
                  <h3 className="font-bold text-slate-800 text-sm">
                    {isAddingNew ? 'Thêm Dịch Vụ Y Tế Mới' : 'Cập Nhật Dịch Vụ'}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Tên dịch vụ y tế *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="VD: Siêu âm ổ bụng tổng quát..."
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Nhóm dịch vụ
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) =>
                          setFormData({ ...formData, category: e.target.value as CategoryType })
                        }
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600"
                      >
                        {CATEGORIES_CONFIG.filter((c) => c.id !== 'all').map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Đơn giá dịch vụ (VNĐ)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        required
                        value={formData.priceService}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            priceService: e.target.value === '' ? 0 : Number(e.target.value),
                          })
                        }
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Lưu ý chuẩn bị bệnh nhân (nếu có)
                      </label>
                      <input
                        type="text"
                        value={formData.prepInstructions}
                        onChange={(e) =>
                          setFormData({ ...formData, prepInstructions: e.target.value })
                        }
                        placeholder="VD: Nhịn ăn sáng ít nhất 6 tiếng, uống nhiều nước..."
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                    <button
                      type="button"
                      onClick={handleCancelForm}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg cursor-pointer"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      className="flex items-center gap-1.5 px-4 py-1.5 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs rounded-lg shadow-xs cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>{isAddingNew ? 'Lưu Dịch Vụ Mới' : 'Cập Nhật Lên Máy Chủ'}</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Action Bar */}
              {!isAddingNew && !editingService && (
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleStartAdd}
                      className="flex items-center gap-1.5 px-3 py-2 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer shadow-xs"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Thêm dịch vụ</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('excel')}
                      className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs rounded-xl border border-emerald-200 transition-colors cursor-pointer"
                    >
                      <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                      <span>Nhập từ Excel</span>
                    </button>

                    <button
                      onClick={() => exportServicesToExcel(services)}
                      className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
                      title="Tải toàn bộ danh sách hiện tại ra file Excel để lưu trữ hoặc chỉnh sửa"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Xuất Excel</span>
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      if (confirm('Khôi phục danh sách dịch vụ y tế về mặc định ban đầu trên máy chủ?')) {
                        onResetData();
                      }
                    }}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 text-slate-500 hover:text-red-700 text-xs font-semibold hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Khôi phục gốc</span>
                  </button>
                </div>
              )}

              {/* Existing List */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden">
                <div className="bg-slate-100 px-4 py-2 font-bold text-xs text-slate-700 flex justify-between items-center">
                  <span>Danh sách dịch vụ hiện hành ({services.length})</span>
                  <span className="text-teal-700 flex items-center gap-1 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Đồng bộ máy chủ
                  </span>
                </div>
                <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto">
                  {services.map((item) => (
                    <div
                      key={item.id}
                      className="px-4 py-2.5 flex items-center justify-between gap-2 hover:bg-slate-50 text-xs"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 font-bold">
                            {item.code}
                          </span>
                          <p className="font-bold text-slate-900 truncate">{item.name}</p>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {item.categoryName} • Đơn giá: {item.priceService.toLocaleString('vi-VN')} đ
                          {item.prepInstructions && (
                            <span className="text-amber-600 ml-2">⚠️ Có lưu ý</span>
                          )}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => handleStartEdit(item)}
                          className="p-1.5 text-slate-500 hover:text-teal-700 hover:bg-slate-100 rounded-lg cursor-pointer"
                          title="Sửa"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Xóa dịch vụ "${item.name}" khỏi máy chủ?`)) {
                              onDeleteService(item.id);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                          title="Xóa"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* TAB 2: EXCEL IMPORT */}
          {activeTab === 'excel' && (
            <div className="space-y-4">
              {/* Instructions & Template Download Bar */}
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h4 className="font-bold text-xs text-emerald-950 flex items-center gap-1.5">
                    <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
                    Nhập dữ liệu bảng giá hàng loạt bằng File Excel (.xlsx / .xls)
                  </h4>
                  <p className="text-[11px] text-emerald-800 mt-1">
                    Bạn có thể tải file mẫu có sẵn tiêu đề chuẩn để điền thông tin, hoặc dùng file Excel bảng giá của đơn vị.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={downloadSampleExcelTemplate}
                    className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-emerald-100 text-emerald-800 font-bold text-xs rounded-xl border border-emerald-300 shadow-2xs transition-colors cursor-pointer"
                  >
                    <FileDown className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Tải File Mẫu Excel</span>
                  </button>

                  <button
                    onClick={() => exportServicesToExcel(services)}
                    className="flex items-center gap-1.5 px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-2xs transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Xuất Bảng Giá Hiện Tại</span>
                  </button>
                </div>
              </div>

              {/* Upload Dropzone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 hover:border-teal-600 bg-slate-50 hover:bg-teal-50/40 rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 group"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx, .xls, .csv"
                  onChange={handleExcelFileChange}
                  className="hidden"
                />
                <div className="w-12 h-12 bg-white rounded-2xl shadow-xs border border-slate-200 flex items-center justify-center text-teal-700 group-hover:scale-110 transition-transform">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold text-xs text-slate-800">
                    {excelFile ? excelFile.name : 'Bấm để chọn hoặc kéo thả tệp Excel vào đây'}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Hỗ trợ định dạng .xlsx, .xls, .csv
                  </p>
                </div>
              </div>

              {/* Parsing status / Errors */}
              {isParsingExcel && (
                <div className="flex items-center justify-center gap-2 py-4 text-xs text-teal-800 font-bold">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Đang đọc và phân tích dữ liệu tệp Excel...</span>
                </div>
              )}

              {excelErrors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-700 space-y-1">
                  <div className="font-bold flex items-center gap-1">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    <span>Phát hiện sự cố khi đọc file:</span>
                  </div>
                  {excelErrors.map((err, i) => (
                    <p key={i} className="pl-5 text-[11px] list-disc">
                      • {err}
                    </p>
                  ))}
                </div>
              )}

              {importSuccessMsg && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-800 font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{importSuccessMsg}</span>
                </div>
              )}

              {/* Preview & Confirmation */}
              {parsedServices.length > 0 && (
                <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50 space-y-3 animate-in fade-in">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        Đã nhận diện: {parsedServices.length} dịch vụ y tế
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Vui lòng chọn chế độ nhập và kiểm tra bản xem trước bên dưới.
                      </p>
                    </div>

                    {/* Import Mode Radio */}
                    <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-xl border border-slate-200 text-xs">
                      <label className="flex items-center gap-1.5 cursor-pointer font-bold text-slate-700">
                        <input
                          type="radio"
                          name="importMode"
                          value="replace"
                          checked={importMode === 'replace'}
                          onChange={() => setImportMode('replace')}
                          className="text-teal-700"
                        />
                        <span>Ghi đè toàn bộ</span>
                      </label>

                      <label className="flex items-center gap-1.5 cursor-pointer font-medium text-slate-600">
                        <input
                          type="radio"
                          name="importMode"
                          value="append"
                          checked={importMode === 'append'}
                          onChange={() => setImportMode('append')}
                          className="text-teal-700"
                        />
                        <span>Bổ sung thêm</span>
                      </label>
                    </div>
                  </div>

                  {/* Preview Table */}
                  <div className="bg-white rounded-xl border border-slate-200 max-h-48 overflow-y-auto overflow-x-auto text-[11px]">
                    <table className="w-full text-left">
                      <thead className="bg-slate-100 text-slate-700 font-bold sticky top-0">
                        <tr>
                          <th className="px-3 py-2">Mã</th>
                          <th className="px-3 py-2">Tên dịch vụ kỹ thuật</th>
                          <th className="px-3 py-2">Nhóm</th>
                          <th className="px-3 py-2 text-right">Giá DV (VNĐ)</th>
                          <th className="px-3 py-2">Lưu ý chuẩn bị</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {parsedServices.slice(0, 10).map((s, idx) => (
                          <tr key={idx} className="hover:bg-slate-50">
                            <td className="px-3 py-1.5 font-mono font-bold text-slate-600">{s.code}</td>
                            <td className="px-3 py-1.5 font-medium text-slate-900">{s.name}</td>
                            <td className="px-3 py-1.5 text-slate-600">{s.categoryName}</td>
                            <td className="px-3 py-1.5 text-right font-bold text-teal-800">
                              {s.priceService.toLocaleString('vi-VN')} đ
                            </td>
                            <td className="px-3 py-1.5 text-slate-500 truncate max-w-xs">
                              {s.prepInstructions || '-'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {parsedServices.length > 10 && (
                      <div className="py-2 text-center text-slate-400 bg-slate-50 italic">
                        ... và còn {parsedServices.length - 10} dịch vụ khác
                      </div>
                    )}
                  </div>

                  {/* Confirm Button */}
                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      onClick={() => {
                        setParsedServices([]);
                        setExcelFile(null);
                      }}
                      className="px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl cursor-pointer"
                    >
                      Hủy bỏ
                    </button>

                    <button
                      onClick={handleExecuteImport}
                      disabled={isImporting}
                      className="flex items-center gap-1.5 px-5 py-2 bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer disabled:opacity-50 transition-all"
                    >
                      {isImporting ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Đang lưu vào hệ thống...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-3.5 h-3.5" />
                          <span>
                            Xác nhận nhập {parsedServices.length} dịch vụ (
                            {importMode === 'replace' ? 'Ghi đè' : 'Bổ sung'})
                          </span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1 text-[11px] text-teal-800 font-medium">
            <ShieldAlert className="w-3.5 h-3.5 text-teal-600 shrink-0" />
            Dữ liệu tự động lưu vĩnh viễn trên Máy chủ & Trình duyệt.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 font-bold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
