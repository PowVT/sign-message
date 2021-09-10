const { ethers } = require("ethers");

// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // Hardhat provider

  const provider = new ethers.providers.JsonRpcProvider("http://localhost:8545");  //https://rpc.xdaichain.com/
  const signer = await provider.getSigner()
  const blockNumber = await provider.getBlockNumber()
  balance = await provider.getBalance("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266")

  // The message...
  var message = "PowVT";
  // Sign the message (this could also come from eth_signMessage)
  var wallet = new ethers.Wallet("0x776853a11927b46ac697e8cdf57f69cc4d3e7c249f98580cc192576a5d3a7631");
  var signature = await wallet.signMessage(message)
  // Split the signature into its r, s and v (Solidity's format)
  var sig = await ethers.utils.splitSignature(signature);
  // Call the contract with the message and signature
  var promise = await contract.verifyString(message, sig.v, sig.r, sig.s);
  promise.then(function(signer) {
      // Check the computed signer matches the actual signer
      console.log(signer === wallet.address);
  });

  //console.log("Provider:", provider);
  //console.log("Signer:", signer);
  //console.log("Block number:", blockNumber);
  //console.log("balance: ", ethers.utils.formatEther(balance))
  console.log("signature", signature)

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
