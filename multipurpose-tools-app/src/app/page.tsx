'use client';

import { useState } from 'react';
import ToolSelector from './components/ToolSelector';
import FileConverter from './components/FileConverter';
import ImageToPdf from './components/ImageToPdf';
import ZipExtractor from './components/ZipExtractor';
import ImageCropper from './components/ImageCropper';
import FileFormatConverter from './components/FileFormatConverter';
import CsvConverter from './components/CsvConverter';
import JsonFormatter from './components/JsonFormatter';
import QrGenerator from './components/QrGenerator';

const ArrowLeft = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

export default function Home() {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);

  const renderTool = () => {
    switch (selectedTool) {
      case 'pdf-excel':
        return <FileConverter />;
      case 'image-pdf':
        return <ImageToPdf />;
      case 'zip-extractor':
        return <ZipExtractor />;
      case 'image-cropper':
        return <ImageCropper />;
      case 'file-converter':
        return <FileFormatConverter />;
      case 'csv-converter':
        return <CsvConverter />;
      case 'json-formatter':
        return <JsonFormatter />;
      case 'qr-generator':
        return <QrGenerator />;
      default:
        return <ToolSelector onToolSelect={setSelectedTool} />;
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }} />
        </div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 animate-pulse" />
      </div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-blue-500/20 rounded-full blur-xl animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }} />
      <div className="absolute top-40 right-20 w-16 h-16 bg-purple-500/20 rounded-full blur-xl animate-bounce" style={{ animationDelay: '1s', animationDuration: '4s' }} />
      <div className="absolute bottom-20 left-20 w-24 h-24 bg-pink-500/20 rounded-full blur-xl animate-bounce" style={{ animationDelay: '2s', animationDuration: '5s' }} />
      
      {/* Content */}
      <div className="relative z-10 min-h-screen py-8 px-4">
        {selectedTool && (
          <div className="max-w-6xl mx-auto mb-8">
            <button
              onClick={() => setSelectedTool(null)}
              className="group flex items-center px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white hover:bg-white/20 transition-all duration-300 hover:scale-105"
            >
              <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Back to Tools</span>
            </button>
          </div>
        )}
        
        {selectedTool ? (
          <div className="max-w-4xl mx-auto">
            {renderTool()}
          </div>
        ) : (
          renderTool()
        )}
      </div>
    </div>
  );
}