'use client';

import { useState } from 'react';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';

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

export default function CsvConverter() {
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
      case 'csv':
        return ['xlsx', 'json'];
      case 'xlsx':
      case 'xls':
        return ['csv', 'json'];
      case 'json':
        return ['csv', 'xlsx'];
      default:
        return [];
    }
  };

  const convertFile = async () => {
    if (!file || !targetFormat) return;
    setConverting(true);

    try {
      const ext = file.name.split('.').pop()?.toLowerCase();
      
      if (ext === 'csv') {
        await convertFromCsv(file, targetFormat);
      } else if (['xlsx', 'xls'].includes(ext || '')) {
        await convertFromExcel(file, targetFormat);
      } else if (ext === 'json') {
        await convertFromJson(file, targetFormat);
      }
    } catch (error) {
      alert('Conversion failed');
    } finally {
      setConverting(false);
    }
  };

  const convertFromCsv = async (file: File, format: string) => {
    const text = await file.text();
    const parsed = Papa.parse(text, { header: true });
    
    if (format === 'json') {
      const blob = new Blob([JSON.stringify(parsed.data, null, 2)], { type: 'application/json' });
      downloadFile(blob, file.name.replace('.csv', '.json'));
    } else if (format === 'xlsx') {
      const ws = XLSX.utils.json_to_sheet(parsed.data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
      XLSX.writeFile(wb, file.name.replace('.csv', '.xlsx'));
    }
  };

  const convertFromExcel = async (file: File, format: string) => {
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(worksheet);
    
    if (format === 'csv') {
      const csv = Papa.unparse(data);
      const blob = new Blob([csv], { type: 'text/csv' });
      downloadFile(blob, file.name.replace(/\.(xlsx|xls)$/, '.csv'));
    } else if (format === 'json') {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      downloadFile(blob, file.name.replace(/\.(xlsx|xls)$/, '.json'));
    }
  };

  const convertFromJson = async (file: File, format: string) => {
    const text = await file.text();
    const data = JSON.parse(text);
    
    if (format === 'csv') {
      const csv = Papa.unparse(data);
      const blob = new Blob([csv], { type: 'text/csv' });
      downloadFile(blob, file.name.replace('.json', '.csv'));
    } else if (format === 'xlsx') {
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
      XLSX.writeFile(wb, file.name.replace('.json', '.xlsx'));
    }
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
    <div className="bg-white rounded-2xl shadow-xl p-8 text-black">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">CSV/JSON/Excel Converter</h2>
      
      <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center mb-6">
        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <input
          type="file"
          accept=".csv,.xlsx,.xls,.json"
          onChange={handleFileChange}
          className="hidden"
          id="csv-input"
        />
        <label htmlFor="csv-input" className="cursor-pointer">
          <span className="text-lg font-medium text-gray-700">Select File to Convert</span>
          <p className="text-gray-500 mt-2">Supports CSV, Excel, JSON</p>
        </label>
      </div>

      {file && (
        <div className="mb-6">
          <p className="text-sm text-black mb-3">Selected: {file.name}</p>
          
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
            className="w-full bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700 disabled:opacity-50"
          >
            <Download className="w-5 h-5 inline mr-2" />
            {converting ? 'Converting...' : `Convert to ${targetFormat.toUpperCase()}`}
          </button>
        </div>
      )}
    </div>
  );
}