# QuadWorldVote - Quadratic Voting on World Chain

A decentralized quadratic voting platform built on World Chain with World ID verification. This mini-app allows users to create and participate in quadratic voting contests with verifiable, on-chain results.

## Features

- **World ID Integration**: Human verification using World ID to prevent sybil attacks
- **Quadratic Voting**: Fair voting system where the cost of votes increases quadratically
- **World Chain Deployment**: All contracts deployed on World Chain for free transactions
- **MiniKit Integration**: Seamless wallet connection and authentication
- **Real-time Results**: Live leaderboard with verifiable on-chain data
- **Contest Management**: Create and manage voting contests with customizable parameters

## Architecture

### Smart Contracts

- **ContestFactory**: Deploys new voting contests
- **Contest**: Individual voting contest with quadratic voting logic
- **World ID Integration**: Verifies human identity for each vote

### Frontend

- **Next.js 14**: React framework with App Router
- **Wagmi**: Ethereum wallet integration
- **World ID Widget**: Human verification component
- **Tailwind CSS**: Modern, responsive UI design

## Prerequisites

- Node.js 18+ 
- npm or yarn
- World ID App ID
- WalletConnect Project ID
- Private key for deployment

## Installation

1. Clone the repository:
```bash
git clone https://github.com/0xNitishh/QuadWorldVote.git
cd QuadWorldVote
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp env.example .env.local
```

Edit `.env.local` with your configuration:
```env
NEXT_PUBLIC_WORLD_ID_APP_ID=your_world_id_app_id
NEXT_PUBLIC_WORLD_ID_CONTRACT_ADDRESS=world_id_contract_address
NEXT_PUBLIC_WORLD_ID_GROUP_ID=world_id_group_id
NEXT_PUBLIC_CONTEST_FACTORY_ADDRESS=deployed_factory_address
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
PRIVATE_KEY=your_private_key_for_deployment
```

## Deployment

### Deploy Smart Contracts

1. Compile contracts:
```bash
npx hardhat compile
```

2. Deploy to World Chain:
```bash
npx hardhat run scripts/deploy.js --network world
```

3. Update your `.env.local` with the deployed contract addresses.

### Deploy Frontend

1. Build the application:
```bash
npm run build
```

2. Deploy to your preferred hosting platform (Vercel, Netlify, etc.)

## Usage

### Creating a Contest

1. Connect your wallet using MiniKit
2. Verify your humanity with World ID
3. Navigate to "Create Contest"
4. Fill in contest details:
   - Title and description
   - Start and end times
   - Credits per voter (quadratic voting budget)
   - Maximum number of projects
   - Allow public submissions (optional)

### Participating in Voting

1. Open the mini-app in World App
2. Verify your humanity with World ID
3. Select a contest to participate in
4. Allocate your credits across projects using sliders
5. Submit your vote (verified on-chain)

### Viewing Results

1. Navigate to "Results" to see live leaderboard
2. Results are calculated in real-time from on-chain data
3. All results are verifiable by checking the smart contract

## Quadratic Voting Rules

- Each voter receives a fixed number of credits
- The cost of allocating N credits to a project is N²
- Total cost across all projects cannot exceed the voter's credit limit
- This system encourages voters to concentrate their support on fewer projects

## World Chain Integration

This mini-app is built specifically for World Chain and meets all requirements for the World mini-app bounty:

- ✅ Uses MiniKit SDK for authentication and wallet connection
- ✅ Integrates World ID for human verification
- ✅ Deploys contracts to World Chain
- ✅ Implements proof validation in smart contracts
- ✅ Not gambling or chance-based
- ✅ Provides instant exposure to 23M+ World App users

## Development

### Local Development

1. Start the development server:
```bash
npm run dev
```

2. Open [http://localhost:3000](http://localhost:3000) in your browser

### Testing

Run the test suite:
```bash
npm test
```

### Linting

Check code quality:
```bash
npm run lint
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support and questions:
- Create an issue in this repository
- Join the World ID Discord community
- Check the World Chain documentation

## Acknowledgments

- World ID team for human verification infrastructure
- World Chain team for the blockchain platform
- MiniKit team for wallet integration tools
- OpenZeppelin for smart contract security patterns
