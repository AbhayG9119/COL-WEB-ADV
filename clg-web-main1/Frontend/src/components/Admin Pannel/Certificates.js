import React, { useState } from 'react';
import TransferCertificate from './TransferCertificate';
import CharacterCertificate from './CharacterCertificate';

const Certificates = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const renderContent = () => {
    switch (activeTab) {
      case 'tc':
        return <TransferCertificate />;
      case 'cc':
        return <CharacterCertificate />;
      default:
        return (
          <div className="menu-content">
            <h1>Certificates</h1>
            <p>Generate student certificates.</p>
            <div className="button-group">
              <button className="btn" onClick={() => setActiveTab('tc')}>Transfer Certificate</button>
              <button className="btn" onClick={() => setActiveTab('cc')}>Character Certificate</button>
            </div>
            <div className="certificate-info">
              <h2>Transfer Certificate (TC)</h2>
              <p>Generate transfer certificates for students leaving the institution.</p>
              <h2>Character Certificate (CC)</h2>
              <p>Generate character certificates for students.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="menu-content">
      {activeTab !== 'overview' && (
        <div className="tab-navigation">
          <button className="back-btn" onClick={() => setActiveTab('overview')}>← Back to Certificates</button>
        </div>
      )}
      {renderContent()}
    </div>
  );
};

export default Certificates;
