'use client';

import { JSX, useState } from 'react';
import { addProductStage } from '@/lib/agritrack';
import { auth } from '@/lib/auth';
import { 
  FaPlus, 
  FaCheck, 
  FaInfoCircle, 
  FaSpinner,
  FaLeaf,
  FaIndustry,
  FaTruck,
  FaStore
} from 'react-icons/fa';

interface AddProductStageProps {
  productId: string;
  onStageAdded: () => void;
}

// Definisikan type untuk stage options
interface StageOption {
  value: string;
  label: string;
  icon: JSX.Element;
  description: string;
}

export default function AddProductStage({ productId, onStageAdded }: AddProductStageProps) {
  const [stageType, setStageType] = useState<string>('harvest');
  const [stageData, setStageData] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  const stageOptions: StageOption[] = [
    { 
      value: 'harvest', 
      label: 'Panen', 
      icon: <FaLeaf className="text-green-500" />,
      description: 'Tahap pemanenan produk dari lahan pertanian'
    },
    { 
      value: 'process', 
      label: 'Pengolahan', 
      icon: <FaIndustry className="text-blue-500" />,
      description: 'Tahap pengolahan produk menjadi bentuk siap distribusi'
    },
    { 
      value: 'distribute', 
      label: 'Distribusi', 
      icon: <FaTruck className="text-orange-500" />,
      description: 'Tahap pendistribusian produk ke berbagai lokasi'
    },
    { 
      value: 'retail', 
      label: 'Penjualan', 
      icon: <FaStore className="text-purple-500" />,
      description: 'Tahap penjualan produk ke konsumen akhir'
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validasi input
    if (!stageData.trim()) {
      setMessage('❌ Informasi tahapan tidak boleh kosong');
      return;
    }

    if (stageData.trim().length < 5) {
      setMessage('❌ Informasi tahapan minimal 5 karakter');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      // Cek authentication
      const user = await auth();
      if (!user?.isAuthenticated) {
        setMessage('❌ Anda harus login untuk menambah tahapan');
        setLoading(false);
        return;
      }

      const success = await addProductStage(productId, stageType, stageData.trim());
      
      if (success) {
        setMessage('✅ Tahapan berhasil ditambahkan!');
        setStageData('');
        onStageAdded(); // Refresh data parent
      } else {
        setMessage('❌ Gagal menambah tahapan');
      }
    } catch (error: unknown) {
      setMessage(`❌ Error: ${error instanceof Error ? error.message : 'Terjadi kesalahan'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setStageData(e.target.value);
    // Clear message ketika user mulai mengetik lagi
    if (message) setMessage('');
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStageType(e.target.value);
  };

  const selectedStage = stageOptions.find(option => option.value === stageType);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mt-6">
      <div className="flex items-center mb-4">
        <div className="bg-green-100 p-2 rounded-lg mr-3">
          <FaPlus className="text-green-600 text-lg" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800">Tambah Tahapan Rantai Pasok</h3>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Stage Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Jenis Tahapan *
          </label>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
            {stageOptions.map(option => (
              <div
                key={option.value}
                onClick={() => setStageType(option.value)}
                className={`p-3 border rounded-lg cursor-pointer transition-all ${
                  stageType === option.value
                    ? 'border-green-500 bg-green-50 shadow-sm'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center mb-2">
                  <div className="text-lg mr-2">{option.icon}</div>
                  <span className="font-medium text-sm">{option.label}</span>
                </div>
                <p className="text-xs text-gray-500">{option.description}</p>
              </div>
            ))}
          </div>

          {/* Fallback dropdown for mobile */}
          <select
            value={stageType}
            onChange={handleSelectChange}
            className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent md:hidden"
            required
            disabled={loading}
          >
            {stageOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Stage Information */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Informasi Tahapan *
          </label>
          <textarea
            value={stageData}
            onChange={handleInputChange}
            placeholder={`Contoh: ${selectedStage?.description}...`}
            rows={4}
            className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
            required
            disabled={loading}
            minLength={5}
            maxLength={500}
          />
          <div className="flex justify-between items-center mt-1">
            <p className="text-xs text-gray-500">
              Minimal 5 karakter, maksimal 500 karakter
            </p>
            <span className={`text-xs ${
              stageData.length > 500 ? 'text-red-500' : 'text-gray-400'
            }`}>
              {stageData.length}/500
            </span>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || stageData.length > 500}
          className="w-full bg-green-600 text-white px-4 py-3 rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
        >
          {loading ? (
            <>
              <FaSpinner className="animate-spin mr-2" />
              Menambahkan...
            </>
          ) : (
            <>
              <FaCheck className="mr-2" />
              Tambah Tahapan
            </>
          )}
        </button>
      </form>

      {/* Message Feedback */}
      {message && (
        <div className={`mt-4 p-4 rounded-lg text-sm ${
          message.includes('✅') 
            ? 'bg-green-50 text-green-700 border border-green-200' 
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          <div className="flex items-center">
            {message.includes('✅') ? (
              <FaCheck className="mr-2 flex-shrink-0" />
            ) : (
              <FaInfoCircle className="mr-2 flex-shrink-0" />
            )}
            <span>{message}</span>
          </div>
        </div>
      )}

      {/* Informasi tambahan */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
        <div className="flex items-start">
          <FaInfoCircle className="text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-blue-800 mb-1">Tips Menambah Tahapan</p>
            <ul className="text-xs text-blue-600 space-y-1">
              <li>• Cantumkan lokasi dan waktu yang spesifik</li>
              <li>• Jelaskan metode atau proses yang digunakan</li>
              <li>• Tambahkan informasi suhu atau kondisi penyimpanan jika relevan</li>
              <li>• Sertakan nama pihak yang bertanggung jawab</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}