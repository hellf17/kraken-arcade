import { ethers } from "ethers";

// Metamask connection
  // A Web3Provider wraps a standard Web3 provider, which is what MetaMask injects as window.ethereum into each page
const provider = new ethers.providers.Web3Provider(window.ethereum)

  // MetaMask requires requesting permission to connect users accounts
await provider.send("eth_requestAccounts", []);

  // The MetaMask plugin also allows signing transactions to send ether and pay to change state within the blockchain. For this, you need the account signer...
const signer = provider.getSigner()

// Kraken and Morti contract connection
  // Contracts
const krakenAddress = "0x668567f4f21a3a14fbca3538b4bfecdebee838fb";
const mortiAddress = "0x77a64f91ae5a833847474f1016dd8f56530273a9";

  // ABIs
const krakenABI = [];
const mortiABI = [];

  // Contract objects
const krakenContract = new ethers.Contract(krakenAddress, krakenABI, provider);
const mortiContract = new ethers.Contract(mortiAddress, mortiABI, provider);

  // Get the krakens and mortis owned by the user; returns a list with the token ID user owns
const ownedKrakens = await krakenContract.tokensOfOwner('userAddress') //need to set the user address properly here - provider?
const ownedMortis = await mortiContract.tokensOfOwner('userAddress')

// Leaderboard contract connection
  // Contract address
const leaderboardAddress = "";

  // ABI
const leaderboardABI = [];

  // Contract objects
const leaderboardContract = new ethers.Contract(leaderboardAddress, leaderboardABI, provider);
  
