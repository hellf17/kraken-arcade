// Function to record a player stats for a specific Kraken ID
async function recordPlayerStatsExt(krakenId, score, timeSurvived, kills, deaths) {
  const matchStats = {
    krakenId,
    score,
    timeSurvived,
    kills,
    deaths,
    timestamp: Date.now(),
  };

  try {
    const response = await fetch('ARWEAVE_API_ENDPOINT', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(matchStats),
    });

    if (response.ok) {
      console.log('Player stats recorded successfully!');
    } else {
      console.error('Failed to record player stats:', response.status);
    }
  } catch (error) {
    console.error('Error recording player stats:', error);
  }
}

// Function to get top stats from the server
async function getTopStatsExt(category, limit = 1) {
  try {
    const response = await fetch(`ARWEAVE_API_ENDPOINT?category=${category}&limit=${limit}`);
    if (response.ok) {
      const topStats = await response.json();
      return topStats;
    } else {
      console.error('Failed to fetch top stats:', response.status);
      return [];
    }
  } catch (error) {
    console.error('Error fetching top stats:', error);
    return [];
  }
}

export { recordPlayerStatsExt, getTopStatsExt };
