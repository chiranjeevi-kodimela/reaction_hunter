function Statistics({ statistics }) {
  return (
    <div className="statistics">
      <h2>Your Statistics</h2>

      <div className="statistics-grid">
        <div className="stat-card">
          <span>Games Played</span>
          <strong>{statistics.gamesPlayed}</strong>
        </div>

        <div className="stat-card">
          <span>Total Hits</span>
          <strong>{statistics.totalHits}</strong>
        </div>

        <div className="stat-card">
          <span>Total Misses</span>
          <strong>{statistics.totalMisses}</strong>
        </div>

        <div className="stat-card">
          <span>Best Score</span>
          <strong>{statistics.bestScore}</strong>
        </div>

        <div className="stat-card">
          <span>Best Streak</span>
          <strong>{statistics.bestStreak}</strong>
        </div>

        <div className="stat-card">
          <span>Best Reaction</span>
          <strong>
            {statistics.bestReaction !== null
              ? `${statistics.bestReaction} ms`
              : "-"}
          </strong>
        </div>

        <div className="stat-card">
          <span>Average Reaction</span>
          <strong>
            {statistics.averageReaction !== null
              ? `${statistics.averageReaction} ms`
              : "-"}
          </strong>
        </div>

        <div className="stat-card">
          <span>Average Accuracy</span>
          <strong>{statistics.averageAccuracy}%</strong>
        </div>
      </div>
    </div>
  );
}

export default Statistics;
