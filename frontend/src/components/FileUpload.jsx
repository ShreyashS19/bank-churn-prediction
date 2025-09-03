import React, { useState } from 'react';
import Papa from 'papaparse';

function FileUpload({ setPredictions, setCsvPath }) {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError(null);
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a CSV file');
      return;
    }

    Papa.parse(file, {
      complete: async (result) => {
        try {
          const jsonData = result.data;
          const response = await fetch('http://localhost:5000/predict', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(jsonData)
          });

          const data = await response.json();
          if (data.error) {
            setError(data.error);
            return;
          }

          setPredictions(data.predictions);
          setCsvPath(data.csv_path);
        } catch (err) {
          setError('Error processing file: ' + err.message);
        }
      },
      header: true,
      skipEmptyLines: true
    });
  };

  return (
    <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Upload CSV File</h2>
      <input
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        className="mb-4 p-2 border rounded w-full"
      />
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <button
        onClick={handleUpload}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Upload and Predict
      </button>
    </div>
  );
}

export default FileUpload;