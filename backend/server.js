const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const pdfParse = require('pdf-parse');
const XLSX = require('xlsx');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const upload = multer({ dest: 'uploads/' });

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'Server running', timestamp: new Date().toISOString() });
});

// PDF to Excel conversion (server-side for proper text extraction)
app.post('/convert/pdf-to-excel', upload.single('file'), async (req, res) => {
  try {
    const filePath = req.file.path;
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    
    const lines = data.text.split('\n').filter(line => line.trim());
    const worksheet = XLSX.utils.aoa_to_sheet([['Content'], ...lines.map(line => [line])]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'PDF Content');
    
    const excelPath = filePath.replace(/\.[^/.]+$/, '.xlsx');
    XLSX.writeFile(workbook, excelPath);
    
    res.download(excelPath, () => {
      fs.unlinkSync(filePath);
      fs.unlinkSync(excelPath);
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});



