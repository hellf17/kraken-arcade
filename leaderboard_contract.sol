pragma solidity ^0.8.0;

contract Leaderboard {
    struct Score {
        address player;
        uint256 score;
        string image;
    }

    mapping(uint256 => Score) private scores;
    uint256 private latestScoreId;
    address private owner;

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action");
        _;
    }

    constructor() {
        owner = msg.sender;
        latestScoreId = 0;
    }

    function registerScore(uint256 score, string memory image) public onlyOwner {
        require(bytes(image).length > 0, "Invalid image");

        latestScoreId++;
        scores[latestScoreId] = Score(msg.sender, score, image);
        updateLeaderboard();
    }

    function updateLeaderboard() private {
        // Sorting logic to order scores from highest to lowest
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

    function getTopScores(uint256 count) public view returns (Score[] memory) {
        require(count > 0 && count <= latestScoreId, "Invalid count");

        Score[] memory topScores = new Score[](count);
        for (uint256 i = 0; i < count; i++) {
            topScores[i] = scores[i + 1];
        }

        return topScores;
    }
}
