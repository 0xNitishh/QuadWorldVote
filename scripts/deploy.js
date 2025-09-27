const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying QuadWorldVote contracts to World Chain...");

  // World ID contract address on World Chain (you'll need to get the actual address)
  const WORLD_ID_ADDRESS = process.env.WORLD_ID_CONTRACT_ADDRESS || "0x1234567890123456789012345678901234567890";
  const GROUP_ID = process.env.WORLD_ID_GROUP_ID || "0x1234567890123456789012345678901234567890";

  // Deploy ContestFactory
  console.log("Deploying ContestFactory...");
  const ContestFactory = await ethers.getContractFactory("ContestFactory");
  const contestFactory = await ContestFactory.deploy(WORLD_ID_ADDRESS, GROUP_ID);
  await contestFactory.deployed();

  const contestFactoryAddress = contestFactory.address;
  console.log("ContestFactory deployed to:", contestFactoryAddress);

  // Verify deployment
  console.log("Verifying deployment...");
  const factory = await ethers.getContractAt("ContestFactory", contestFactoryAddress);
  const worldId = await factory.worldId();
  const groupId = await factory.groupId();

  console.log("Verification successful!");
  console.log("World ID address:", worldId);
  console.log("Group ID:", groupId);

  console.log("\n=== Deployment Summary ===");
  console.log("ContestFactory:", contestFactoryAddress);
  console.log("World ID:", WORLD_ID_ADDRESS);
  console.log("Group ID:", GROUP_ID);
  console.log("\nAdd these to your .env.local file:");
  console.log(`NEXT_PUBLIC_CONTEST_FACTORY_ADDRESS=${contestFactoryAddress}`);
  console.log(`NEXT_PUBLIC_WORLD_ID_CONTRACT_ADDRESS=${WORLD_ID_ADDRESS}`);
  console.log(`NEXT_PUBLIC_WORLD_ID_GROUP_ID=${GROUP_ID}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
