function ResultsScreen({
  difficulty,
  score,
  highScore,
  accuracy,
  averageReaction,
  bestReaction,
  misses,
  rating,
  newHighScore,
  onPlayAgain,
  onChangeDifficulty,
}) {
  return (
    <div className="results">
      <h2>Game Over</h2>

      {newHighScore && <h2 className="new-record">NEW HIGH SCORE!</h2>}

      <p>Difficulty: {difficulty}</p>

      <div className="result-stats">
        <p>
          Score
          <strong>{score}</strong>
        </p>

        <p>
          High Score
          <strong>{highScore}</strong>
        </p>

        <p>
          Accuracy
          <strong>{accuracy}%</strong>
        </p>

        <p>
          Average Reaction
          <strong>
            {averageReaction !== null ? `${averageReaction} ms` : "-"}
          </strong>
        </p>

        <p>
          Best Reaction
          <strong>{bestReaction !== null ? `${bestReaction} ms` : "-"}</strong>
        </p>

        <p>
          Misses
          <strong>{misses}</strong>
        </p>

        <p>
          Rating
          <strong>{rating}</strong>
        </p>
      </div>

      <button onClick={onPlayAgain}>Play Again</button>

      <button onClick={onChangeDifficulty}>Change Difficulty</button>
    </div>
  );
}

export default ResultsScreen;
