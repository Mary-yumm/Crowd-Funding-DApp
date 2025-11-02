import React, { useState, useEffect } from 'react';

function AdminPanel({ kycContract }) {
  const [kycRequests, setKycRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (kycContract) {
      loadKYCRequests();
    }
  }, [kycContract]);

  const loadKYCRequests = async () => {
    try {
      setLoading(true);
      const addresses = await kycContract.getAllKYCRequests();
      
      const requests = [];
      for (let addr of addresses) {
        const [fullName, cnic, isVerified, exists, timestamp] = await kycContract.getKYCDetails(addr);
        if (exists) {
          requests.push({
            address: addr,
            fullName,
            cnic,
            isVerified,
            timestamp: Number(timestamp)
          });
        }
      }
      
      setKycRequests(requests);
    } catch (error) {
      console.error('Error loading KYC requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const approveKYC = async (address) => {
    setLoading(true);
    try {
      const tx = await kycContract.approveKYC(address);
      await tx.wait();
      alert('✅ KYC approved successfully!');
      await loadKYCRequests();
    } catch (error) {
      console.error('Error approving KYC:', error);
      alert('❌ Failed to approve KYC: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const rejectKYC = async (address) => {
    if (!window.confirm('Are you sure you want to reject this KYC request?')) {
      return;
    }

    setLoading(true);
    try {
      const tx = await kycContract.rejectKYC(address);
      await tx.wait();
      alert('✅ KYC rejected successfully!');
      await loadKYCRequests();
    } catch (error) {
      console.error('Error rejecting KYC:', error);
      alert('❌ Failed to reject KYC: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-panel">
      <h2>⚙️ Admin Panel - KYC Management</h2>
      
      <div className="admin-stats">
        <div className="stat-card">
          <h3>{kycRequests.length}</h3>
          <p>Total Requests</p>
        </div>
        <div className="stat-card">
          <h3>{kycRequests.filter(r => !r.isVerified).length}</h3>
          <p>Pending</p>
        </div>
        <div className="stat-card">
          <h3>{kycRequests.filter(r => r.isVerified).length}</h3>
          <p>Approved</p>
        </div>
      </div>

      {loading && <p className="loading-text">Loading KYC requests...</p>}

      {kycRequests.length === 0 && !loading ? (
        <p className="no-data">No KYC requests found.</p>
      ) : (
        <div className="kyc-requests-list">
          {kycRequests.map((request, index) => (
            <div key={index} className={`kyc-request-card ${request.isVerified ? 'verified' : 'pending'}`}>
              <div className="request-header">
                <h3>{request.fullName}</h3>
                {request.isVerified ? (
                  <span className="status-badge verified">✓ Verified</span>
                ) : (
                  <span className="status-badge pending">⏳ Pending</span>
                )}
              </div>
              
              <div className="request-details">
                <p><strong>CNIC:</strong> {request.cnic}</p>
                <p><strong>Address:</strong> {request.address.substring(0, 10)}...{request.address.substring(38)}</p>
                <p><strong>Submitted:</strong> {new Date(request.timestamp * 1000).toLocaleDateString()}</p>
              </div>

              {!request.isVerified && (
                <div className="request-actions">
                  <button 
                    onClick={() => approveKYC(request.address)}
                    disabled={loading}
                    className="approve-btn"
                  >
                    ✓ Approve
                  </button>
                  <button 
                    onClick={() => rejectKYC(request.address)}
                    disabled={loading}
                    className="reject-btn"
                  >
                    ✕ Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminPanel;