function ResultsScreen({
  difficulty,
  score,
  accuracy,
  averageReaction,
  bestReaction,
  misses,
  rating,
  onPlayAgain,
  onChangeDifficulty,
}) {
  return (
    <div className="menu results">
      <h2>Game Over</h2>

      <p>
        Difficulty:{" "}
        <strong>
          {difficulty}
        </strong>
      </p>

      <div className="result-stats">
        <p>
          Score
          <strong>
            {score}
          </strong>
        </p>

        <p>
          Accuracy
          <strong>
            {accuracy}%
          </strong>
        </p>

        <p>
          Average
          <strong>
            {averageReaction !== null
              ? `${averageReaction} ms`
              : "--"}
          </strong>
        </p>

        <p>
          Best
          <strong>
            {bestReaction !== null
              ? `${bestReaction} ms`
              : "--"}
          </strong>
        </p>

        <p>
          Hits
          <strong>
            {score}
          </strong>
        </p>

        <p>
          Misses
          <strong>
            {misses}
          </strong>
        </p>
      </div>

      <h3>{rating}</h3>

      <button onClick={onPlayAgain}>
        Play Again
      </button>

      <button
        onClick={onChangeDifficulty}
      >
        Change Difficulty
      </button>
    </div>
  );
}

export default ResultsScreen;