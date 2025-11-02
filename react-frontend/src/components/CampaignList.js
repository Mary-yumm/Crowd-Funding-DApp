import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

function CampaignList({ crowdfundingContract, account }) {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [contributionAmount, setContributionAmount] = useState({});
  const [contributingTo, setContributingTo] = useState(null);

  useEffect(() => {
    if (crowdfundingContract) {
      loadCampaigns();
      
      // Listen for new campaigns
      crowdfundingContract.on('CampaignCreated', () => {
        loadCampaigns();
      });

      // Listen for contributions
      crowdfundingContract.on('ContributionMade', () => {
        loadCampaigns();
      });

      // Listen for withdrawals
      crowdfundingContract.on('FundsWithdrawn', () => {
        loadCampaigns();
      });
    }
  }, [crowdfundingContract]);

  const loadCampaigns = async () => {
    try {
      setLoading(true);
      const allCampaigns = await crowdfundingContract.getAllCampaigns();
      
      const formattedCampaigns = allCampaigns.map(c => ({
        id: Number(c.id),
        title: c.title,
        description: c.description,
        creator: c.creator,
        goalAmount: ethers.formatEther(c.goalAmount),
        fundsRaised: ethers.formatEther(c.fundsRaised),
        status: Number(c.status), // 0: Active, 1: Completed, 2: Withdrawn
        createdAt: Number(c.createdAt)
      }));

      setCampaigns(formattedCampaigns.reverse()); // Show newest first
    } catch (error) {
      console.error('Error loading campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  const contribute = async (campaignId) => {
    const amount = contributionAmount[campaignId];
    
    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid contribution amount');
      return;
    }

    setContributingTo(campaignId);
    try {
      const amountInWei = ethers.parseEther(amount);
      const tx = await crowdfundingContract.contribute(campaignId, { value: amountInWei });
      await tx.wait();
      
      alert('✅ Contribution successful! Thank you for your support!');
      setContributionAmount({ ...contributionAmount, [campaignId]: '' });
      await loadCampaigns();
    } catch (error) {
      console.error('Error contributing:', error);
      alert('❌ Failed to contribute: ' + error.message);
    } finally {
      setContributingTo(null);
    }
  };

  const withdrawFunds = async (campaignId) => {
    if (!window.confirm('Are you sure you want to withdraw the funds?')) {
      return;
    }

    setLoading(true);
    try {
      const tx = await crowdfundingContract.withdrawFunds(campaignId);
      await tx.wait();
      
      alert('✅ Funds withdrawn successfully!');
      await loadCampaigns();
    } catch (error) {
      console.error('Error withdrawing funds:', error);
      alert('❌ Failed to withdraw funds: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 0: return <span className="status-badge active">🟢 Active</span>;
      case 1: return <span className="status-badge completed">✓ Goal Reached</span>;
      case 2: return <span className="status-badge withdrawn">💰 Funds Withdrawn</span>;
      default: return <span className="status-badge">Unknown</span>;
    }
  };

  const getProgressPercentage = (raised, goal) => {
    return Math.min((parseFloat(raised) / parseFloat(goal)) * 100, 100);
  };

  return (
    <div className="campaign-list-section">
      <h2>📋 All Campaigns</h2>

      {loading && campaigns.length === 0 && (
        <p className="loading-text">Loading campaigns...</p>
      )}

      {campaigns.length === 0 && !loading ? (
        <div className="no-campaigns">
          <p>No campaigns yet. Be the first to create one!</p>
        </div>
      ) : (
        <div className="campaigns-grid">
          {campaigns.map((campaign) => (
            <div key={campaign.id} className="campaign-card">
              <div className="campaign-header">
                <h3>{campaign.title}</h3>
                {getStatusBadge(campaign.status)}
              </div>

              <p className="campaign-description">{campaign.description}</p>

              <div className="campaign-stats">
                <div className="stat">
                  <span className="label">Goal:</span>
                  <span className="value">{parseFloat(campaign.goalAmount).toFixed(2)} ETH</span>
                </div>
                <div className="stat">
                  <span className="label">Raised:</span>
                  <span className="value">{parseFloat(campaign.fundsRaised).toFixed(2)} ETH</span>
                </div>
                <div className="stat">
                  <span className="label">Creator:</span>
                  <span className="value">
                    {campaign.creator.substring(0, 6)}...{campaign.creator.substring(38)}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="progress-bar-container">
                <div 
                  className="progress-bar-fill"
                  style={{ width: `${getProgressPercentage(campaign.fundsRaised, campaign.goalAmount)}%` }}
                />
              </div>
              <p className="progress-text">
                {getProgressPercentage(campaign.fundsRaised, campaign.goalAmount).toFixed(1)}% funded
              </p>

              {/* Contribution Section */}
              {campaign.status === 0 && (
                <div className="contribution-section">
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    placeholder="Amount in ETH"
                    value={contributionAmount[campaign.id] || ''}
                    onChange={(e) => setContributionAmount({
                      ...contributionAmount,
                      [campaign.id]: e.target.value
                    })}
                  />
                  <button
                    onClick={() => contribute(campaign.id)}
                    disabled={contributingTo === campaign.id}
                    className="contribute-btn"
                  >
                    {contributingTo === campaign.id ? 'Contributing...' : '💝 Contribute'}
                  </button>
                </div>
              )}

              {/* Withdraw Button */}
              {campaign.status === 1 && 
               campaign.creator.toLowerCase() === account.toLowerCase() && (
                <button
                  onClick={() => withdrawFunds(campaign.id)}
                  disabled={loading}
                  className="withdraw-btn"
                >
                  {loading ? 'Withdrawing...' : '💰 Withdraw Funds'}
                </button>
              )}

              {campaign.status === 2 && (
                <p className="withdrawn-message">✓ Funds have been withdrawn by creator</p>
              )}

              <p className="campaign-date">
                Created: {new Date(campaign.createdAt * 1000).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CampaignList;