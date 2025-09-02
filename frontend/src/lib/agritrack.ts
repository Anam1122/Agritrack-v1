import { auth } from './auth';

// Definisikan interface
interface Product {
  id: string;
  name: string;
  farmLocation: string;
  harvestDate: string;
  variety: string;
}

interface ProductStage {
  id: string;
  productId: string;
  stageType: string;
  timestamp: string;
  data: string;
  actor: string;
}

// SEMENTARA: Gunakan mock functions dengan persistence ke localStorage
const STORAGE_KEY = 'agritrack_products';
const STORAGE_KEY_STAGES = 'agritrack_stages';

// Load data dari localStorage saat pertama kali
const loadFromLocalStorage = (key: string, defaultValue: Product[] | ProductStage[]): Product[] | ProductStage[] => {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return defaultValue;
  }
};

// Save data ke localStorage
const saveToLocalStorage = (key: string, data: Product[] | ProductStage[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

// Initialize dengan data dari localStorage
const mockProducts: Product[] = loadFromLocalStorage(STORAGE_KEY, [
  {
    id: "mock-001",
    name: "Beras Organik",
    farmLocation: "Subang",
    harvestDate: "2023-10-15",
    variety: "Pandan Wangi"
  },
  {
    id: "mock-002", 
    name: "Kopi Arabica",
    farmLocation: "Aceh",
    harvestDate: "2023-09-20",
    variety: "Gayo"
  }
]) as Product[];

const mockStages: ProductStage[] = loadFromLocalStorage(STORAGE_KEY_STAGES, [
  {
    id: "stage-001",
    productId: "mock-001",
    stageType: "harvest",
    timestamp: new Date().toISOString(),
    data: "Panen dilakukan secara manual",
    actor: "petani-001"
  },
  {
    id: "stage-002",
    productId: "mock-001", 
    stageType: "process",
    timestamp: new Date().toISOString(),
    data: "Pengeringan selama 2 hari",
    actor: "pengolah-001"
  }
]) as ProductStage[];

// HAPUS DUPLICATE FUNCTIONS, HANYA SIMPAN SATU VERSI:

export const addProduct = async (name: string, farmLocation: string, harvestDate: string, variety: string): Promise<string> => {
  console.log("🟢 MOCK: Menambah produk", { name, farmLocation, harvestDate, variety });
  
  const newId = `prod-${Date.now()}`;
  const newProduct: Product = {
    id: newId,
    name,
    farmLocation,
    harvestDate,
    variety
  };
  
  mockProducts.push(newProduct);
  saveToLocalStorage(STORAGE_KEY, mockProducts);
  console.log("✅ Produk ditambahkan:", newProduct);
  return newId;
};

// HANYA SIMPAN SATU VERSION addProductStage
export const addProductStage = async (productId: string, stageType: string, data: string): Promise<boolean> => {
  // Cek authentication
  const user = await auth();
  if (!user?.isAuthenticated) {
    throw new Error('Unauthorized: User must be logged in');
  }

  console.log("🟢 MOCK: Menambah stage", { productId, stageType, data });
  
  const newStage: ProductStage = {
    id: `stage-${Date.now()}`,
    productId,
    stageType,
    timestamp: new Date().toISOString(),
    data,
    actor: user.principal // Gunakan principal user yang login
  };
  
  mockStages.push(newStage);
  saveToLocalStorage(STORAGE_KEY_STAGES, mockStages);
  console.log("✅ Stage ditambahkan:", newStage);
  return true;
};

export const getProduct = async (productId: string): Promise<Product | null> => {
  console.log("🟢 MOCK: Get product", productId);
  return mockProducts.find(p => p.id === productId) || null;
};

export const getProductStages = async (productId: string): Promise<ProductStage[]> => {
  console.log("🟢 MOCK: Get product stages for", productId);
  return mockStages.filter(stage => stage.productId === productId);
};

export const getAllProducts = async (): Promise<Product[]> => {
  console.log("🟢 MOCK: Get all products");
  return [...mockProducts];
};

// Tambahkan function untuk add sample stages
export const addSampleStages = async (productId: string): Promise<boolean> => {
  console.log("📊 Adding sample stages for product:", productId);
  
  // Sample data untuk rantai pasok
  const sampleStages = [
    {
      type: 'harvest',
      data: 'Panen dilakukan secara manual dengan kualitas terbaik'
    },
    {
      type: 'process', 
      data: 'Pencucian dan sortasi untuk memastikan kualitas'
    },
    {
      type: 'distribute',
      data: 'Pengiriman ke distributor utama'
    }
  ];

  for (const stage of sampleStages) {
    await addProductStage(productId, stage.type, stage.data);
  }
  
  console.log("✅ Sample stages added!");
  return true;
};