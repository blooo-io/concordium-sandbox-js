# Concordium Sandbox

A web application for testing Ledger hardware wallet integration with the Concordium blockchain. This sandbox provides a user-friendly interface to test various blockchain operations including transfers, contract deployment, credential management, and more.

## Features

- **Ledger Wallet Integration**: Connect and interact with Ledger hardware wallets via WebHID
- **Transaction Signing**: Test signing various Concordium transaction types:
  - Simple transfers (with and without memo)
  - Scheduled transfers
  - Public transfers
  - Contract deployment and updates
  - Credential deployment and updates
  - Baker and delegation configuration
  - Data registration
  - PLT (Programmable Ledger Token) transactions
- **Address Verification**: Verify Concordium addresses on your Ledger device
- **Key Management**: Export private keys (legacy and new formats)
- **Public Key Operations**: Retrieve and manage public keys for identity providers

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 14.x or higher (recommended: 16.x or 18.x)
- **npm**: Version 6.x or higher (comes with Node.js)
- **Browser**: Chrome or Edge browser with WebHID support (required for Ledger connection)
  - Chrome 89+ or Edge 89+
  - WebHID is not supported in Firefox or Safari
- **Hardware**: Ledger device with the Concordium app installed (official or sideloaded)

## Installation

1. **Clone or navigate to the project directory**:
   ```bash
   cd concordium-sandbox-js
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

## Running the Project

1. **Start the development server**:
   ```bash
   npm run start
   ```

2. **Open your browser**:
   - The application will typically be available at `http://localhost:1234`
   - Parcel will display the exact URL in the terminal

3. **Connect your Ledger device**:
   - Make sure your Ledger is connected via USB
   - Open the Concordium app on your Ledger device
   - Click "Connect your Wallet" button in the web application
   - Select your Ledger device when prompted by the browser

The WebHID API is necessary for direct communication with Ledger hardware wallets through the browser.

## Usage

Once the application is running and your Ledger is connected:

1. **Get Address**: Retrieve your Concordium wallet public key
2. **Verify Address**: Verify an address on your Ledger device (new and legacy formats)
3. **Export Private Key**: Export private keys in legacy or new format (for testing purposes)
4. **Transaction Operations**: Test various transaction types:
   - Simple transfers
   - Transfers with memos
   - Scheduled transfers
   - Contract operations
   - Credential management
   - Baker/delegation configuration
   - PLT transactions

## Troubleshooting

### Ledger Connection Issues

- **Device not detected**: 
  - Ensure your Ledger is connected via USB
  - Make sure the Concordium app is open on your Ledger device
  - Try disconnecting and reconnecting the device
  - Check that WebHID is enabled in your browser settings

- **Permission denied**:
  - Grant WebHID permissions when prompted by the browser
  - Check browser settings to ensure WebHID is allowed
  - Check for existing extensions interfering with the device connection

### Build/Dependency Issues


- **Parcel build errors**:
  - Clear the Parcel cache: `rm -rf .parcel-cache`
  - Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`

### Port Already in Use

If port 1234 is already in use:
- Parcel will automatically try the next available port
- Check the terminal output for the actual URL
