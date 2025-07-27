'use client';

import { useState } from 'react';
// Simple SVG icons
const Upload = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
  </svg>
);

const FileText = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const FileSpreadsheet = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const Download = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const Loader2 = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export default function FileConverter() {
  const [file, setFile] = useState<File | null>(null);
  const [converting, setConverting] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const pdfToExcel = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch('http://localhost:5000/convert/pdf-to-excel', {
      method: 'POST',
      body: formData,
    });
    
    if (response.ok) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${file.name.replace('.pdf', '')}.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);
    } else {
      throw new Error('Server conversion failed');
    }
  };

  const excelToPdf = async (file: File) => {
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
    
    const doc = new jsPDF();
    doc.autoTable({
      head: data.length > 0 ? [data[0]] : [],
      body: data.slice(1),
      startY: 20,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [41, 128, 185] }
    });
    doc.save(`${file.name.replace(/\.(xlsx|xls)$/, '')}.pdf`);
  };

  const convertFile = async () => {
    if (!file) return;
    setConverting(true);
    
    try {
      if (file.type === 'application/pdf') {
        await pdfToExcel(file);
      } else if (file.type.includes('sheet') || file.name.match(/\.(xlsx|xls)$/)) {
        await excelToPdf(file);
      }
    } catch (error) {
      console.error('Conversion failed:', error);
      alert('Conversion failed. Please try again.');
    } finally {
      setConverting(false);
    }
  };

  const getFileIcon = () => {
    if (!file) return <Upload className="w-12 h-12 text-gray-400" />;
    return file.type === 'application/pdf' ? 
      <FileText className="w-12 h-12 text-red-500" /> : 
      <FileSpreadsheet className="w-12 h-12 text-green-500" />;
  };

  const getConversionText = () => {
    if (!file) return '';
    return file.type === 'application/pdf' ? 'PDF → Excel' : 'Excel → PDF';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">File Converter</h1>
          <p className="text-gray-600">Convert PDF to Excel and Excel to PDF instantly</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
              dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {getFileIcon()}
            
            {!file ? (
              <div>
                <p className="text-xl font-medium text-gray-700 mb-2">
                  Drop your file here or click to browse
                </p>
                <p className="text-gray-500 mb-4">Supports PDF, Excel (.xlsx, .xls)</p>
                <input
                  type="file"
                  accept=".pdf,.xlsx,.xls"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-input"
                />
                <label
                  htmlFor="file-input"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
                >
                  <Upload className="w-5 h-5 mr-2" />
                  Choose File
                </label>
              </div>
            ) : (
              <div>
                <p className="text-lg font-medium text-gray-800 mb-2">{file.name}</p>
                <p className="text-gray-500 mb-4">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                
                <button
                  onClick={convertFile}
                  disabled={converting}
                  className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {converting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Converting...
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5 mr-2" />
                      Convert {getConversionText()}
                    </>
                  )}
                </button>
                
                <button
                  onClick={() => setFile(null)}
                  className="ml-4 px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center p-6 bg-red-50 rounded-xl">
              <FileText className="w-8 h-8 text-red-500 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-800 mb-2">PDF to Excel</h3>
              <p className="text-sm text-gray-600">Extract text content from PDF files into Excel format</p>
            </div>
            
            <div className="text-center p-6 bg-green-50 rounded-xl">
              <FileSpreadsheet className="w-8 h-8 text-green-500 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-800 mb-2">Excel to PDF</h3>
              <p className="text-sm text-gray-600">Convert Excel spreadsheets into professional PDF documents</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}