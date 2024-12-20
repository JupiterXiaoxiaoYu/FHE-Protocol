# Smart Contract Project Setup Guide

This is a Hardhat-based smart contract development project.

## Prerequisites

- Node.js (v14.0.0 or later)
- npm (Node Package Manager)

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Available Commands:

- Run tests:
```bash
npm test
```

- Compile contracts:
```bash
npx hardhat compile
```

- Start local network:
```bash
npx hardhat node
```

## Project Structure

- `/contracts` - Smart contract source files
- `/test` - Contract test files
- `/scripts` - Deployment scripts
- `/artifacts` - Compiled contracts
- `/cache` - Hardhat cache

## Development

- Write contracts in `/contracts`
- Add tests in `/test`
- Create deployment scripts in `/scripts`
- Configure networks in `hardhat.config.js`