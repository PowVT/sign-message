const { ethers } = require("ethers");
const hre = require("hardhat");

async function main() {

  // Hardhat provider
  const provider = new ethers.providers.JsonRpcProvider("http://localhost:8545");  // http://localhost:8545 https://rpc.xdaichain.com/
  const signer = await provider.getSigner()
  const blockNumber = await provider.getBlockNumber()


  // The message...
  let message = ethers.utils.id("Your message here!");

  // Wallet init
  var wallet = new ethers.Wallet("0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80", provider); // initiate wallet object with a private key.

  // To Wallet init
  toAddress = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"

  // Sign message
  var signature = await wallet.signMessage(message)
  
  // Verify/Sign In
  let recoveredAddress = ethers.utils.verifyMessage(message, signature)
  console.log(recoveredAddress)
  if(recoveredAddress == wallet.address){
    // If success do something... 
    let sendResult = await wallet.sendTransaction({
      to: toAddress,
      value: ethers.utils.parseEther("0.01")
    })
    
    console.log(" 👍 successfully signed in as "+ wallet.address +"!");
  }
  
  balance = await provider.getBalance(toAddress)

  //console.log("Provider:", provider);
  //console.log("Signer:", signer);
  console.log("Block Number:", blockNumber);
  console.log("Second Hardhat Account Balance: ", ethers.utils.formatEther(balance))
  console.log("Signature: ", signature)
  //console.log("contract", contract)

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
