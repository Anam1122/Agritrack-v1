import { useState, useEffect } from 'react';
import { addProduct, getAllProducts } from '@/lib/agritrack';
import { 
  FaPlus, 
  FaSpinner, 
  FaCheck, 
  FaLeaf, 
  FaMapMarkerAlt, 
  FaCalendarAlt,
  FaSeedling,
  FaInfoCircle
} from 'react-icons/fa';

interface Product {
  id: string;
  name: string;
  farmLocation: string;
  harvestDate: string;
  variety: string;
}

function ProductForm() {
  const [formData, setFormData] = useState({
    name: '',
    farmLocation: '',
    harvestDate: '',
    variety: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [showProducts, setShowProducts] = useState(false);

  useEffect(() => {
    console.log("🔍 Component mounted, loading products...");
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      console.log("🔄 Loading products...");
      const allProducts = await getAllProducts();
      console.log("📦 Products loaded:", allProducts);
      setProducts(allProducts);
    } catch (error) {
      console.log('❌ Error loading products:', error);
    }
  };

  const addSampleData = async () => {
    setLoading(true);
    setMessage('');
    try {
      await addProduct("Beras Organik", "Subang, Jawa Barat", "2023-10-15", "Pandan Wangi");
      await addProduct("Kopi Arabica", "Aceh Gayo", "2023-09-20", "Gayo");
      await addProduct("Teh Hijau", "Bandung", "2023-11-01", "Jepang");
      await loadProducts();
      setMessage("✅ Sample data berhasil ditambahkan!");
    } catch (error) {
      setMessage('❌ Error menambah sample data: ' + error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    try {
      console.log("📝 Adding product:", formData);
      const productId = await addProduct(
        formData.name,
        formData.farmLocation,
        formData.harvestDate,
        formData.variety
      );
      
      setMessage(`✅ Produk berhasil ditambahkan dengan ID: ${productId}`);
      setFormData({ name: '', farmLocation: '', harvestDate: '', variety: '' });
      
      // Reload products after a short delay
      setTimeout(async () => {
        await loadProducts();
      }, 500);
      
    } catch (error) {
      setMessage('❌ Error: ' + error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear message when user starts typing
    if (message) setMessage('');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-2">
          <div className="bg-green-100 p-3 rounded-full mr-3">
            <FaLeaf className="text-green-600 text-xl" />
          </div>
          <h2 className="text-2xl font-bold text-green-800">Tambah Produk Baru</h2>
        </div>
        <p className="text-gray-600">Lengkapi informasi produk pertanian Anda</p>
      </div>

      {/* Form Section */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nama Produk */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaLeaf className="inline mr-2 text-green-500" />
                Nama Produk *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Contoh: Beras Organik"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
              />
            </div>
            
            {/* Varietas */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaSeedling className="inline mr-2 text-green-500" />
                Varietas *
              </label>
              <input
                type="text"
                name="variety"
                value={formData.variety}
                onChange={handleChange}
                required
                placeholder="Contoh: Pandan Wangi"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
              />
            </div>
            
            {/* Lokasi Pertanian */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaMapMarkerAlt className="inline mr-2 text-green-500" />
                Lokasi Pertanian *
              </label>
              <input
                type="text"
                name="farmLocation"
                value={formData.farmLocation}
                onChange={handleChange}
                required
                placeholder="Contoh: Subang, Jawa Barat"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
              />
            </div>
            
            {/* Tanggal Panen */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaCalendarAlt className="inline mr-2 text-green-500" />
                Tanggal Panen *
              </label>
              <input
                type="date"
                name="harvestDate"
                value={formData.harvestDate}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center justify-center"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  Menambahkan...
                </>
              ) : (
                <>
                  <FaPlus className="mr-2" />
                  Tambah Produk
                </>
              )}
            </button>
            
            <button
              type="button"
              onClick={addSampleData}
              disabled={loading}
              className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              Tambah Sample Data
            </button>
          </div>
        </form>

        {/* Message Feedback */}
        {message && (
          <div className={`mt-6 p-4 rounded-lg border ${
            message.includes('✅') 
              ? 'bg-green-50 text-green-700 border-green-200' 
              : 'bg-red-50 text-red-700 border-red-200'
          }`}>
            <div className="flex items-center">
              {message.includes('✅') ? (
                <FaCheck className="mr-2 text-green-500" />
              ) : (
                <FaInfoCircle className="mr-2 text-red-500" />
              )}
              <span>{message}</span>
            </div>
          </div>
        )}
      </div>

      {/* Products List Section */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Daftar Produk</h3>
            <p className="text-sm text-gray-600">{products.length} produk terdaftar</p>
          </div>
          <button
            onClick={() => setShowProducts(!showProducts)}
            className="px-4 py-2 text-sm text-green-600 hover:text-green-700 font-medium"
          >
            {showProducts ? 'Sembunyikan' : 'Tampilkan'}
          </button>
        </div>

        {showProducts && (
          <>
            {products.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <FaLeaf className="text-gray-300 text-4xl mx-auto mb-3" />
                <p className="text-gray-500">Belum ada produk. Tambahkan produk pertama Anda!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {products.map((product) => (
                  <div key={product.id} className="bg-green-50 p-4 rounded-lg border border-green-200 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-green-800">{product.name}</h4>
                      <span className="bg-green-200 text-green-800 text-xs px-2 py-1 rounded-full">
                        Active
                      </span>
                    </div>
                    <div className="space-y-1 text-sm text-green-700">
                      <p><span className="font-medium">ID:</span> {product.id}</p>
                      <p><span className="font-medium">Lokasi:</span> {product.farmLocation}</p>
                      <p><span className="font-medium">Panen:</span> {formatDate(product.harvestDate)}</p>
                      <p><span className="font-medium">Varietas:</span> {product.variety}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Informasi */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-start">
          <FaInfoCircle className="text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-blue-800 mb-1">Tips Mengisi Form</p>
            <ul className="text-xs text-blue-600 space-y-1">
              <li>• Gunakan nama produk yang jelas dan deskriptif</li>
              <li>• Cantumkan lokasi pertanian yang spesifik</li>
              <li>• Pilih tanggal panen yang akurat</li>
              <li>• Tulis varietas tanaman dengan benar</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductForm;