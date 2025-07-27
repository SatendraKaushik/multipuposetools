'use client';

import { useState, useRef } from 'react';
import QRCode from 'qrcode';

const Download = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const Upload = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
  </svg>
);

export default function QrGenerator() {
  const [text, setText] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [mode, setMode] = useState<'generate' | 'scan'>('generate');
  const [scanResult, setScanResult] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateQR = async () => {
    if (!text.trim()) return;
    
    try {
      const qrDataURL = await QRCode.toDataURL(text, {
        width: 300,
        margin: 2,
      });
      setQrCode(qrDataURL);
    } catch (error) {
      alert('Failed to generate QR code');
    }
  };

  const downloadQR = () => {
    if (!qrCode) return;
    
    const a = document.createElement('a');
    a.href = qrCode;
    a.download = 'qrcode.png';
    a.click();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    
    const file = e.target.files[0];
    const reader = new FileReader();
    
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        if (canvasRef.current) {
          const canvas = canvasRef.current;
          const ctx = canvas.getContext('2d');
          canvas.width = img.width;
          canvas.height = img.height;
          ctx?.drawImage(img, 0, 0);
          
          // Simple QR code detection (placeholder - would need a proper QR scanner library)
          setScanResult('QR scanning requires additional libraries. Please use a dedicated QR scanner app.');
        }
      };
      img.src = event.target?.result as string;
    };
    
    reader.readAsDataURL(file);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 text-black">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">QR Code Generator & Scanner</h2>
      
      <div className="flex mb-6">
        <button
          onClick={() => setMode('generate')}
          className={`px-4 py-2 rounded-l-lg ${mode === 'generate' ? 'bg-pink-600 text-white' : 'bg-gray-200'}`}
        >
          Generate
        </button>
        <button
          onClick={() => setMode('scan')}
          className={`px-4 py-2 rounded-r-lg ${mode === 'scan' ? 'bg-pink-600 text-white' : 'bg-gray-200'}`}
        >
          Scan
        </button>
      </div>

      {mode === 'generate' ? (
        <div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Enter text or URL</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter text, URL, or any data to generate QR code..."
              className="w-full h-24 p-3 border rounded-lg"
            />
          </div>
          
          <button
            onClick={generateQR}
            disabled={!text.trim()}
            className="w-full bg-pink-600 text-white py-3 rounded-lg hover:bg-pink-700 disabled:opacity-50 mb-6"
          >
            Generate QR Code
          </button>

          {qrCode && (
            <div className="text-center">
              <img src={qrCode} alt="QR Code" className="mx-auto mb-4" />
              <button
                onClick={downloadQR}
                className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700"
              >
                <Download className="w-4 h-4 inline mr-2" />
                Download QR Code
              </button>
            </div>
          )}
        </div>
      ) : (
        <div>
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center mb-6">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="qr-scan-input"
            />
            <label htmlFor="qr-scan-input" className="cursor-pointer">
              <span className="text-lg font-medium text-gray-700">Upload QR Code Image</span>
              <p className="text-gray-500 mt-2">Select an image containing a QR code</p>
            </label>
          </div>

          {scanResult && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-800 mb-2">Scan Result:</h3>
              <p className="text-gray-600">{scanResult}</p>
            </div>
          )}

          <canvas ref={canvasRef} className="hidden" />
        </div>
      )}
    </div>
  );
}