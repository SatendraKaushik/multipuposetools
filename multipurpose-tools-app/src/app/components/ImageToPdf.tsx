'use client';

import { useState } from 'react';
import jsPDF from 'jspdf';

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

export default function ImageToPdf() {
  const [images, setImages] = useState<File[]>([]);
  const [converting, setConverting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const convertToPdf = async () => {
    if (images.length === 0) return;
    setConverting(true);

    try {
      const pdf = new jsPDF();
      
      for (let i = 0; i < images.length; i++) {
        const img = images[i];
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const imgElement = new Image();
        
        await new Promise((resolve) => {
          imgElement.onload = () => {
            canvas.width = imgElement.width;
            canvas.height = imgElement.height;
            ctx?.drawImage(imgElement, 0, 0);
            
            const imgData = canvas.toDataURL('image/jpeg', 0.95);
            const imgWidth = 210;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            
            if (i > 0) pdf.addPage();
            pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);
            resolve(null);
          };
          imgElement.src = URL.createObjectURL(img);
        });
      }
      
      pdf.save('images.pdf');
    } catch (error) {
      alert('Conversion failed');
    } finally {
      setConverting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Image to PDF Converter</h2>
      
      <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center mb-6">
        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          id="image-input"
        />
        <label htmlFor="image-input" className="cursor-pointer">
          <span className="text-lg font-medium text-gray-700">Select Images</span>
          <p className="text-gray-500 mt-2">Choose multiple images to combine into PDF</p>
        </label>
      </div>

      {images.length > 0 && (
        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-3">{images.length} images selected</p>
          <div className="grid grid-cols-4 gap-2">
            {images.slice(0, 8).map((img, idx) => (
              <img
                key={idx}
                src={URL.createObjectURL(img)}
                alt={`Preview ${idx}`}
                className="w-full h-20 object-cover rounded"
              />
            ))}
          </div>
        </div>
      )}

      <button
        onClick={convertToPdf}
        disabled={images.length === 0 || converting}
        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        <Download className="w-5 h-5 inline mr-2" />
        {converting ? 'Converting...' : 'Convert to PDF'}
      </button>
    </div>
  );
}