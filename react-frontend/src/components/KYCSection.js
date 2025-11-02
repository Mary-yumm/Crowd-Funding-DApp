import React, { useState, useEffect } from 'react';

function KYCSection({ kycContract, account, isVerified }) {
  const [fullName, setFullName] = useState('');
  const [cnic, setCnic] = useState('');
  const [loading, setLoading] = useState(false);
  const [kycStatus, setKycStatus] = useState(null);

  useEffect(() => {
    if (kycContract && account) {
      loadKYCStatus();
    }
  }, [kycContract, account]);

  const loadKYCStatus = async () => {
    try {
      const [name, cnicNum, verified, exists] = await kycContract.getKYCDetails(account);
      if (exists) {
        setKycStatus({
          fullName: name,
          cnic: cnicNum,
          isVerified: verified,
          exists: exists
        });
      }
    } catch (error) {
      console.error('Error loading KYC status:', error);
    }
  };

  const submitKYC = async (e) => {
    e.preventDefault();
    
    if (!fullName.trim() || cnic.length !== 13) {
      alert('Please enter valid name and 13-digit CNIC');
      return;
    }

    setLoading(true);
    try {
      const tx = await kycContract.submitKYC(fullName, cnic);
      await tx.wait();
      alert('✅ KYC request submitted successfully! Wait for admin approval.');
      setFullName('');
      setCnic('');
      await loadKYCStatus();
    } catch (error) {
      console.error('Error submitting KYC:', error);
      alert('❌ Failed to submit KYC: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="kyc-section">
      <h2>🆔 KYC Verification</h2>
      
      {isVerified ? (
        <div className="kyc-verified">
          <div className="success-icon">✓</div>
          <h3>Your KYC is Verified!</h3>
          <p>You can now create crowdfunding campaigns.</p>
          {kycStatus && (
            <div className="kyc-details">
              <p><strong>Name:</strong> {kycStatus.fullName}</p>
              <p><strong>CNIC:</strong> {kycStatus.cnic}</p>
            </div>
          )}
        </div>
      ) : kycStatus && kycStatus.exists && !kycStatus.isVerified ? (
        <div className="kyc-pending">
          <div className="pending-icon">⏳</div>
          <h3>KYC Pending Approval</h3>
          <p>Your KYC request is under review by the admin.</p>
          <div className="kyc-details">
            <p><strong>Name:</strong> {kycStatus.fullName}</p>
            <p><strong>CNIC:</strong> {kycStatus.cnic}</p>
          </div>
        </div>
      ) : (
        <div className="kyc-form-container">
          <p className="kyc-info">
            Submit your KYC details to get verified and create campaigns.
          </p>
          <form onSubmit={submitKYC} className="kyc-form">
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label>CNIC (13 digits) *</label>
              <input
                type="text"
                placeholder="1234567890123"
                value={cnic}
                onChange={(e) => setCnic(e.target.value.replace(/\D/g, '').slice(0, 13))}
                maxLength="13"
                required
              />
              <small>{cnic.length}/13 digits</small>
            </div>
            
            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? 'Submitting...' : 'Submit KYC Request'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default KYCSection;