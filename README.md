# Crowd Funding App

## Overview
The Crowd Funding App is a decentralized application (dApp) built on the Ethereum blockchain. It allows users to create, manage, and contribute to crowdfunding campaigns in a secure and transparent manner. The app also includes a Know Your Customer (KYC) registry to ensure compliance and trustworthiness among participants.

This project is divided into two main components:
1. **Hardhat Backend**: Manages the smart contracts and blockchain interactions.
2. **React Frontend**: Provides a user-friendly interface for interacting with the dApp.

---

## Features
### Backend
- **Crowdfunding Campaigns**: Smart contracts to create and manage campaigns.
- **KYC Registry**: A registry to verify user identities.
- **Voting Mechanism**: Allows stakeholders to vote on campaign-related decisions.

### Frontend
- **Campaign Management**: Create, view, and contribute to campaigns.
- **Admin Panel**: Manage KYC approvals and oversee campaigns.
- **KYC Section**: Submit and verify user identities.

---

## Project Structure
### Hardhat Backend
- **Contracts**: Solidity smart contracts for crowdfunding, KYC, and voting.
- **Scripts**: Deployment scripts for deploying contracts to the blockchain.
- **Tests**: Unit tests for verifying contract functionality.

### React Frontend
- **Components**: Reusable React components for the user interface.
- **Contracts**: JSON files for interacting with deployed smart contracts.
- **Public**: Static assets like the favicon and manifest.

---

## Prerequisites
- Node.js (v16 or higher)
- Hardhat
- MetaMask (or any Ethereum wallet)
- Ethereum test network (e.g., Goerli, Sepolia)

---

## Installation
### Backend
1. Navigate to the backend directory:
   ```bash
   cd hardhat-backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Compile the smart contracts:
   ```bash
   npx hardhat compile
   ```
4. Deploy the contracts:
   ```bash
   npx hardhat run scripts/deploy.js --network <network-name>
   ```

### Frontend
1. Navigate to the frontend directory:
   ```bash
   cd react-frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```

---

## Usage
1. Open the frontend in your browser at `http://localhost:3000`.
2. Connect your Ethereum wallet (e.g., MetaMask).
3. Interact with the app to create campaigns, contribute, or manage KYC.

---

## Testing
### Backend
Run the Hardhat tests:
```bash
npx hardhat test
```

### Frontend
Run the React tests:
```bash
npm test
```

---

## Folder Structure
```
Crowd_Funding_App/
├── hardhat-backend/
│   ├── contracts/          # Solidity smart contracts
│   ├── scripts/            # Deployment scripts
│   ├── test/               # Unit tests
│   └── hardhat.config.js   # Hardhat configuration
├── react-frontend/
│   ├── src/                # React source code
│   ├── public/             # Static assets
│   └── package.json        # Frontend dependencies
```

---

## Contributing
1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add your message here"
   ```
4. Push to the branch:
   ```bash
   git push origin feature/your-feature-name
   ```
5. Open a pull request.

---

## Acknowledgments
- Ethereum Blockchain
- Hardhat Development Environment
- React.js Framework
- OpenZeppelin Libraries
