from web3 import Web3
from json import loads

# Connects with ETH nodes
w3 = Web3(Web3.HTTPProvider('https://rinkeby.infura.io/v3/your-infura-project-id'))

# Leaderboard contract addres
contract_address = '0x123456789ABCDEF123456789ABCDEF1234567890'

# Leaderboard ABI
contract_abi = loads('[{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"scores","outputs":[{"name":"player","type":"address"},{"name":"score","type":"uint256"},{"name":"image","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"score","type":"uint256"},{"name":"image","type":"string"}],"name":"registerScore","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"count","type":"uint256"}],"name":"getTopScores","outputs":[{"name":"","type":"string[]"}],"payable":false,"stateMutability":"view","type":"function"}]')

# Creates the contract object
contract = w3.eth.contract(address=contract_address, abi=contract_abi)

def calculate_xp(user_address, score, kraken_image):
    # Calculate the user XP based on the enemies killed and time survived
    xp = score

    # Writes the score on the leaderboard
    contract.functions.registerScore(xp, kraken_image).transact({'from': user_address})

    return xp

# Example
user_address = '0x1234567890ABCDEF1234567890ABCDEF12345678'
score = 500
kraken_image = 'kraken.png'

xp = calculate_xp(user_address, score, kraken_image)
print(f"Accumulated XP: {xp}")
