'use client';

import { useState, useRef, useCallback } from 'react';

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

export default function ImageCropper() {
  const [image, setImage] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 50, y: 50, width: 200, height: 200 });
  const [cropShape, setCropShape] = useState<'rectangle' | 'circle' | 'square'>('rectangle');
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizing, setResizing] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => setImage(e.target?.result as string);
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleMouseDown = useCallback((e: React.MouseEvent, action: string) => {
    e.preventDefault();
    setIsDragging(true);
    setResizing(action);
    setDragStart({ x: e.clientX, y: e.clientY });
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;

    if (resizing === 'move') {
      setCrop(prev => ({
        ...prev,
        x: Math.max(0, Math.min(prev.x + deltaX, rect.width - prev.width)),
        y: Math.max(0, Math.min(prev.y + deltaY, rect.height - prev.height))
      }));
    } else if (resizing.includes('resize')) {
      setCrop(prev => {
        let newCrop = { ...prev };
        
        if (resizing.includes('n')) {
          const newHeight = prev.height - deltaY;
          const newY = prev.y + deltaY;
          if (newHeight >= 20 && newY >= 0) {
            newCrop.height = newHeight;
            newCrop.y = newY;
          }
        }
        if (resizing.includes('s')) {
          newCrop.height = Math.max(20, Math.min(prev.height + deltaY, rect.height - prev.y));
        }
        if (resizing.includes('w')) {
          const newWidth = prev.width - deltaX;
          const newX = prev.x + deltaX;
          if (newWidth >= 20 && newX >= 0) {
            newCrop.width = newWidth;
            newCrop.x = newX;
          }
        }
        if (resizing.includes('e')) {
          newCrop.width = Math.max(20, Math.min(prev.width + deltaX, rect.width - prev.x));
        }
        
        return newCrop;
      });
    }

    setDragStart({ x: e.clientX, y: e.clientY });
  }, [isDragging, dragStart, resizing]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setResizing('');
  }, []);

  const cropImage = () => {
    if (!image || !canvasRef.current || !imgRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = imgRef.current;
    const container = containerRef.current;
    
    if (!container) return;

    const scaleX = img.naturalWidth / container.offsetWidth;
    const scaleY = img.naturalHeight / container.offsetHeight;

    canvas.width = crop.width * scaleX;
    canvas.height = crop.height * scaleY;

    if (cropShape === 'circle') {
      const centerX = (crop.width * scaleX) / 2;
      const centerY = (crop.height * scaleY) / 2;
      const radius = Math.min(centerX, centerY);
      
      ctx?.beginPath();
      ctx?.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx?.clip();
    }

    ctx?.drawImage(
      img,
      crop.x * scaleX, crop.y * scaleY, crop.width * scaleX, crop.height * scaleY,
      0, 0, crop.width * scaleX, crop.height * scaleY
    );

    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `cropped-${cropShape}.png`;
        a.click();
        URL.revokeObjectURL(url);
      }
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Interactive Image Cropper</h2>
      
      {!image ? (
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            id="image-crop-input"
          />
          <label htmlFor="image-crop-input" className="cursor-pointer">
            <span className="text-lg font-medium text-gray-700">Select Image to Crop</span>
            <p className="text-gray-500 mt-2">Drag to adjust crop area</p>
          </label>
        </div>
      ) : (
        <div>
          {/* Shape selector */}
          <div className="flex justify-center mb-4 space-x-2">
            <button
              onClick={() => setCropShape('rectangle')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${cropShape === 'rectangle' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Rectangle
            </button>
            <button
              onClick={() => setCropShape('square')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${cropShape === 'square' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Square
            </button>
            <button
              onClick={() => setCropShape('circle')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${cropShape === 'circle' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Circle
            </button>
          </div>

          <div 
            ref={containerRef}
            className="relative mb-6 max-w-2xl mx-auto select-none border-2 border-gray-200 rounded-lg overflow-hidden"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <img
              ref={imgRef}
              src={image}
              alt="Crop preview"
              className="w-full h-auto block"
              draggable={false}
            />
            
            {/* Dimmed overlay outside crop area */}
            <div 
              className="absolute inset-0 bg-black bg-opacity-40 pointer-events-none"
              style={{
                clipPath: cropShape === 'circle' 
                  ? `circle(0px at ${crop.x + crop.width/2}px ${crop.y + crop.height/2}px)`
                  : `polygon(0% 0%, 0% 100%, ${crop.x}px 100%, ${crop.x}px ${crop.y}px, ${crop.x + crop.width}px ${crop.y}px, ${crop.x + crop.width}px ${crop.y + crop.height}px, ${crop.x}px ${crop.y + crop.height}px, ${crop.x}px 100%, 100% 100%, 100% 0%)`
              }}
            />
            
            {/* Crop selection area */}
            <div
              className={`absolute cursor-move ${cropShape === 'circle' ? 'rounded-full' : 'rounded-sm'}`}
              style={{
                left: crop.x,
                top: crop.y,
                width: crop.width,
                height: cropShape === 'square' ? crop.width : crop.height,
                border: '2px solid #fff',
                boxShadow: '0 0 0 1px rgba(0,0,0,0.3), inset 0 0 0 1px rgba(255,255,255,0.5)',
                backgroundColor: 'transparent'
              }}
              onMouseDown={(e) => handleMouseDown(e, 'move')}
            >
              {cropShape !== 'circle' && (
                <>
                  {/* Corner handles */}
                  <div className="absolute w-2 h-2 bg-white border border-gray-600 rounded-full cursor-nw-resize" style={{ left: -4, top: -4 }} onMouseDown={(e) => { e.stopPropagation(); handleMouseDown(e, 'resize-nw'); }} />
                  <div className="absolute w-2 h-2 bg-white border border-gray-600 rounded-full cursor-ne-resize" style={{ right: -4, top: -4 }} onMouseDown={(e) => { e.stopPropagation(); handleMouseDown(e, 'resize-ne'); }} />
                  <div className="absolute w-2 h-2 bg-white border border-gray-600 rounded-full cursor-sw-resize" style={{ left: -4, bottom: -4 }} onMouseDown={(e) => { e.stopPropagation(); handleMouseDown(e, 'resize-sw'); }} />
                  <div className="absolute w-2 h-2 bg-white border border-gray-600 rounded-full cursor-se-resize" style={{ right: -4, bottom: -4 }} onMouseDown={(e) => { e.stopPropagation(); handleMouseDown(e, 'resize-se'); }} />
                  
                  {/* Edge handles */}
                  <div className="absolute w-2 h-1 bg-white border border-gray-600 rounded cursor-n-resize" style={{ left: '50%', top: -4, transform: 'translateX(-50%)' }} onMouseDown={(e) => { e.stopPropagation(); handleMouseDown(e, 'resize-n'); }} />
                  <div className="absolute w-2 h-1 bg-white border border-gray-600 rounded cursor-s-resize" style={{ left: '50%', bottom: -4, transform: 'translateX(-50%)' }} onMouseDown={(e) => { e.stopPropagation(); handleMouseDown(e, 'resize-s'); }} />
                  <div className="absolute w-1 h-2 bg-white border border-gray-600 rounded cursor-w-resize" style={{ left: -4, top: '50%', transform: 'translateY(-50%)' }} onMouseDown={(e) => { e.stopPropagation(); handleMouseDown(e, 'resize-w'); }} />
                  <div className="absolute w-1 h-2 bg-white border border-gray-600 rounded cursor-e-resize" style={{ right: -4, top: '50%', transform: 'translateY(-50%)' }} onMouseDown={(e) => { e.stopPropagation(); handleMouseDown(e, 'resize-e'); }} />
                </>
              )}
              
              {cropShape === 'circle' && (
                <div className="absolute w-2 h-2 bg-white border border-gray-600 rounded-full cursor-se-resize" style={{ right: -4, bottom: -4 }} onMouseDown={(e) => { e.stopPropagation(); handleMouseDown(e, 'resize-se'); }} />
              )}
            </div>
          </div>
          
          <div className="text-center mb-6">
            <p className="text-sm text-gray-600 mb-2">
              {cropShape === 'circle' ? `Diameter: ${crop.width} px` : `Crop area: ${crop.width} × ${cropShape === 'square' ? crop.width : crop.height} px`}
            </p>
            <p className="text-xs text-gray-500">
              Drag to move • Drag handles to resize • Select shape above
            </p>
          </div>

          <button
            onClick={cropImage}
            className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700"
          >
            <Download className="w-5 h-5 inline mr-2" />
            Download Cropped Image
          </button>
          
          <canvas ref={canvasRef} className="hidden" />
        </div>
      )}
    </div>
  );
}