// Function to record a win for a specific Kraken ID
function recordWin(krakenId) {
  const wins = getWins();
  wins[krakenId] = (wins[krakenId] || 0) + 1;
  updateWins(wins);
}

// Function to record a loss for a specific Kraken ID
function recordLoss(krakenId) {
  const losses = getLosses();
  losses[krakenId] = (losses[krakenId] || 0) + 1;
  updateLosses(losses);
}

// Function to record a player score for a specific Kraken ID
function recordPlayerScore(krakenId, score) {
  const scores = getPlayerScores();
  if (!scores[krakenId]) {
    scores[krakenId] = [];
  }
  scores[krakenId].push(score);
  updatePlayerScores(scores);
}

// Function to get recorded wins
function getWins() {
  const winsStr = getCookie('wins');
  return winsStr ? JSON.parse(winsStr) : {};
}

// Function to get recorded losses
function getLosses() {
  const lossesStr = getCookie('losses');
  return lossesStr ? JSON.parse(lossesStr) : {};
}

// Function to get recorded player scores
function getPlayerScores() {
  const playerScoresStr = getCookie('playerScores');
  return playerScoresStr ? JSON.parse(playerScoresStr) : {};
}

// Function to update recorded wins
function updateWins(wins) {
  updateCookie('wins', JSON.stringify(wins));
}

// Function to update recorded losses
function updateLosses(losses) {
  updateCookie('losses', JSON.stringify(losses));
}

// Function to update recorded player scores
function updatePlayerScores(scores) {
  updateCookie('playerScores', JSON.stringify(scores));
}

// Helper function to set/update a cookie
function updateCookie(name, value) {
  document.cookie = `${name}=${value}; expires=Sun, 1 Jan 2023 00:00:00 UTC; path=/`;
}

// Helper function to get the value of a cookie by name
function getCookie(name) {
  const cookies = document.cookie.split('; ');
  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.split('=');
    if (cookieName === name) {
      return cookieValue;
    }
  }
  return null;
}

export {
  recordWin,
  recordLoss,
  recordPlayerScore,
  getWins,
  getLosses,
  getPlayerScores,
};
