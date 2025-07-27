'use client';

import { useState } from 'react';
import JSZip from 'jszip';

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

export default function ZipExtractor() {
  const [files, setFiles] = useState<File[]>([]);
  const [zipFile, setZipFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [mode, setMode] = useState<'compress' | 'extract'>('compress');

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleZipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setZipFile(e.target.files[0]);
    }
  };

  const compressFiles = async () => {
    if (files.length === 0) return;
    setProcessing(true);

    try {
      const zip = new JSZip();
      
      for (const file of files) {
        zip.file(file.name, file);
      }
      
      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'compressed.zip';
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      alert('Compression failed');
    } finally {
      setProcessing(false);
    }
  };

  const extractZip = async () => {
    if (!zipFile) return;
    setProcessing(true);

    try {
      const zip = new JSZip();
      const contents = await zip.loadAsync(zipFile);
      
      for (const [filename, file] of Object.entries(contents.files)) {
        if (!file.dir) {
          const blob = await file.async('blob');
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          a.click();
          URL.revokeObjectURL(url);
        }
      }
    } catch (error) {
      alert('Extraction failed');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 text-black">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">ZIP Compressor & Extractor</h2>
      
      <div className="flex mb-6">
        <button
          onClick={() => setMode('compress')}
          className={`px-4 py-2 rounded-l-lg ${mode === 'compress' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Compress
        </button>
        <button
          onClick={() => setMode('extract')}
          className={`px-4 py-2 rounded-r-lg ${mode === 'extract' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Extract
        </button>
      </div>

      {mode === 'compress' ? (
        <div>
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center mb-6">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <input
              type="file"
              multiple
              onChange={handleFilesChange}
              className="hidden"
              id="files-input"
            />
            <label htmlFor="files-input" className="cursor-pointer">
              <span className="text-lg font-medium text-gray-700">Select Files to Compress</span>
            </label>
          </div>
          
          {files.length > 0 && (
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-2">{files.length} files selected</p>
              <button
                onClick={compressFiles}
                disabled={processing}
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                <Download className="w-5 h-5 inline mr-2" />
                {processing ? 'Compressing...' : 'Create ZIP'}
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
              accept=".zip"
              onChange={handleZipChange}
              className="hidden"
              id="zip-input"
            />
            <label htmlFor="zip-input" className="cursor-pointer">
              <span className="text-lg font-medium text-gray-700">Select ZIP File to Extract</span>
            </label>
          </div>
          
          {zipFile && (
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-2">Selected: {zipFile.name}</p>
              <button
                onClick={extractZip}
                disabled={processing}
                className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 disabled:opacity-50"
              >
                <Download className="w-5 h-5 inline mr-2" />
                {processing ? 'Extracting...' : 'Extract Files'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}