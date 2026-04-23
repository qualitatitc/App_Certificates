import React, { useState } from 'react';
import CertificateForm from './components/CertificateForm';
import CertificatePreview from './components/CertificatePreview';

function App() {
  const [certificateData, setCertificateData] = useState(null);

  return (
    <div className="app">
      {!certificateData ? (
        <CertificateForm onGenerate={setCertificateData} />
      ) : (
        <CertificatePreview 
          data={certificateData} 
          onBack={() => setCertificateData(null)} 
        />
      )}
    </div>
  );
}

export default App;
