'use client';

import { JSX } from 'react';
import { 
  FaLeaf, 
  FaMapMarkerAlt, 
  FaCalendarAlt,
  FaSeedling,
  FaHistory,
  FaUser,
  FaClock,
  FaLock,
  FaBox,
  FaTruck,
  FaStore
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

interface PublicProductViewProps {
  product: Product;
  stages: ProductStage[];
}

export default function PublicProductView({ product, stages }: PublicProductViewProps) {
  const getStageInfo = (stageType: string) => {
    const stageInfo: { [key: string]: { label: string; icon: JSX.Element; color: string } } = {
      'harvest': { 
        label: 'Panen', 
        icon: <FaLeaf className="text-green-500" />,
        color: 'bg-green-100 text-green-800 border-green-200'
      },
      'process': { 
        label: 'Pengolahan', 
        icon: <FaBox className="text-blue-500" />,
        color: 'bg-blue-100 text-blue-800 border-blue-200'
      },
      'distribute': { 
        label: 'Distribusi', 
        icon: <FaTruck className="text-orange-500" />,
        color: 'bg-orange-100 text-orange-800 border-orange-200'
      },
      'retail': { 
        label: 'Penjualan', 
        icon: <FaStore className="text-purple-500" />,
        color: 'bg-purple-100 text-purple-800 border-purple-200'
      }
    };
    return stageInfo[stageType] || { 
      label: stageType, 
      icon: <FaHistory className="text-gray-500" />, 
      color: 'bg-gray-100 text-gray-800 border-gray-200' 
    };
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

  const formatHarvestDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Product Header */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-full mr-4">
              <FaLeaf className="text-green-600 text-xl" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-green-800">{product.name}</h1>
              <p className="text-gray-600">ID: {product.id}</p>
            </div>
          </div>
          <div className="bg-green-50 px-3 py-1 rounded-full">
            <span className="text-green-700 text-sm font-medium">Produk Aktif</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-gray-100">
          <div className="flex items-center">
            <FaMapMarkerAlt className="text-green-500 mr-3 text-lg" />
            <div>
              <p className="text-sm text-gray-600">Lokasi Pertanian</p>
              <p className="font-medium text-gray-800">{product.farmLocation}</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <FaCalendarAlt className="text-green-500 mr-3 text-lg" />
            <div>
              <p className="text-sm text-gray-600">Tanggal Panen</p>
              <p className="font-medium text-gray-800">{formatHarvestDate(product.harvestDate)}</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <FaSeedling className="text-green-500 mr-3 text-lg" />
            <div>
              <p className="text-sm text-gray-600">Varietas</p>
              <p className="font-medium text-gray-800">{product.variety}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Supply Chain Timeline */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <FaHistory className="text-blue-500 mr-3 text-lg" />
            <h2 className="text-xl font-bold text-gray-800">Rantai Pasok Produk</h2>
          </div>
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
            {stages.length} Tahapan
          </span>
        </div>

        {stages.length > 0 ? (
          <div className="space-y-4">
            {stages.map((stage, index) => {
              const stageInfo = getStageInfo(stage.stageType);
              return (
                <div key={stage.id} className="flex">
                  {/* Timeline indicator */}
                  <div className="flex flex-col items-center mr-4">
                    <div className={`w-10 h-10 rounded-full ${stageInfo.color} border-4 border-white shadow-sm flex items-center justify-center`}>
                      {stageInfo.icon}
                    </div>
                    {index < stages.length - 1 && (
                      <div className="w-1 h-16 bg-gray-200 my-2"></div>
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${stageInfo.color} border`}>
                          {stageInfo.icon}
                          <span className="ml-2">{stageInfo.label}</span>
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <FaClock className="mr-1 text-xs" />
                        <span>{formatDate(stage.timestamp)}</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 mb-3">{stage.data}</p>
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <FaUser className="mr-2" />
                      <span>Oleh: {stage.actor}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200 text-center">
            <FaHistory className="text-yellow-400 text-3xl mx-auto mb-3" />
            <h3 className="text-lg font-medium text-yellow-800 mb-2">Belum Ada Data Rantai Pasok</h3>
            <p className="text-yellow-600">Produk ini belum memiliki catatan rantai pasok.</p>
          </div>
        )}
      </div>

      {/* Authentication Notice */}
      <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
        <div className="flex items-start">
          <div className="bg-blue-100 p-2 rounded-full mr-4 flex-shrink-0">
            <FaLock className="text-blue-600 text-lg" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-blue-800 mb-2">Akses Terbatas</h3>
            <p className="text-blue-700 mb-3">
              Hanya stakeholder yang terautentikasi yang dapat menambah tahapan rantai pasok.
            </p>
            <div className="bg-white p-3 rounded-lg border border-blue-100">
              <p className="text-sm text-blue-600">
                🔐 Login sebagai produsen, distributor, atau retailer untuk memperbarui informasi rantai pasok.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Product Verification */}
      <div className="bg-green-50 p-6 rounded-xl border border-green-200">
        <div className="flex items-center">
          <div className="bg-green-100 p-2 rounded-full mr-4">
            <FaLeaf className="text-green-600 text-lg" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-green-800 mb-1">Produk Terverifikasi</h3>
            <p className="text-green-700">
              Informasi produk ini tercatat pada blockchain AgriTrack dan dapat diverifikasi keasliannya.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}