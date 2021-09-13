require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-web3");
require("@nomiclabs/hardhat-ethers");


task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

task("balance", "Prints an account's balance")
.addParam("account", "The account's address")
.setAction(async (taskArgs) => {
  const account = web3.utils.toChecksumAddress(taskArgs.account);
  const balance = await web3.eth.getBalance(account);

  console.log(web3.utils.fromWei(balance, "ether"), "ETH");
});


task("wallet", "Create a wallet (pk) link", async (_, { ethers }) => {
  const randomWallet = ethers.Wallet.createRandom();
  const privateKey = randomWallet._signingKey().privateKey;
  console.log("🔐 WALLET Generated as " + randomWallet.address + "");
  console.log("🔗 http://localhost:3000/pk#" + privateKey);
});

task("walletAddress", "Wallet address", async (_, { ethers }) => {
  const wallet = ethers.Wallet;
  
  console.log("Wallet address " + wallet.address + "");
});


task("generate", "Create a mnemonic for builder deploys", async (_, { ethers }) => {
  const bip39 = require("bip39");
  const hdkey = require("ethereumjs-wallet/hdkey");
  const mnemonic = bip39.generateMnemonic();
  if (DEBUG) console.log("mnemonic", mnemonic);
  const seed = await bip39.mnemonicToSeed(mnemonic);
  if (DEBUG) console.log("seed", seed);
  const hdwallet = hdkey.fromMasterSeed(seed);
  const wallet_hdpath = "m/44'/60'/0'/0/";
  const account_index = 0;
  let fullPath = wallet_hdpath + account_index;
  if (DEBUG) console.log("fullPath", fullPath);
  const wallet = hdwallet.derivePath(fullPath).getWallet();
  const privateKey = "0x" + wallet._privKey.toString("hex");
  if (DEBUG) console.log("privateKey", privateKey);
  var EthUtil = require("ethereumjs-util");
  const address =
    "0x" + EthUtil.privateToAddress(wallet._privKey).toString("hex");
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


// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
};
