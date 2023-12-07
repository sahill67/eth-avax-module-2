const hre = require("hardhat");

async function main() {
  // Set the desired initial balance and PIN
  const initBalance = 1000;
  const _pin = 1001;

  const Assessment = await hre.ethers.getContractFactory("Assessment");
  const assessment = await Assessment.deploy(initBalance, _pin);
  await assessment.deployed();

  console.log(`A contract with balance of ${initBalance} ETH and PIN ${_pin} deployed to ${assessment.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
