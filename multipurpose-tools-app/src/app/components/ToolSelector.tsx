'use client';

import { useState } from 'react';

const FileText = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const Image = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m4 16 4.586-4.586a2 2 0 012.828 0L16 16m-2-2 1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const Archive = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
  </svg>
);

const Crop = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
  </svg>
);

const RefreshCw = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

interface ToolSelectorProps {
  onToolSelect: (tool: string) => void;
}

export default function ToolSelector({ onToolSelect }: ToolSelectorProps) {
  const Database = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
  </svg>
);

const Code = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
  </svg>
);

const QrCode = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
  </svg>
);

const tools = [
    { id: 'pdf-excel', name: 'PDF ↔ Excel', icon: FileText, color: 'bg-red-50 text-red-600' },
    { id: 'image-pdf', name: 'Image to PDF', icon: Image, color: 'bg-blue-50 text-blue-600' },
    { id: 'zip-extractor', name: 'ZIP/RAR Tools', icon: Archive, color: 'bg-green-50 text-green-600' },
    { id: 'image-cropper', name: 'Image Cropper', icon: Crop, color: 'bg-purple-50 text-purple-600' },
    { id: 'file-converter', name: 'File Converter', icon: RefreshCw, color: 'bg-orange-50 text-orange-600' },
    { id: 'csv-converter', name: 'CSV/JSON Tools', icon: Database, color: 'bg-teal-50 text-teal-600' },
    { id: 'json-formatter', name: 'JSON Formatter', icon: Code, color: 'bg-indigo-50 text-indigo-600' },
    { id: 'qr-generator', name: 'QR Code Tools', icon: QrCode, color: 'bg-pink-50 text-pink-600' }
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-20">
        <div className="relative mb-8">
          <h1 className="text-8xl font-black bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent mb-4 tracking-tight">
            FileForge
          </h1>
          <div className="w-32 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full mx-auto" />
        </div>
        <p className="text-3xl text-white/90 font-light mb-6 max-w-4xl mx-auto">
          Professional File Processing Platform
        </p>
        <p className="text-xl text-white/70 max-w-3xl mx-auto mb-12">
          Transform, convert, and process your files with our comprehensive suite of tools. 
          Fast, secure, and completely browser-based.
        </p>
        
        {/* Stats */}
        <div className="flex justify-center space-x-12 mb-16">
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-2">8+</div>
            <div className="text-white/60 text-sm uppercase tracking-wide">Tools</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-2">100%</div>
            <div className="text-white/60 text-sm uppercase tracking-wide">Secure</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-2">Free</div>
            <div className="text-white/60 text-sm uppercase tracking-wide">Forever</div>
          </div>
        </div>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
        {tools.map((tool, index) => (
          <div
            key={tool.id}
            onClick={() => onToolSelect(tool.id)}
            className="group relative cursor-pointer transform transition-all duration-500 hover:scale-105"
          >
            <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 h-full hover:bg-white/20 transition-all duration-500 shadow-2xl hover:shadow-purple-500/25">
              {/* Icon */}
              <div className="relative mb-8">
                <div className={`w-20 h-20 rounded-2xl ${tool.color.replace('bg-', 'bg-gradient-to-br from-').replace('text-', 'to-').replace('-50', '-500').replace('-600', '-600')} p-0.5 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                  <div className="w-full h-full bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                    <tool.icon className="w-10 h-10 text-white" />
                  </div>
                </div>
              </div>
              
              {/* Content */}
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-100 transition-colors">
                  {tool.name}
                </h3>
                <p className="text-white/70 text-sm leading-relaxed group-hover:text-white/90 transition-colors">
                  {tool.id === 'pdf-excel' && 'Convert between PDF and Excel formats'}
                  {tool.id === 'image-pdf' && 'Convert images to PDF documents'}
                  {tool.id === 'zip-extractor' && 'Compress and extract ZIP/RAR files'}
                  {tool.id === 'image-cropper' && 'Crop and resize images'}
                  {tool.id === 'file-converter' && 'Convert between various file formats'}
                  {tool.id === 'csv-converter' && 'Convert CSV to Excel/JSON and vice versa'}
                  {tool.id === 'json-formatter' && 'Format and beautify JSON data'}
                  {tool.id === 'qr-generator' && 'Generate and scan QR codes'}
                </p>
              </div>
              
              {/* Arrow */}
              <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h4 className="text-xl font-semibold text-white mb-3">100% Secure</h4>
          <p className="text-white/70 text-sm">All processing in your browser. Files never leave your device.</p>
        </div>
        
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h4 className="text-xl font-semibold text-white mb-3">Lightning Fast</h4>
          <p className="text-white/70 text-sm">Instant processing with no server delays.</p>
        </div>
        
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h4 className="text-xl font-semibold text-white mb-3">Always Free</h4>
          <p className="text-white/70 text-sm">No subscriptions, no limits. Professional tools for everyone.</p>
        </div>
      </div>
      
      <div className="text-center">
        <div className="inline-flex items-center space-x-3 text-white/50 text-sm">
          <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse" />
          <span>Select a tool above to get started</span>
          <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
        </div>
      </div>
    </div>
  );
}