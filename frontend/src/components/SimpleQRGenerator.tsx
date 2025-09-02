'use client';

import { useState } from 'react';
import { getProduct } from '@/lib/agritrack';
import RealQRCodeDisplay from './RealQRCodeDisplay';
import { 
  FaQrcode, 
  FaSearch, 
  FaSpinner, 
  FaExclamationTriangle, 
  FaInfoCircle,
  FaLightbulb,
  FaDownload,
  FaCheckCircle
} from 'react-icons/fa';

// Definisikan interface Product
interface Product {
  id: string;
  name: string;
  farmLocation: string;
  harvestDate: string;
  variety: string;
}

export default function SimpleQRGenerator() {
  const [productId, setProductId] = useState('');
  const [productInfo, setProductInfo] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const generateQR = async () => {
    if (!productId.trim()) {
      setError('Masukkan ID produk terlebih dahulu');
      return;
    }

    setLoading(true);
    setError('');
    setProductInfo(null);
    
    try {
      const product = await getProduct(productId.trim());
      if (!product) {
        setError('Produk tidak ditemukan. Pastikan ID produk benar.');
        return;
      }
      
      setProductInfo(product);
      
      // Tambahkan ke recent searches (maksimal 5)
      setRecentSearches(prev => {
        const newSearches = [productId.trim(), ...prev.filter(id => id !== productId.trim())];
        return newSearches.slice(0, 5);
      });
    } catch (err) {
      setError('Terjadi kesalahan saat mengambil data produk. Silakan coba lagi.');
      console.error('Error fetching product:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      generateQR();
    }
  };

  const handleRecentSearchClick = (id: string) => {
    setProductId(id);
    // Auto-search ketika recent search diklik
    setTimeout(() => generateQR(), 100);
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="bg-purple-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <FaQrcode className="text-purple-600 text-2xl" />
        </div>
        <h2 className="text-2xl font-bold text-purple-800 mb-2">Generator QR Code</h2>
        <p className="text-gray-600">Buat QR code untuk verifikasi produk oleh konsumen</p>
      </div>

      {/* Input Section */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Masukkan ID Produk
        </label>
        
        <div className="flex gap-3 mb-3">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Contoh: mock-001, mock-002, atau ID produk Anda"
              value={productId}
              onChange={(e) => {
                setProductId(e.target.value);
                setError('');
              }}
              onKeyPress={handleKeyPress}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
              disabled={loading}
            />
          </div>
          <button
            onClick={generateQR}
            disabled={loading || !productId.trim()}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
          >
            {loading ? (
              <FaSpinner className="animate-spin mr-2" />
            ) : (
              <FaQrcode className="mr-2" />
            )}
            Generate
          </button>
        </div>

        {/* Recent Searches */}
        {recentSearches.length > 0 && (
          <div className="mt-3">
            <p className="text-sm text-gray-600 mb-2">Pencarian terakhir:</p>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((id, index) => (
                <button
                  key={index}
                  onClick={() => handleRecentSearchClick(id)}
                  className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-200 transition-colors"
                >
                  {id}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mt-4 bg-red-50 p-4 rounded-lg border border-red-200">
            <div className="flex items-center">
              <FaExclamationTriangle className="text-red-500 mr-2" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}
      </div>

      {/* QR Code Display */}
      {productInfo && (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">QR Code Produk</h3>
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
              Berhasil Digenerate
            </span>
          </div>
          <RealQRCodeDisplay 
            productId={productInfo.id} 
            productName={productInfo.name}
          />
        </div>
      )}

      {/* Info Section */}
      <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
        <div className="flex items-center mb-4">
          <FaLightbulb className="text-blue-500 text-xl mr-3" />
          <h3 className="text-lg font-semibold text-blue-800">Cara Menggunakan Generator QR Code</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg border border-blue-100">
            <div className="flex items-center mb-2">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                <span className="text-blue-600 text-sm font-bold">1</span>
              </div>
              <h4 className="font-medium text-blue-700">Masukkan ID Produk</h4>
            </div>
            <p className="text-sm text-gray-600">Gunakan ID produk yang terdaftar di sistem AgriTrack</p>
          </div>

          <div className="bg-white p-4 rounded-lg border border-blue-100">
            <div className="flex items-center mb-2">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                <span className="text-blue-600 text-sm font-bold">2</span>
              </div>
              <h4 className="font-medium text-blue-700">Generate QR Code</h4>
            </div>
            <p className="text-sm text-gray-600">Klik tombol Generate untuk membuat QR code</p>
          </div>

          <div className="bg-white p-4 rounded-lg border border-blue-100">
            <div className="flex items-center mb-2">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                <span className="text-blue-600 text-sm font-bold">3</span>
              </div>
              <h4 className="font-medium text-blue-700">Download QR Code</h4>
            </div>
            <p className="text-sm text-gray-600">Download dan cetak QR code untuk ditempel pada produk</p>
          </div>

          <div className="bg-white p-4 rounded-lg border border-blue-100">
            <div className="flex items-center mb-2">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                <span className="text-blue-600 text-sm font-bold">4</span>
              </div>
              <h4 className="font-medium text-blue-700">Scan oleh Konsumen</h4>
            </div>
            <p className="text-sm text-gray-600">Konsumen dapat scan untuk verifikasi keaslian produk</p>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-6 bg-white p-4 rounded-lg border border-blue-100">
          <div className="flex items-center mb-2">
            <FaInfoCircle className="text-blue-500 mr-2" />
            <h4 className="font-medium text-blue-700">Tips Penting</h4>
          </div>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Pastikan ID produk sudah benar sebelum generate</li>
            <li>• Gunakan QR code dengan resolusi tinggi untuk hasil scan yang optimal</li>
            <li>• Cetak QR code dengan ukuran minimal 3x3 cm untuk kemudahan scanning</li>
            <li>• Tempel QR code di kemasan produk yang mudah diakses konsumen</li>
          </ul>
        </div>
      </div>
    </div>
  );
}