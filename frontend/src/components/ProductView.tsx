import { JSX, useState } from 'react';
import { getProduct, getProductStages } from '@/lib/agritrack';
import { 
  FaSearch, 
  FaSpinner, 
  FaLeaf, 
  FaMapMarkerAlt, 
  FaCalendarAlt,
  FaSeedling,
  FaBox,
  FaExclamationTriangle,
  FaHistory,
  FaUser,
  FaClock
} from 'react-icons/fa';

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

export default function ProductView() {
  const [productId, setProductId] = useState('');
  const [product, setProduct] = useState<Product | null>(null);
  const [stages, setStages] = useState<ProductStage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!productId.trim()) return;
    
    setLoading(true);
    setError('');
    setProduct(null);
    setStages([]);
    
    try {
      const productData = await getProduct(productId.trim());
      const productStages = await getProductStages(productId.trim());
      
      setProduct(productData);
      setStages(productStages || []);
    } catch (error) {
      console.error('Error:', error);
      setError('Produk tidak ditemukan. Pastikan ID produk benar.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Format tanggal yang lebih baik
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Terjemahkan tipe stage dengan ikon
  const getStageInfo = (stageType: string) => {
    const stageInfo: { [key: string]: { label: string; icon: JSX.Element; color: string } } = {
      'harvest': { 
        label: 'Panen', 
        icon: <FaLeaf className="text-green-500" />,
        color: 'bg-green-100 text-green-800'
      },
      'process': { 
        label: 'Pengolahan', 
        icon: <FaBox className="text-blue-500" />,
        color: 'bg-blue-100 text-blue-800'
      },
      'distribute': { 
        label: 'Distribusi', 
        icon: <FaMapMarkerAlt className="text-orange-500" />,
        color: 'bg-orange-100 text-orange-800'
      },
      'retail': { 
        label: 'Penjualan', 
        icon: <FaUser className="text-purple-500" />,
        color: 'bg-purple-100 text-purple-800'
      }
    };
    return stageInfo[stageType] || { label: stageType, icon: <FaHistory className="text-gray-500" />, color: 'bg-gray-100 text-gray-800' };
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-2">
          <div className="bg-blue-100 p-3 rounded-full mr-3">
            <FaSearch className="text-blue-600 text-xl" />
          </div>
          <h2 className="text-2xl font-bold text-blue-800">Cari Produk</h2>
        </div>
        <p className="text-gray-600">Temukan informasi lengkap produk dengan ID produk</p>
      </div>

      {/* Search Section */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Masukkan ID Produk
        </label>
        <div className="flex space-x-3">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaLeaf className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Contoh: mock-001, mock-002, atau ID produk Anda"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              disabled={loading}
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={loading || !productId.trim()}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
          >
            {loading ? (
              <FaSpinner className="animate-spin mr-2" />
            ) : (
              <FaSearch className="mr-2" />
            )}
            Cari
          </button>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Gunakan ID produk yang tertera pada kemasan atau QR code
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 p-4 rounded-lg border border-red-200 mb-6">
          <div className="flex items-center">
            <FaExclamationTriangle className="text-red-500 mr-2" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Product Details */}
      {product && (
        <div className="space-y-6">
          {/* Product Card */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <FaLeaf className="text-green-500 mr-2" />
              Detail Produk
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="font-semibold text-gray-600 mb-1 flex items-center">
                    <FaLeaf className="text-green-500 mr-2" />
                    Nama Produk
                  </p>
                  <p className="text-lg font-medium text-gray-800">{product.name}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-600 mb-1 flex items-center">
                    <FaMapMarkerAlt className="text-green-500 mr-2" />
                    Lokasi Pertanian
                  </p>
                  <p className="text-gray-800">{product.farmLocation}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="font-semibold text-gray-600 mb-1 flex items-center">
                    <FaCalendarAlt className="text-green-500 mr-2" />
                    Tanggal Panen
                  </p>
                  <p className="text-gray-800">{formatDate(product.harvestDate)}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-600 mb-1 flex items-center">
                    <FaSeedling className="text-green-500 mr-2" />
                    Varietas
                  </p>
                  <p className="text-gray-800">{product.variety}</p>
                </div>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-100">
              <p className="font-semibold text-gray-600 mb-1">ID Produk</p>
              <code className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm font-mono">
                {product.id}
              </code>
            </div>
          </div>

          {/* Supply Chain */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <FaHistory className="text-blue-500 mr-2" />
              Rantai Pasok
            </h3>

            {stages.length > 0 ? (
              <div className="space-y-4">
                {stages.map((stage, index) => {
                  const stageInfo = getStageInfo(stage.stageType);
                  return (
                    <div key={stage.id} className="flex">
                      {/* Timeline line */}
                      <div className="flex flex-col items-center mr-4">
                        <div className={`w-3 h-3 rounded-full ${stageInfo.color} border-2 border-white shadow`}></div>
                        {index < stages.length - 1 && (
                          <div className="w-0.5 h-16 bg-gray-200 my-1"></div>
                        )}
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${stageInfo.color}`}>
                              {stageInfo.icon}
                              <span className="ml-1">{stageInfo.label}</span>
                            </span>
                          </div>
                          <span className="text-xs text-gray-500">
                            {formatDate(stage.timestamp)}
                          </span>
                        </div>
                        
                        <p className="text-gray-700 mb-2">{stage.data}</p>
                        
                        <div className="flex items-center text-xs text-gray-500">
                          <FaUser className="mr-1" />
                          <span>Oleh: {stage.actor}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <div className="flex items-center">
                  <FaExclamationTriangle className="text-yellow-500 mr-2" />
                  <p className="text-yellow-700">Belum ada data rantai pasok untuk produk ini.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Help Section */}
      <div className="bg-blue-50 p-6 rounded-xl border border-blue-200 mt-8">
        <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center">
          <FaExclamationTriangle className="mr-2" />
          Tidak menemukan produk?
        </h3>
        <ul className="text-sm text-blue-600 space-y-1">
          <li>• Pastikan ID produk yang dimasukkan sudah benar</li>
          <li>• Coba gunakan ID contoh: <code className="bg-blue-100 px-1 rounded">mock-001</code> atau <code className="bg-blue-100 px-1 rounded">mock-002</code></li>
          <li>• Produk mungkin belum terdaftar dalam sistem</li>
          <li>• Hubungi admin jika masalah terus berlanjut</li>
        </ul>
      </div>
    </div>
  );
}