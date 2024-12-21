const { ethers } = require("ethers");

async function main() {
  // Connect to the Hardhat local network
  const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");

  // Use a Hardhat account to sign transactions
  const privateKey =
    "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"; // Replace with one of the private keys from `npx hardhat node`
  const signer = new ethers.Wallet(privateKey, provider);

  // Contract address
  const contractAddress = "0x9fe46736679d2d9a65f0992f2272de9f3c7fa6e0"; // Replace with your deployed contract's address

  // ABI of your contract
  const abi = [
    {
      inputs: [],
      name: "helloWorld",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
      stateMutability: "pure",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "a",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "b",
          type: "uint256",
        },
      ],
      name: "add",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "pure",
      type: "function",
    },
  ];

  // Connect to the deployed contract
  const myContract = new ethers.Contract(contractAddress, abi, signer);

  try {
    // Call the `helloWorld` function
    const message = await myContract.helloWorld();
    console.log("helloWorld function response:", message);

    // Call the `add` function with two numbers
    const sum = await myContract.add(5, 3);
    console.log("Sum of 5 + 3:", sum);
  } catch (err) {
    console.error("Error interacting with the contract:", err);
  }
}

main().catch(console.error);
