function DifficultyStats({ difficultyStatistics }) {
  return (
    <div className="difficulty-stats">
      <h2>Statistics by Difficulty</h2>

      <div className="difficulty-stats-grid">
        {["easy", "medium", "hard"].map((level) => {
          const stats = difficultyStatistics[level];

          return (
            <div className="difficulty-card" key={level}>
              <h3>{level.toUpperCase()}</h3>

              <p>
                Games
                <strong>{stats.gamesPlayed}</strong>
              </p>

              <p>
                Best Score
                <strong>{stats.bestScore}</strong>
              </p>

              <p>
                Best Streak
                <strong>{stats.bestStreak}</strong>
              </p>

              <p>
                Best Reaction
                <strong>
                  {stats.bestReaction !== null
                    ? `${stats.bestReaction} ms`
                    : "-"}
                </strong>
              </p>

              <p>
                Avg Reaction
                <strong>
                  {stats.averageReaction !== null
                    ? `${stats.averageReaction} ms`
                    : "-"}
                </strong>
              </p>

              <p>
                Accuracy
                <strong>{stats.averageAccuracy}%</strong>
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default DifficultyStats;
