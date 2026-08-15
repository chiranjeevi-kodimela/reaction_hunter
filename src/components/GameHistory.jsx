function GameHistory({ history }) {
  if (history.length === 0) {
    return (
      <div className="history">
        <h3>Recent Games</h3>
        <p>No games played yet.</p>
      </div>
    );
  }

  return (
    <div className="history">
      <h3>Recent Games</h3>

      <div className="history-list">
        {history.map((game) => (
          <div
            className="history-item"
            key={game.id}
          >
            <div>
              <strong>
                {game.difficulty}
              </strong>

              <span>
                Score: {game.score}
              </span>
            </div>

            <div>
              <span>
                Accuracy: {game.accuracy}%
              </span>

              <span>
                Avg:{" "}
                {game.averageReaction !== null
                  ? `${game.averageReaction} ms`
                  : "-"}
              </span>

              <span>
                Rating: {game.rating}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GameHistory;