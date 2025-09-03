import React, { useState, Suspense } from 'react';
import FileUpload from './components/FileUpload';
const ResultsTable = React.lazy(() => import('./components/ResultsTable'));

function App() {
  const [predictions, setPredictions] = useState([]);
  const [csvPath, setCsvPath] = useState(null);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <h1 className="text-3xl font-bold mb-6">Bank Customer Churn Prediction</h1>
      <FileUpload setPredictions={setPredictions} setCsvPath={setCsvPath} />
      <Suspense fallback={<div>Loading results...</div>}>
        {predictions.length > 0 && <ResultsTable predictions={predictions} csvPath={csvPath} />}
      </Suspense>
    </div>
  );
}

export default App;