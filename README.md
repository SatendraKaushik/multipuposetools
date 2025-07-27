# FileForge - Multipurpose File Processing Tools

A professional file processing platform with 8 powerful tools for converting, processing, and manipulating files.

## 🚀 Features

### Frontend (Next.js 15)
- **PDF ↔ Excel Converter** - Convert between PDF and Excel formats
- **Image to PDF** - Combine multiple images into PDF
- **ZIP/RAR Tools** - Compress and extract files
- **Image Cropper** - Interactive crop with multiple shapes
- **File Format Converter** - DOCX to TXT, Image format conversions
- **CSV/JSON/Excel Converter** - Convert between data formats
- **JSON Formatter** - Format and beautify JSON
- **QR Code Generator** - Create colorful QR codes

### Backend (Node.js + Express)
- **PDF Processing** - Server-side PDF text extraction
- **Health Check** - API status monitoring

## 📁 Project Structure

```
mutipurpose/
├── multipurpose-tools-app/    # Next.js Frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/    # All tool components
│   │   │   ├── page.tsx       # Main application
│   │   │   └── layout.tsx
│   │   └── types/             # TypeScript declarations
│   ├── package.json
│   └── ...
└── backend/                   # Node.js Backend
    ├── server.js             # Express server
    ├── package.json
    └── ...
```

## 🛠️ Installation & Setup

### Frontend
```bash
cd multipurpose-tools-app
npm install
npm run dev
```

### Backend (Optional - only for PDF processing)
```bash
cd backend
npm install
npm start
```

## 🌐 Usage

1. **Start Frontend**: `npm run dev` (runs on http://localhost:3000)
2. **Start Backend**: `npm start` (runs on http://localhost:5000) - Optional
3. **Access Tools**: Navigate to localhost:3000 and select any tool

## 🔧 Technologies

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express
- **Libraries**: 
  - `xlsx` - Excel processing
  - `jspdf` - PDF generation
  - `jszip` - ZIP compression
  - `qrcode` - QR code generation
  - `mammoth` - DOCX processing
  - `papaparse` - CSV processing

## 🎨 Design Features

- **Professional UI** with glassmorphism effects
- **Dark theme** with gradient backgrounds
- **Responsive design** for all devices
- **Interactive animations** and hover effects
- **Modern typography** and spacing

## 🔒 Privacy & Security

- **100% Client-side processing** (except PDF text extraction)
- **No data storage** - files never leave your device
- **No tracking** or analytics
- **Open source** and transparent

## 📱 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Submit pull request

## 📄 License

MIT License - feel free to use for personal and commercial projects.

---

**FileForge** - Professional file processing made simple and secure.