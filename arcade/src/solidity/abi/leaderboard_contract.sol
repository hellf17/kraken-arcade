//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;

contract Leaderboard {
    struct Score {
        address player;
        uint256 token_id;
        uint256 score;
    }

    mapping(uint256 => Score) private scores;
    uint256 private latestScoreId;
    address private owner;
    string private gameSecretKey; // Secret key or password set by your Python game

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action");
        _;
    }

    modifier onlyGame() {
        require(msg.sender == owner || msg.sender == address(this), "Only the game can register scores");
        _;
    }

    constructor() {
        owner = msg.sender;
        latestScoreId = 0;
    }

    function setGameSecretKey(string memory _gameSecretKey) external onlyOwner {
        gameSecretKey = _gameSecretKey;
    }

    // Function to register score with a secret key
    function registerScore(uint256 token_id, uint256 score, string memory secretKey) public onlyGame {
        require(keccak256(bytes(secretKey)) == keccak256(bytes(gameSecretKey)), "Invalid secret key");

        latestScoreId++;
        scores[latestScoreId] = Score(msg.sender, token_id, score);
        updateLeaderboard();
    }

    function updateLeaderboard() private {
        // If there are more than 50 entries, use the divide and conquer method
        if (latestScoreId > 50) {
            mergeSort(1, latestScoreId);
        } else {
            // Sorting logic to order scores from highest to lowest if 50 or fewer entries
            for (uint256 i = 1; i <= latestScoreId; i++) {
                for (uint256 j = i + 1; j <= latestScoreId; j++) {
                    if (scores[i].score < scores[j].score) {
                        Score memory temp = scores[i];
                        scores[i] = scores[j];
                        scores[j] = temp;
                    }
                }
            }
        }
    }

// Merge Sort for divide and conquer
    function mergeSort(uint256 left, uint256 right) private {
        if (left < right) {
            uint256 mid = (left + right) / 2;
            mergeSort(left, mid);
            mergeSort(mid + 1, right);
            merge(left, mid, right);
        }
    }

// Merge helper function
    function merge(uint256 left, uint256 mid, uint256 right) private {
        Score[] memory leftArray = new Score[](mid - left + 1);
        Score[] memory rightArray = new Score[](right - mid);

        uint256 i;
        uint256 j;

        for (i = 0; i < leftArray.length; i++) {
            leftArray[i] = scores[left + i];
        }

        for (j = 0; j < rightArray.length; j++) {
            rightArray[j] = scores[mid + j + 1];
        }

        i = 0;
        j = 0;
        uint256 k = left;

        while (i < leftArray.length && j < rightArray.length) {
            if (leftArray[i].score >= rightArray[j].score) {
                scores[k] = leftArray[i];
                i++;
            } else {
                scores[k] = rightArray[j];
                j++;
            }
            k++;
        }

        while (i < leftArray.length) {
            scores[k] = leftArray[i];
            i++;
            k++;
        }

        while (j < rightArray.length) {
            scores[k] = rightArray[j];
            j++;
            k++;
        }
    }

    function getTopScores(uint256 count) public view returns (Score[] memory) {
        require(count > 0 && count <= latestScoreId, "Invalid count");

        Score[] memory topScores = new Score[](count);
        for (uint256 i = 0; i < count; i++) {
            topScores[i] = scores[i + 1];
        }

        return topScores;
    }

    // Get the user's position in the leaderboard
    function getUserPosition(address userAddress) public view returns (uint256) {
        for (uint256 i = 1; i <= latestScoreId; i++) {
            if (scores[i].player == userAddress) {
                return i;
            }
        }
        return 0; // User not found in the leaderboard
    }
}