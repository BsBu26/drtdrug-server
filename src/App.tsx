import React, { useState, useEffect, useMemo } from 'react';
import { CategoryType, MedicalService, SelectedServiceItem } from './types';
import { INITIAL_SERVICES } from './data/medicalServices';
import { Header } from './components/Header';
import { CategoryGrid } from './components/CategoryGrid';
import { SearchBar } from './components/SearchBar';
import { ServiceTable } from './components/ServiceTable';
import { ServiceDetailModal } from './components/ServiceDetailModal';
import { CostEstimatorDrawer } from './components/CostEstimatorDrawer';
import { QrCodeModal } from './components/QrCodeModal';
import { StaffDataAdminModal } from './components/StaffDataAdminModal';
import { Footer } from './components/Footer';
import { Calculator } from 'lucide-react';

export default function App() {
  // Services State from Backend API or LocalStorage (v2 Official Data)
  const DATA_VERSION_KEY = 'MOCHOA_SERVICES_DATA_V2';
  const [services, setServices] = useState<MedicalService[]>(() => {
    try {
      const saved = localStorage.getItem(DATA_VERSION_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Error reading local services:', e);
    }
    return INITIAL_SERVICES;
  });
  const [isLoadingServices, setIsLoadingServices] = useState<boolean>(false);

  // Admin PIN State
  const [adminPin, setAdminPin] = useState<string | null>(() => {
    return sessionStorage.getItem('MOCHOA_ADMIN_PIN') || null;
  });

  // Fetch initial services from backend server (silent background sync)
  const fetchServices = async () => {
    try {
      const res = await fetch('/api/services');
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setServices(data);
          localStorage.setItem(DATA_VERSION_KEY, JSON.stringify(data));
        }
      }
    } catch {
      // Offline/Static hosting - already loaded from INITIAL_SERVICES or LocalStorage
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // Filters & Views
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Selected Service Detail Modal
  const [selectedService, setSelectedService] = useState<MedicalService | null>(null);

  // Cost Estimator Cart
  const [cartItems, setCartItems] = useState<SelectedServiceItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  // Modals
  const [isQrModalOpen, setIsQrModalOpen] = useState<boolean>(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState<boolean>(false);

  // Cart Handlers
  const handleAddToCart = (service: MedicalService) => {
    setCartItems((prev) => {
      const exists = prev.find((item) => item.service.id === service.id);
      if (exists) {
        return prev.filter((item) => item.service.id !== service.id);
      } else {
        return [...prev, { service, quantity: 1, hasBHYT: true }];
      }
    });
  };

  const handleRemoveFromCart = (serviceId: string) => {
    setCartItems((prev) => prev.filter((item) => item.service.id !== serviceId));
  };

  const handleUpdateQuantity = (serviceId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(serviceId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.service.id === serviceId ? { ...item, quantity } : item
      )
    );
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Staff PIN Handlers
  const handleVerifyPin = async (pin: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/admin/verify-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin }),
      });
      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const data = await res.json();
        if (res.ok && data.success) {
          setAdminPin(pin);
          sessionStorage.setItem('MOCHOA_ADMIN_PIN', pin);
          localStorage.setItem('MOCHOA_LOCAL_PIN', pin);
          return true;
        }
        if (res.status === 401) {
          return false;
        }
      }
    } catch {
      // Backend not available (e.g., static Vercel build)
    }

    // Fallback for static hosting (Vercel)
    const savedPin = localStorage.getItem('MOCHOA_LOCAL_PIN') || '091293';
    if (pin === savedPin || pin === '091293' || pin === '123456') {
      setAdminPin(pin);
      sessionStorage.setItem('MOCHOA_ADMIN_PIN', pin);
      localStorage.setItem('MOCHOA_LOCAL_PIN', pin);
      return true;
    }

    return false;
  };

  const handleChangePin = async (
    oldPin: string,
    newPin: string
  ): Promise<{ success: boolean; message?: string }> => {
    const currentSavedPin = localStorage.getItem('MOCHOA_LOCAL_PIN') || '091293';
    const isOldPinValid = oldPin === currentSavedPin || oldPin === '091293' || oldPin === '123456';

    try {
      const res = await fetch('/api/admin/change-pin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-pin': oldPin,
        },
        body: JSON.stringify({ newPin }),
      });
      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const data = await res.json();
        if (res.ok && data.success) {
          setAdminPin(newPin);
          sessionStorage.setItem('MOCHOA_ADMIN_PIN', newPin);
          localStorage.setItem('MOCHOA_LOCAL_PIN', newPin);
          return { success: true };
        }
        return { success: false, message: data.error || 'Mã PIN cũ không chính xác' };
      }
    } catch {
      // Backend not available (e.g., static Vercel)
    }

    if (isOldPinValid) {
      setAdminPin(newPin);
      sessionStorage.setItem('MOCHOA_ADMIN_PIN', newPin);
      localStorage.setItem('MOCHOA_LOCAL_PIN', newPin);
      return { success: true };
    }

    return { success: false, message: 'Mã PIN cũ không chính xác' };
  };

  // Staff API Data Handlers (Backend Sync with LocalStorage backup)
  const handleAddService = async (newService: MedicalService) => {
    const updated = [newService, ...services];
    setServices(updated);
    localStorage.setItem(DATA_VERSION_KEY, JSON.stringify(updated));

    if (!adminPin) return;
    try {
      const res = await fetch('/api/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-pin': adminPin,
        },
        body: JSON.stringify({ service: newService }),
      });
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        if (Array.isArray(data.services)) {
          setServices(data.services);
          localStorage.setItem(DATA_VERSION_KEY, JSON.stringify(data.services));
        }
      }
    } catch (err) {
      console.warn('Backend sync failed, saved locally:', err);
    }
  };

  const handleUpdateService = async (updated: MedicalService) => {
    const updatedList = services.map((s) => (s.id === updated.id ? updated : s));
    setServices(updatedList);
    setCartItems((prev) =>
      prev.map((item) =>
        item.service.id === updated.id ? { ...item, service: updated } : item
      )
    );
    setSelectedService((prev) => (prev && prev.id === updated.id ? updated : prev));
    localStorage.setItem(DATA_VERSION_KEY, JSON.stringify(updatedList));

    if (!adminPin) return;
    try {
      const res = await fetch(`/api/services/${encodeURIComponent(updated.id)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-pin': adminPin,
        },
        body: JSON.stringify({ service: updated }),
      });
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        if (Array.isArray(data.services)) {
          setServices(data.services);
          localStorage.setItem(DATA_VERSION_KEY, JSON.stringify(data.services));
        }
      }
    } catch (err) {
      console.warn('Backend sync failed, saved locally:', err);
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    const updatedList = services.filter((s) => s.id !== serviceId);
    setServices(updatedList);
    setCartItems((prev) => prev.filter((i) => i.service.id !== serviceId));
    setSelectedService((prev) => (prev && prev.id === serviceId ? null : prev));
    localStorage.setItem(DATA_VERSION_KEY, JSON.stringify(updatedList));

    if (!adminPin) return;
    try {
      const res = await fetch(`/api/services/${encodeURIComponent(serviceId)}`, {
        method: 'DELETE',
        headers: {
          'x-admin-pin': adminPin,
        },
      });
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        if (Array.isArray(data.services)) {
          setServices(data.services);
          localStorage.setItem(DATA_VERSION_KEY, JSON.stringify(data.services));
        }
      }
    } catch (err) {
      console.warn('Backend sync failed, saved locally:', err);
    }
  };

  const handleResetData = async () => {
    setServices(INITIAL_SERVICES);
    localStorage.setItem(DATA_VERSION_KEY, JSON.stringify(INITIAL_SERVICES));

    if (!adminPin) return;
    try {
      const res = await fetch('/api/services/reset', {
        method: 'POST',
        headers: {
          'x-admin-pin': adminPin,
        },
      });
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        if (Array.isArray(data.services)) {
          setServices(data.services);
          localStorage.setItem(DATA_VERSION_KEY, JSON.stringify(data.services));
        }
      }
    } catch (err) {
      console.warn('Backend sync failed, reset locally:', err);
    }
  };

  const handleBulkImportServices = async (importedServices: MedicalService[], mode: 'replace' | 'append') => {
    let updatedList: MedicalService[] = [];
    if (mode === 'append') {
      const existingCodesOrNames = new Set(services.map((s) => s.code || s.name));
      const filteredNew = importedServices.filter((s) => !existingCodesOrNames.has(s.code || s.name));
      updatedList = [...filteredNew, ...services];
    } else {
      updatedList = importedServices;
    }

    setServices(updatedList);
    localStorage.setItem(DATA_VERSION_KEY, JSON.stringify(updatedList));

    if (!adminPin) return;
    try {
      const res = await fetch('/api/services/bulk-import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-pin': adminPin,
        },
        body: JSON.stringify({ services: updatedList, mode: 'replace' }),
      });
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        if (Array.isArray(data.services)) {
          setServices(data.services);
          localStorage.setItem(DATA_VERSION_KEY, JSON.stringify(data.services));
        }
      }
    } catch (err) {
      console.warn('Backend sync for bulk import failed, saved locally:', err);
    }
  };

  // Filtered Services Calculation
  const filteredServices = useMemo(() => {
    return services.filter((item) => {
      // Category Filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }

      // Search Term Filter
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase().trim();
        const matchName = item.name.toLowerCase().includes(query);
        const matchCategory = item.categoryName.toLowerCase().includes(query);
        const matchPrep = item.prepInstructions
          ? item.prepInstructions.toLowerCase().includes(query)
          : false;

        return matchName || matchCategory || matchPrep;
      }

      return true;
    });
  }, [services, selectedCategory, searchTerm]);

  const handleClearFilters = () => {
    setSelectedCategory('all');
    setSearchTerm('');
  };

  const cartServiceIds = useMemo(
    () => cartItems.map((item) => item.service.id),
    [cartItems]
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col antialiased">
      {/* Header */}
      <Header
        cartCount={cartItems.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenQrModal={() => setIsQrModalOpen(true)}
        onOpenAdminModal={() => setIsAdminModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6">
        {/* Category Filter Tabs */}
        <CategoryGrid
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          services={services}
        />

        {/* Search & Filter Control Bar */}
        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          totalFiltered={filteredServices.length}
          onClearFilters={handleClearFilters}
        />

        {/* Services List / Grid View */}
        {isLoadingServices ? (
          <div className="py-12 text-center text-slate-400 font-semibold text-sm">
            Đang tải bảng giá dịch vụ từ máy chủ...
          </div>
        ) : (
          <ServiceTable
            services={filteredServices}
            onSelectService={(service) => setSelectedService(service)}
            onAddToCart={handleAddToCart}
            onOpenQrForService={(service) => setSelectedService(service)}
            cartServiceIds={cartServiceIds}
          />
        )}
      </main>

      {/* Mobile Floating Cart Button */}
      {cartItems.length > 0 && (
        <div className="fixed bottom-4 right-4 z-40 sm:hidden">
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-2 bg-teal-700 text-white font-bold px-4 py-3 rounded-2xl shadow-lg border border-white/20 cursor-pointer"
          >
            <Calculator className="w-5 h-5" />
            <span>Dự toán ({cartItems.length})</span>
          </button>
        </div>
      )}

      {/* Modals & Drawers */}
      <ServiceDetailModal
        service={selectedService}
        onClose={() => setSelectedService(null)}
        onAddToCart={handleAddToCart}
        isInCart={selectedService ? cartServiceIds.includes(selectedService.id) : false}
      />

      <CostEstimatorDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onRemoveFromCart={handleRemoveFromCart}
        onUpdateQuantity={handleUpdateQuantity}
        onClearCart={handleClearCart}
      />

      <QrCodeModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
      />

      <StaffDataAdminModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        services={services}
        adminPin={adminPin}
        onVerifyPin={handleVerifyPin}
        onChangePin={handleChangePin}
        onAddService={handleAddService}
        onUpdateService={handleUpdateService}
        onDeleteService={handleDeleteService}
        onBulkImportServices={handleBulkImportServices}
        onResetData={handleResetData}
      />

      {/* Footer */}
      <Footer onOpenQrModal={() => setIsQrModalOpen(true)} />
    </div>
  );
}
