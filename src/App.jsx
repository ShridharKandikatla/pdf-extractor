import React, { useState, useEffect } from 'react';
import { Document, Page } from 'react-pdf';
import { pdfjs } from 'react-pdf';
import axios from 'axios';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url
).toString();

function App() {
  const [selectedPages, setSelectedPages] = useState([]);
  const [file, setFile] = useState(null);
  const [numPages, setNumPages] = useState(null);

  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile && uploadedFile.type === 'application/pdf') {
      setFile(uploadedFile);
    }
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const handlePageSelection = (page) => {
    if (selectedPages.includes(page)) {
      setSelectedPages(selectedPages.filter((p) => p !== page));
    } else {
      setSelectedPages([...selectedPages, page]);
    }
  };

  const createNewPDF = () => {
    const requestParams = {
      selectedPages: selectedPages,
      uploadedFile: file,
    };

    axios
      .post('http://localhost:5000/create-pdf', requestParams)
      .then((response) => {
        const pdfUrl = URL.createObjectURL(response.data);
        window.open(pdfUrl);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className='container-fluid'>
      <h1 className='mt-3 text-center display-1'>PDF Extractor</h1>
      {!file && (
        <div>
          <input
            type='file'
            accept='.pdf'
            className='form-control'
            onChange={handleFileUpload}
          />
          <p className='form-label mt-3'>Choose PDF</p>
        </div>
      )}
      {file && (
        <div className='border p-3'>
          <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
            {Array.from({ length: numPages }, (_, i) => (
              <Page key={i + 1} pageNumber={i + 1} onRenderSuccess={() => {}} />
            ))}
          </Document>
          {Array.from({ length: numPages }, (_, i) => (
            <div key={i}>
              <div className='form-check m-2'>
                <input
                  type='checkbox'
                  className='form-check-input'
                  checked={selectedPages.includes(i + 1)}
                  onChange={() => handlePageSelection(i + 1)}
                />
                <label className='form-check-label'>Page {i + 1}</label>
              </div>
            </div>
          ))}
          <div className='d-flex m-2'>
            <button onClick={createNewPDF} className='btn btn-primary mx-2'>
              Create New PDF
            </button>
            <button
              onClick={() => {
                setFile(null);
                setNumPages(null);
                setSelectedPages([]);
              }}
              className='btn btn-success mx-2'
            >
              Choose Another PDF
            </button>
            <button
              onClick={() => {
                setFile(null);
                setNumPages(null);
                setSelectedPages([]);
              }}
              className='btn btn-warning mx-2'
            >
              Clear
            </button>{' '}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
