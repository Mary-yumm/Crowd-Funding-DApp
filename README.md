# Crowd Funding App
## Demo Video
[Watch the demo](assets/demo.mp4)


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
4. (Local development) Start a Hardhat node in a dedicated terminal:
   ```bash
   npx hardhat node
   ```
   This launches a persistent local chain at `http://127.0.0.1:8545` with funded test accounts.
5. Deploy the contracts (choose one of the networks):
   - To the running local node:
     ```bash
     npx hardhat run scripts/deploy.js --network localhost
     ```
   - To the in-memory ephemeral Hardhat network (no separate node process needed):
     ```bash
     npx hardhat run scripts/deploy.js --network hardhat
     ```
   - To Sepolia (after creating `.env`):
     ```bash
     npx hardhat run scripts/deploy.js --network sepolia
     ```
   If you see an error deploying to `localhost`, ensure the node from step 4 is still running.

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

## Deployment

### Option A — Local Hardhat network (recommended for development)
1. Start a local node (terminal 1):
   ```bash
   npx hardhat node
   ```
2. Deploy contracts to localhost (terminal 2):
   ```bash
   npx hardhat run scripts/deploy.js --network localhost
   ```
   - This script saves contract addresses and ABIs to `react-frontend/src/contracts/`:
     - `contract-addresses.json`
     - `KYCRegistry.json`
     - `Crowdfunding.json`
3. In MetaMask:
   - Add the network: HTTP RPC `http://127.0.0.1:8545`, Chain ID `31337`.
   - Import one of the private keys printed by Hardhat into MetaMask (from the node output).
4. Start the frontend and connect MetaMask to the localhost network.

### Option B — Sepolia testnet
1. Create an `.env` file in `hardhat-backend/` with your RPC URL and deployer private key:
   ```bash
   SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/<YOUR_KEY>
   PRIVATE_KEY=0x<YOUR_PRIVATE_KEY>
   ```
   - Never commit your `.env` file.
   - Fund your deployer account with Sepolia ETH from a faucet.
2. Deploy to Sepolia:
   ```bash
   npx hardhat run scripts/deploy.js --network sepolia
   ```
   - The script will again save addresses and ABIs to `react-frontend/src/contracts/`.
3. In MetaMask:
   - Switch to the Sepolia network.
   - Use the deployed addresses from `react-frontend/src/contracts/contract-addresses.json`.

Notes
- The deployment script logs a summary with addresses and also persists them to the frontend folder.
- If you change contracts, re-run compile and deployment to refresh ABIs and addresses.

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
