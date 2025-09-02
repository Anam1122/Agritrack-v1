'use client';

import { useState, useEffect } from 'react';
import { getAllProducts } from '@/lib/agritrack';
import { 
  FaSpinner, 
  FaExclamationTriangle, 
  FaLeaf, 
  FaMapMarkerAlt, 
  FaCalendarAlt,
  FaSeedling,
  FaEye,
  FaSync,
  FaChartBar,
  FaBoxOpen
} from 'react-icons/fa';

interface Product {
  id: string;
  name: string;
  farmLocation: string;
  harvestDate: string;
  variety: string;
}

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'harvestDate' | 'farmLocation'>('harvestDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError('');
      const allProducts = await getAllProducts();
      setProducts(allProducts);
    } catch (err) {
      setError('Gagal memuat data produk. Silakan coba lagi.');
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Filter products based on search term
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.farmLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.variety.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'harvestDate') {
      return sortOrder === 'asc' 
        ? new Date(a.harvestDate).getTime() - new Date(b.harvestDate).getTime()
        : new Date(b.harvestDate).getTime() - new Date(a.harvestDate).getTime();
    }
    
    if (sortBy === 'name') {
      return sortOrder === 'asc' 
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    }

    return sortOrder === 'asc' 
      ? a.farmLocation.localeCompare(b.farmLocation)
      : b.farmLocation.localeCompare(a.farmLocation);
  });

  const toggleSort = (field: 'name' | 'harvestDate' | 'farmLocation') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4"></div>
        <p className="text-gray-600">Memuat data produk...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-6 rounded-xl border border-red-200">
        <div className="flex items-center mb-3">
          <FaExclamationTriangle className="text-red-500 mr-2" />
          <h3 className="text-red-800 font-medium">Terjadi Kesalahan</h3>
        </div>
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={loadProducts}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center"
        >
          <FaSync className="mr-2" />
          Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-2">
          <div className="bg-green-100 p-3 rounded-full mr-3">
            <FaLeaf className="text-green-600 text-xl" />
          </div>
          <h2 className="text-2xl font-bold text-green-800">Daftar Produk</h2>
        </div>
        <p className="text-gray-600">Kelola dan pantau semua produk pertanian Anda</p>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Search Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cari Produk
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Cari berdasarkan nama, lokasi, atau varietas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLeaf className="text-gray-400" />
              </div>
            </div>
          </div>

          {/* Sort Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Urutkan Berdasarkan
            </label>
            <div className="flex space-x-2">
              <button
                onClick={() => toggleSort('name')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  sortBy === 'name'
                    ? 'bg-green-100 text-green-700 border border-green-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Nama {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
              </button>
              <button
                onClick={() => toggleSort('harvestDate')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  sortBy === 'harvestDate'
                    ? 'bg-green-100 text-green-700 border border-green-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Tanggal {sortBy === 'harvestDate' && (sortOrder === 'asc' ? '↑' : '↓')}
              </button>
              <button
                onClick={() => toggleSort('farmLocation')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  sortBy === 'farmLocation'
                    ? 'bg-green-100 text-green-700 border border-green-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Lokasi {sortBy === 'farmLocation' && (sortOrder === 'asc' ? '↑' : '↓')}
              </button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">
            Menampilkan {sortedProducts.length} dari {products.length} produk
          </span>
          <button
            onClick={loadProducts}
            className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center"
          >
            <FaSync className="mr-1" />
            Refresh
          </button>
        </div>
      </div>

      {/* Products Grid */}
      {sortedProducts.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <FaBoxOpen className="text-gray-300 text-5xl mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? 'Produk tidak ditemukan' : 'Belum ada produk'}
          </h3>
          <p className="text-gray-500">
            {searchTerm
              ? 'Coba gunakan kata kunci pencarian yang berbeda'
              : 'Tambahkan produk pertama Anda untuk memulai'}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {sortedProducts.map((product) => (
              <div key={product.id} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-semibold text-green-800 text-lg truncate" title={product.name}>
                    {product.name}
                  </h3>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full whitespace-nowrap">
                    #{product.id.slice(0, 6)}
                  </span>
                </div>
                
                <div className="space-y-3 mb-4">
                  <div className="flex items-center">
                    <FaMapMarkerAlt className="text-gray-400 mr-3 flex-shrink-0" />
                    <span className="text-sm text-gray-600 truncate" title={product.farmLocation}>
                      {product.farmLocation}
                    </span>
                  </div>
                  
                  <div className="flex items-center">
                    <FaCalendarAlt className="text-gray-400 mr-3 flex-shrink-0" />
                    <span className="text-sm text-gray-600">{formatDate(product.harvestDate)}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <FaSeedling className="text-gray-400 mr-3 flex-shrink-0" />
                    <span className="text-sm text-gray-600">{product.variety}</span>
                  </div>
                </div>

                <button
                  onClick={() => window.open(`/product/${product.id}`, '_blank')}
                  className="w-full bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition-colors flex items-center justify-center"
                >
                  <FaEye className="mr-2" />
                  Lihat Detail
                </button>
              </div>
            ))}
          </div>

          {/* Statistics */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center mb-4">
              <FaChartBar className="text-green-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-800">Statistik Produk</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{products.length}</div>
                <div className="text-sm text-gray-600">Total Produk</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {new Set(products.map(p => p.farmLocation)).size}
                </div>
                <div className="text-sm text-gray-600">Lokasi Berbeda</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {new Set(products.map(p => p.variety)).size}
                </div>
                <div className="text-sm text-gray-600">Varietas Unik</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {Math.max(...products.map(p => new Date(p.harvestDate).getTime())) > Date.now() - 30 * 24 * 60 * 60 * 1000 
                    ? products.filter(p => new Date(p.harvestDate).getTime() > Date.now() - 30 * 24 * 60 * 60 * 1000).length
                    : 0}
                </div>
                <div className="text-sm text-gray-600">Panen 30 Hari Terakhir</div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}