const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Greeter", function () {
  it("Should return the new greeting once it's changed", async function () {
    
    //Deploy contract
    const Greeter = await ethers.getContractFactory("Greeter");
    const greeter = await Greeter.deploy("Hello, world!");
    await greeter.deployed();
    // Expect the contracutor is set
    expect(await greeter.greet()).to.equal("Hello, world!");
    // Set new greeting
    const setGreetingTx = await greeter.setGreeting("Hola, mundo!");
    // wait until the transaction is mined from mempool
    await setGreetingTx.wait();
    // Verify greeting was successfully changed
    expect(await greeter.greet()).to.equal("Hola, mundo!");
  });
});
