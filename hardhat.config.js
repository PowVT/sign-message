require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-web3");
require("@nomiclabs/hardhat-ethers");
const fs = require("fs");

const DEBUG = true;

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => { // npx hardhat accounts
  const accounts = await hre.ethers.getSigners();
  for (const account of accounts) {
    console.log(account.address);
  }
});

task("balance", "Prints an account's balance") // npx hardhat balance --account 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266
.addParam("account", "The account's address")
.setAction(async (taskArgs) => {
  const account = web3.utils.toChecksumAddress(taskArgs.account);
  const balance = await web3.eth.getBalance(account);

  console.log(web3.utils.fromWei(balance, "ether"), "ETH");
});

// Generate random wallet to use. public and private keys displayed. 
task("generateWallet", "Create a wallet (pk) link", async (_, { ethers }) => { // npx hardhat wallet
  const randomWallet = ethers.Wallet.createRandom();
  const privateKey = randomWallet._signingKey().privateKey;
  console.log("🔐 WALLET Generated as " + randomWallet.address + "");
  console.log("🔗 http://localhost:3000/pk#" + privateKey);
});

// Get wallet address when private key is inputted. 
task("walletAddress", "Wallet address")  // npx hardhat walletAddress
.addParam("privatekey", "The account's private key")
.setAction( async (_, { ethers }, taskArgs) => { 
  const wallet = ethers.Wallet(taskArgs.privatekey);
  console.log("Wallet address " + wallet.address + "");
});

// generate new deployer account with mnemonic
task("generate", "Create a mnemonic for builder deploys", async (_, { ethers }) => {
  const bip39 = require("bip39");
  const { hdkey } = require('ethereumjs-wallet')
  const fs = require("fs");
  const mnemonic = bip39.generateMnemonic();
  if (DEBUG) console.log("mnemonic", mnemonic);
  const seed = await bip39.mnemonicToSeed(mnemonic);
  if (DEBUG) console.log("seed", seed);
  const hdwallet = hdkey.fromMasterSeed(seed);
  const wallet_hdpath = "m/44'/60'/0'/0/";
  const account_index = 0;
  let fullPath = wallet_hdpath + account_index;
  if (DEBUG) console.log("fullPath: ", fullPath);
  const wallet = hdwallet.derivePath(fullPath).getWallet();
  if (DEBUG) console.log("Wallet: ", wallet);
  const privateKey = "0x" + wallet.privateKey.toString("hex");
  if (DEBUG) console.log("privateKey", privateKey);
  var EthUtil = require("ethereumjs-util");
  const address =
    "0x" + EthUtil.privateToAddress(wallet.privateKey).toString("hex");
  console.log(
    "🔐 Account Generated as " +
      address +
      " and set as mnemonic in packages/hardhat"
  );
  console.log(
    "💬 Use 'yarn run account' to get more information about the deployment account."
  );

  fs.writeFileSync("./" + address + ".txt", mnemonic.toString());
  fs.writeFileSync("./mnemonic.txt", mnemonic.toString());
});

// View the balance info for your generated account
task(
  "account",
  "Get balance informations for the deployment account.",
  async (_, { ethers }) => {
    const { hdkey } = require('ethereumjs-wallet')
    const bip39 = require("bip39");
    let mnemonic = fs.readFileSync("./mnemonic.txt").toString().trim();
    if (DEBUG) console.log("mnemonic", mnemonic);
    const seed = await bip39.mnemonicToSeed(mnemonic);
    //if (DEBUG) console.log("seed", seed);
    const hdwallet = hdkey.fromMasterSeed(seed);
    const wallet_hdpath = "m/44'/60'/0'/0/";
    const account_index = 0;
    let fullPath = wallet_hdpath + account_index;
    //if (DEBUG) console.log("fullPath", fullPath);
    const wallet = hdwallet.derivePath(fullPath).getWallet();
    const privateKey = "0x" + wallet.privateKey.toString("hex");
    if (DEBUG) console.log("privateKey", privateKey);
    var EthUtil = require("ethereumjs-util");
    const address =
      "0x" + EthUtil.privateToAddress(wallet.privateKey).toString("hex");

    var qrcode = require("qrcode-terminal");
    qrcode.generate(address);
    console.log("‍📬 Deployer Account is " + address);
    for (let n in config.networks) {
      //console.log(config.networks[n],n)
      try {
        let provider = new ethers.providers.JsonRpcProvider(
          config.networks[n].url
        );
        let balance = await provider.getBalance(address);
        console.log(" -- " + n + " --  -- -- 📡 ");
        console.log("   balance: " + ethers.utils.formatEther(balance));
        console.log(
          "   nonce: " + (await provider.getTransactionCount(address))
        );
      } catch (e) {
        if (DEBUG) {
          console.log(e);
        }
      }
    }
  }
);

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
};
