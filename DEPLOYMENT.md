# QuadVote Deployment Guide

This guide will help you deploy the QuadVote mini-app to World Chain and make it available to World App users.

## Prerequisites

1. **World ID Setup**
   - Register your app at [world.id](https://world.id)
   - Get your App ID and configure verification settings
   - Note the World ID contract address on World Chain

2. **World Chain Configuration**
   - Get World Chain RPC URL: `https://worldchain.worldcoin.org`
   - Chain ID: `480`
   - Native currency: ETH

3. **WalletConnect Setup**
   - Create a project at [WalletConnect Cloud](https://cloud.walletconnect.com)
   - Get your Project ID

## Step 1: Environment Setup

1. Copy the environment template:
```bash
cp env.example .env.local
```

2. Fill in your configuration:
```env
# World ID Configuration
NEXT_PUBLIC_WORLD_ID_APP_ID=app_staging_your_app_id_here
NEXT_PUBLIC_WORLD_ID_CONTRACT_ADDRESS=0x_your_world_id_contract_address
NEXT_PUBLIC_WORLD_ID_GROUP_ID=0x_your_group_id

# Contract Addresses (will be filled after deployment)
NEXT_PUBLIC_CONTEST_FACTORY_ADDRESS=0x_your_factory_address

# WalletConnect
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id

# Private Key for deployment
PRIVATE_KEY=your_private_key_here
```

## Step 2: Smart Contract Deployment

1. Install dependencies:
```bash
npm install
```

2. Compile contracts:
```bash
npx hardhat compile
```

3. Deploy to World Chain:
```bash
npx hardhat run scripts/deploy.js --network world
```

4. Update your `.env.local` with the deployed contract addresses.

## Step 3: Frontend Deployment

### Option A: Vercel (Recommended)

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Set environment variables in Vercel dashboard:
   - Go to your project settings
   - Add all variables from your `.env.local`

### Option B: Netlify

1. Build the project:
```bash
npm run build
```

2. Deploy the `out` folder to Netlify
3. Set environment variables in Netlify dashboard

### Option C: Other Platforms

1. Build the project:
```bash
npm run build
```

2. Deploy the `out` folder to your preferred hosting platform
3. Set environment variables

## Step 4: MiniKit Integration

1. **Configure MiniKit**
   - Your app will automatically detect if it's running in MiniKit
   - The `MiniKitProvider` component handles this detection

2. **Test in World App**
   - Open World App
   - Navigate to your deployed mini-app URL
   - Test the complete flow:
     - Wallet connection
     - World ID verification
     - Contest creation
     - Voting
     - Results viewing

## Step 5: Verification

### Smart Contract Verification

1. Verify your contracts on World Chain explorer:
```bash
npx hardhat verify --network world <CONTRACT_ADDRESS> <CONSTRUCTOR_ARGS>
```

### MiniKit Compliance

Ensure your app meets all MiniKit requirements:

- ✅ Uses MiniKit SDK for authentication
- ✅ Integrates World ID for human verification
- ✅ Deploys contracts to World Chain
- ✅ Implements proof validation in smart contracts
- ✅ Not gambling or chance-based
- ✅ Provides instant exposure to World App users

## Step 6: Testing

### Local Testing

1. Start development server:
```bash
npm run dev
```

2. Test with local Hardhat network:
```bash
npx hardhat node
npx hardhat run scripts/deploy.js --network localhost
```

### Production Testing

1. Test all functionality on World Chain
2. Verify World ID integration works
3. Test with multiple users
4. Verify quadratic voting calculations
5. Check results accuracy

## Troubleshooting

### Common Issues

1. **World ID Verification Fails**
   - Check your App ID configuration
   - Verify the action ID matches your app
   - Ensure you're using the correct World ID contract

2. **Contract Deployment Fails**
   - Check your private key has sufficient ETH
   - Verify World Chain RPC URL is correct
   - Check gas limits

3. **MiniKit Detection Issues**
   - Ensure your app is accessible via HTTPS
   - Check iframe compatibility
   - Verify MiniKit environment detection

### Support

- Check the [World ID documentation](https://docs.world.org/world-id)
- Review [World Chain docs](https://docs.world.org/world-chain)
- Consult [MiniKit documentation](https://docs.world.org/mini-apps)

## Security Considerations

1. **Private Key Security**
   - Never commit private keys to version control
   - Use environment variables for sensitive data
   - Consider using hardware wallets for production

2. **Smart Contract Security**
   - Audit your contracts before mainnet deployment
   - Use OpenZeppelin's security patterns
   - Test thoroughly on testnets

3. **Frontend Security**
   - Validate all user inputs
   - Implement proper error handling
   - Use HTTPS in production

## Monitoring

1. **Contract Monitoring**
   - Monitor contract events
   - Track voting patterns
   - Monitor gas usage

2. **Frontend Monitoring**
   - Track user interactions
   - Monitor error rates
   - Track performance metrics

## Updates and Maintenance

1. **Contract Updates**
   - Use proxy patterns for upgradeable contracts
   - Implement proper access controls
   - Plan for migration strategies

2. **Frontend Updates**
   - Use CI/CD for automated deployments
   - Implement feature flags
   - Monitor user feedback

## Bounty Submission

To submit for the World mini-app bounty:

1. Ensure all requirements are met
2. Deploy to World Chain
3. Test thoroughly
4. Document your implementation
5. Submit according to bounty guidelines

Your QuadVote mini-app is now ready for the World App ecosystem!
