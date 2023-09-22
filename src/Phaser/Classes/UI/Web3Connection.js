import { ethers } from "ethers";
import { krakenABI } from "../../../solidity/abi/kraken_abi.json";
import { mortiABI } from "../../../solidity/abi/morti_abi.json";
import { leaderboardABI } from "../../../solidity/abi/leaderboard_abi.json";

// Define global variables
let provider;
let signer;
let userAddress;

// Define your contract addresses
const krakenAddress = "0x668567f4f21a3a14fbca3538b4bfecdebee838fb";
const mortiAddress = "0x77a64f91ae5a833847474f1016dd8f56530273a9";
const leaderboardAddress = "";

// Create contract objects
const krakenContract = new ethers.Contract(krakenAddress, krakenABI, provider);
const mortiContract = new ethers.Contract(mortiAddress, mortiABI, provider);
const leaderboardContract = new ethers.Contract(leaderboardAddress, leaderboardABI, provider);

// Connect to MetaMask and call userConnected when the user connects
async function connectToMetaMask() {
  try {
    // Create a Web3Provider with MetaMask
    provider = new ethers.providers.Web3Provider(window.ethereum);

    // Request Ethereum wallet access
    await window.ethereum.request({ method: 'eth_requestAccounts' });

    // Get the user's address
    signer = provider.getSigner();
    userAddress = await signer.getAddress();

  } catch (error) {
    console.error('Error connecting to wallet:', error.message);
  }
}

// Function to get owned Krakens and Mortis for the connected user; returns an array of token IDs
async function getOwnedKrakens() {
  try {
    // Check if the user is connected
    if (!provider) {
      console.error('User is not connected to a wallet.');
      return [];
    }

    // Get the list of Krakens and Mortis owned by the user
    const ownedKrakens = await krakenContract.tokensOfOwner(userAddress);

    // Return the list of owned tokens
    return [...ownedKrakens]; 

  } catch (error) {
    console.error('Error fetching owned tokens:', error.message);
    // Handle errors
    return [];
  }
}

// Function to get owned Krakens and Mortis for the connected user; returns an array of token IDs
async function getOwnedMortis() {
  try {
    // Check if the user is connected
    if (!provider) {
      console.error('User is not connected to a wallet.');
      return [];
    }

    // Get the list of Krakens and Mortis owned by the user
    const ownedMortis = await mortiContract.tokensOfOwner(userAddress);

    // Return the list of owned tokens
    return [ ...ownedMortis]; 

  } catch (error) {
    console.error('Error fetching owned tokens:', error.message);
    // Handle errors
    return [];
  }
}


// Function to register the user's score on the leaderboard - need to properly implement the leaderboard contract and check this again
async function registerScore(score) {
  try {
    // Check if the user is connected
    if (!provider) {
      console.error('User is not connected to a wallet.');
      return;
    } else {
      // Register the score on the leaderboard
      const register = await leaderboardContract.registerScore(score);
      await register.wait();
    }
  } catch (error) {
    console.error('Error registering score:', error.message);
  }
}
        

export { connectToMetaMask, getOwnedKrakens, getOwnedMortis, registerScore };




  
