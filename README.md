---
# HelpNet
[Watch the overview video](https://www.youtube.com/watch?v=xfk_6xLy2jU)

[![Watch the overview video](https://img.youtube.com/vi/xfk_6xLy2jU/0.jpg)](https://www.youtube.com/watch?v=xfk_6xLy2jU)

HelpNet is a decentralized platform built on Polygon zkEVM that allows users to share and verify disaster relief information. Users can earn crypto rewards by contributing valuable information and participating in the verification process.


## Table of Contents

- [Features](#features)
- [Technologies](#technologies)
- [Installation](#installation)
- [Usage](#usage)
- [Smart Contract](#smart-contract)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Features

- **User Contributions**: Users can upload disaster relief information.
- **Voting System**: The community can vote on the accuracy of the information.
- **Rewards**: Users earn crypto tokens for valid contributions and voting.
- **Decentralized Storage**: All data is securely stored using Filecoin.

## Technologies

- **Frontend**: Next.js
- **Backend**: Express.js
- **Blockchain**: Polygon zkEVM
- **Storage**: Filecoin (Lighthouse)
- **Database**: MongoDB (optional, based on requirements)

## Installation

To set up the project locally, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/Dhruv-Sood/HelpNet.git
   cd HelpNet
   ```

2. Install the required dependencies for the frontend:
   ```bash
   cd client
   npm install
   ```

3. Install the required dependencies for the backend:
   ```bash
   cd backend
   npm install
   ```

4. (Optional) If using MongoDB, set up your MongoDB instance and update the connection string in your backend configuration.

## Usage

1. Start the backend server:
   ```bash
   cd backend
   npm run start
   ```

2. Start the frontend application:
   ```bash
   cd frontend
   npm run dev
   ```

3. Access the application at `http://localhost:3000`.

## Smart Contract

The smart contract allows users to mint HNT tokens. Below are the steps to deploy the smart contract:

1. Compile and deploy the contract using Hardhat or Remix.
2. Ensure that the contract is deployed on the Polygon zkEVM Testnet.
3. Interact with the contract through the frontend.


## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue.

1. Fork the repository.
2. Create your feature branch:
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. Commit your changes:
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. Push to the branch:
   ```bash
   git push origin feature/AmazingFeature
   ```
5. Open a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


---
