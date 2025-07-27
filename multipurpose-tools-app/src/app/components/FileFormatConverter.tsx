'use client';

import { useState } from 'react';
import mammoth from 'mammoth';

const Upload = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
  </svg>
);

const Download = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

export default function FileFormatConverter() {
  const [file, setFile] = useState<File | null>(null);
  const [converting, setConverting] = useState(false);
  const [targetFormat, setTargetFormat] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
      setTargetFormat('');
    }
  };

  const getAvailableFormats = () => {
    if (!file) return [];
    
    const ext = file.name.split('.').pop()?.toLowerCase();
    
    switch (ext) {
      case 'docx':
        return ['txt', 'html'];
      case 'png':
        return ['jpg', 'jpeg', 'webp'];
      case 'jpg':
      case 'jpeg':
        return ['png', 'webp'];
      case 'webp':
        return ['png', 'jpg', 'jpeg'];
      default:
        return [];
    }
  };

  const convertFile = async () => {
    if (!file || !targetFormat) return;
    setConverting(true);

    try {
      const ext = file.name.split('.').pop()?.toLowerCase();
      
      if (ext === 'docx' && targetFormat === 'txt') {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        const blob = new Blob([result.value], { type: 'text/plain' });
        downloadFile(blob, file.name.replace('.docx', '.txt'));
      } else if (['png', 'jpg', 'jpeg', 'webp'].includes(ext || '')) {
        await convertImage(file, targetFormat);
      }
    } catch (error) {
      alert('Conversion failed');
    } finally {
      setConverting(false);
    }
  };

  const convertImage = async (file: File, format: string) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    return new Promise((resolve) => {
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        
        const mimeType = format === 'jpg' ? 'image/jpeg' : `image/${format}`;
        canvas.toBlob((blob) => {
          if (blob) {
            const newName = file.name.replace(/\.[^/.]+$/, `.${format}`);
            downloadFile(blob, newName);
          }
          resolve(null);
        }, mimeType, 0.9);
      };
      img.src = URL.createObjectURL(file);
    });
  };

  const downloadFile = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">File Format Converter</h2>
      
      <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center mb-6">
        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <input
          type="file"
          accept=".docx,.png,.jpg,.jpeg,.webp"
          onChange={handleFileChange}
          className="hidden"
          id="format-input"
        />
        <label htmlFor="format-input" className="cursor-pointer">
          <span className="text-lg font-medium text-gray-700">Select File to Convert</span>
          <p className="text-gray-500 mt-2">Supports DOCX, PNG, JPG, WEBP</p>
        </label>
      </div>

      {file && (
        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-3">Selected: {file.name}</p>
          
          {getAvailableFormats().length > 0 && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Convert to:</label>
              <select
                value={targetFormat}
                onChange={(e) => setTargetFormat(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="">Select format</option>
                {getAvailableFormats().map(format => (
                  <option key={format} value={format}>{format.toUpperCase()}</option>
                ))}
              </select>
            </div>
          )}

          <button
            onClick={convertFile}
            disabled={!targetFormat || converting}
            className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 disabled:opacity-50"
          >
            <Download className="w-5 h-5 inline mr-2" />
            {converting ? 'Converting...' : `Convert to ${targetFormat.toUpperCase()}`}
          </button>
        </div>
      )}
    </div>
  );
}