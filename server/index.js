const express = require('express');
const multer = require('multer');
const fs = require('fs');
const { PDFDocument } = require('pdf-lib');
const cors = require('cors');

const app = express();
app.use(
  cors({
    origin: 'http://localhost:3000',
  })
);
const port = 5000;

const storage = multer.memoryStorage();
const upload = multer({ storage });

app.post('/upload', upload.single('pdf'), (req, res) => {
  const pdfBuffer = req.file.buffer;

  if (req.file.mimetype !== 'application/pdf') {
    res.status(400).send('Invalid file type');
    return;
  }

  const fileName = 'path/to/save/file.pdf';

  fs.writeFile(fileName, pdfBuffer, (err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error saving PDF');
    } else {
      res.status(200).send('PDF uploaded and saved successfully');
    }
  });
});

app.get('/download', (req, res) => {
  res.download('path/to/pdf/file.pdf');
});

app.post('/create-pdf', async (req, res) => {
  const selectedPages = req.body.selectedPages;
  const pdfBuffer = req.body.pdfBuffer;

  const pdfDoc = await PDFDocument.load(pdfBuffer);

  const copiedPages = pdfDoc.copyPages(pdfDoc, selectedPages);

  const newPdfDoc = await PDFDocument.create();

  for (const page of copiedPages) {
    newPdfDoc.addPage(page);
  }

  const newPdfBuffer = await newPdfDoc.save();

  res.send(newPdfBuffer);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
