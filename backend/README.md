# HelpNet Backend

This is the backend Express.js server for HelpNet, a platform for sharing and verifying disaster relief information.

## Getting Started

### Prerequisites
- Node.js 16.x or higher 
- MongoDB
- npm or yarn package manager

### Installation

1. Clone the repository
2. Navigate to the backend directory:
   ```bash
   cd backend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
   or
   ```bash
   yarn install
   ```
4. Create a `.env` file with the following variables:
   ```
   LIGHTHOUSE_API_KEY=your_lighthouse_api_key
   MONGO_URI=your_mongodb_connection_string
   PRIVATE_KEY=your_private_key
   RPC_URL=your_rpc_url
   ```

### Usage
Start the Express server:
node app.js


### Routes

- **POST /submission**: Create a new submission.
- **POST /verify**: Verify a submission with a vote.
- **GET /submissions**: Fetch all unverified submissions.
- **GET /verifiedInfo**: Fetch combined verified information.

