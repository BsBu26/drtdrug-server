import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { INITIAL_SERVICES } from './src/data/medicalServices.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'services-db.json');
const ADMIN_CONFIG_FILE = path.join(DATA_DIR, 'admin-config.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Ensure services database exists
function getServices() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading services database:', err);
  }
  // Initialize with default services
  saveServices(INITIAL_SERVICES);
  return INITIAL_SERVICES;
}

function saveServices(services: any[]) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(services, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving services database:', err);
  }
}

// Ensure Admin PIN config exists (Default PIN: 091293)
function getAdminConfig() {
  try {
    if (fs.existsSync(ADMIN_CONFIG_FILE)) {
      const data = fs.readFileSync(ADMIN_CONFIG_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading admin config:', err);
  }
  const defaultConfig = { pin: '091293' };
  saveAdminConfig(defaultConfig);
  return defaultConfig;
}

function saveAdminConfig(config: { pin: string }) {
  try {
    fs.writeFileSync(ADMIN_CONFIG_FILE, JSON.stringify(config, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving admin config:', err);
  }
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '10mb' }));

  // Helper middleware to check Admin PIN
  const requireAdminPin = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const adminPin = req.headers['x-admin-pin'] || req.body?.pin;
    const currentConfig = getAdminConfig();
    if (!adminPin || adminPin !== currentConfig.pin) {
      res.status(401).json({ error: 'Mã PIN Cán bộ Y tế không hợp lệ' });
      return;
    }
    next();
  };

  // --- API Endpoints ---

  // 1. Get all services (Public for patients and staff)
  app.get('/api/services', (_req, res) => {
    const services = getServices();
    res.json(services);
  });

  // 2. Verify Admin PIN
  app.post('/api/admin/verify-pin', (req, res) => {
    const { pin } = req.body;
    const currentConfig = getAdminConfig();
    if (pin === currentConfig.pin) {
      res.json({ success: true, message: 'Xác thực mã PIN thành công' });
    } else {
      res.status(401).json({ success: false, error: 'Mã PIN không đúng' });
    }
  });

  // 3. Change Admin PIN
  app.post('/api/admin/change-pin', requireAdminPin, (req, res) => {
    const { newPin } = req.body;
    if (!newPin || typeof newPin !== 'string' || newPin.trim().length < 4) {
      res.status(400).json({ error: 'Mã PIN mới phải từ 4 ký tự trở lên' });
      return;
    }
    saveAdminConfig({ pin: newPin.trim() });
    res.json({ success: true, message: 'Đã đổi mã PIN cán bộ thành công' });
  });

  // 4. Create new service (Admin only)
  app.post('/api/services', requireAdminPin, (req, res) => {
    const newService = req.body.service;
    if (!newService || !newService.name) {
      res.status(400).json({ error: 'Dữ liệu dịch vụ không hợp lệ' });
      return;
    }
    const services = getServices();
    const updatedServices = [newService, ...services];
    saveServices(updatedServices);
    res.json({ success: true, service: newService, services: updatedServices });
  });

  // 5. Update existing service (Admin only)
  app.put('/api/services/:id', requireAdminPin, (req, res) => {
    const serviceId = req.params.id;
    const updatedService = req.body.service;
    const services = getServices();
    const index = services.findIndex((s: any) => s.id === serviceId);
    if (index === -1) {
      res.status(404).json({ error: 'Không tìm thấy dịch vụ' });
      return;
    }
    services[index] = { ...services[index], ...updatedService };
    saveServices(services);
    res.json({ success: true, service: services[index], services });
  });

  // 6. Delete service (Admin only)
  app.delete('/api/services/:id', requireAdminPin, (req, res) => {
    const serviceId = req.params.id;
    const services = getServices();
    const updatedServices = services.filter((s: any) => s.id !== serviceId);
    saveServices(updatedServices);
    res.json({ success: true, services: updatedServices });
  });

  // 7. Bulk import services from Excel (Admin only)
  app.post('/api/services/bulk-import', requireAdminPin, (req, res) => {
    const { services: importedServices, mode } = req.body;
    if (!Array.isArray(importedServices)) {
      res.status(400).json({ error: 'Dữ liệu danh sách không hợp lệ' });
      return;
    }

    const current = getServices();
    let updatedServices: any[] = [];

    if (mode === 'append') {
      // Avoid duplicate IDs
      const existingIds = new Set(current.map((s: any) => s.id));
      const newItems = importedServices.filter((s: any) => !existingIds.has(s.id));
      updatedServices = [...importedServices, ...current];
    } else {
      // Replace all
      updatedServices = importedServices;
    }

    saveServices(updatedServices);
    res.json({ success: true, count: importedServices.length, services: updatedServices });
  });

  // 8. Reset services to initial default (Admin only)
  app.post('/api/services/reset', requireAdminPin, (_req, res) => {
    saveServices(INITIAL_SERVICES);
    res.json({ success: true, services: INITIAL_SERVICES });
  });

  // Vite middleware or Static files
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
