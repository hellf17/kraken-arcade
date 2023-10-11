import {ethers} from 'ethers/dist/ethers.esm';
import { krakenABI } from '../../../solidity/abi/kraken_abi';

// Define global variables
let provider;
let signer;
let userAddress;
let ownedKrakensIds;

// Define the contracts addresses
let krakenAddress = "0x6389936FAC235a4FADF660Ca5c428084115579Bb";
// const mortiAddress = "";
// const leaderboardAddress = "";

// Create contract objects
let krakenContract;
let mortiContract;
let leaderboardContract;

// Connect to MetaMask
async function connectToMetaMask() {
  try {
    // Create a Web3Provider with MetaMask
    provider = new ethers.providers.Web3Provider(window.ethereum);

    // Request Ethereum wallet access
    await window.ethereum.request({ method: 'eth_requestAccounts' });

    // Get the user's address
    signer = provider.getSigner();
    userAddress = await signer.getAddress();

    // Create contract objects
    krakenContract = new ethers.Contract(krakenAddress, krakenABI, signer);

  } catch (error) {
    window.alert('Error connecting to wallet:', error.message);
  }
}

// Function to get owned Krakens and Mortis for the connected user; returns an array of token IDs
async function getOwnedKrakens() {
  try {
    // Check if the user is connected
    if (provider == null) {
      console.error('User is not connected to a wallet.');
      return [];
    }

    // Get the list of Krakens and Mortis owned by the user
    await krakenContract.functions.tokensOfOwner(userAddress).then((ownedKrakens) => {
      ownedKrakensIds = ownedKrakens;
    });

    // Return the list of owned tokens
    return ownedKrakensIds;

  } catch (error) {
    window.alert('Error fetching owned tokens:', error.message);
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
    window.alert('Error fetching owned tokens:', error.message);
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
