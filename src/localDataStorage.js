// Function to record a player stats for a specific Kraken ID
function recordPlayerStats(krakenId, score, timeSurvived, kills, deaths) {
  // Player stats contain the player's score, time survived, kills, deaths recorded locally
  // The stats are associated with the player's Kraken ID and the match's timestamp
  const playerStats = getPlayerStats();
  if (!playerStats[krakenId]) {
    playerStats[krakenId] = [];
  }
  
  const matchStats = {
    score,
    timeSurvived,
    kills,
    deaths,
    timestamp: Date.now(),
  };

  playerStats[krakenId].push(matchStats);
  updatePlayerStats(playerStats);
}

// Function to get player stats from local storage
function getPlayerStats() {
  const playerStatsStr = localStorage.getItem('playerStats');
  return playerStatsStr ? JSON.parse(playerStatsStr) : {};
}

// Function to update player stats in local storage
function updatePlayerStats(playerStats) {
  localStorage.setItem('playerStats', JSON.stringify(playerStats));
}

// Function to find top stats across different matches for a specific category
function getTopStats(category, limit = 1) {
  const playerStats = getPlayerStats();
  const topStats = [];

  for (const krakenId in playerStats) {
    const statsArray = playerStats[krakenId];
    const sortedStats = statsArray.sort((a, b) => b[category] - a[category]);
    const topStatsForKraken = sortedStats.slice(0, limit);
    topStats.push(...topStatsForKraken);
  }

  return topStats;
}

export {
  recordPlayerStats,
  getTopStats
};
