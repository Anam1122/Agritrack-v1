import { useRouter } from 'next/router';
import { useEffect, useState, useCallback } from 'react';
import { getProduct, getProductStages } from '@/lib/agritrack';
import RealQRCodeDisplay from '@/components/RealQRCodeDisplay';
import AddProductStage from '@/components/AddProductStage';
import { auth } from '@/lib/auth';

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

export default function ProductDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState<Product | null>(null);
  const [stages, setStages] = useState<ProductStage[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuth = useCallback(async () => {
    const user = await auth();
    setIsAuthenticated(!!user?.isAuthenticated);
  }, []);

  const loadProductData = useCallback(async () => {
    try {
      setLoading(true);
      const productData = await getProduct(id as string);
      const productStages = await getProductStages(id as string);
      
      setProduct(productData);
      setStages(productStages || []);
    } catch (error) {
      console.error('Error loading product:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (id) {
      loadProductData();
    }
  }, [id, loadProductData, refreshKey]);

  const refreshData = () => {
    setRefreshKey(prev => prev + 1);
  };

  const translateStageType = (stageType: string) => {
    const translations: { [key: string]: string } = {
      'harvest': '🌱 Panen',
      'process': '🏭 Pengolahan',
      'distribute': '🚚 Distribusi',
      'retail': '🏪 Penjualan'
    };
    return translations[stageType] || stageType;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="bg-white rounded-lg shadow-sm p-6 max-w-4xl mx-auto text-center">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="bg-white rounded-lg shadow-sm p-6 max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-red-600 mb-6">Produk Tidak Ditemukan</h1>
          <p>Produk dengan ID #{id} tidak ditemukan dalam sistem.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-sm p-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-green-600 mb-2">Detail Produk #{product.id}</h1>
            <p className="text-gray-600">Informasi lengkap tentang produk pertanian</p>
          </div>
          <button
            onClick={() => router.back()}
            className="bg-gray-200 px-4 py-2 rounded-md text-sm hover:bg-gray-300"
          >
            Kembali
          </button>
        </div>

        {/* Product Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-green-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-3">Informasi Produk</h2>
            <div className="space-y-2">
              <div>
                <span className="font-medium">Nama:</span>
                <p className="text-gray-800">{product.name}</p>
              </div>
              <div>
                <span className="font-medium">Lokasi Pertanian:</span>
                <p className="text-gray-800">{product.farmLocation}</p>
              </div>
              <div>
                <span className="font-medium">Tanggal Panen:</span>
                <p className="text-gray-800">{product.harvestDate}</p>
              </div>
              <div>
                <span className="font-medium">Varietas:</span>
                <p className="text-gray-800">{product.variety}</p>
              </div>
            </div>
          </div>

          {/* QR Code Info */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-3">QR Code Produk</h2>
            <RealQRCodeDisplay productId={product.id} productName={product.name} />
          </div>
        </div>

        {/* Supply Chain Timeline */}
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Rantai Pasok</h2>
            <span className="bg-yellow-200 text-yellow-800 text-xs px-2 py-1 rounded">
              {stages.length} tahapan
            </span>
          </div>
          
          {stages.length > 0 ? (
            <div className="space-y-3">
              {stages.map((stage, index) => (
                <div key={stage.id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white">
                      {index + 1}
                    </div>
                  </div>
                  <div className="flex-1 bg-white p-3 rounded border">
                    <h3 className="font-medium">{translateStageType(stage.stageType)}</h3>
                    <p className="text-sm text-gray-600">{stage.data}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Oleh: {stage.actor} • {formatDate(stage.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-600 mb-4">Belum ada data rantai pasok untuk produk ini.</p>
            </div>
          )}

          {/* HANYA TAMPILKAN ADD PRODUCT STAGE JIKA USER TERAUTHENTIKASI */}
          {isAuthenticated ? (
            <AddProductStage productId={product.id} onStageAdded={refreshData} />
          ) : (
            <div className="bg-blue-50 p-4 rounded-md mt-4">
              <p className="text-sm text-blue-700">
                🔐 Login untuk menambah tahapan rantai pasok
              </p>
            </div>
          )}
        </div>

        {/* Call to Action */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-2">📱 Bagikan Informasi Produk</h3>
          <p className="text-sm text-gray-600 mb-3">
            Konsumen dapat scan QR code untuk melihat keaslian dan perjalanan produk ini.
          </p>
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: `AgriTrack - ${product.name}`,
                  text: `Lihat informasi produk ${product.name} dari AgriTrack`,
                  url: window.location.href
                });
              } else {
                navigator.clipboard.writeText(window.location.href);
                alert('Link berhasil disalin ke clipboard!');
              }
            }}
            className="bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700"
          >
            Bagikan Produk
          </button>
        </div>
      </div>
    </div>
  );
}