'use client';

import { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';
import { 
  FaCopy, 
  FaDownload, 
  FaExternalLinkAlt, 
  FaQrcode,
  FaMobileAlt,
  FaWifi,
  FaInfoCircle,
  FaCheckCircle
} from 'react-icons/fa';

interface RealQRCodeDisplayProps {
  productId: string;
  productName: string;
}

export default function RealQRCodeDisplay({ productId, productName }: RealQRCodeDisplayProps) {
  const [qrUrl, setQrUrl] = useState('');
  const [isClient, setIsClient] = useState(false);
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
      const isDevelopment = process.env.NODE_ENV === 'development';
      const isLocalhost = window.location.hostname === 'localhost' || 
                         window.location.hostname === '127.0.0.1';
      
      let baseUrl = window.location.origin;
      
      if (isDevelopment && isLocalhost) {
        // Untuk development di localhost, gunakan network IP
        baseUrl = 'http://192.168.18.213:3000'; // ← GUNAKAN IP KOMPUTER ANDA
      }
      
      setQrUrl(`${baseUrl}/product/${productId}`);
    }
  }, [productId]);

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(qrUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Gagal menyalin URL:', error);
      // Fallback untuk browser lama
      const textArea = document.createElement('textarea');
      textArea.value = qrUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const downloadQR = () => {
    if (!isClient) return;
    
    const svg = document.getElementById('qr-code-svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([svgData], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);

    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = `agritrack-${productId}-${productName}.svg`.replace(/\s+/g, '-').toLowerCase();
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(url);
    
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  const openUrl = () => {
    window.open(qrUrl, '_blank');
  };

  if (!isClient) {
    return (
      <div className="flex flex-col items-center justify-center p-6">
        <div className="w-40 h-40 bg-gray-100 rounded-xl flex items-center justify-center mb-4">
          <FaQrcode className="text-gray-300 text-4xl animate-pulse" />
        </div>
        <p className="text-gray-600">Mempersiapkan QR Code...</p>
      </div>
    );
  }

  return (
    <div className="max-w-sm mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="bg-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3">
          <FaQrcode className="text-blue-600 text-2xl" />
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">QR Code Produk</h3>
        <p className="text-gray-600">Scan untuk melihat informasi lengkap produk</p>
      </div>

      {/* QR Code Display */}
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 mb-6">
        <div className="flex justify-center mb-4">
          <div className="bg-white p-4 rounded-xl border-2 border-gray-200">
            <QRCode
              id="qr-code-svg"
              value={qrUrl}
              size={200}
              level="H"
              style={{ 
                height: "auto", 
                maxWidth: "100%", 
                width: "100%",
                padding: '4px',
                backgroundColor: 'white'
              }}
            />
          </div>
        </div>
        
        <div className="text-center">
          <p className="text-sm font-medium text-gray-700 mb-1">{productName}</p>
          <p className="text-xs text-gray-500">ID: {productId}</p>
        </div>
      </div>

      {/* URL Display */}
      <div className="bg-gray-50 p-4 rounded-xl mb-6">
        <div className="flex items-center mb-2">
          <FaWifi className="text-gray-400 mr-2" />
          <span className="text-sm font-medium text-gray-700">URL Produk</span>
        </div>
        <div className="bg-white p-3 rounded-lg border border-gray-200 mb-3">
          <p className="text-xs font-mono break-all text-gray-800">{qrUrl}</p>
        </div>
        <p className="text-xs text-gray-500 flex items-center">
          <FaInfoCircle className="mr-1" />
          Pastikan perangkat dalam jaringan yang sama untuk testing
        </p>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <button
          onClick={copyUrl}
          className="w-full bg-blue-600 text-white px-4 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
        >
          {copied ? (
            <>
              <FaCheckCircle className="mr-2" />
              Berhasil Disalin!
            </>
          ) : (
            <>
              <FaCopy className="mr-2" />
              Salin URL
            </>
          )}
        </button>

        <button
          onClick={downloadQR}
          className="w-full bg-green-600 text-white px-4 py-3 rounded-xl font-medium hover:bg-green-700 transition-colors flex items-center justify-center"
        >
          {downloaded ? (
            <>
              <FaCheckCircle className="mr-2" />
              Terdownload!
            </>
          ) : (
            <>
              <FaDownload className="mr-2" />
              Download QR Code
            </>
          )}
        </button>

        <button
          onClick={openUrl}
          className="w-full bg-purple-600 text-white px-4 py-3 rounded-xl font-medium hover:bg-purple-700 transition-colors flex items-center justify-center"
        >
          <FaExternalLinkAlt className="mr-2" />
          Buka Halaman Produk
        </button>
      </div>

      {/* Instructions */}
      <div className="mt-6 bg-blue-50 p-4 rounded-xl border border-blue-200">
        <h4 className="font-medium text-blue-800 mb-2 flex items-center">
          <FaMobileAlt className="mr-2" />
          Cara Menggunakan QR Code
        </h4>
        <ul className="text-sm text-blue-600 space-y-1">
          <li>• Buka aplikasi kamera di smartphone</li>
          <li>• Arahkan kamera ke QR code</li>
          <li>• Ketuk notifikasi yang muncul</li>
          <li>• Atau gunakan aplikasi QR scanner</li>
        </ul>
      </div>

      {/* Development Notice */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-4 bg-amber-50 p-3 rounded-xl border border-amber-200">
          <div className="flex items-center">
            <FaInfoCircle className="text-amber-500 mr-2" />
            <span className="text-sm text-amber-700 font-medium">Mode Development</span>
          </div>
          <p className="text-xs text-amber-600 mt-1">
            QR code mengarah ke: {qrUrl.includes('192.168') ? 'network IP' : 'localhost'}
          </p>
        </div>
      )}
    </div>
  );
}