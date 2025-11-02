import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './App.css';

import KYCRegistryABI from './contracts/KYCRegistry.json';
import CrowdfundingABI from './contracts/Crowdfunding.json';
import contractAddresses from './contracts/contract-addresses.json';

import KYCSection from './components/KYCSection';
import AdminPanel from './components/AdminPanel';
import CreateCampaign from './components/CreateCampaign';
import CampaignList from './components/CampaignList';

function App() {
  const [account, setAccount] = useState('');
  const [balance, setBalance] = useState('0');
  const [isAdmin, setIsAdmin] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [kycContract, setKycContract] = useState(null);
  const [crowdfundingContract, setCrowdfundingContract] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('campaigns');

  // Connect to MetaMask
  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert('Please install MetaMask!');
        return;
      }

      setLoading(true);
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      setAccount(accounts[0]);
      await initializeContracts(accounts[0]);
      setError('');
    } catch (error) {
      console.error('Error connecting wallet:', error);
      setError('Failed to connect wallet: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Initialize contracts
  const initializeContracts = async (userAccount) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Get balance
      const balanceWei = await provider.getBalance(userAccount);
      setBalance(ethers.formatEther(balanceWei));

      // Initialize KYC contract
      const kyc = new ethers.Contract(
        contractAddresses.KYCRegistry,
        KYCRegistryABI.abi,
        signer
      );
      setKycContract(kyc);

      // Initialize Crowdfunding contract
      const crowdfunding = new ethers.Contract(
        contractAddresses.Crowdfunding,
        CrowdfundingABI.abi,
        signer
      );
      setCrowdfundingContract(crowdfunding);

      // Check if user is admin
      const adminAddress = await kyc.admin();
      setIsAdmin(adminAddress.toLowerCase() === userAccount.toLowerCase());

      // Check if user is verified
      const verified = await kyc.isUserVerified(userAccount);
      setIsVerified(verified);

    } catch (error) {
      console.error('Error initializing contracts:', error);
      setError('Failed to initialize contracts: ' + error.message);
    }
  };

  // Handle account changes
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          initializeContracts(accounts[0]);
        } else {
          setAccount('');
          setKycContract(null);
          setCrowdfundingContract(null);
          setIsAdmin(false);
          setIsVerified(false);
        }
      });

      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }
  }, []);

  return (
    <div className="App">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <h1>🌟 Decentralized Crowdfunding Platform</h1>
          
          {!account ? (
            <button onClick={connectWallet} className="connect-btn" disabled={loading}>
              {loading ? 'Connecting...' : 'Connect MetaMask'}
            </button>
          ) : (
            <div className="wallet-info">
              <div className="wallet-details">
                <p className="wallet-address">
                  {account.substring(0, 6)}...{account.substring(38)}
                </p>
                <p className="wallet-balance">💰 {parseFloat(balance).toFixed(4)} ETH</p>
              </div>
              <div className="status-badges">
                {isAdmin && <span className="badge admin-badge">👑 Admin</span>}
                {isVerified && <span className="badge verified-badge">✓ Verified</span>}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Error Message */}
      {error && (
        <div className="error-banner">
          <span>⚠️ {error}</span>
          <button onClick={() => setError('')}>✕</button>
        </div>
      )}

      {account && (
        <main className="main-content">
          {/* Navigation Tabs */}
          <div className="tab-navigation">
            <button
              className={`tab ${activeTab === 'campaigns' ? 'active' : ''}`}
              onClick={() => setActiveTab('campaigns')}
            >
              📋 Campaigns
            </button>
            <button
              className={`tab ${activeTab === 'create' ? 'active' : ''}`}
              onClick={() => setActiveTab('create')}
            >
              ➕ Create Campaign
            </button>
            <button
              className={`tab ${activeTab === 'kyc' ? 'active' : ''}`}
              onClick={() => setActiveTab('kyc')}
            >
              🆔 KYC Verification
            </button>
            {isAdmin && (
              <button
                className={`tab ${activeTab === 'admin' ? 'active' : ''}`}
                onClick={() => setActiveTab('admin')}
              >
                ⚙️ Admin Panel
              </button>
            )}
          </div>

          {/* Tab Content */}
          <div className="tab-content">
            {activeTab === 'campaigns' && (
              <CampaignList
                crowdfundingContract={crowdfundingContract}
                account={account}
              />
            )}

            {activeTab === 'create' && (
              <CreateCampaign
                crowdfundingContract={crowdfundingContract}
                isVerified={isVerified}
                isAdmin={isAdmin}
              />
            )}

            {activeTab === 'kyc' && (
              <KYCSection
                kycContract={kycContract}
                account={account}
                isVerified={isVerified}
              />
            )}

            {activeTab === 'admin' && isAdmin && (
              <AdminPanel kycContract={kycContract} />
            )}
          </div>
        </main>
      )}

      {/* Footer */}
      <footer className="app-footer">
        <p>
          Developed by <strong>Maryam Masood</strong> | Roll No: <strong>22i-1169</strong>
        </p>
        <p>Decentralized Crowdfunding Platform © 2024</p>
      </footer>
    </div>
  );
}

export default App;