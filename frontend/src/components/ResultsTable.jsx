import React from 'react';

function ResultsTable({ predictions, csvPath }) {
  const handleDownload = async () => {
    try {
      const response = await fetch('http://localhost:5000/download');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'predictions.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      console.error('Error downloading file:', err);
    }
  };

  return (
    <div className="w-full max-w-4xl mt-6 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Prediction Results</h2>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">CLIENTNUM</th>
            <th className="border p-2">Prediction</th>
          </tr>
        </thead>
        <tbody>
          {predictions.map((pred, index) => (
            <tr key={index} className="hover:bg-gray-100">
              <td className="border p-2">{pred.CLIENTNUM}</td>
              <td className="border p-2">{pred.Prediction}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        onClick={handleDownload}
        className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Download Results CSV
      </button>
    </div>
  );
}

export default ResultsTable;