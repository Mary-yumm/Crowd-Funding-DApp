import React, { useState } from 'react';
import { ethers } from 'ethers';

function CreateCampaign({ crowdfundingContract, isVerified, isAdmin }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [goalAmount, setGoalAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const createCampaign = async (e) => {
    e.preventDefault();

    if (!title.trim() || !description.trim() || !goalAmount) {
      alert('Please fill all fields');
      return;
    }

    if (parseFloat(goalAmount) <= 0) {
      alert('Goal amount must be greater than 0');
      return;
    }

    setLoading(true);
    try {
      const goalInWei = ethers.parseEther(goalAmount);
      const tx = await crowdfundingContract.createCampaign(title, description, goalInWei);
      await tx.wait();
      
      alert('🎉 Campaign created successfully!');
      setTitle('');
      setDescription('');
      setGoalAmount('');
      
      // Refresh page or emit event to parent
      window.location.reload();
    } catch (error) {
      console.error('Error creating campaign:', error);
      alert('❌ Failed to create campaign: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isVerified && !isAdmin) {
    return (
      <div className="create-campaign-section">
        <h2>➕ Create Campaign</h2>
        <div className="not-verified-message">
          <div className="warning-icon">⚠️</div>
          <h3>KYC Verification Required</h3>
          <p>You need to complete KYC verification before creating campaigns.</p>
          <p>Please go to the <strong>KYC Verification</strong> tab to submit your details.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="create-campaign-section">
      <h2>➕ Create New Campaign</h2>
      
      <form onSubmit={createCampaign} className="campaign-form">
        <div className="form-group">
          <label>Campaign Title *</label>
          <input
            type="text"
            placeholder="Enter campaign title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Description *</label>
          <textarea
            placeholder="Describe your campaign and what the funds will be used for..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="5"
            required
          />
        </div>

        <div className="form-group">
          <label>Funding Goal (ETH) *</label>
          <input
            type="number"
            step="0.01"
            min="0.01"
            placeholder="0.00"
            value={goalAmount}
            onChange={(e) => setGoalAmount(e.target.value)}
            required
          />
          <small>Minimum: 0.01 ETH</small>
        </div>

        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? 'Creating Campaign...' : '🚀 Create Campaign'}
        </button>
      </form>

      <div className="campaign-tips">
        <h3>💡 Tips for a Successful Campaign</h3>
        <ul>
          <li>Write a clear and compelling title</li>
          <li>Provide detailed description of your project</li>
          <li>Set a realistic funding goal</li>
          <li>Share your campaign with potential contributors</li>
        </ul>
      </div>
    </div>
  );
}

export default CreateCampaign;