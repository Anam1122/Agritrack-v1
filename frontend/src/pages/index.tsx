import { useState, useEffect } from 'react';
import { auth, login, logout } from '@/lib/auth';
import ProductForm from '@/components/ProductForm';
import ProductView from '@/components/ProductView';
import ProductList from '@/components/ProductList';
import SimpleQRGenerator from '@/components/SimpleQRGenerator';
import { 
  FaPlus, 
  FaSearch, 
  FaList, 
  FaQrcode, 
  FaUser, 
  FaSignOutAlt, 
  FaLeaf,
  FaSpinner,
  FaBox,
  FaChartLine,
  FaShieldAlt,
  FaGlobe
} from 'react-icons/fa';

// Definisikan User interface di luar komponen
interface User {
  principal: string;
  isAuthenticated: boolean;
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('add');
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await auth();
        setUser(user);
      } catch (error) {
        console.error('Authentication error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const user = await login();
      setUser(user);
    } catch (error) {
      console.error('Login error:', error);
      alert('Login gagal. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      alert('Logout gagal. Silakan coba lagi.');
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-green-800 font-medium">Memuat AgriTrack...</p>
          <p className="text-sm text-green-600 mt-2">Menyiapkan aplikasi</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
              <FaLeaf className="text-4xl text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-green-800 mb-3">AgriTrack</h1>
            <p className="text-gray-600">Sistem Pelacakan Produk Pertanian Berbasis Blockchain</p>
          </div>
          
          <button 
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-medium py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center shadow-md hover:shadow-lg disabled:shadow-none"
          >
            {isLoading ? (
              <FaSpinner className="animate-spin mr-3" />
            ) : (
              <FaUser className="mr-3" />
            )}
            Login dengan Internet Identity
          </button>
          
          <div className="mt-8 p-6 bg-green-50 rounded-xl border border-green-200">
            <h3 className="font-semibold text-green-800 mb-4 text-center flex items-center justify-center">
              <FaLeaf className="mr-2" />
              Fitur Unggulan
            </h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="bg-green-200 p-2 rounded-lg mr-3">
                  <FaBox className="text-green-700" />
                </div>
                <div>
                  <h4 className="font-medium text-green-800">Manajemen Produk</h4>
                  <p className="text-sm text-green-600">Kelola data produk pertanian dengan mudah</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-green-200 p-2 rounded-lg mr-3">
                  <FaChartLine className="text-green-700" />
                </div>
                <div>
                  <h4 className="font-medium text-green-800">Pelacakan Rantai Pasok</h4>
                  <p className="text-sm text-green-600">Lacak perjalanan produk dari farm to table</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-green-200 p-2 rounded-lg mr-3">
                  <FaQrcode className="text-green-700" />
                </div>
                <div>
                  <h4 className="font-medium text-green-800">QR Code Verification</h4>
                  <p className="text-sm text-green-600">Verifikasi keaslian produk dengan QR code</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-green-200 p-2 rounded-lg mr-3">
                  <FaShieldAlt className="text-green-700" />
                </div>
                <div>
                  <h4 className="font-medium text-green-800">Blockchain Security</h4>
                  <p className="text-sm text-green-600">Data terjamin keamanannya dengan teknologi blockchain</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Powered by Internet Computer Protocol
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-xl mr-3">
                <FaLeaf className="text-2xl text-green-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-green-800">AgriTrack</h1>
                <p className="text-xs text-green-600">Blockchain Product Tracking</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center bg-green-50 rounded-full py-2 px-4 border border-green-200">
                <FaUser className="text-green-600 text-sm mr-2" />
                <span className="text-sm text-green-700 font-medium">
                  {user.principal?.slice(0, 6)}...{user.principal?.slice(-4)}
                </span>
              </div>
              
              <button 
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:from-red-300 disabled:to-red-400 text-white font-medium py-2 px-4 rounded-xl transition-all duration-200 flex items-center shadow-md hover:shadow-lg disabled:shadow-none"
              >
                {isLoggingOut ? (
                  <FaSpinner className="animate-spin mr-2" />
                ) : (
                  <FaSignOutAlt className="mr-2" />
                )}
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white mb-8 shadow-lg">
          <div className="flex items-center">
            <div className="bg-white/20 p-3 rounded-full mr-4">
              <FaGlobe className="text-2xl" />
            </div>
            <div>
              <h2 className="text-xl font-bold mb-1">Selamat Datang di AgriTrack!</h2>
              <p className="opacity-90">Kelola dan lacak produk pertanian Anda dengan teknologi blockchain</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Navigation Tabs */}
          <div className="border-b border-gray-200 bg-gray-50">
            <nav className="flex overflow-x-auto">
              {[
                { id: 'add', label: 'Tambah Produk', icon: FaPlus },
                { id: 'view', label: 'Cari Produk', icon: FaSearch },
                { id: 'list', label: 'Daftar Produk', icon: FaList },
                { id: 'qr', label: 'Generator QR', icon: FaQrcode }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 md:flex-none py-5 px-6 border-b-2 font-medium text-sm flex items-center justify-center whitespace-nowrap min-w-[120px] ${
                    activeTab === tab.id
                      ? 'border-green-500 text-green-600 bg-white shadow-sm'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  } transition-all duration-200`}
                >
                  <tab.icon className="mr-2 text-base" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content berdasarkan tab */}
          <div className="p-6 md:p-8">
            {activeTab === 'add' && <ProductForm />}
            {activeTab === 'view' && <ProductView />}
            {activeTab === 'list' && <ProductList />}
            {activeTab === 'qr' && <SimpleQRGenerator />}
          </div>
        </div>

        {/* Stats Footer */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl shadow-sm text-center">
            <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
              <FaLeaf className="text-green-600" />
            </div>
            <p className="text-sm text-gray-600">Produk Terdaftar</p>
            <p className="font-bold text-green-700">100+</p>
          </div>
          
          <div className="bg-white p-4 rounded-xl shadow-sm text-center">
            <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
              <FaChartLine className="text-blue-600" />
            </div>
            <p className="text-sm text-gray-600">Rantai Pasok</p>
            <p className="font-bold text-blue-700">500+</p>
          </div>
          
          <div className="bg-white p-4 rounded-xl shadow-sm text-center">
            <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
              <FaQrcode className="text-purple-600" />
            </div>
            <p className="text-sm text-gray-600">QR Generated</p>
            <p className="font-bold text-purple-700">250+</p>
          </div>
          
          <div className="bg-white p-4 rounded-xl shadow-sm text-center">
            <div className="bg-orange-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
              <FaShieldAlt className="text-orange-600" />
            </div>
            <p className="text-sm text-gray-600">Keamanan</p>
            <p className="font-bold text-orange-700">100%</p>
          </div>
        </div>

        {/* Info Footer */}
        <div className="mt-8 text-center">
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <div className="flex items-center justify-center mb-3">
              <FaLeaf className="text-green-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-800">AgriTrack</h3>
            </div>
            <p className="text-gray-600 mb-2">Sistem Pelacakan Produk Pertanian berbasis Blockchain</p>
            <p className="text-sm text-gray-500">Powered by Internet Computer Protocol 🌐</p>
          </div>
        </div>
      </main>
    </div>
  );
}