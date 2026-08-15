function GameHistory({ history }) {
  const recentGames = history.slice(0, 5);

  return (
    <div className="history">
      <h2>Recent Games</h2>

      {recentGames.length === 0 ? (
        <p>No games played yet.</p>
      ) : (
        <div className="history-list">
          {recentGames.map((game, index) => (
            <div className="history-item" key={game.id}>
              <div>
                <strong>Game #{history.length - index}</strong>

                <span>{game.difficulty}</span>
              </div>

              <div>
                <strong>{game.score} pts</strong>

                <span>{game.accuracy}% accuracy</span>
              </div>

              <div>
                <span>Hits: {game.hits}</span>

                <span>Misses: {game.misses}</span>
              </div>

              <div>
                <span>
                  Avg:{" "}
                  {game.averageReaction !== null
                    ? `${game.averageReaction} ms`
                    : "-"}
                </span>

                <span>
                  Best:{" "}
                  {game.bestReaction !== null ? `${game.bestReaction} ms` : "-"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default GameHistory;
